// @ts-ignore
import webpush from 'web-push';
import { supabase } from '@/lib/supabase';

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BG66lKYjVyCTBCyVvgT0qpmwpFaJ414JqzVUVNZ14KRQlcC5UdqDUOp9USQElQ2r7vO6P4fzYlX3oFRuu4oR5V8';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || 'tdwjaJ5ZfrrPFNPyzsni4CZGLWwmftF7nl0LfUYAkDg';

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  try {
    webpush.setVapidDetails('mailto:saarthiguide9@gmail.com', VAPID_PUBLIC, VAPID_PRIVATE);
  } catch {}
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
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return;

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
        if (err.statusCode === 404 || err.statusCode === 410) {
          gone.push(sub.id);
        }
      }
    })
  );

  if (gone.length) {
    await supabase.from('push_subscriptions').delete().in('id', gone);
  }
}
