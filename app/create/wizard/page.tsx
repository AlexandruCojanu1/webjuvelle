'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

type WizardPhase = 'onboarding' | 'generating' | 'deployed' | 'revision' | 'domain'

const SUGGESTIONS: Record<WizardPhase, string[]> = {
    onboarding: ['I run a local bakery', 'I offer consulting services', 'I need a portfolio site'],
    generating: [],
    deployed: ["I love it! Let's do the domain", 'Change the color scheme', 'Update the text content'],
    revision: ['Make it darker', 'Change the font', 'Add an about section'],
    domain: ['I already own a domain', 'Check if mybusiness.com is available'],
}

export default function WizardPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [phase, setPhase] = useState<WizardPhase>('onboarding')
    const [projectId, setProjectId] = useState<string | null>(null)
    const [deployedUrl, setDeployedUrl] = useState<string | null>(null)
    const [domainInput, setDomainInput] = useState('')
    const [domainAvailability, setDomainAvailability] = useState<{ available: boolean; price?: number } | null>(null)
    const [initialized, setInitialized] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const router = useRouter()

    useEffect(() => {
        async function initWizard() {
            // --- AUTH BYPASS FOR TESTING ---
            // const { data: { user } } = await supabase.auth.getUser()
            // if (!user) { router.push('/create'); return }

            // const { data: meta } = await supabase
            //     .from('users_meta').select('credits_remaining').eq('id', user.id).single()

            // if (!meta || meta.credits_remaining < 1) {
            //     setMessages([{ role: 'assistant', content: "You don't have any credits remaining. Upgrade your plan to generate more websites." }])
            //     setInitialized(true)
            //     return
            // }

            // Use a temporary hardcoded project ID or create an anon project
            // For now, we'll bypass the DB insert since RLS blocks anon inserts
            // and just kickstart the chat
            const mockProjectId = "00000000-0000-0000-0000-000000000000"
            setProjectId(mockProjectId)
            
            // Kickstart the chat directly
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: mockProjectId, message: '__INIT__' }),
            }).catch(e => console.error(e))

            if (res) {
                const data = await res.json()
                setMessages([{ role: 'assistant', content: data.reply }])
            }
            setInitialized(true)
        }
        initWizard()
    }, [router])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Auto-resize textarea
    function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setInput(e.target.value)
        e.target.style.height = 'auto'
        e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    async function handleSend(msg?: string) {
        const text = (msg ?? input).trim()
        if (!text || loading || !projectId) return

        setInput('')
        if (inputRef.current) inputRef.current.style.height = 'auto'
        setMessages(prev => [...prev, { role: 'user', content: text }])
        setLoading(true)

        try {
            if (phase === 'onboarding') {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId, message: text, mockHistory: messages }),
                })
                const data = await res.json()
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
                if (data.isComplete) {
                    setPhase('generating')
                    setMessages(prev => [...prev, { role: 'assistant', content: '🚀 Perfect! Generating your website now — this usually takes 1–2 minutes…' }])
                    await triggerGeneration(data.onboardingData)
                }
            } else if (phase === 'revision') {
                const res = await fetch('/api/revise', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId, revisionRequest: text }),
                })
                const data = await res.json()
                if (data.requiresPayment) {
                    setMessages(prev => [...prev, { role: 'assistant', content: "You've used your free revision. Upgrade your plan to make more changes." }])
                } else {
                    setDeployedUrl(data.newUrl)
                    setMessages(prev => [...prev, { role: 'assistant', content: `✅ Done! Your updated site is live:\n${data.newUrl}\n\nHappy with it? Say so and we'll set up your domain!` }])
                    setPhase('deployed')
                }
            } else if (phase === 'deployed') {
                const l = text.toLowerCase()
                if (l.includes('happy') || l.includes('love it') || l.includes('great') || l.includes('domain')) {
                    setPhase('domain')
                    setMessages(prev => [...prev, { role: 'assistant', content: "🎉 Amazing! Now let's get your website on a real domain.\n\nDo you already own a domain, or would you like to check if one's available?" }])
                } else {
                    setPhase('revision')
                    setMessages(prev => [...prev, { role: 'assistant', content: 'Sure! Tell me exactly what you\'d like to change and I\'ll apply it.' }])
                }
            } else if (phase === 'domain') {
                if (text.includes('.')) {
                    setDomainInput(text.replace(/^https?:\/\//, '').trim())
                    await checkDomainByName(text.replace(/^https?:\/\//, '').trim())
                } else {
                    setMessages(prev => [...prev, { role: 'assistant', content: 'Please enter a domain name, e.g. mybusiness.com' }])
                }
            }
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
        } finally {
            setLoading(false)
        }
    }

    async function triggerGeneration(mockData?: any) {
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId, mockOnboardingData: mockData }),
        })
        const data = await res.json()
        if (data.deploymentUrl) {
            setDeployedUrl(data.deploymentUrl)
            setPhase('deployed')
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `🎉 Your website is live!\n\n**Preview:** [${data.deploymentUrl}](${data.deploymentUrl})\n\nWhat do you think? You have 1 free revision. Tell me what to change, or say "I love it!" to move on to your domain.`,
            }])
        }
    }

    async function checkDomainByName(domain: string) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Checking **${domain}**…` }])
        const res = await fetch(`/api/domain?domain=${domain}`)
        const data = await res.json()
        setDomainAvailability(data)
        if (data.available) {
            setMessages(prev => [...prev, { role: 'assistant', content: `✅ **${domain}** is available for $${data.price}/year! Ready to purchase?` }])
        } else {
            setMessages(prev => [...prev, { role: 'assistant', content: `❌ **${domain}** is already taken. Do you own this domain, or would you like to try another one?` }])
        }
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
            setMessages(prev => [...prev, { role: 'assistant', content: `🎉 **${domainInput}** is now connected! Your website is live. Congratulations! 🚀` }])
        }
        setLoading(false)
    }

    function renderContent(text: string) {
        if (!text) return ''
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/\n/g, '<br/>')
    }

    const suggestions = SUGGESTIONS[phase]

    return (
        <main className="chat-page">
            {/* Top bar */}
            <header className="chat-topbar">
                <div className="chat-topbar-inner">
                    <span className="chat-topbar-title">
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                        AI Website Builder
                    </span>
                    {deployedUrl && (
                        <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className="chat-preview-link">
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                            Preview
                        </a>
                    )}
                </div>
            </header>

            {/* Messages */}
            <div className="chat-messages-area">
                <div className="chat-messages-inner">
                    {!initialized && (
                        <div className="chat-loading">
                            <div className="chat-spinner"></div>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
                            {msg.role === 'assistant' && (
                                <div className="chat-avatar">
                                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                                </div>
                            )}
                            <div
                                className={`chat-bubble chat-bubble-${msg.role}`}
                                dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                            />
                        </div>
                    ))}

                    {loading && (
                        <div className="chat-msg chat-msg-assistant">
                            <div className="chat-avatar">
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                            </div>
                            <div className="chat-bubble chat-bubble-assistant chat-typing">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}

                    {/* Domain action buttons */}
                    {phase === 'domain' && domainAvailability && !loading && (
                        <div className="chat-actions">
                            {domainAvailability.available ? (
                                <button onClick={() => handleDomainAction('buy')} className="chat-action-btn chat-action-primary">
                                    Purchase ${domainAvailability.price}/yr via Stripe
                                </button>
                            ) : (
                                <button onClick={() => handleDomainAction('own')} className="chat-action-btn">
                                    I own this domain — connect it
                                </button>
                            )}
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="chat-input-area">
                <div className="chat-input-inner">
                    {/* Suggestion chips */}
                    {suggestions.length > 0 && messages.length <= 2 && (
                        <div className="chat-suggestions">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    className="chat-suggestion-chip"
                                    onClick={() => handleSend(s)}
                                    disabled={loading}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className={`chat-input-box ${phase === 'generating' ? 'chat-input-disabled' : ''}`}>
                        <textarea
                            ref={inputRef}
                            rows={1}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            disabled={loading || phase === 'generating'}
                            placeholder={
                                phase === 'generating' ? 'Generating your website…' :
                                    phase === 'domain' ? 'Type a domain name, e.g. mybusiness.com' :
                                        phase === 'deployed' ? 'Tell me what to change, or say "I love it!"' :
                                            'Message AI builder…'
                            }
                            className="chat-textarea"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={loading || !input.trim() || phase === 'generating'}
                            className="chat-send-btn"
                            aria-label="Send"
                        >
                            <i className="fa-solid fa-arrow-up"></i>
                        </button>
                    </div>
                    <p className="chat-footer-note">AI can make mistakes. Review your site before publishing.</p>
                </div>
            </div>
        </main>
    )
}
