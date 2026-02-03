import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

/**
 * Google Indexing API Route
 * 
 * Submits URLs to Google Indexing API for faster indexing.
 * 
 * Environment variables required:
 * - GOOGLE_CLIENT_EMAIL: Service account email
 * - GOOGLE_PRIVATE_KEY: Service account private key
 * - SITE_URL: Your website URL (e.g., https://adsnow.ro)
 * 
 * Usage:
 * POST /api/google-indexing
 * Body: { "url": "https://adsnow.ro/blog/article-slug" }
 */

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const token = jwt.sign(
    {
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/indexing',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    },
    privateKey,
    { algorithm: 'RS256' }
  )

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get access token: ${error}`)
  }

  const data = await response.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Get environment variables
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    const siteUrl =
      process.env.SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://adsnow.ro')

    // Validate environment variables
    if (!clientEmail || !privateKey) {
      console.error('Missing Google credentials')
      return NextResponse.json(
        { 
          error: 'Google Indexing API credentials not configured',
          message: 'Configurați GOOGLE_CLIENT_EMAIL și GOOGLE_PRIVATE_KEY în Vercel Environment Variables'
        },
        { status: 500 }
      )
    }

    // Verify URL belongs to the site
    if (!url.startsWith(siteUrl)) {
      return NextResponse.json(
        { error: 'URL does not belong to the configured site' },
        { status: 400 }
      )
    }

    // Get access token using service account
    const accessToken = await getAccessToken(clientEmail, privateKey)

    // Submit URL to Google Indexing API
    const response = await fetch(
      'https://indexing.googleapis.com/v3/urlNotifications:publish',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          url: url,
          type: 'URL_UPDATED', // Use 'URL_UPDATED' for updates, 'URL_DELETED' for deletions
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Google Indexing API error:', errorData)
      return NextResponse.json(
        {
          error: 'Failed to submit URL to Google',
          details: errorData,
        },
        { status: response.status }
      )
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: 'URL submitted to Google successfully',
      url: url,
      result: result,
    })
  } catch (error: any) {
    console.error('Error submitting to Google Indexing API:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
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

