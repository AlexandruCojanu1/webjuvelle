import { NextRequest, NextResponse } from 'next/server'
import { runHaikuOnboarding, extractOnboardingData } from '@/lib/ai/haiku-onboarding'
import { createServerSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    try {
        const { projectId, message, mockHistory } = await req.json()

        if (!projectId || !message) {
            return NextResponse.json({ error: 'projectId and message are required' }, { status: 400 })
        }

        let conversationHistory = mockHistory || []

        if (projectId !== '00000000-0000-0000-0000-000000000000') {
            const supabase = createServerSupabase()
            const { data: project, error: projectError } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single()

            if (projectError || !project) {
                return NextResponse.json({ error: 'Project not found' }, { status: 404 })
            }

            const { data: history } = await supabase
                .from('conversations')
                .select('role, content')
                .eq('project_id', projectId)
                .order('created_at', { ascending: true })

            conversationHistory = (history || []) as Array<{ role: 'user' | 'assistant'; content: string }>
        }

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

            if (projectId !== '00000000-0000-0000-0000-000000000000') {
                const supabase = createServerSupabase()
                // Save onboarding data to project and update status
                await supabase
                    .from('projects')
                    .update({
                        status: 'generating',
                        onboarding_data: onboardingData,
                    })
                    .eq('id', projectId)
            }

            return NextResponse.json({
                reply,
                isComplete: true,
                onboardingData,
            })
        }

        return NextResponse.json({ reply, isComplete: false })
    } catch (err: any) {
        console.error('Chat API error:', err)
        return NextResponse.json({ 
            error: 'Internal server error', 
            details: err?.message || String(err),
            stack: err?.stack
        }, { status: 500 })
    }
}
