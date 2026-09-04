import { NextResponse } from 'next/server';
import { readStatus, updateStatus } from '@/lib/statusDb';
import { isAuthorizedAdmin } from '@/lib/authGuard';
import { pushNotifyAll } from '@/lib/pushNotify';

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

    // Push: general notice/announcement changed
    if (body.notice && body.notice !== before.notice && body.notice.trim()) {
      pushNotifyAll({
        title: '📢 Tirumala Update',
        body: body.notice,
        url: '/',
        tag: 'tirumala-notice',
      }).catch(() => {});
    }

    // Push: crowd dropped to low
    if (body.crowdLevel === 'low' && before.crowdLevel !== 'low') {
      pushNotifyAll({
        title: '🟢 Low Crowd at Tirumala!',
        body: `Wait time: ${updated.waitTime}. Great time for darshan.`,
        url: '/',
        tag: 'crowd-low',
      }).catch(() => {});
    }

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

