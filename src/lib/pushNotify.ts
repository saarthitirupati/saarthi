import webpush from 'web-push';
import { supabase } from '@/lib/supabase';

let vapidConfigured = false;
function ensureVapid(): boolean {
  if (vapidConfigured) return true;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
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
