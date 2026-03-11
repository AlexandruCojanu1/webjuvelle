'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function CreatePage() {
    const [mode, setMode] = useState<'login' | 'signup'>('signup')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const router = useRouter()

    // --- AUTH BYPASS FOR TESTING ---
    useEffect(() => {
        router.push('/create/wizard')
    }, [router])


    async function handleAuth(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setSuccessMsg('')
        setLoading(true)

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({ 
                    email, 
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/create`
                    }
                })
                if (error) throw error
                setSuccessMsg('Check your email to confirm your account, then log in.')
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error
                router.push('/create/wizard')
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="create-auth-page">
            <div className="create-auth-container">
                <div className="create-auth-card">
                    <div className="create-auth-header">
                        <h1>{mode === 'signup' ? 'Create Your Website' : 'Welcome Back'}</h1>
                        <p>
                            {mode === 'signup'
                                ? 'Start with one free AI-generated website.'
                                : 'Sign in to continue building.'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="create-auth-form">
                        <div className="form-field">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                            />
                        </div>

                        {error && <div className="auth-error">{error}</div>}
                        {successMsg && <div className="auth-success">{successMsg}</div>}

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Loading...' : mode === 'signup' ? 'Get Started Free' : 'Sign In'}
                        </button>
                    </form>

                    <button
                        className="create-auth-switch"
                        onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(''); setSuccessMsg('') }}
                    >
                        {mode === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </button>
                </div>

                <div className="create-auth-features">
                    <div className="create-feature-item">
                        <span className="feature-icon">✦</span>
                        <span>1 free AI-generated website</span>
                    </div>
                    <div className="create-feature-item">
                        <span className="feature-icon">✦</span>
                        <span>Deployed live and ready to share</span>
                    </div>
                    <div className="create-feature-item">
                        <span className="feature-icon">✦</span>
                        <span>1 free revision included</span>
                    </div>
                </div>
            </div>
        </main>
    )
}
