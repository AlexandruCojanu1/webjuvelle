import Anthropic from '@anthropic-ai/sdk'
import { Octokit } from '@octokit/rest'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
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

// Fetch color/font palette list from design library
async function getDesignLibraryContext(): Promise<string> {
    try {
        const { data: tree } = await octokit.git.getTree({
            owner: process.env.GITHUB_COMPONENT_LIBRARY_OWNER!,
            repo: process.env.GITHUB_COLOR_FONT_REPO!,
            tree_sha: 'main',
            recursive: 'true',
        })

        const palettes = tree.tree
            .filter(f => f.type === 'blob')
            .map(f => f.path)
            .slice(0, 50)
            .join('\n')

        return `Available color/font palettes:\n${palettes}`
    } catch {
        return 'Design library not yet configured.'
    }
}

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
    const designContext = await getDesignLibraryContext()

    const prompt = `You are an expert Astro website developer. Based on the client's requirements below, generate a complete, production-ready Astro website.

CLIENT REQUIREMENTS:
${JSON.stringify(onboardingData, null, 2)}

COMPONENT LIBRARY AVAILABLE:
${componentContext}

DESIGN LIBRARY AVAILABLE:
${designContext}

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
  "public/favicon.svg": "..."
}

IMPORTANT:
- Use Astro 4.x + Tailwind CSS
- Make it look PREMIUM and MODERN — it must wow the client
- Use the client's actual business name, description, and content
- Include all pages they requested
- Add proper meta tags for SEO
- Use Google Fonts (match to their font preference)
- Use their color preferences as the primary palette
- Generate REAL content, not placeholder lorem ipsum
- Only output the JSON object, nothing else`

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'

    // Extract JSON from response (handle potential markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const files: Record<string, string> = jsonMatch ? JSON.parse(jsonMatch[0]) : {}

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

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : originalFiles
}
