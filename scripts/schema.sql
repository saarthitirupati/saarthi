-- ============================================================
-- SAARTHI STAGE 1 — DATABASE SCHEMA
-- Run against Supabase PostgreSQL
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- CITIES
-- Multi-city ready from day one. Only Tirupati for now.
-- ============================================================
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  lat DECIMAL NOT NULL,
  lng DECIMAL NOT NULL,
  state TEXT,
  country TEXT DEFAULT 'India',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CATEGORIES
-- Dynamic categories per city. Admin-manageable.
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  icon TEXT,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city_id, slug)
);

-- ============================================================
-- PLACES
-- The core table. Replaces the 97KB hardcoded places.ts.
-- Story/history inline (Change 2). Gallery as JSONB (Change 4).
-- Media replaces youtube (Change 5). Verification fields (Change 9/10).
-- ============================================================
CREATE TABLE IF NOT EXISTS places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,

  -- Content (always loaded with place, never queried independently)
  description TEXT,                     -- 50-80 word intro
  history TEXT,                         -- story card, 1-min read
  story TEXT,                           -- narrative version
  interesting_facts JSONB,              -- ["fact1", "fact2", ...]
  why_visit TEXT[],                     -- ['Spiritual importance', 'Scenic beauty']

  -- Location
  coordinates JSONB,                    -- { "lat": 13.63, "lng": 79.42 }

  -- Practical info (JSONB — always loaded together)
  timings JSONB,                        -- { "opening": "6:00 AM", "closing": "8:00 PM", "bestTime": "Morning", "breakTimings": [...] }
  entry_fee JSONB,                      -- { "amount": 0, "currency": "INR", "notes": "Free entry" }
  visit_duration JSONB,                 -- { "quick": "30 min", "recommended": "90 min" }
  travel_info JSONB,                    -- { "rtc": { "fare": 20, "time": "25 mins", "bus_numbers": ["201"] }, "auto": {...}, "bike": {...}, "car": {...} }

  -- Media (Change 4 + 5)
  hero_image TEXT,                      -- primary display image
  gallery JSONB DEFAULT '[]'::jsonb,    -- [{ "url": "", "caption": "", "featured": true }]
  media JSONB DEFAULT '{}'::jsonb,      -- { "video": "youtube_url", "audio": "guide_url", "pdf": "" }

  -- Visitor guidance
  tips TEXT[],                          -- ['Carry water', 'Visit before 10 AM']

  -- Smart suggestion tags
  weather_ideal TEXT[] DEFAULT '{"all"}',   -- ['sunny', 'rainy', 'cloudy', 'all']
  best_time TEXT[] DEFAULT '{"morning"}',   -- ['morning', 'afternoon', 'evening']
  crowd_escape BOOLEAN DEFAULT false,

  -- Overflow for rich fields (spiritual_info, rituals, facilities, architecture, etc.)
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Verification (Change 9 + 10)
  verification_status TEXT DEFAULT 'Not Verified',
  verified_by TEXT,
  verified_on TIMESTAMPTZ,
  last_reviewed TIMESTAMPTZ,           -- Admin gets warning if stale
  trust_score INTEGER DEFAULT 0,

  -- Metadata & Search
  keywords TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,

  -- Publishing
  status TEXT DEFAULT 'Draft',
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PLACE_NEARBY (Change 3: junction table instead of UUID[])
-- ============================================================
CREATE TABLE IF NOT EXISTS place_nearby (
  place_id UUID REFERENCES places(id) ON DELETE CASCADE NOT NULL,
  nearby_place_id UUID REFERENCES places(id) ON DELETE CASCADE NOT NULL,
  priority INTEGER DEFAULT 0,
  PRIMARY KEY (place_id, nearby_place_id)
);

-- ============================================================
-- LIVE_UPDATES (Change 8: richer schema)
-- Covers: crowd, parking, temple notices, darshan wait, SSD tokens
-- ============================================================
CREATE TABLE IF NOT EXISTS live_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE NOT NULL,
  place_id UUID REFERENCES places(id) ON DELETE SET NULL,
  module TEXT NOT NULL,                 -- 'crowd', 'parking', 'darshan', 'ssd', 'temple_notice'
  title TEXT NOT NULL,
  value TEXT,
  badge TEXT,                           -- 'Active', 'Warning', 'Info', 'Critical'
  priority INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FESTIVALS
-- ============================================================
CREATE TABLE IF NOT EXISTS festivals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  date_start DATE NOT NULL,
  date_end DATE,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ALERTS
-- ============================================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DARSHAN_TYPES
-- ============================================================
CREATE TABLE IF NOT EXISTS darshan_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  wait_time TEXT,
  fee JSONB,                            -- { "amount": 300, "currency": "INR" }
  tips TEXT[],
  guidelines TEXT[],
  journey_steps JSONB,                  -- [{ "step": 1, "title": "...", "description": "..." }]
  facilities JSONB,
  dress_code JSONB,
  accessibility TEXT,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city_id, slug)
);

-- ============================================================
-- FEEDBACK
-- ============================================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  is_positive BOOLEAN NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ANONYMOUS_SESSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS anonymous_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ANALYTICS_EVENTS (Change 6: 'action' not 'event_type')
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES anonymous_sessions(id) ON DELETE SET NULL,
  action TEXT NOT NULL,                 -- 'page_view', 'place_open', 'share', 'save', 'feedback', 'search'
  place_id UUID REFERENCES places(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_places_city ON places(city_id);
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category_id);
CREATE INDEX IF NOT EXISTS idx_places_slug ON places(slug);
CREATE INDEX IF NOT EXISTS idx_places_published ON places(status) WHERE status = 'Published';
CREATE INDEX IF NOT EXISTS idx_places_verified ON places(verification_status) WHERE verification_status = 'Verified';
CREATE INDEX IF NOT EXISTS idx_places_last_reviewed ON places(last_reviewed);

CREATE INDEX IF NOT EXISTS idx_live_updates_city ON live_updates(city_id);
CREATE INDEX IF NOT EXISTS idx_live_updates_active ON live_updates(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_live_updates_module ON live_updates(module);

CREATE INDEX IF NOT EXISTS idx_festivals_city ON festivals(city_id);
CREATE INDEX IF NOT EXISTS idx_festivals_date ON festivals(date_start);
CREATE INDEX IF NOT EXISTS idx_festivals_active ON festivals(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_alerts_city ON alerts(city_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_feedback_place ON feedback(place_id);
CREATE INDEX IF NOT EXISTS idx_analytics_action ON analytics_events(action);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER places_updated_at
  BEFORE UPDATE ON places
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER live_updates_updated_at
  BEFORE UPDATE ON live_updates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- Public read, authenticated write for admin
-- ============================================================

-- Places: anyone can read published, only service role can write
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published places" ON places
  FOR SELECT USING (status = 'Published');
CREATE POLICY "Service role full access on places" ON places
  FOR ALL USING (auth.role() = 'service_role');

-- Categories: public read
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);
CREATE POLICY "Service role full access on categories" ON categories
  FOR ALL USING (auth.role() = 'service_role');

-- Live updates: public read active
ALTER TABLE live_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active live_updates" ON live_updates
  FOR SELECT USING (is_active = true);
CREATE POLICY "Service role full access on live_updates" ON live_updates
  FOR ALL USING (auth.role() = 'service_role');

-- Festivals: public read active
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active festivals" ON festivals
  FOR SELECT USING (is_active = true);
CREATE POLICY "Service role full access on festivals" ON festivals
  FOR ALL USING (auth.role() = 'service_role');

-- Alerts: public read active
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active alerts" ON alerts
  FOR SELECT USING (is_active = true);
CREATE POLICY "Service role full access on alerts" ON alerts
  FOR ALL USING (auth.role() = 'service_role');

-- Darshan types: public read active
ALTER TABLE darshan_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active darshan_types" ON darshan_types
  FOR SELECT USING (is_active = true);
CREATE POLICY "Service role full access on darshan_types" ON darshan_types
  FOR ALL USING (auth.role() = 'service_role');

-- Feedback: public can insert, only service role can read
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit feedback" ON feedback
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can read feedback" ON feedback
  FOR SELECT USING (auth.role() = 'service_role');

-- Analytics: public can insert, only service role can read
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can log analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can read analytics" ON analytics_events
  FOR SELECT USING (auth.role() = 'service_role');

-- Sessions: public can insert/update own, service role reads all
ALTER TABLE anonymous_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can create sessions" ON anonymous_sessions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update own session" ON anonymous_sessions
  FOR UPDATE USING (true);
CREATE POLICY "Service role can read sessions" ON anonymous_sessions
  FOR SELECT USING (auth.role() = 'service_role');

-- Cities: public read
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read cities" ON cities
  FOR SELECT USING (true);
CREATE POLICY "Service role full access on cities" ON cities
  FOR ALL USING (auth.role() = 'service_role');

-- Place nearby: public read
ALTER TABLE place_nearby ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read place_nearby" ON place_nearby
  FOR SELECT USING (true);
CREATE POLICY "Service role full access on place_nearby" ON place_nearby
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- ENABLE REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE live_updates;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE places;
