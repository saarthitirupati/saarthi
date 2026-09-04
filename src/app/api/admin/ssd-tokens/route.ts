import { NextResponse } from 'next/server';
import { readStatus, updateStatus, SsdTokenSlot, SsdCounter } from '@/lib/statusDb';
import { isAuthorizedAdmin } from '@/lib/authGuard';
import { pushNotifyAll } from '@/lib/pushNotify';

export async function GET() {
  try {
    const status = await readStatus();
    return NextResponse.json({
      ssdTokenStatus: status.ssdTokenStatus,
      ssdNextTokenTime: status.ssdNextTokenTime,
      ssdTokenSlots: status.ssdTokenSlots,
      ssdNotice: status.ssdNotice,
      ssdTimingsGuide: status.ssdTimingsGuide,
      ssdCounters: status.ssdCounters,
      lastUpdated: status.lastUpdated
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch SSD token status' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const body = await req.json();
    
    const updates: any = {};
    if (body.ssdTokenStatus !== undefined) updates.ssdTokenStatus = body.ssdTokenStatus;
    if (body.ssdNextTokenTime !== undefined) updates.ssdNextTokenTime = body.ssdNextTokenTime;
    if (body.ssdTokenSlots !== undefined) updates.ssdTokenSlots = body.ssdTokenSlots;
    if (body.ssdNotice !== undefined) updates.ssdNotice = body.ssdNotice;
    if (body.ssdTimingsGuide !== undefined) updates.ssdTimingsGuide = body.ssdTimingsGuide;
    if (body.ssdCounters !== undefined) updates.ssdCounters = body.ssdCounters;

    // Read current state before update to detect changes
    const before = await readStatus();
    const updated = await updateStatus(updates);

    // Push notifications for SSD status changes
    if (body.ssdTokenStatus === 'issuing' && before.ssdTokenStatus !== 'issuing') {
      pushNotifyAll({
        title: '🎫 SSD Tokens are LIVE!',
        body: 'Srivari Seva Darshanam tokens are being issued now at Tirumala counters.',
        url: '/darshan/ssd-token',
        tag: 'ssd-live',
      }).catch(() => {});
    } else if (body.ssdTokenStatus === 'paused' && before.ssdTokenStatus === 'issuing') {
      pushNotifyAll({
        title: '⏸️ SSD Tokens Paused',
        body: body.ssdNotice || 'Token issuing has been paused. Check back soon.',
        url: '/darshan/ssd-token',
        tag: 'ssd-paused',
      }).catch(() => {});
    }
    // Notify on new SSD notice
    if (body.ssdNotice && body.ssdNotice !== before.ssdNotice && body.ssdNotice.trim()) {
      pushNotifyAll({
        title: '📢 SSD Token Update',
        body: body.ssdNotice,
        url: '/darshan/ssd-token',
        tag: 'ssd-notice',
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      ssdTokenStatus: updated.ssdTokenStatus,
      ssdNextTokenTime: updated.ssdNextTokenTime,
      ssdTokenSlots: updated.ssdTokenSlots,
      ssdNotice: updated.ssdNotice,
      ssdTimingsGuide: updated.ssdTimingsGuide,
      ssdCounters: updated.ssdCounters,
      lastUpdated: updated.lastUpdated
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update SSD tokens' }, { status: 400 });
  }
}
