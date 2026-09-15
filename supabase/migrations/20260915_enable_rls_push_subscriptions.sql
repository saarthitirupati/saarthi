-- Supabase Migration: Enable RLS on public.push_subscriptions
-- Resolves Supabase Security Advisor Alert (rls_disabled_in_public_public_push_subscriptions)

-- 1. Enable Row Level Security (RLS) on the push_subscriptions table
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if re-running to avoid duplicate name errors
DROP POLICY IF EXISTS "Allow anon insert and update push_subscriptions" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Allow service_role full access" ON public.push_subscriptions;

-- 3. Policy: Allow anon and authenticated roles to register & update push subscriptions
CREATE POLICY "Allow anon insert and update push_subscriptions"
ON public.push_subscriptions
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 4. Policy: Allow backend service_role full administrative access
CREATE POLICY "Allow service_role full access"
ON public.push_subscriptions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
