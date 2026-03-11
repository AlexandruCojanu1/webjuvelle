import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabase } from '@/lib/supabase'

// Anthropic initialized dynamically inside functions to prevent top-level crash

export const ONBOARDING_SYSTEM_PROMPT = `You are Webjuvelle's AI website creation assistant. Your job is to collect the necessary information to generate a beautiful, professional Astro website.

Instead of a rigid checklist, you MUST adapt your questions dynamically based on what the user tells you. 
Start by warmly greeting the user and asking about their business/project name and what they do.
Based on their answers, ask the next logical questions (e.g., target audience, website type, preferred style, if they have content/photos, features needed, contact info).

Ask 1-2 questions at a time — never overwhelm the user. Keep it conversational, warm, and guiding, but EXTREMELY CONCISE AND DIRECT. Get straight to the point in 1-2 short sentences maximum. Do not be overly verbose.
If a user gives you a short or vague answer, politely ask for a bit more detail to ensure the final website is high-quality. If they provide a lot of information upfront, acknowledge it and skip those topics.

Your GOAL is to gather enough context to build a complete site (Business details, Target Audience, Website Type, Content availability, Contact Info, Style/Color preferences, Features needed).

Once you feel you have a solid understanding of the project and enough details to generate a great website, output EXACTLY this message and nothing else:
"[ONBOARDING_COMPLETE]"

Do NOT ask for payment info or highly technical hosting preferences.`


export async function runHaikuOnboarding(
    projectId: string,
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{ reply: string; isComplete: boolean }> {
    const messages = [
        ...conversationHistory.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
        })),
        { role: 'user' as const, content: userMessage },
    ]

    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY || 'MISSING_KEY',
    })

    const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        system: ONBOARDING_SYSTEM_PROMPT,
        messages,
    })

    const assistantReply =
        response.content[0].type === 'text' ? response.content[0].text : ''

    const isComplete = assistantReply.includes('[ONBOARDING_COMPLETE]')
    const cleanReply = assistantReply.replace('[ONBOARDING_COMPLETE]', '').trim()

    // Save conversation to Supabase
    if (projectId !== '00000000-0000-0000-0000-000000000000') {
        const supabase = createServerSupabase()
        await supabase.from('conversations').insert([
            { project_id: projectId, role: 'user', content: userMessage },
            { project_id: projectId, role: 'assistant', content: cleanReply || 'Onboarding complete! Starting your website generation...' },
        ])
    }

    return {
        reply: cleanReply || "I have everything I need! Let me now generate your website. This will take about 1-2 minutes...",
        isComplete,
    }
}

// After onboarding, extract a structured JSON from the conversation
export async function extractOnboardingData(
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<Record<string, string>> {
    const conversationText = conversationHistory
        .map(m => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n\n')

    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY || 'MISSING_KEY',
    })

    const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 2048,
        system: `Extract the website requirements from this conversation and return valid JSON only.
The JSON should have these keys: business_name, business_type, description, target_audience, website_type, pages, has_photos, photo_description, has_content, content_text, location, email, phone, social_media, brand_story, usp, colors, fonts, features, style_references, has_domain, domain_name.
Only output valid JSON. No explanation.`,
        messages: [{ role: 'user', content: conversationText }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    try {
        return JSON.parse(text)
    } catch {
        return {}
    }
}
