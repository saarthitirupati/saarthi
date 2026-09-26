import { NextResponse } from 'next/server';
import { readStatus, updateStatus, SsdTokenSlot, SsdCounter } from '@/lib/statusDb';
import { isAuthorizedAdmin } from '@/lib/authGuard';
import { notifySsdUpdates, pushNotifyAll } from '@/lib/pushNotify';

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

    // Automatic push notification matching the live preview
    const shouldSendPush = body.sendPush !== false;
    if (shouldSendPush) {
      const pushTitle = updated.ssdTokenStatus === 'closed-for-day'
        ? 'Today’s SSD Token Quota Closed'
        : (updated.ssdTokenStatus === 'paused'
            ? 'SSD Offline Tokens Paused'
            : `Free SSD Counters Opening at ${updated.ssdNextTokenTime || '5:00 AM'}`);

      const pushBody = updated.ssdTokenStatus === 'closed-for-day'
        ? (updated.ssdNotice?.trim() || 'Offline SSD token quota for today is complete. Next issuance tomorrow morning.')
        : `Offline token counters opening shortly at Vishnu Nivasam & Srinivasam. Bring original Aadhaar cards for biometric issue.${updated.ssdNotice?.trim() ? ` ${updated.ssdNotice.trim()}` : ''}`;

      pushNotifyAll({
        title: pushTitle,
        body: pushBody,
        url: '/darshan/ssd-token',
        tag: 'ssd-status',
        category: 'High Priority'
      }).catch((err) => {
        console.error('[PushNotify] Error broadcasting SSD update:', err);
      });
    } else {
      notifySsdUpdates(before, updated).catch((err) => {
        console.error('[PushNotify] Error broadcasting SSD update:', err);
      });
    }

    return NextResponse.json({
      success: true,
      pushSent: shouldSendPush,
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
