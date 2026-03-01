'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Project {
    id: string
    name: string
    status: string
    vercel_url: string | null
    domain: string | null
    revision_count: number
    created_at: string
}

interface UserMeta {
    credits_remaining: number
    email: string
}

export default function DashboardPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [userMeta, setUserMeta] = useState<UserMeta | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function loadDashboard() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/create'); return }

            const [{ data: meta }, { data: projectsList }] = await Promise.all([
                supabase.from('users_meta').select('credits_remaining, email').eq('id', user.id).single(),
                supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
            ])

            setUserMeta(meta)
            setProjects(projectsList || [])
            setLoading(false)
        }
        loadDashboard()
    }, [router])

    async function signOut() {
        await supabase.auth.signOut()
        router.push('/')
    }

    function getStatusBadge(status: string) {
        const map: Record<string, string> = {
            onboarding: 'badge-info',
            generating: 'badge-warning',
            deployed: 'badge-success',
            failed: 'badge-error',
        }
        return map[status] || 'badge-info'
    }

    if (loading) {
        return (
            <main className="dashboard-loading">
                <div className="spinner"></div>
            </main>
        )
    }

    return (
        <main className="dashboard-page">
            <nav className="dashboard-nav">
                <Link href="/">
                    <Image src="/assets/images/logo1.webp" alt="Webjuvelle" width={120} height={38} priority />
                </Link>
                <div className="dashboard-nav-right">
                    <div className="credits-badge">
                        <i className="fa-solid fa-bolt"></i>
                        <span>{userMeta?.credits_remaining ?? 0} credits</span>
                    </div>
                    <button onClick={signOut} className="btn btn-sm btn-outline-primary">Sign Out</button>
                </div>
            </nav>

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div>
                        <h1>My Projects</h1>
                        <p>{userMeta?.email}</p>
                    </div>
                    <Link href="/create/wizard" className="btn btn-accent">
                        <i className="fa-solid fa-plus"></i>
                        New Website
                    </Link>
                </div>

                {projects.length === 0 ? (
                    <div className="dashboard-empty">
                        <div className="empty-icon">
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                        </div>
                        <h2>No projects yet</h2>
                        <p>Generate your first AI-powered website in minutes.</p>
                        <Link href="/create/wizard" className="btn btn-accent">
                            Create Your First Website
                        </Link>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {projects.map(project => (
                            <div key={project.id} className="project-card">
                                <div className="project-card-header">
                                    <div className="project-info">
                                        <h3>{project.name}</h3>
                                        <span className={`status-badge ${getStatusBadge(project.status)}`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <span className="project-date">
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="project-details">
                                    {project.domain ? (
                                        <a href={`https://${project.domain}`} target="_blank" rel="noopener noreferrer" className="project-domain">
                                            <i className="fa-solid fa-globe"></i> {project.domain}
                                        </a>
                                    ) : project.vercel_url ? (
                                        <a href={project.vercel_url} target="_blank" rel="noopener noreferrer" className="project-preview-link">
                                            <i className="fa-solid fa-arrow-up-right-from-square"></i> Preview Site
                                        </a>
                                    ) : null}
                                    <span className="revision-count">
                                        <i className="fa-solid fa-rotate"></i>
                                        {project.revision_count} revision{project.revision_count !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="project-actions">
                                    {project.status === 'deployed' && (
                                        <>
                                            <Link
                                                href={`/create/wizard?projectId=${project.id}&phase=revision`}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                Request Revision
                                            </Link>
                                            {!project.domain && (
                                                <Link
                                                    href={`/create/wizard?projectId=${project.id}&phase=domain`}
                                                    className="btn btn-sm btn-accent"
                                                >
                                                    Connect Domain
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upgrade CTA */}
                {(userMeta?.credits_remaining ?? 0) === 0 && (
                    <div className="upgrade-banner">
                        <div className="upgrade-content">
                            <h3>Out of credits?</h3>
                            <p>Upgrade to Business or Pro to generate more websites and unlock advanced features.</p>
                        </div>
                        <Link href="/#pricing" className="btn btn-accent">View Plans</Link>
                    </div>
                )}
            </div>
        </main>
    )
}
