-- ==============================================================================
-- Saarthi Database Schema (v1.1) - Sprint 1 Foundation
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ------------------------------------------------------------------------------
-- 2. TABLES & FOREIGN KEYS
-- ------------------------------------------------------------------------------

-- Layer 1: Master Data
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    state TEXT NOT NULL,
    coordinates GEOMETRY(POINT) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL
);

CREATE TABLE places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    history TEXT,
    interesting_facts JSONB DEFAULT '[]'::jsonb,
    why_visit TEXT,
    coordinates GEOMETRY(POINT) NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    videos JSONB DEFAULT '[]'::jsonb,
    gallery JSONB DEFAULT '[]'::jsonb,
    best_visiting_duration INTEGER,
    opening_hours JSONB DEFAULT '{}'::jsonb,
    entry_fee JSONB DEFAULT '{}'::jsonb,
    travel_info JSONB DEFAULT '{}'::jsonb,
    base_priority INTEGER NOT NULL DEFAULT 50,
    verification_status TEXT NOT NULL DEFAULT 'PENDING',
    has_parking BOOLEAN NOT NULL DEFAULT false,
    has_restroom BOOLEAN NOT NULL DEFAULT false,
    free_entry BOOLEAN NOT NULL DEFAULT false,
    requires_ticket BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE place_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    target_place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL,
    distance_km FLOAT
);

-- Layer 2: Recommendation Context
CREATE TABLE place_context (
    place_id UUID PRIMARY KEY REFERENCES places(id) ON DELETE CASCADE,
    best_time JSONB DEFAULT '[]'::jsonb,
    ideal_weather JSONB DEFAULT '[]'::jsonb,
    ideal_temperature_min INTEGER,
    ideal_temperature_max INTEGER,
    season TEXT,
    weekend_friendly BOOLEAN DEFAULT true,
    weekday_friendly BOOLEAN DEFAULT true,
    hot_weather_friendly BOOLEAN DEFAULT false,
    crowd_escape BOOLEAN DEFAULT false,
    indoor BOOLEAN DEFAULT false,
    outdoor BOOLEAN DEFAULT false,
    family_friendly BOOLEAN DEFAULT true,
    elderly_friendly BOOLEAN DEFAULT false,
    wheelchair_accessible BOOLEAN DEFAULT false,
    rtc_available BOOLEAN DEFAULT false,
    recommendation_priority INTEGER DEFAULT 50
);

-- Layer 3: Operations
CREATE TABLE live_updates (
    place_id UUID PRIMARY KEY REFERENCES places(id) ON DELETE CASCADE,
    crowd_level TEXT NOT NULL DEFAULT 'LOW',
    parking_status TEXT NOT NULL DEFAULT 'AVAILABLE',
    rtc_status TEXT NOT NULL DEFAULT 'NORMAL',
    weather_override TEXT,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
    place_id UUID REFERENCES places(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    severity TEXT NOT NULL,
    message TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ
);

-- Layer 4: Experience
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    media_url TEXT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Layer 5: Intelligence
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    is_helpful BOOLEAN NOT NULL,
    comments TEXT,
    language TEXT,
    device TEXT,
    app_version TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    place_id UUID REFERENCES places(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE recommendation_weights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factor TEXT NOT NULL UNIQUE,
    weight INTEGER NOT NULL
);

CREATE TABLE recommendation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    weather TEXT,
    crowd TEXT,
    recommended_place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    clicked BOOLEAN NOT NULL DEFAULT false,
    visited BOOLEAN NOT NULL DEFAULT false
);

-- ------------------------------------------------------------------------------
-- 3. INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX idx_cities_slug ON cities(slug);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_places_slug ON places(slug);
CREATE INDEX idx_places_city_id ON places(city_id);
CREATE INDEX idx_places_category_id ON places(category_id);
CREATE INDEX idx_places_verification ON places(verification_status);
CREATE INDEX idx_places_coordinates ON places USING GIST (coordinates);
CREATE INDEX idx_place_relations_source ON place_relations(source_place_id);
CREATE INDEX idx_place_relations_target ON place_relations(target_place_id);
CREATE INDEX idx_live_updates_crowd ON live_updates(crowd_level);
CREATE INDEX idx_alerts_city ON alerts(city_id);
CREATE INDEX idx_alerts_place ON alerts(place_id);
CREATE INDEX idx_alerts_active ON alerts(is_active);
CREATE INDEX idx_recommendation_logs_session ON recommendation_logs(session_id);
CREATE INDEX idx_analytics_session ON analytics(session_id);

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
-- Enable RLS on all tables
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_logs ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public Read Cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Places" ON places FOR SELECT USING (true);
CREATE POLICY "Public Read Place Relations" ON place_relations FOR SELECT USING (true);
CREATE POLICY "Public Read Place Context" ON place_context FOR SELECT USING (true);
CREATE POLICY "Public Read Live Updates" ON live_updates FOR SELECT USING (true);
CREATE POLICY "Public Read Alerts" ON alerts FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Stories" ON stories FOR SELECT USING (true);
CREATE POLICY "Public Read Recommendation Weights" ON recommendation_weights FOR SELECT USING (true);

-- Public write access (insert only) for feedback, analytics, recommendation logs
CREATE POLICY "Public Insert Feedback" ON feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Analytics" ON analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Recommendation Logs" ON recommendation_logs FOR INSERT WITH CHECK (true);

-- Authenticated Users (Admins) get full access to everything
-- Note: Assuming auth.uid() checks for admin in real setup. We'll use simple auth for now.
CREATE POLICY "Admin Full Access Cities" ON cities TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Categories" ON categories TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Places" ON places TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Place Relations" ON place_relations TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Place Context" ON place_context TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Live Updates" ON live_updates TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Alerts" ON alerts TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Stories" ON stories TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Feedback" ON feedback TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Analytics" ON analytics TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Activity Logs" ON activity_logs TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Recommendation Weights" ON recommendation_weights TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Recommendation Logs" ON recommendation_logs TO authenticated USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 5. VIEWS
-- ------------------------------------------------------------------------------
CREATE VIEW active_places AS
SELECT * FROM places WHERE verification_status = 'VERIFIED';

CREATE VIEW open_places AS
SELECT p.* 
FROM places p
JOIN live_updates lu ON p.id = lu.place_id
LEFT JOIN alerts a ON p.id = a.place_id AND a.is_active = true AND a.type = 'ROAD_CLOSURE'
WHERE a.id IS NULL;
