'use client'

import { useState, useEffect } from 'react'
import { BlogPost } from '@/lib/blog'

interface AdminPostFormProps {
  post?: BlogPost | null
  onSave: (post: BlogPost) => void
  onCancel: () => void
}

export default function AdminPostForm({ post, onSave, onCancel }: AdminPostFormProps) {
  const [htmlContent, setHtmlContent] = useState('')
  const [featured, setFeatured] = useState(false)
  const [slug, setSlug] = useState('')

  useEffect(() => {
    if (post) {
      setHtmlContent(post.content)
      setFeatured(post.featured)
      setSlug(post.slug)
    } else {
      setHtmlContent('')
      setFeatured(false)
      setSlug('')
    }
  }, [post])

  const extractMetadataFromHTML = (html: string) => {
    // Extract title from <h1> or <title>
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || 
                       html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : 'Articol Nou'

    // Extract excerpt from first <p> or meta description
    const excerptMatch = html.match(/<p[^>]*>([^<]+)<\/p>/i) ||
                         html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    const excerpt = excerptMatch ? excerptMatch[1].trim().substring(0, 200) : 'Articol nou'

    // Extract category from meta tag or default
    const categoryMatch = html.match(/<meta[^>]*name=["']category["'][^>]*content=["']([^"']+)["']/i)
    const category = categoryMatch ? categoryMatch[1] : 'Social Media'

    // Extract date from meta tag or use today
    const dateMatch = html.match(/<meta[^>]*name=["']date["'][^>]*content=["']([^"']+)["']/i)
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0]

    // Extract tags from meta tag
    const tagsMatch = html.match(/<meta[^>]*name=["']tags["'][^>]*content=["']([^"']+)["']/i)
    const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : []

    // Extract SEO metadata
    const seoTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
                           html.match(/<meta[^>]*name=["']title["'][^>]*content=["']([^"']+)["']/i)
    const seoTitle = seoTitleMatch ? seoTitleMatch[1] : title

    const seoDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    const seoDesc = seoDescMatch ? seoDescMatch[1] : excerpt

    const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i)
    const keywords = keywordsMatch ? keywordsMatch[1] : tags.join(', ')

    return {
      title,
      excerpt,
      category,
      date,
      tags,
      seo: {
        metaTitle: seoTitle,
        metaDescription: seoDesc,
        keywords,
      },
    }
  }

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!htmlContent.trim()) {
      alert('Conținutul HTML este obligatoriu!')
      return
    }

    if (!slug.trim()) {
      alert('Slug-ul este obligatoriu!')
      return
    }

    const metadata = extractMetadataFromHTML(htmlContent)
    const finalSlug = slug.trim() || generateSlug(metadata.title)

    const postData: BlogPost = {
      slug: finalSlug,
      title: metadata.title,
      excerpt: metadata.excerpt,
      content: htmlContent,
      image: '/favicon.webp',
      date: metadata.date,
      category: metadata.category,
      author: 'Algo Digital Solutions',
      tags: metadata.tags,
      seo: metadata.seo,
      published: true, // Auto-publish
      featured: featured,
      id: post?.id || Date.now(),
    }

    onSave(postData)
  }

  return (
    <div className="admin-post-form">
      <div className="admin-post-form-header">
        <h2>{post ? 'Editează Articol' : 'Articol Nou'}</h2>
        <button onClick={onCancel} className="btn btn-outline-secondary btn-sm">
          Anulează
        </button>
      </div>

      <form onSubmit={handleSubmit} className="admin-post-form-content">
        <div className="admin-form-group">
          <label htmlFor="slug">Slug * (identificator unic pentru URL)</label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="admin-form-input"
            placeholder="exemplu-articol-2025"
          />
          <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
            URL-ul articolului va fi: /blog/{slug || 'slug-articol'}
          </small>
        </div>

        <div className="admin-form-group">
          <label htmlFor="content">Conținut HTML *</label>
          <textarea
            id="content"
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            required
            rows={20}
            className="admin-form-textarea admin-form-textarea-code"
            placeholder="<html>...</html>"
          />
          <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
            Lipește aici codul HTML complet al articolului. Titlul, rezumatul și alte metadata vor fi extrase automat.
          </small>
        </div>

        <div className="admin-form-checkboxes">
          <label className="admin-checkbox-label">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <span>Featured (va apărea în secțiunea principală)</span>
          </label>
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-accent">
            {post ? 'Salvează Modificările' : 'Creează Articol'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-outline-secondary">
            Anulează
          </button>
        </div>
      </form>

      <style jsx>{`
        .admin-post-form {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
        }

        .admin-post-form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .admin-post-form-header h2 {
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .admin-post-form-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .admin-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .admin-form-group label {
          color: #ffffff;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .admin-form-input,
        .admin-form-textarea {
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        .admin-form-textarea {
          resize: vertical;
          min-height: 400px;
        }

        .admin-form-textarea-code {
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
        }

        .admin-form-input:focus,
        .admin-form-textarea:focus {
          outline: none;
          border-color: #2E5E99;
          background: rgba(255, 255, 255, 0.15);
        }

        .admin-form-input::placeholder,
        .admin-form-textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .admin-form-checkboxes {
          display: flex;
          gap: 2rem;
        }

        .admin-checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          color: #ffffff;
        }

        .admin-checkbox-label input[type='checkbox'] {
          width: 1.25rem;
          height: 1.25rem;
          cursor: pointer;
        }

        .admin-form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .admin-form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
