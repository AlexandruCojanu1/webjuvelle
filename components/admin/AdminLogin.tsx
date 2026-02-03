'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminLoginProps {
  onLogin: () => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Admin password - should be in environment variable in production
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Adsnow2026!'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simple password check
    if (password === ADMIN_PASSWORD) {
      // Store login state in sessionStorage
      sessionStorage.setItem('admin_authenticated', 'true')
      sessionStorage.setItem('admin_login_time', Date.now().toString())
      onLogin()
    } else {
      setError('Parolă incorectă')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Admin Panel</h1>
        <p className="admin-login-subtitle">Autentificare necesară</p>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="password" className="admin-form-label">
              Parolă
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-form-input"
              placeholder="Introdu parola"
              required
              autoFocus
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="admin-error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-accent admin-login-button"
            disabled={loading}
          >
            {loading ? 'Se conectează...' : 'Conectare'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-color, #0D2440);
          padding: 2rem;
        }

        .admin-login-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 3rem;
          max-width: 400px;
          width: 100%;
          backdrop-filter: blur(10px);
        }

        .admin-login-title {
          color: #ffffff;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .admin-login-subtitle {
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          margin-bottom: 2rem;
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .admin-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .admin-form-label {
          color: #ffffff;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .admin-form-input {
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .admin-form-input:focus {
          outline: none;
          border-color: #2E5E99;
          background: rgba(255, 255, 255, 0.15);
        }

        .admin-form-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .admin-error-message {
          background: rgba(239, 83, 80, 0.2);
          border: 1px solid rgba(239, 83, 80, 0.5);
          color: #EF5350;
          padding: 0.75rem;
          border-radius: 8px;
          text-align: center;
          font-size: 0.9rem;
        }

        .admin-login-button {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
        }

        .admin-login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}

