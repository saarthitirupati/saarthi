import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = (rawUrl && !rawUrl.includes('your-supabase-ref'))
  ? rawUrl
  : 'https://ehywzcxufqjywrnysmrz.supabase.co';

const supabaseAnonKey = (rawKey && !rawKey.includes('your-supabase-anon-key'))
  ? rawKey
  : 'sb_publishable_at47-iL5G_k_wGLspiuDfw_JfogA8gb';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
