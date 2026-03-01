import { NextRequest, NextResponse } from 'next/server'
import { runHaikuOnboarding, extractOnboardingData } from '@/lib/ai/haiku-onboarding'
import { createServerSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    try {
        const { projectId, message } = await req.json()

        if (!projectId || !message) {
            return NextResponse.json({ error: 'projectId and message are required' }, { status: 400 })
        }

        const supabase = createServerSupabase()

        // Fetch the project to verify it exists
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single()

        if (projectError || !project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        // Fetch conversation history
        const { data: history } = await supabase
            .from('conversations')
            .select('role, content')
            .eq('project_id', projectId)
            .order('created_at', { ascending: true })

        const conversationHistory = (history || []) as Array<{ role: 'user' | 'assistant'; content: string }>

        // Run Haiku onboarding
        const { reply, isComplete } = await runHaikuOnboarding(
            projectId,
            message,
            conversationHistory
        )

        // If onboarding is complete, extract structured data
        if (isComplete) {
            const allHistory = [...conversationHistory, { role: 'user' as const, content: message }]
            const onboardingData = await extractOnboardingData(allHistory)

            // Save onboarding data to project and update status
            await supabase
                .from('projects')
                .update({
                    status: 'generating',
                    onboarding_data: onboardingData,
                })
                .eq('id', projectId)

            return NextResponse.json({
                reply,
                isComplete: true,
                onboardingData,
            })
        }

        return NextResponse.json({ reply, isComplete: false })
    } catch (err) {
        console.error('Chat API error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
