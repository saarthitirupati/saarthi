import { NextResponse } from 'next/server';
import { readStatus, updateStatus } from '@/lib/statusDb';
import { isAuthorizedAdmin } from '@/lib/authGuard';
import { notifyLiveStatusUpdates, notifySsdUpdates } from '@/lib/pushNotify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await readStatus();
    return NextResponse.json(status);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const body = await req.json();
    const before = await readStatus();
    const updated = await updateStatus(body);

    // Push notifications for live queue, darshan wait times, crowd level, and notices
    notifyLiveStatusUpdates(before, updated).catch((err) => {
      console.error('[PushNotify] Error broadcasting Live Status update:', err);
    });

    // Also notify if any SSD fields were updated through this route
    notifySsdUpdates(before, updated).catch((err) => {
      console.error('[PushNotify] Error broadcasting SSD update:', err);
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

