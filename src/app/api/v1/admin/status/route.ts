import { NextResponse } from 'next/server';
import { readStatus, updateStatus } from '@/lib/statusDb';
import { notifyLiveStatusUpdates, notifySsdUpdates } from '@/lib/pushNotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await readStatus();
    return NextResponse.json(status);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const before = await readStatus();
    const updated = await updateStatus(body);

    // Push notifications for live queue, darshan wait times, crowd level, and notices
    notifyLiveStatusUpdates(before, updated).catch((err) => {
      console.error('[PushNotify] Error broadcasting Live Status update from v1 admin:', err);
    });

    // Also notify if any SSD fields were updated
    notifySsdUpdates(before, updated).catch((err) => {
      console.error('[PushNotify] Error broadcasting SSD update from v1 admin:', err);
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    console.error('Error updating status in admin API:', e);
    return NextResponse.json({ error: e.message || 'Failed to update status' }, { status: 400 });
  }
}

