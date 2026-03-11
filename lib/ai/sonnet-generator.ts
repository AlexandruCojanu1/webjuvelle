import Anthropic from '@anthropic-ai/sdk'
import { Octokit } from '@octokit/rest'
import fs from 'fs'
import path from 'path'
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })

// Fetch the list of available components from the component library GitHub repo
async function getComponentLibraryContext(): Promise<string> {
    try {
        if (!process.env.GITHUB_COMPONENT_LIBRARY_OWNER || !process.env.GITHUB_COMPONENT_LIBRARY_REPO) {
            return 'Component library not configured (missing environment variables).'
        }

        const { data: tree } = await octokit.git.getTree({
            owner: process.env.GITHUB_COMPONENT_LIBRARY_OWNER,
            repo: process.env.GITHUB_COMPONENT_LIBRARY_REPO,
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
        if (!process.env.GITHUB_COMPONENT_LIBRARY_OWNER || !process.env.GITHUB_COMPONENT_LIBRARY_REPO) return ''

        const { data } = await octokit.repos.getContent({
            owner: process.env.GITHUB_COMPONENT_LIBRARY_OWNER,
            repo: process.env.GITHUB_COMPONENT_LIBRARY_REPO,
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
  "src/components/Hero.astro": "..."
}

IMPORTANT:
- DO NOT generate \`package.json\`, \`astro.config.mjs\`, \`tailwind.config.mjs\`, or \`public/robots.txt\`. These are injected automatically!
- ONLY output your Astro pages, layouts, and components.
- Use Astro 4.x + Tailwind CSS.
- EXTREMELY IMPORTANT: Prioritize using the cutting edge "GSAP" components from the library (e.g. Scroll3DZoom.astro, SnapHorizontalSections.astro).
- If you use ANY GSAP or ScrollTrigger components, include the GSAP CDN scripts in your Layout.astro head.
- SEO & METATAGS MUST BE EXHAUSTIVE exactly in Layout.astro.
- Use Google Fonts (dynamically inject the <link> tag for the chosen Google Fonts in the <head> of Layout.astro).
- Generate REAL content, not placeholder lorem ipsum.
- MAXIMIZE CONCISENESS! Output ONLY the files strictly necessary. Keep the CSS/HTML as minimal as possible. Do NOT use huge base64 images or inline SVGs.
- Keep the number of pages to a minimum (1-2 max) to ensure the JSON does not truncate.
- ALL images MUST use the \`.webp\` format.



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
            // If it failed due to truncation, we can try to auto-heal the JSON slightly by appending '}
            try {
                files = JSON.parse(jsonMatch[0] + '}')
                console.log("Successfully auto-healed truncated JSON!")
            } catch (healError) {
                throw new Error("AI Code Generation was truncated because the requested website was too large. Please request a simpler website or fewer features.")
            }
        }
    }

    // Inject boilerplate so AI doesn't have to waste tokens writing it
    files['package.json'] = JSON.stringify({
        name: "webjuvelle-site",
        version: "1.0.0",
        scripts: { dev: "astro dev", start: "astro dev", build: "astro build", preview: "astro preview" },
        dependencies: {
            "astro": "^4.0.0",
            "tailwindcss": "^3.4.0",
            "@astrojs/tailwind": "^5.1.0",
            "@astrojs/sitemap": "^3.1.0",
            "gsap": "^3.12.5"
        }
    }, null, 2)

    files['astro.config.mjs'] = `import { defineConfig } from 'astro/config';\nimport tailwind from '@astrojs/tailwind';\nimport sitemap from '@astrojs/sitemap';\nexport default defineConfig({\n  site: 'https://example.com',\n  integrations: [tailwind(), sitemap()]\n});`
    files['tailwind.config.mjs'] = `export default {\n  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],\n  theme: { extend: {} },\n  plugins: [],\n}`
    files['public/robots.txt'] = "User-agent: *\\nAllow: /"

    const projectName = `${(onboardingData.business_name || 'webjuvelle-site')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}-${Date.now()}`

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
