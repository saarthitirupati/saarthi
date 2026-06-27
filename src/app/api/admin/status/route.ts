import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabase
    .from('tirumala_status')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const updates = {
      waitTime:            body.waitTime,
      crowdLevel:          body.crowdLevel,
      sevaStatus:          body.sevaStatus,
      notice:              body.notice ?? '',
      darshanSpeed:        body.darshanSpeed,
      accommodationStatus: body.accommodationStatus,
      ladduAvailability:   body.ladduAvailability,
      weather:             body.weather,
      darshans:            body.darshans ?? [],
      lastUpdated:         new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('tirumala_status')
      .update(updates)
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

