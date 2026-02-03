import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BlogPostSchema, BreadcrumbSchema } from '@/components/seo/StructuredData'
import { getPostData, getAllPostSlugs } from '@/lib/blog'
import { parseBlogContent } from '@/lib/blogContentParser'
import BlogPostScripts from '@/components/client/BlogPostScripts'

interface Props {
  params: Promise<{ slug: string }>
}

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map(slug => ({ slug }))
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostData(slug)
  
  if (!post) {
    return {
      title: 'Post not found',
    }
  }
  
  // FIX: Shorten title if too long (max 75 chars for SEO)
  const fullTitle = post.seo.metaTitle || post.title
  const shortTitle = fullTitle.length > 75 
    ? fullTitle.substring(0, 72) + '...' 
    : fullTitle
  
  const canonicalUrl = `https://www.adsnow.ro/blog/${slug}`
  
  return {
    title: shortTitle,
    description: post.seo.metaDescription || post.excerpt,
    keywords: post.seo.keywords,
    // FIX: Add canonical URL
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: shortTitle,
      description: post.seo.metaDescription || post.excerpt,
      url: canonicalUrl, // FIX: Use www.adsnow.ro
      images: [post.image],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: shortTitle,
      description: post.seo.metaDescription || post.excerpt,
      images: [post.image],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostData(slug)
  
  if (!post) {
    notFound()
  }
  
  // Parse the HTML content to extract body, styles, and scripts
  const { bodyContent, styles, scripts, fontLinks } = parseBlogContent(post.content)
  
  const breadcrumbItems = [
    { name: 'Acasă', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${slug}` }
  ]

  return (
    <>
      <BlogPostSchema post={post} siteUrl="https://www.adsnow.ro" />
      <BreadcrumbSchema items={breadcrumbItems} siteUrl="https://www.adsnow.ro" />
      
      {/* Add font links from the blog post */}
      {fontLinks.map((link, index) => (
        <link
          key={index}
          rel={link.rel}
          href={link.href}
          as={link.as}
          crossOrigin={link.crossorigin as 'anonymous' | 'use-credentials' | undefined}
        />
      ))}
      
      {/* Inject styles from the blog post */}
      {styles && (
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      )}
      
      <main>
        <article className="blog-post-single">
          {/* Back Button */}
          <section className="section pt-4">
            <div className="hero-container">
              <Link href="/blog" className="btn btn-sm btn-outline-secondary mb-4">
                ← Înapoi la Blog
              </Link>
            </div>
          </section>
          
          {/* Body Content Only (no DOCTYPE, html, head, body tags) */}
          <div 
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: bodyContent }}
          />
          
          {/* Client Component for Scripts (Chart.js, etc.) */}
          {scripts && <BlogPostScripts scripts={scripts} />}
        </article>
      </main>
    </>
  )
}

