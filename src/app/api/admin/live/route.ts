import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAuthorizedAdmin } from '@/lib/authGuard';
import { readStatus, updateStatus, TirumalaStatus } from '@/lib/statusDb';
import { notifyLiveStatusUpdates } from '@/lib/pushNotify';

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

    const before = await readStatus();

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

    // Sync in-memory/statusDb state
    const statusUpdates: Partial<TirumalaStatus> = {};
    if (crowd_level) {
      const cl = crowd_level.toLowerCase();
      statusUpdates.crowdLevel = (cl === 'extreme' ? 'very-high' : cl) as any;
    }
    if (crowd_wait_minutes !== undefined) {
      const hours = Math.floor(crowd_wait_minutes / 60);
      const mins = crowd_wait_minutes % 60;
      statusUpdates.waitTime = hours > 0 ? `${hours}h ${mins}m` : `${mins} mins`;
    }
    if (sarva_darshan_wait || special_entry_wait || divya_darshan_wait || srivani_darshan_wait) {
      statusUpdates.darshans = [
        { name: 'Sarva Darshan (Free)', waitTime: sarva_darshan_wait || before.darshans?.[0]?.waitTime || '12-15 hours', peakHours: 'Daily 10 AM - 6 PM' },
        { name: 'Special Entry (₹300)', waitTime: special_entry_wait || before.darshans?.[1]?.waitTime || '3-4 hours', peakHours: 'Daily 9 AM - 3 PM' },
        { name: 'Divya Darshan (Footpath)', waitTime: divya_darshan_wait || before.darshans?.[2]?.waitTime || '8-10 hours', peakHours: 'Daily 8 AM - 4 PM' },
        { name: 'VIP / Srivani Break', waitTime: srivani_darshan_wait || before.darshans?.[3]?.waitTime || '1.5 hours', peakHours: 'Daily 6 AM - 8 AM' }
      ];
    }
    const updated = await updateStatus(statusUpdates);

    // Push notification for live metrics and wait time changes
    notifyLiveStatusUpdates(before, updated).catch((err) => {
      console.error('[PushNotify] Error broadcasting live updates:', err);
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
