'use client'

import { useState, useEffect } from 'react'
import AdminLogin from '@/components/admin/AdminLogin'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const authenticated = sessionStorage.getItem('admin_authenticated')
      const loginTime = sessionStorage.getItem('admin_login_time')
      
      // Check if login is still valid (24 hours)
      if (authenticated === 'true' && loginTime) {
        const timeDiff = Date.now() - parseInt(loginTime)
        const hoursDiff = timeDiff / (1000 * 60 * 60)
        
        if (hoursDiff < 24) {
          setIsAuthenticated(true)
        } else {
          // Session expired
          sessionStorage.removeItem('admin_authenticated')
          sessionStorage.removeItem('admin_login_time')
        }
      }
      
      setLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated')
    sessionStorage.removeItem('admin_login_time')
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0D2440',
        color: '#ffffff'
      }}>
        Se încarcă...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <>
      <AdminDashboard />
      <div style={{ 
        position: 'fixed', 
        bottom: '1rem', 
        right: '1rem',
        zIndex: 1000
      }}>
        <button
          onClick={handleLogout}
          className="btn btn-outline-secondary btn-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Deconectare
        </button>
      </div>
    </>
  )
}

