import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === '1';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let query = supabase
    .from('festivals')
    .select('*')
    .order('date', { ascending: true });

  if (!all) {
    query = query.gte('date', today.toISOString().split('T')[0]);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ festivals: data });
}
