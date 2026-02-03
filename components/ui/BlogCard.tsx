import Link from 'next/link'
import Image from 'next/image'
import { BlogPost, formatDate } from '@/lib/blog'

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="blog-card" style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'transform 0.3s ease'
    }}>
      <Link href={`/blog/${post.slug}`} className="blog-card-link" style={{ textDecoration: 'none' }}>
        <div className="blog-card-image" style={{
          width: '100%',
          aspectRatio: '16 / 9',
          overflow: 'hidden',
          backgroundColor: '#f8f9fa'
        }}>
          <Image
            src={post.image}
            alt={post.title}
            width={600}
            height={400}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        <div className="blog-card-content" style={{ padding: '1.5rem' }}>
          <div className="blog-card-meta" style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            {/* Category removed as per request */}
            <span className="blog-card-date" style={{
              color: '#ffffff',
              fontSize: '0.875rem',
              opacity: 0.8
            }}>
              {formatDate(post.date)}
            </span>
          </div>
          <h3 className="blog-card-title" style={{
            color: '#ffffff',
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '0.75rem',
            lineHeight: '1.3'
          }}>
            {post.title}
          </h3>
          <p className="blog-card-excerpt" style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1rem',
            lineHeight: '1.6',
            marginBottom: '1rem'
          }}>
            {post.excerpt}
          </p>
          <div className="blog-card-footer">
            <span className="blog-card-read-more" style={{
              color: '#4A90E2',
              fontSize: '0.95rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Citește articolul
              <Image 
                src="/assets/images/cursor.webp" 
                alt="arrow" 
                width={16}
                height={16}
                className="cursor-icon"
                loading="lazy"
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

