import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('tirumala_status')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

