import { NextRequest, NextResponse } from 'next/server'
import { checkDomainAvailability, purchaseDomain, addDomainToProject } from '@/lib/vercel-deploy'
import { createServerSupabase } from '@/lib/supabase'

const VERCEL_NS1 = process.env.NEXT_PUBLIC_VERCEL_NS1!
const VERCEL_NS2 = process.env.NEXT_PUBLIC_VERCEL_NS2!

// GET /api/domain?domain=example.com — check availability + price
export async function GET(req: NextRequest) {
    const domain = req.nextUrl.searchParams.get('domain')
    if (!domain) return NextResponse.json({ error: 'domain required' }, { status: 400 })

    const result = await checkDomainAvailability(domain)
    return NextResponse.json(result)
}

// POST /api/domain — handle domain assignment or purchase
export async function POST(req: NextRequest) {
    const { projectId, domain, action } = await req.json()
    // action: 'own' (user has domain) | 'buy' (purchase via Vercel)

    const supabase = createServerSupabase()
    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    if (action === 'own') {
        // User has their own domain — add it to the Vercel project and return DNS records
        await addDomainToProject(project.vercel_project_id, domain)
        await supabase.from('projects').update({ domain }).eq('id', projectId)

        const dnsMessage = `✅ Domain added to your project!\n\nTo make it live, go to your domain registrar and set these **nameservers**:\n\n• \`${VERCEL_NS1}\`\n• \`${VERCEL_NS2}\`\n\nAfter updating them, propagation may take up to 48 hours, but is usually much faster!`

        await supabase.from('conversations').insert({
            project_id: projectId,
            role: 'assistant',
            content: dnsMessage,
        })

        return NextResponse.json({ success: true, dnsMessage })
    }

    if (action === 'buy') {
        // Purchase the domain via Vercel API, then assign it
        await purchaseDomain(domain)
        await addDomainToProject(project.vercel_project_id, domain)
        await supabase.from('projects').update({ domain }).eq('id', projectId)

        const successMessage = `🎉 Domain **${domain}** has been purchased and linked to your website!\n\nYour site is now live at: https://${domain}`

        await supabase.from('conversations').insert({
            project_id: projectId,
            role: 'assistant',
            content: successMessage,
        })

        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
