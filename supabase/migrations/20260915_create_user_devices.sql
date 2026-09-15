-- Supabase Migration: Create user_devices, user_notification_preferences, and notification_telemetry
-- Production Notification Engine Architecture for Saarthi (FCM + Web Push)

-- 1. Devices Table
CREATE TABLE IF NOT EXISTS public.user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL UNIQUE,
    platform TEXT NOT NULL CHECK (platform IN ('android', 'web', 'ios')),
    fcm_token TEXT,
    web_subscription JSONB,
    is_in_tirupati BOOLEAN DEFAULT FALSE,
    user_language TEXT DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Notification Preferences Table
CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
    device_id TEXT PRIMARY KEY REFERENCES public.user_devices(device_id) ON DELETE CASCADE,
    crowd_alerts BOOLEAN DEFAULT TRUE,
    temple_updates BOOLEAN DEFAULT TRUE,
    travel_alerts BOOLEAN DEFAULT TRUE,
    daily_guidance BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Notification Telemetry & Observability Table
CREATE TABLE IF NOT EXISTS public.notification_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    audience_count INTEGER DEFAULT 0,
    fcm_accepted INTEGER DEFAULT 0,
    invalid_tokens INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_telemetry ENABLE ROW LEVEL SECURITY;

-- 5. Security Policies for user_devices
DROP POLICY IF EXISTS "Allow anon insert and update user_devices" ON public.user_devices;
DROP POLICY IF EXISTS "Allow service_role full access user_devices" ON public.user_devices;

CREATE POLICY "Allow anon insert and update user_devices"
ON public.user_devices
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow service_role full access user_devices"
ON public.user_devices
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 6. Security Policies for user_notification_preferences
DROP POLICY IF EXISTS "Allow anon insert and update user_notification_preferences" ON public.user_notification_preferences;
DROP POLICY IF EXISTS "Allow service_role full access user_notification_preferences" ON public.user_notification_preferences;

CREATE POLICY "Allow anon insert and update user_notification_preferences"
ON public.user_notification_preferences
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow service_role full access user_notification_preferences"
ON public.user_notification_preferences
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 7. Security Policies for notification_telemetry
DROP POLICY IF EXISTS "Allow service_role full access notification_telemetry" ON public.notification_telemetry;

CREATE POLICY "Allow service_role full access notification_telemetry"
ON public.notification_telemetry
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
