-- ================================================================
-- WEBJUVELLE — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- TABLE: users_meta
-- Extra metadata for authenticated Supabase users
-- ================================================================
CREATE TABLE IF NOT EXISTS public.users_meta (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  credits_remaining INTEGER NOT NULL DEFAULT 1,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automatically create a users_meta row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_meta (id, email, credits_remaining)
  VALUES (NEW.id, NEW.email, 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- TABLE: projects
-- Each AI-generated website project
-- ================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'onboarding'
    CHECK (status IN ('onboarding', 'generating', 'deployed', 'failed')),
  vercel_project_id TEXT,
  vercel_url TEXT,
  github_repo TEXT,
  domain TEXT,
  revision_count INTEGER NOT NULL DEFAULT 0,
  onboarding_data JSONB,        -- stores all collected answers from Haiku
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ================================================================
-- TABLE: conversations
-- Per-project chat history (both onboarding and revision chats)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- Users can only access their own data
-- ================================================================
ALTER TABLE public.users_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- users_meta policies
CREATE POLICY "Users can view own meta" ON public.users_meta
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own meta" ON public.users_meta
  FOR UPDATE USING (auth.uid() = id);

-- projects policies
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

-- conversations policies
CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id)
  );

CREATE POLICY "Users can insert own conversations" ON public.conversations
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.projects WHERE id = project_id)
  );

-- ================================================================
-- INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_project_id ON public.conversations(project_id);
