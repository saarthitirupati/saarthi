import webpush from 'web-push';
import { supabase } from '@/lib/supabase';

let vapidConfigured = false;
function ensureVapid(): boolean {
  if (vapidConfigured) return true;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BG66lKYjVyCTBCyVvgT0qpmwpFaJ414JqzVUVNZ14KRQlcC5UdqDUOp9USQElQ2r7vO6P4fzYlX3oFRuu4oR5V8';
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) {
    console.warn('[PushNotify] VAPID keys not configured in environment');
    return false;
  }
  try {
    webpush.setVapidDetails('mailto:admin@saarthiguide.in', pub, priv);
    vapidConfigured = true;
    return true;
  } catch (err) {
    console.error('Failed to set VAPID details:', err);
    return false;
  }
}

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  tag?: string;
}

/**
 * Send a push notification to all subscribed users.
 * Silently removes expired/invalid subscriptions.
 */
export async function pushNotifyAll(payload: PushPayload) {
  if (!ensureVapid()) return;

  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, keys_p256dh, keys_auth');

  if (error || !subs?.length) return;

  const body = JSON.stringify(payload);
  const gone: number[] = [];

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
          },
          body,
          { TTL: 3600 }
        );
      } catch (err: any) {
        // Prune 404 (Not Found), 410 (Gone), 403 (Invalid VAPID credentials / rotated key)
        if (err.statusCode === 404 || err.statusCode === 410 || err.statusCode === 403) {
          gone.push(sub.id);
        }
      }
    })
  );

  if (gone.length) {
    await supabase.from('push_subscriptions').delete().in('id', gone);
  }
}

export interface StatusLike {
  waitTime?: string;
  crowdLevel?: 'low' | 'moderate' | 'high' | 'very-high' | string;
  notice?: string;
  darshans?: Array<{ name: string; waitTime: string; [key: string]: any }>;
  ssdTokenStatus?: 'issuing' | 'paused' | 'closed-for-day' | string;
  ssdNextTokenTime?: string;
  ssdTokenSlots?: Array<{ slotTime: string; status: string; tokensLeft?: string; [key: string]: any }>;
  ssdNotice?: string;
  ssdTimingsGuide?: string;
  [key: string]: any;
}

/**
 * Trigger web push notifications when SSD token timings, slots, or statuses change.
 */
export async function notifySsdUpdates(
  before: StatusLike | null | undefined,
  updated: StatusLike
): Promise<void> {
  if (!updated) return;
  const prev = before || {};

  // 1. Status change (issuing / paused / closed-for-day)
  if (updated.ssdTokenStatus && updated.ssdTokenStatus !== prev.ssdTokenStatus) {
    if (updated.ssdTokenStatus === 'issuing') {
      pushNotifyAll({
        title: 'SSD Tokens are LIVE!',
        body: 'Srivari Seva Darshanam offline tokens are being issued now at Tirumala & Tirupati counters.',
        url: '/darshan/ssd-token',
        tag: 'ssd-status',
      }).catch(() => {});
    } else if (updated.ssdTokenStatus === 'paused') {
      pushNotifyAll({
        title: 'SSD Tokens Paused',
        body: (updated.ssdNotice || '').trim() || 'Token issuing has been temporarily paused. Please check back shortly.',
        url: '/darshan/ssd-token',
        tag: 'ssd-status',
      }).catch(() => {});
    } else if (updated.ssdTokenStatus === 'closed-for-day') {
      pushNotifyAll({
        title: 'Today’s SSD Quota Closed',
        body: (updated.ssdNotice || '').trim() || `Today's offline SSD token quota is complete. Next issuance: ${updated.ssdNextTokenTime || 'tomorrow morning'}.`,
        url: '/darshan/ssd-token',
        tag: 'ssd-status',
      }).catch(() => {});
    }
  }

  // 2. Next Token Time updated (e.g. "2:00 PM", "Tomorrow 4:00 AM", etc.)
  const prevTime = (prev.ssdNextTokenTime || '').trim();
  const nextTime = (updated.ssdNextTokenTime || '').trim();
  if (nextTime && nextTime !== prevTime) {
    const noticeExtra = (updated.ssdNotice || '').trim() ? ` • ${updated.ssdNotice!.trim()}` : '';
    pushNotifyAll({
      title: 'SSD Token Timings Updated',
      body: `Next token batch release: ${nextTime}.${noticeExtra} Counters open at Vishnu Nivasam & Srinivasam.`,
      url: '/darshan/ssd-token',
      tag: 'ssd-timings',
    }).catch(() => {});
  }

  // 3. SSD Slots updated
  if (updated.ssdTokenSlots && Array.isArray(updated.ssdTokenSlots)) {
    const prevSlotsStr = JSON.stringify(prev.ssdTokenSlots || []);
    const nextSlotsStr = JSON.stringify(updated.ssdTokenSlots);
    if (nextSlotsStr !== prevSlotsStr) {
      const available = updated.ssdTokenSlots.filter(s => s.status === 'available');
      const slotText = available.length > 0
        ? `Open slots: ${available.map(s => s.slotTime).slice(0, 3).join(', ')}.`
        : 'Slot availability and timings have been refreshed.';
      pushNotifyAll({
        title: 'SSD Darshan Slots Updated',
        body: `${slotText} Check live counter timings now.`,
        url: '/darshan/ssd-token',
        tag: 'ssd-slots',
      }).catch(() => {});
    }
  }

  // 4. SSD Live Notice updated
  const prevNotice = (prev.ssdNotice || '').trim();
  const nextNotice = (updated.ssdNotice || '').trim();
  if (nextNotice && nextNotice !== prevNotice && updated.ssdTokenStatus === prev.ssdTokenStatus) {
    pushNotifyAll({
      title: 'SSD Token Update',
      body: nextNotice,
      url: '/darshan/ssd-token',
      tag: 'ssd-notice',
    }).catch(() => {});
  }
}

/**
 * Trigger web push notifications when Live Darshan status, wait times, crowd, or announcements change.
 */
export async function notifyLiveStatusUpdates(
  before: StatusLike | null | undefined,
  updated: StatusLike
): Promise<void> {
  if (!updated) return;
  const prev = before || {};

  // 1. Live notice / announcement changed
  const prevNotice = (prev.notice || '').trim();
  const nextNotice = (updated.notice || '').trim();
  if (nextNotice && nextNotice !== prevNotice) {
    pushNotifyAll({
      title: 'Tirumala Live Update',
      body: nextNotice,
      url: '/alerts',
      tag: 'tirumala-notice',
    }).catch(() => {});
  }

  // 2. Darshan Timings changed (individual categories or overall wait time)
  const darshanChanges: string[] = [];
  if (Array.isArray(updated.darshans) && Array.isArray(prev.darshans)) {
    for (const d of updated.darshans) {
      const old = prev.darshans.find(b => b.name === d.name);
      if (old && (old.waitTime || '').trim() !== (d.waitTime || '').trim() && (d.waitTime || '').trim()) {
        darshanChanges.push(`${d.name}: ${d.waitTime.trim()}`);
      }
    }
  }

  const prevWait = (prev.waitTime || '').trim();
  const nextWait = (updated.waitTime || '').trim();
  const waitChanged = nextWait && nextWait !== prevWait;

  if (darshanChanges.length > 0) {
    const crowdInfo = updated.crowdLevel ? ` • Crowd: ${updated.crowdLevel}` : '';
    pushNotifyAll({
      title: 'Live Darshan Timings Updated',
      body: `Live update: ${darshanChanges.slice(0, 2).join(' • ')}${crowdInfo}.`,
      url: '/alerts',
      tag: 'live-darshan-timings',
    }).catch(() => {});
  } else if (waitChanged) {
    const crowdInfo = updated.crowdLevel ? ` (${updated.crowdLevel} crowd)` : '';
    pushNotifyAll({
      title: 'Darshan Wait Time Updated',
      body: `Current wait time updated to ${nextWait}${crowdInfo}. Plan your darshan visit accordingly.`,
      url: '/alerts',
      tag: 'live-darshan-timings',
    }).catch(() => {});
  }

  // 3. Crowd Level change (Low / Moderate / High / Very High)
  const prevCrowd = (prev.crowdLevel || '').trim().toLowerCase();
  const nextCrowd = (updated.crowdLevel || '').trim().toLowerCase();
  if (nextCrowd && nextCrowd !== prevCrowd) {
    if (nextCrowd === 'low') {
      pushNotifyAll({
        title: 'Low Crowd at Tirumala!',
        body: `Wait time: ${nextWait || prevWait || 'minimal'}. Favorable conditions for smooth, peaceful darshan.`,
        url: '/alerts',
        tag: 'live-crowd',
      }).catch(() => {});
    } else if (nextCrowd === 'high' || nextCrowd === 'very-high') {
      const label = nextCrowd === 'very-high' ? 'Very High' : 'High';
      pushNotifyAll({
        title: 'Heavy Rush at Tirumala',
        body: `Crowd level is now ${label}. Wait time: ${nextWait || prevWait || 'extended'}. Expect compartment delays.`,
        url: '/alerts',
        tag: 'live-crowd',
      }).catch(() => {});
    } else if (nextCrowd === 'moderate') {
      pushNotifyAll({
        title: 'Moderate Crowd at Tirumala',
        body: `Crowd has normalized to Moderate. Current wait time: ${nextWait || prevWait || '2-3 hours'}.`,
        url: '/alerts',
        tag: 'live-crowd',
      }).catch(() => {});
    }
  }
}

