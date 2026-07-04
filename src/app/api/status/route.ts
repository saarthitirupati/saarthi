import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function deserializeStatus(data: any) {
  if (!data) return data;
  const configItem = data.darshans?.find((d: any) => d.name === 'SSD_CONFIG');
  if (configItem) {
    try {
      const config = JSON.parse(configItem.waitTime);
      Object.assign(data, config);
    } catch (e) {
      console.error('Error parsing SSD_CONFIG:', e);
    }
    data.darshans = data.darshans.filter((d: any) => d.name !== 'SSD_CONFIG');
  }
  return data;
}

export async function GET() {
  const { data, error } = await supabase
    .from('tirumala_status')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }

  return NextResponse.json(deserializeStatus(data), {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

