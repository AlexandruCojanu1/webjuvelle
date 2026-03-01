import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy client — avoids crashing at build time when env vars are placeholders
let _client: SupabaseClient | null = null
function getClient() {
    if (!_client) {
        _client = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    }
    return _client
}

// Client-side Supabase client (uses anon key)
export const supabase = new Proxy({} as SupabaseClient, {
    get(_t, p) { return (getClient() as unknown as Record<string, unknown>)[p as string] },
})

// Server-side Supabase client (uses service role — never expose to browser)
export function createServerSupabase() {
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export type Database = {
    public: {
        Tables: {
            users_meta: {
                Row: {
                    id: string
                    email: string
                    credits_remaining: number
                    stripe_customer_id: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    credits_remaining?: number
                    stripe_customer_id?: string | null
                }
                Update: {
                    credits_remaining?: number
                    stripe_customer_id?: string | null
                }
            }
            projects: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    status: 'generating' | 'deployed' | 'failed'
                    vercel_project_id: string | null
                    vercel_url: string | null
                    github_repo: string | null
                    domain: string | null
                    revision_count: number
                    created_at: string
                }
                Insert: {
                    user_id: string
                    name: string
                    status?: 'generating' | 'deployed' | 'failed'
                    vercel_project_id?: string | null
                    vercel_url?: string | null
                    github_repo?: string | null
                    domain?: string | null
                }
                Update: {
                    status?: 'generating' | 'deployed' | 'failed'
                    vercel_project_id?: string | null
                    vercel_url?: string | null
                    github_repo?: string | null
                    domain?: string | null
                    revision_count?: number
                }
            }
            conversations: {
                Row: {
                    id: string
                    project_id: string
                    role: 'user' | 'assistant'
                    content: string
                    created_at: string
                }
                Insert: {
                    project_id: string
                    role: 'user' | 'assistant'
                    content: string
                }
                Update: never
            }
        }
    }
}
