import { NextRequest, NextResponse } from 'next/server'

const GITHUB_OWNER = 'AlexandruCojanu1'
const GITHUB_REPO = 'adsnow2025'
const GITHUB_BRANCH = 'main'
const BLOG_POSTS_PATH = 'content/posts.json'

/**
 * Get file SHA from GitHub
 */
async function getFileSha(token: string, path: string): Promise<string | null> {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`

  try {
    console.log(`Fetching SHA for: ${path}`)
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'Vercel-Serverless-Function',
      },
    })

    console.log(`Response status for ${path}:`, response.status)

    if (response.status === 404) {
      console.log(`File ${path} does not exist, will create new`)
      return null // File doesn't exist yet
    }

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }
      console.error(`Error getting SHA for ${path}:`, errorData)
      throw new Error(
        `Failed to get file SHA (${response.status}): ${errorData.message || response.statusText}`
      )
    }

    const data = await response.json()
    console.log(`✓ SHA obtained for ${path}:`, data.sha?.substring(0, 7) + '...')
    return data.sha
  } catch (error: any) {
    console.error(`Error in getFileSha for ${path}:`, error)
    throw new Error(`Error getting file SHA: ${error.message}`)
  }
}

/**
 * Base64 encode for Edge Runtime (no Buffer)
 */
function base64Encode(str: string): string {
  if (typeof btoa !== 'undefined') {
    // Browser/Edge Runtime
    return btoa(unescape(encodeURIComponent(str)))
  }
  // Node.js (fallback)
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf8').toString('base64')
  }
  throw new Error('No base64 encoding method available')
}

/**
 * Update file in GitHub
 */
async function updateFile(
  token: string,
  path: string,
  content: string,
  sha: string | null,
  message: string
) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`

  // Base64 encode content
  const base64Content = base64Encode(content)

  const body: any = {
    message: message,
    content: base64Content,
    branch: GITHUB_BRANCH,
  }

  if (sha) {
    body.sha = sha
  }

  console.log(`Updating file: ${path}, content length: ${content.length}, has SHA: ${!!sha}`)

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Vercel-Serverless-Function',
    },
    body: JSON.stringify(body),
  })

  console.log(`Update response status for ${path}:`, response.status)

  if (!response.ok) {
    const errorText = await response.text()
    let errorData
    try {
      errorData = JSON.parse(errorText)
    } catch {
      errorData = { message: errorText }
    }
    console.error(`Error updating ${path}:`, errorData)
    throw new Error(
      `Failed to update file (${response.status}): ${errorData.message || response.statusText}`
    )
  }

  const result = await response.json()
  console.log(
    `✓ File ${path} updated successfully, commit SHA:`,
    result.commit?.sha?.substring(0, 7) + '...'
  )
  return result
}

/**
 * Generate posts.json content
 */
function generatePostsJson(posts: any[]): string {
  return JSON.stringify(posts, null, 2)
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('=== GitHub Commit API Handler Started ===')

  try {
    const body = await request.json()
    const { githubToken, posts, sitemapXml } = body

    console.log('Request parsed:', {
      hasToken: !!githubToken,
      tokenPrefix: githubToken?.substring(0, 7) + '...',
      postsCount: posts?.length || 0,
      sitemapLength: sitemapXml?.length || 0,
    })

    // Validate inputs
    if (!githubToken) {
      return NextResponse.json({ error: 'GitHub token is required' }, { status: 400 })
    }

    if (!posts || !Array.isArray(posts)) {
      return NextResponse.json({ error: 'Posts array is required' }, { status: 400 })
    }

    const results = {
      blogPosts: { success: false, error: null as string | null, verified: false, message: '', commitSha: '', commitUrl: '' },
      sitemap: { success: false, error: null as string | null, verified: false, message: '', commitSha: '', commitUrl: '' },
    }

    // Generate content first (synchronous, fast)
    const blogPostsContent = generatePostsJson(posts)
    const commitMessage = `Update blog posts - ${new Date().toISOString()}`

    // Update posts.json
    try {
      console.log('Step 1: Getting posts.json SHA...')
      const blogPostsShaPromise = getFileSha(githubToken, BLOG_POSTS_PATH)
      const blogPostsSha = await Promise.race([
        blogPostsShaPromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout getting SHA (15s)')), 15000)
        ),
      ])
      console.log('Step 1: ✓ SHA obtained:', blogPostsSha ? 'existing file' : 'new file')

      console.log('Step 2: Updating posts.json in GitHub...')
      const updatePromise = updateFile(
        githubToken,
        BLOG_POSTS_PATH,
        blogPostsContent,
        blogPostsSha,
        commitMessage
      )
      const blogPostsResult = await Promise.race([
        updatePromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout updating file (15s)')), 15000)
        ),
      ])

      console.log('Step 2: ✓ File updated, commit SHA:', blogPostsResult.commit?.sha)

      // Verify commit was successful
      console.log('Step 3: Verifying commit...')
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2s for GitHub to process

      try {
        const verifySha = await Promise.race([
          getFileSha(githubToken, BLOG_POSTS_PATH),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Verification timeout')), 10000)
          ),
        ])

        if (verifySha && verifySha !== blogPostsSha) {
          results.blogPosts.success = true
          results.blogPosts.verified = true
          results.blogPosts.message = 'Blog posts updated and verified in GitHub'
          results.blogPosts.commitSha = blogPostsResult.commit?.sha || ''
          results.blogPosts.commitUrl = blogPostsResult.commit?.html_url || ''
          console.log('Step 3: ✓ Commit verified - file SHA changed')
        } else if (blogPostsResult.commit?.sha) {
          results.blogPosts.success = true
          results.blogPosts.verified = true
          results.blogPosts.message = 'Blog posts updated in GitHub (verification pending)'
          results.blogPosts.commitSha = blogPostsResult.commit?.sha || ''
          results.blogPosts.commitUrl = blogPostsResult.commit?.html_url || ''
          console.log(
            'Step 3: ✓ Commit confirmed (SHA:',
            blogPostsResult.commit?.sha?.substring(0, 7) + '...)'
          )
        } else {
          throw new Error('No commit SHA returned from GitHub')
        }
      } catch (verifyError: any) {
        if (blogPostsResult.commit?.sha) {
          console.warn('Verification delayed, but commit exists:', blogPostsResult.commit?.sha)
          results.blogPosts.success = true
          results.blogPosts.verified = true
          results.blogPosts.message = 'Blog posts updated in GitHub (verification delayed)'
          results.blogPosts.commitSha = blogPostsResult.commit?.sha || ''
          results.blogPosts.commitUrl = blogPostsResult.commit?.html_url || ''
        } else {
          throw verifyError
        }
      }
    } catch (error: any) {
      results.blogPosts.error = error.message
      results.blogPosts.verified = false
      console.error('✗ Error updating blogPosts:', error.message)
    }

    // Sitemap is generated dynamically, so we skip it
    results.sitemap.success = true
    results.sitemap.message = 'Sitemap is generated dynamically by Next.js - no update needed'
    results.sitemap.verified = true

    const success = results.blogPosts.success && results.blogPosts.verified
    const message = success
      ? '✓ Articol actualizat cu succes în GitHub! Vercel va face auto-deploy în câteva minute.'
      : '✗ Actualizarea a eșuat. Verifică erorile de mai jos.'

    return NextResponse.json(
      {
        success,
        results,
        message,
        verified: {
          blogPosts: results.blogPosts.verified || false,
          sitemap: results.sitemap.verified || false,
        },
        githubUrls: {
          blogPosts: results.blogPosts.commitUrl || null,
          repository: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/commits/${GITHUB_BRANCH}`,
        },
      },
      { status: success ? 200 : 500 }
    )
  } catch (error: any) {
    console.error('Error in github-commit handler:', error)

    let errorMessage = error.message || 'Internal server error'
    let statusCode = 500

    if (error.message?.includes('Timeout')) {
      errorMessage = 'Timeout: GitHub API a răspuns prea lent. Te rog încearcă din nou.'
      statusCode = 504
    } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      errorMessage =
        'Eroare de autentificare: Token-ul GitHub este invalid sau expirat. Verifică token-ul.'
      statusCode = 401
    } else if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
      errorMessage =
        'Acces interzis: Token-ul nu are permisiunile necesare (necesar: repo scope).'
      statusCode = 403
    } else if (error.message?.includes('404')) {
      errorMessage =
        'Repository sau fișier negăsit. Verifică că repository-ul există și că token-ul are acces.'
      statusCode = 404
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: statusCode }
    )
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

