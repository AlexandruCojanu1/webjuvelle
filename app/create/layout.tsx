import type { Metadata } from 'next'
import '@/app/wizard.css'

export const metadata: Metadata = {
    title: 'Create Your Website — Webjuvelle',
    description: 'Generate a professional AI-powered website in minutes.',
}

// No Header/Footer — the wizard is a full-screen app
export default function CreateLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
