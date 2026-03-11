import { NextRequest, NextResponse } from 'next/server'
import { generateAstroWebsite } from '@/lib/ai/sonnet-generator'
import { createAndPushRepo } from '@/lib/github-deploy'
import { deployToVercel } from '@/lib/vercel-deploy'
import { createServerSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    try {
        const { projectId, mockOnboardingData } = await req.json()

        if (!projectId) {
            return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
        }

        let onboardingData = mockOnboardingData

        if (projectId !== '00000000-0000-0000-0000-000000000000') {
            const supabase = createServerSupabase()
            // Fetch project and onboarding data
            const { data: project, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single()

            if (error || !project) {
                return NextResponse.json({ error: 'Project not found' }, { status: 404 })
            }

            onboardingData = project.onboarding_data
        }

        if (!onboardingData) {
            return NextResponse.json({ error: 'Onboarding not complete' }, { status: 400 })
        }

        // 1. Generate the Astro website with Sonnet
        const { files, projectName } = await generateAstroWebsite(onboardingData)

        // 2. Create GitHub repo and push files
        const repoUrl = await createAndPushRepo(projectName, files)

        // 3. Deploy to Vercel
        const { projectId: vercelProjectId, deploymentUrl } = await deployToVercel(
            projectName,
            process.env.GITHUB_DEPLOY_ORG!
        )

        // 4. Update project in Supabase if not mock
        if (projectId !== '00000000-0000-0000-0000-000000000000') {
            const supabase = createServerSupabase()
            await supabase
                .from('projects')
                .update({
                    status: 'deployed',
                    vercel_project_id: vercelProjectId,
                    vercel_url: deploymentUrl,
                    github_repo: projectName,
                })
                .eq('id', projectId)

            // 5. Save a message in the conversation
            await supabase.from('conversations').insert({
                project_id: projectId,
                role: 'assistant',
                content: `🎉 Your website is ready! Preview it here: ${deploymentUrl}\n\nLet me know if you'd like any changes. You have 1 free revision available.`,
            })
        }

        return NextResponse.json({ deploymentUrl, repoUrl })
    } catch (err: any) {
        console.error('Generate API error:', err)
        return NextResponse.json({ 
            error: 'Generation failed',
            details: err?.message || String(err),
            stack: err?.stack
        }, { status: 500 })
    }
}
