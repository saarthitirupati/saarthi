import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAuthorizedAdmin } from '@/lib/authGuard';
import { pushNotifyAll } from '@/lib/pushNotify';

export async function POST(req: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      crowd_wait_minutes, 
      parking_status, 
      parking_location, 
      next_bus_minutes,
      crowd_level,
      sarva_darshan_wait,
      special_entry_wait,
      divya_darshan_wait,
      srivani_darshan_wait
    } = body;

    const { error } = await supabase
      .from('live_metrics')
      .update({
        crowd_wait_minutes,
        parking_status,
        parking_location,
        next_bus_minutes,
        crowd_level,
        sarva_darshan_wait,
        special_entry_wait,
        divya_darshan_wait,
        srivani_darshan_wait,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    if (error) throw error;

    // Push notification when crowd drops to low
    if (crowd_level && crowd_level.toLowerCase() === 'low') {
      pushNotifyAll({
        title: '🟢 Low Crowd at Tirumala!',
        body: 'Crowd is low right now — great time for darshan.',
        url: '/',
        tag: 'crowd-low',
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
