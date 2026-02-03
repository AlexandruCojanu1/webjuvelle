import { MetadataRoute } from 'next'
import { getSortedPostsData } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.adsnow.ro'
  const currentDate = new Date().toISOString()

  // Fetch all published blog posts
  const blogPosts = getSortedPostsData()

  // Static pages - only include valid, accessible pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // Dynamic blog posts - automatically updated whenever posts.json changes
  // Only include published posts with valid slugs
  const blogPages: MetadataRoute.Sitemap = blogPosts
    .filter((post) => post.published && post.slug && post.slug.trim() !== '')
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.date || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  return [...staticPages, ...blogPages]
}

