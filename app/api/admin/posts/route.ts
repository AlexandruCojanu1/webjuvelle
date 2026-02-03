import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { BlogPost } from '@/lib/blog'

const postsFilePath = path.join(process.cwd(), 'content', 'posts.json')

// GET - Read all posts
export async function GET() {
  try {
    // Check if file exists
    if (!fs.existsSync(postsFilePath)) {
      console.warn('Posts file does not exist, returning empty array')
      return NextResponse.json([], { status: 200 })
    }

    const fileContents = fs.readFileSync(postsFilePath, 'utf8')
    const posts: BlogPost[] = JSON.parse(fileContents)
    
    return NextResponse.json(posts, { status: 200 })
  } catch (error: any) {
    console.error('Error reading posts:', error)
    return NextResponse.json(
      { 
        error: 'Failed to read posts',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST - Save posts (for admin updates)
export async function POST(request: NextRequest) {
  try {
    // In production, add authentication check here
    // const authHeader = request.headers.get('authorization')
    // if (!isAuthenticated(authHeader)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const { posts } = body

    if (!Array.isArray(posts)) {
      return NextResponse.json(
        { error: 'Invalid posts data' },
        { status: 400 }
      )
    }

    // Validate posts structure
    const validPosts = posts.filter((post: any) => {
      return (
        post.slug &&
        post.title &&
        post.excerpt &&
        post.content &&
        post.date &&
        post.category &&
        post.author &&
        Array.isArray(post.tags) &&
        post.seo &&
        typeof post.published === 'boolean' &&
        typeof post.featured === 'boolean'
      )
    })

    // Note: In Vercel, filesystem is read-only
    // Posts should be saved via GitHub API using /api/github-commit
    // This endpoint is kept for validation purposes only
    
    // Try to write (will fail in production, but useful for local dev)
    try {
      // Ensure directory exists
      const postsDir = path.dirname(postsFilePath)
      if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir, { recursive: true })
      }
      
      fs.writeFileSync(
        postsFilePath,
        JSON.stringify(validPosts, null, 2),
        'utf8'
      )
    } catch (writeError: any) {
      // In production (Vercel), this will fail - that's expected
      console.warn('Cannot write to filesystem (expected in Vercel):', writeError.message)
      // Return success anyway - actual save happens via GitHub API
    }

    return NextResponse.json(
      { 
        success: true, 
        count: validPosts.length,
        message: 'Posts validated. Use /api/github-commit to save to GitHub.'
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error saving posts:', error)
    return NextResponse.json(
      { 
        error: 'Failed to save posts',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}

