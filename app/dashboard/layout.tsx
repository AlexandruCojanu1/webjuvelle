import type { Metadata } from 'next'
import '@/app/wizard.css'

export const metadata: Metadata = {
    title: 'Dashboard — Webjuvelle',
    description: 'Manage your AI-generated websites.',
}

// No Header/Footer — the dashboard is a full-screen app
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
