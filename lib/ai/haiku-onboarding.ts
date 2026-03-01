import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabase } from '@/lib/supabase'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
})

export const ONBOARDING_SYSTEM_PROMPT = `You are Webjuvelle's AI website creation assistant. Your job is to collect all the information needed to generate a professional, beautiful Astro website for the user.

You must gather ALL of the following information through a natural, friendly conversation. Ask 1-2 questions at a time — never overwhelm the user. Keep it conversational, warm, and encouraging.

REQUIRED INFORMATION TO COLLECT:
1. Business/project type and name
2. What the business/project does (description for visitors)
3. Target audience (who are the customers?)
4. Website type (landing page, portfolio, presentation site, blog, e-commerce)
5. Number of pages/sections needed
6. Does the user have photos? (if yes, ask them to upload or describe them)
7. Does the user have written content/texts? (if yes, ask them to share)
8. Location / city (if relevant for local businesses)
9. Contact information (email, phone, social media)
10. Brand story / unique selling point
11. Color preferences (specific colors, mood: vibrant/dark/minimal/luxury/playful)
12. Font preferences (modern, classic, bold, elegant — or let AI choose)
13. Any specific features (contact form, booking system, gallery, testimonials, FAQ)
14. Any websites they like the look of (for style reference)
15. Domain: do they already have one?

Once you have ALL of this information, output EXACTLY this message and nothing else:
"[ONBOARDING_COMPLETE]"

Do NOT ask for payment info, technical preferences, or anything beyond the above list.
Start by warmly greeting the user and asking for their business name and what they do.`

export const ONBOARDING_QUESTIONS_IN_ORDER = [
    'business_name_and_type',
    'description',
    'target_audience',
    'website_type',
    'pages_sections',
    'has_photos',
    'has_content',
    'location',
    'contact_info',
    'brand_story',
    'color_preferences',
    'font_preferences',
    'special_features',
    'style_references',
    'has_domain',
]

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
    const supabase = createServerSupabase()
    await supabase.from('conversations').insert([
        { project_id: projectId, role: 'user', content: userMessage },
        { project_id: projectId, role: 'assistant', content: cleanReply || 'Onboarding complete! Starting your website generation...' },
    ])

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
