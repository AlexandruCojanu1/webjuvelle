import Anthropic from '@anthropic-ai/sdk'
import { Octokit } from '@octokit/rest'
import fs from 'fs'
import path from 'path'
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

// Fetch the list of available components from the component library GitHub repo
async function getComponentLibraryContext(): Promise<string> {
    try {
        const { data: tree } = await octokit.git.getTree({
            owner: process.env.GITHUB_COMPONENT_LIBRARY_OWNER!,
            repo: process.env.GITHUB_COMPONENT_LIBRARY_REPO!,
            tree_sha: 'main',
            recursive: 'true',
        })

        const components = tree.tree
            .filter(f => f.path?.endsWith('.astro'))
            .map(f => f.path)
            .join('\n')

        return `Available component files in the library:\n${components}`
    } catch {
        return 'Component library not yet configured.'
    }
}

// Fetch extracted design patterns from local analysis
function getLocalDesignPaletteContext(): string {
    try {
        const palettePath = path.join(process.cwd(), 'design-palette.json')
        if (fs.existsSync(palettePath)) {
            const data = JSON.parse(fs.readFileSync(palettePath, 'utf8'))
            
            // Limit the lists so we don't blow up the context window
            const fonts = data.fontFamilies.slice(0, 15).join(', ')
            const colors = data.colorHexes.slice(0, 30).join(', ')
            
            return `Referințe de Design (extrase din ${data.totalProjectsAnalyzed} proiecte premium):\nFonturi Recomandate: ${fonts}\nPaletă Extinsă de Culori Aprobate: ${colors}`
        }
    } catch {
        // Fallback if file doesn't exist
    }
    return ''
}

// Fetch general architecture patterns and CSS protips
function getDesignPrinciplesContext(): string {
    try {
        const principlesPath = path.join(process.cwd(), 'design-principles.json')
        if (fs.existsSync(principlesPath)) {
            const data = JSON.parse(fs.readFileSync(principlesPath, 'utf8'))
            
            const cssProtips = data.cssProtips.join(', ')
            const patterns = data.designPatterns.join(', ')
            
            return `CSS Protips (Best Practices): ${cssProtips}\nDesign Patterns: ${patterns}`
        }
    } catch {
        // Fallback
    }
    return ''
}

// Fetch color/font palette list from design library (REMOVED: User requested removal)

// Read the content of a specific component file from GitHub
export async function getComponentContent(filePath: string): Promise<string> {
    try {
        const { data } = await octokit.repos.getContent({
            owner: process.env.GITHUB_COMPONENT_LIBRARY_OWNER!,
            repo: process.env.GITHUB_COMPONENT_LIBRARY_REPO!,
            path: filePath,
        })

        if (Array.isArray(data) || data.type !== 'file') return ''
        return Buffer.from(data.content, 'base64').toString('utf-8')
    } catch {
        return ''
    }
}

export async function generateAstroWebsite(
    onboardingData: Record<string, string>
): Promise<{ files: Record<string, string>; projectName: string }> {
    const componentContext = await getComponentLibraryContext()

    const prompt = `You are an expert Astro website developer. Based on the client's requirements below, generate a complete, production-ready Astro website.

CLIENT REQUIREMENTS:
${JSON.stringify(onboardingData, null, 2)}

COMPONENT LIBRARY AVAILABLE:
${componentContext}

PREMIUM DESIGN PATTERNS (Extracted from high-end references):
${getLocalDesignPaletteContext()}

ADVANCED CSS & UX PRINCIPLES:
${getDesignPrinciplesContext()}

YOUR TASK:
1. Select the most appropriate components from the library for this website type
2. Choose a suitable color palette and font combination
3. Generate a complete Astro project with all necessary files
4. Write compelling, professional copy based on the client's information
5. Ensure the website is fully responsive and optimized for SEO

OUTPUT FORMAT:
Return a JSON object where each key is a file path and the value is the file content.
Example:
{
  "src/pages/index.astro": "...",
  "src/layouts/Layout.astro": "...",
  "src/components/Hero.astro": "...",
  "astro.config.mjs": "...",
  "package.json": "...",
  "tailwind.config.mjs": "...",
  "public/robots.txt": "...",
  "public/favicon.svg": "..."
}

IMPORTANT:
- Use Astro 4.x + Tailwind CSS
- Make it look PREMIUM and MODERN — it must wow the client
- EXTREMELY IMPORTANT: Prioritize using the cutting edge "GSAP" components from the library (e.g. Scroll3DZoom.astro, SnapHorizontalSections.astro) to make the page highly dynamic and interactive!
- If you use ANY GSAP or ScrollTrigger components, you MUST include the GSAP CDN scripts in your Layout.astro head:
  \`<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" is:inline></script>\`
  \`<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" is:inline></script>\`
- Include all pages they requested
- SEO & METATAGS MUST BE EXHAUSTIVE: You MUST generate comprehensive \`<meta>\` tags in your Layout including Open Graph (og:title, og:image, etc.), Twitter Cards, and standard descriptions.
- You MUST generate a valid \`public/robots.txt\` file.
- You MUST install and configure \`@astrojs/sitemap\` within \`astro.config.mjs\`, ensuring you define a \`site\` option so the sitemap builds correctly.
- Use Google Fonts (match to their font preference AND the overall MOOD of the website). You MUST dynamically inject the <link> tag for the chosen Google Fonts in the <head> of Layout.astro. For example, if the mood is Luxury, fetch a classy serif like 'Playfair Display'; if Tech, fetch 'Inter' or 'Roboto Mono'.
- Use their color preferences as the primary palette
- Generate REAL content, not placeholder lorem ipsum
- BE EXTREMELY CONCISE with your code to avoid hitting strict length limits! Do NOT use huge base64 images or massive inline SVGs. Use standard emoji or external links.
- Keep the number of pages to a minimum (1-3 max) to ensure the JSON does not truncate.
- ALL images in the generated project MUST use the \`.webp\` format. If using Unsplash or placeholder URLs, ensure they resolve or indicate \`.webp\` usage.
- Only output the JSON object, nothing else`

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || 'MISSING_KEY' })

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'

    // Extract JSON from response (handle potential markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    let files: Record<string, string> = {}
    
    if (jsonMatch) {
        try {
            files = JSON.parse(jsonMatch[0])
        } catch (e: any) {
            console.error("AI JSON parse failed. Length:", text.length, "Error:", e.message)
            throw new Error("AI Code Generation was truncated because the requested website was too large. Please request a simpler website or fewer features.")
        }
    }

    // Generate a clean project name from business name
    const projectName = (onboardingData.business_name || 'webjuvelle-site')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

    return { files, projectName }
}

export async function applyRevision(
    originalFiles: Record<string, string>,
    revisionRequest: string,
    projectName: string
): Promise<Record<string, string>> {
    const prompt = `You are modifying an existing Astro website based on client feedback.

CURRENT WEBSITE FILES:
${JSON.stringify(originalFiles, null, 2)}

CLIENT FEEDBACK / REVISION REQUEST:
${revisionRequest}

Apply ONLY the changes requested. Return the COMPLETE updated file list as JSON (include unchanged files too).
Only output the JSON object, nothing else.`

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || 'MISSING_KEY' })

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : originalFiles
}
