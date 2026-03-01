import { NextRequest, NextResponse } from 'next/server'
import { applyRevision } from '@/lib/ai/sonnet-generator'
import { updateRepoFiles } from '@/lib/github-deploy'
import { redeployProject } from '@/lib/vercel-deploy'
import { createServerSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    try {
        const { projectId, revisionRequest } = await req.json()

        const supabase = createServerSupabase()

        // Fetch project
        const { data: project } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single()

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        // Check revision limit (first one is free)
        const isFreeRevision = project.revision_count < 1

        if (!isFreeRevision) {
            // Check if user has paid for a revision (simplified — in production check Stripe)
            return NextResponse.json({
                error: 'free_revision_used',
                message: 'Your free revision has been used. Please purchase additional revisions.',
                requiresPayment: true,
            }, { status: 402 })
        }

        // Fetch the current file content from GitHub
        // For simplicity, we re-generate with the revision request in context
        const revisionResult = await applyRevision(
            {}, // In production, fetch current files from GitHub
            revisionRequest,
            project.github_repo as string
        )
        const revisedFiles = revisionResult as unknown as Record<string, string>

        // Push updated files to GitHub
        await updateRepoFiles(project.github_repo as string, revisedFiles)

        // Redeploy on Vercel
        const newUrl = await redeployProject(project.vercel_project_id, project.github_repo)

        // Update revision count
        await supabase
            .from('projects')
            .update({ revision_count: project.revision_count + 1, vercel_url: newUrl })
            .eq('id', projectId)

        // Save to conversation
        await supabase.from('conversations').insert([
            { project_id: projectId, role: 'user', content: revisionRequest },
            {
                project_id: projectId,
                role: 'assistant',
                content: `✅ Revision applied! Your updated website is live at: ${newUrl}\n\nNote: You have used your 1 free revision. Additional revisions require a payment.`,
            },
        ])

        return NextResponse.json({ newUrl })
    } catch (err) {
        console.error('Revision API error:', err)
        return NextResponse.json({ error: 'Revision failed' }, { status: 500 })
    }
}
