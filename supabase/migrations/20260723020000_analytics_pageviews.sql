-- Migration: 20260723020000_analytics_pageviews.sql
-- Description: Analytics telemetry tables for pageviews, unique visitors, and active sessions

CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  path TEXT NOT NULL,
  page_title TEXT,
  place_id TEXT,
  story_id TEXT,
  device_type TEXT DEFAULT 'Mobile',
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.visitor_sessions (
  session_id TEXT PRIMARY KEY,
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  total_views INT DEFAULT 1,
  device_type TEXT DEFAULT 'Mobile'
);

-- Performance Indexes for fast queries & analytics aggregations
CREATE INDEX IF NOT EXISTS idx_page_views_path_created ON public.page_views (path, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON public.page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON public.page_views (session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_last_seen ON public.visitor_sessions (last_seen_at DESC);
