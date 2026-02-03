import { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo/StructuredData'
import { getSortedPostsData } from '@/lib/blog'
import BlogCard from '@/components/ui/BlogCard'

export const metadata: Metadata = {
  title: 'Blog - Articole despre Marketing Digital',
  description: 'Explorează cele mai recente articole despre marketing digital, SEO, social media și strategii de business online.',
  // FIX: Add canonical URL
  alternates: {
    canonical: 'https://www.adsnow.ro/blog',
  },
  openGraph: {
    title: 'Blog - Articole despre Marketing Digital | ADSNOW',
    description: 'Explorează cele mai recente articole despre marketing digital, SEO, social media și strategii de business online.',
    url: 'https://www.adsnow.ro/blog', // FIX: Use www.adsnow.ro
  },
}

export default function BlogPage() {
  const breadcrumbItems = [
    { name: 'Acasă', url: '/' },
    { name: 'Blog', url: '/blog' }
  ]

  const posts = getSortedPostsData()

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} siteUrl="https://www.adsnow.ro" />
      
      <main>
        <section className="section-banner keep-dark">
          <div className="hero-container">
            <div className="d-flex flex-column gspace-2">
              <h1 className="title-heading">Marketing 101</h1>
              <p className="banner-description">
                Perspectivele noastre despre marketing digital, branding și identitate online.
                Nu reinventăm roata, doar alegem traiectoria.
              </p>
            </div>
          </div>
        </section>
        
        <section className="section">
          <div className="hero-container">
            {posts.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">Momentan nu există articole publicate.</p>
              </div>
            ) : (
              <div className="row row-cols-md-2 row-cols-1 grid-spacer-3">
                {posts.map(post => (
                  <div key={post.id} className="col">
                    <BlogCard post={post} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}

