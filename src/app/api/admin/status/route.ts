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

  if (error || !data) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json(deserializeStatus(data));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Prepare darshans with serialised configuration
    const darshans = body.darshans ?? [];
    const filteredDarshans = darshans.filter((d: any) => d.name !== 'SSD_CONFIG');
    
    filteredDarshans.push({
      name: 'SSD_CONFIG',
      waitTime: JSON.stringify({
        ssdTokenStatus: body.ssdTokenStatus,
        ssdNextTokenTime: body.ssdNextTokenTime,
        ssdTokenSlots: body.ssdTokenSlots,
        ssdNotice: body.ssdNotice,
        ssdTimingsGuide: body.ssdTimingsGuide,
        ssdCounters: body.ssdCounters
      }),
      peakHours: ''
    });

    const updates = {
      waitTime:            body.waitTime,
      crowdLevel:          body.crowdLevel,
      sevaStatus:          body.sevaStatus,
      notice:              body.notice ?? '',
      darshanSpeed:        body.darshanSpeed,
      accommodationStatus: body.accommodationStatus,
      ladduAvailability:   body.ladduAvailability,
      weather:             body.weather,
      darshans:            filteredDarshans,
      lastUpdated:         new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('tirumala_status')
      .update(updates)
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json(deserializeStatus(data));
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

