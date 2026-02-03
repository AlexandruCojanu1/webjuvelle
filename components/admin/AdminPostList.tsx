'use client'

import { useState, useEffect } from 'react'
import { BlogPost } from '@/lib/blog'
import Link from 'next/link'

interface AdminPostListProps {
  posts: BlogPost[]
  onEdit: (post: BlogPost) => void
  onDelete: (slug: string) => void
  onIndexToGoogle?: (slug: string) => void
}

export default function AdminPostList({ posts, onEdit, onDelete, onIndexToGoogle }: AdminPostListProps) {
  const [localPosts, setLocalPosts] = useState<BlogPost[]>(posts)

  useEffect(() => {
    setLocalPosts(posts)
  }, [posts])

  const handleDelete = (slug: string) => {
    if (confirm('Ești sigur că vrei să ștergi acest articol?')) {
      onDelete(slug)
    }
  }

  return (
    <div className="admin-post-list">
      <div className="admin-post-list-header">
        <h2>Articole Blog ({localPosts.length})</h2>
        <Link href="/blog" target="_blank" className="btn btn-outline-secondary btn-sm">
          Vezi Blog Public
        </Link>
      </div>

      {localPosts.length === 0 ? (
        <div className="admin-empty-state">
          <p>Nu există articole. Creează primul articol!</p>
        </div>
      ) : (
        <div className="admin-post-table-container">
          <table className="admin-post-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titlu</th>
                <th>Categorie</th>
                <th>Data</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {localPosts.map((post) => (
                <tr key={post.slug}>
                  <td>{post.id}</td>
                  <td>
                    <div className="admin-post-title">
                      {post.title}
                      {post.featured && (
                        <span className="admin-badge admin-badge-featured">Featured</span>
                      )}
                    </div>
                  </td>
                  <td>{post.category}</td>
                  <td>{new Date(post.date).toLocaleDateString('ro-RO')}</td>
                  <td>
                    {post.published ? (
                      <span className="admin-badge admin-badge-published">Publicat</span>
                    ) : (
                      <span className="admin-badge admin-badge-draft">Draft</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        onClick={() => onEdit(post)}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Editează
                      </button>
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="btn btn-sm btn-outline-secondary"
                      >
                        Vezi
                      </Link>
                      {post.published && onIndexToGoogle && (
                        <button
                          onClick={() => onIndexToGoogle(post.slug)}
                          className="btn btn-sm btn-outline-success"
                          title="Indexează în Google"
                        >
                          Google
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        Șterge
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .admin-post-list {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
        }

        .admin-post-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .admin-post-list-header h2 {
          color: #ffffff;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .admin-empty-state {
          text-align: center;
          padding: 3rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .admin-post-table-container {
          overflow-x: auto;
        }

        .admin-post-table {
          width: 100%;
          border-collapse: collapse;
          color: #ffffff;
        }

        .admin-post-table thead {
          background: rgba(255, 255, 255, 0.1);
        }

        .admin-post-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid rgba(255, 255, 255, 0.2);
        }

        .admin-post-table td {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .admin-post-table tr:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .admin-post-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          max-width: 300px;
        }

        .admin-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .admin-badge-featured {
          background: rgba(46, 94, 153, 0.3);
          color: #2E5E99;
          border: 1px solid #2E5E99;
        }

        .admin-badge-published {
          background: rgba(76, 175, 80, 0.3);
          color: #4CAF50;
          border: 1px solid #4CAF50;
        }

        .admin-badge-draft {
          background: rgba(255, 193, 7, 0.3);
          color: #FFC107;
          border: 1px solid #FFC107;
        }

        .admin-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-sm {
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        }

        .btn-outline-primary {
          background: transparent;
          border: 1px solid #2E5E99;
          color: #2E5E99;
        }

        .btn-outline-primary:hover {
          background: #2E5E99;
          color: #ffffff;
        }

        .btn-outline-secondary {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
        }

        .btn-outline-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .btn-outline-danger {
          background: transparent;
          border: 1px solid #EF5350;
          color: #EF5350;
        }

        .btn-outline-danger:hover {
          background: #EF5350;
          color: #ffffff;
        }

        .btn-outline-success {
          background: transparent;
          border: 1px solid #4CAF50;
          color: #4CAF50;
        }

        .btn-outline-success:hover {
          background: #4CAF50;
          color: #ffffff;
        }

        @media (max-width: 768px) {
          .admin-post-table {
            font-size: 0.875rem;
          }

          .admin-post-table th,
          .admin-post-table td {
            padding: 0.5rem;
          }

          .admin-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

