'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp?: string
}

type WizardPhase = 'onboarding' | 'generating' | 'deployed' | 'revision' | 'domain'

export default function WizardPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [phase, setPhase] = useState<WizardPhase>('onboarding')
    const [projectId, setProjectId] = useState<string | null>(null)
    const [deployedUrl, setDeployedUrl] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [domainInput, setDomainInput] = useState('')
    const [domainAvailability, setDomainAvailability] = useState<{ available: boolean; price?: number } | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        // Auth check + create project
        async function initWizard() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/create')
                return
            }
            setUserId(user.id)

            // Check credits
            const { data: meta } = await supabase
                .from('users_meta')
                .select('credits_remaining')
                .eq('id', user.id)
                .single()

            if (!meta || meta.credits_remaining < 1) {
                setMessages([{
                    role: 'assistant',
                    content: "You don't have any credits remaining. Upgrade your plan to generate more websites.",
                }])
                return
            }

            // Create a new project
            const { data: project } = await supabase
                .from('projects')
                .insert({ user_id: user.id, name: 'New Website', status: 'onboarding' })
                .select()
                .single()

            if (project) {
                setProjectId(project.id)
                // Send first message to kick off onboarding
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId: project.id, message: '__INIT__' }),
                })
                const data = await res.json()
                setMessages([{ role: 'assistant', content: data.reply }])
            }
        }

        initWizard()
    }, [router])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    async function sendMessage(e: React.FormEvent) {
        e.preventDefault()
        if (!input.trim() || loading || !projectId) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setLoading(true)

        try {
            if (phase === 'onboarding') {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId, message: userMessage }),
                })
                const data = await res.json()
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])

                if (data.isComplete) {
                    setPhase('generating')
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: '🚀 I have everything I need! Generating your website now. This usually takes 1-2 minutes...',
                    }])
                    await triggerGeneration()
                }
            } else if (phase === 'revision') {
                const res = await fetch('/api/revise', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId, revisionRequest: userMessage }),
                })
                const data = await res.json()
                if (data.requiresPayment) {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: "You've used your free revision. To make additional changes, please upgrade your plan.",
                    }])
                } else {
                    setDeployedUrl(data.newUrl)
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: data.message || `✅ Revision applied! Your site is live at:\n${data.newUrl}`,
                    }])
                }
            } else if (phase === 'domain') {
                await handleDomainChat(userMessage)
            }
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
        } finally {
            setLoading(false)
        }
    }

    async function triggerGeneration() {
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId }),
            })
            const data = await res.json()

            if (data.deploymentUrl) {
                setDeployedUrl(data.deploymentUrl)
                setPhase('deployed')
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `🎉 Your website is live!\n\n**Preview:** ${data.deploymentUrl}\n\nWhat do you think? You have 1 free revision. Just tell me what you'd like to change, or say "I'm happy with it!" to move on to your domain.`,
                }])
            }
        } catch {
            setPhase('onboarding')
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '❌ Generation failed. Please try again.',
            }])
        }
    }

    async function handleDomainChat(msg: string) {
        const lower = msg.toLowerCase()
        if (lower.includes("i'm happy") || lower.includes('im happy') || lower.includes('love it') || lower.includes('looks great')) {
            setPhase('domain')
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Amazing! 🙌 Now let's get your website on a real domain.\n\nDo you already have a domain name? If yes, type it. If not, type a domain you'd like and I'll check if it's available!",
            }])
        } else if (lower.includes('change') || lower.includes('update') || lower.includes('fix') || lower.includes('modify')) {
            setPhase('revision')
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sure! Tell me exactly what you\'d like to change.' }])
        }
    }

    async function checkDomain() {
        if (!domainInput) return
        const res = await fetch(`/api/domain?domain=${domainInput}`)
        const data = await res.json()
        setDomainAvailability(data)
    }

    async function handleDomainAction(action: 'own' | 'buy') {
        setLoading(true)
        const res = await fetch('/api/domain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId, domain: domainInput, action }),
        })
        const data = await res.json()
        if (data.dnsMessage) {
            setMessages(prev => [...prev, { role: 'assistant', content: data.dnsMessage }])
        } else if (data.success) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `🎉 Your domain **${domainInput}** is now live! Congratulations on your new website!`,
            }])
        }
        setLoading(false)
    }

    function renderMessageContent(content: string) {
        // Simple markdown-like rendering for links and bold
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/\n/g, '<br/>')
    }

    return (
        <main className="wizard-page">
            <div className="wizard-layout">
                {/* Sidebar */}
                <aside className="wizard-sidebar">
                    <div className="wizard-logo">
                        <a href="/">
                            <Image src="/assets/images/logo1.webp" alt="Webjuvelle" width={120} height={38} />
                        </a>
                    </div>
                    <div className="wizard-steps">
                        <div className={`wizard-step ${phase === 'onboarding' ? 'active' : 'done'}`}>
                            <span className="step-number">1</span>
                            <span className="step-label">Tell us about your project</span>
                        </div>
                        <div className={`wizard-step ${phase === 'generating' ? 'active' : (['deployed', 'revision', 'domain'].includes(phase) ? 'done' : '')}`}>
                            <span className="step-number">2</span>
                            <span className="step-label">AI generates your site</span>
                        </div>
                        <div className={`wizard-step ${['deployed', 'revision'].includes(phase) ? 'active' : (phase === 'domain' ? 'done' : '')}`}>
                            <span className="step-number">3</span>
                            <span className="step-label">Review & revise</span>
                        </div>
                        <div className={`wizard-step ${phase === 'domain' ? 'active' : ''}`}>
                            <span className="step-number">4</span>
                            <span className="step-label">Connect your domain</span>
                        </div>
                    </div>
                    {deployedUrl && (
                        <div className="wizard-preview-link">
                            <a href={deployedUrl} target="_blank" rel="noopener noreferrer">
                                <i className="fa-solid fa-arrow-up-right-from-square"></i> Preview Site
                            </a>
                        </div>
                    )}
                </aside>

                {/* Chat Area */}
                <div className="wizard-chat">
                    <div className="wizard-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`message-wrapper message-${msg.role}`}>
                                {msg.role === 'assistant' && (
                                    <div className="message-avatar">
                                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                                    </div>
                                )}
                                <div
                                    className={`message-bubble bubble-${msg.role}`}
                                    dangerouslySetInnerHTML={{ __html: renderMessageContent(msg.content) }}
                                />
                                {msg.role === 'user' && (
                                    <div className="message-avatar message-avatar-user">
                                        <i className="fa-solid fa-user"></i>
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="message-wrapper message-assistant">
                                <div className="message-avatar">
                                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                                </div>
                                <div className="message-bubble bubble-assistant typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}

                        {/* Domain Check UI */}
                        {phase === 'domain' && (
                            <div className="domain-checker">
                                <div className="domain-input-row">
                                    <input
                                        type="text"
                                        placeholder="e.g. mybusiness.com"
                                        value={domainInput}
                                        onChange={e => setDomainInput(e.target.value)}
                                        className="domain-input"
                                    />
                                    <button onClick={checkDomain} className="btn btn-primary btn-sm">Check</button>
                                </div>
                                {domainAvailability && (
                                    <div className="domain-result">
                                        {domainAvailability.available ? (
                                            <div className="domain-available">
                                                <span>✅ Available — ${domainAvailability.price}/year</span>
                                                <button onClick={() => handleDomainAction('buy')} className="btn btn-accent btn-sm">
                                                    Purchase via Stripe
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="domain-taken">
                                                <span>❌ Taken — but you can still connect if you own it.</span>
                                                <button onClick={() => handleDomainAction('own')} className="btn btn-outline-primary btn-sm">
                                                    I own this domain
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    {phase !== 'generating' && (
                        <form className="wizard-input-bar" onSubmit={sendMessage}>
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder={
                                    phase === 'onboarding' ? 'Type your answer...' :
                                        phase === 'deployed' ? 'Tell me what to change, or say "I love it!"' :
                                            phase === 'revision' ? 'Describe the changes you want...' :
                                                'Type here...'
                                }
                                disabled={loading}
                                autoFocus
                            />
                            <button type="submit" disabled={loading || !input.trim()} className="wizard-send-btn">
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    )
}
