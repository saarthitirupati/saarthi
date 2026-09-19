import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { supabase } from '@/lib/supabase';
import { sendFCMNotification } from '@/lib/fcmService';
import {
  buildDailySpotNotification,
  buildFestivalReminder,
  buildWeekendSuggestion,
  buildReEngagementNotification,
  buildWelcomeNotification,
  type NotificationPayload,
} from '@/lib/notifications';
import { isAuthorizedAdmin } from '@/lib/authGuard';

interface CustomPushData {
  title?: string;
  body?: string;
  url?: string;
  image?: string;
  tag?: string;
}

function buildPayload(type: string, daysSince?: number, custom?: CustomPushData): NotificationPayload | null {
  if (custom && custom.title && custom.body) {
    return {
      title: custom.title,
      body: custom.body,
      icon: '/icon-192.png',
      tag: custom.tag || 'saarthi-alert',
      url: custom.url || '/alerts',
    };
  }

  switch (type) {
    case 'daily_spot':   return buildDailySpotNotification();
    case 'festival':     return buildFestivalReminder();
    case 'weekend':      return buildWeekendSuggestion();
    case 'reengagement': return buildReEngagementNotification(daysSince ?? 3);
    case 'welcome':      return buildWelcomeNotification();
    default:             return null;
  }
}

async function handlePushDispatch(type: string, endpoint?: string, daysSince?: number, custom?: CustomPushData) {
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BG66lKYjVyCTBCyVvgT0qpmwpFaJ414JqzVUVNZ14KRQlcC5UdqDUOp9USQElQ2r7vO6P4fzYlX3oFRuu4oR5V8';
  const priv = process.env.VAPID_PRIVATE_KEY;

  if (!pub || !priv) {
    console.warn('[PushSend] VAPID keys not configured in environment');
    return NextResponse.json({ error: 'VAPID keys not configured in server environment' }, { status: 500 });
  }

  try {
    webpush.setVapidDetails('mailto:admin@saarthiguide.in', pub, priv);
  } catch (err: any) {
    console.error('[PushSend] setVapidDetails failed:', err);
    return NextResponse.json({ error: 'Failed to initialize VAPID credentials' }, { status: 500 });
  }

  const payload = buildPayload(type, daysSince, custom);
  if (!payload) return NextResponse.json({ ok: true, sent: 0, reason: 'No payload generated' });

  // Fetch subscriptions — specific endpoint or all; re-engagement filters by inactivity
  let query = supabase
    .from('push_subscriptions')
    .select('endpoint, keys_p256dh, keys_auth');

  if (endpoint) {
    query = query.eq('endpoint', endpoint);
  } else if (type === 'reengagement') {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (daysSince ?? 3));
    query = query.lt('last_seen_at', cutoff.toISOString());
  }

  const { data: subs, error } = await query;
  if (error) {
    console.error('[PushSend] Error fetching subscriptions:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
  if (!subs?.length) return NextResponse.json({ ok: true, sent: 0, reason: 'No active subscriptions' });

  const dead: string[] = [];
  let sent = 0;

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth } },
          JSON.stringify(payload),
          {
            TTL: 86400,
            headers: {
              Urgency: 'high',
              Topic: payload.tag || 'saarthi-alert',
            },
          }
        );
        sent++;
      } catch (err: any) {
        // 404/410 = subscription expired, 403 = VAPID key mismatch / invalid subscription
        if (err?.statusCode === 410 || err?.statusCode === 404 || err?.statusCode === 403) {
          dead.push(sub.endpoint);
        }
      }
    })
  );

  // Prune dead subscriptions in one query
  if (dead.length) {
    await supabase.from('push_subscriptions').delete().in('endpoint', dead);
  }

  return NextResponse.json({ ok: true, sent, pruned: dead.length });
}

async function checkAuth(req: Request): Promise<boolean> {
  // 1. Allow authenticated admin session from admin panel
  if (await isAuthorizedAdmin(req)) return true;

  // 2. Allow in local dev if no secret configured
  if (!process.env.CRON_SECRET) return true;

  // 3. Allow valid CRON_SECRET from cron triggers
  const authHeader = req.headers.get('authorization');
  const cronSecretHeader = req.headers.get('x-cron-secret');
  const url = new URL(req.url);
  const cronSecretQuery = url.searchParams.get('cron_secret');

  return (
    cronSecretHeader === process.env.CRON_SECRET ||
    cronSecretQuery === process.env.CRON_SECRET ||
    authHeader === `Bearer ${process.env.CRON_SECRET}`
  );
}

export async function GET(req: Request) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = new URL(req.url);
  const type = url.searchParams.get('type') || 'daily_spot';
  const endpoint = url.searchParams.get('endpoint') || undefined;
  return handlePushDispatch(type, endpoint);
}

export async function POST(req: Request) {
  const bodyData = await req.json().catch(() => ({}));
  const { type = 'daily_spot', endpoint, fcmToken, daysSince, title, body, url, image, tag, delay } = bodyData;

  // Allow self-targeted device test pushes, otherwise enforce admin/cron auth for broadcasts
  const isSelfTargetedTest = Boolean(
    (endpoint && typeof endpoint === 'string' && endpoint.startsWith('https://')) ||
    (fcmToken && typeof fcmToken === 'string' && fcmToken.length > 20)
  );

  if (!isSelfTargetedTest && !(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (typeof delay === 'number' && delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 15) * 1000));
  }

  if (fcmToken) {
    const payload = buildPayload(type, daysSince, { title, body, url, image, tag }) || {
      title: title || 'Tirumala Live Alert',
      body: body || 'Live updates for Darshan and SSD tokens.',
      url: url || '/alerts',
      icon: '/icon-192.png',
      tag: tag || 'saarthi-alert',
    };

    const deepLink = payload.url
      ? (payload.url.startsWith('http') ? payload.url : `https://www.saarthiguide.in${payload.url}`)
      : 'https://www.saarthiguide.in/alerts';

    const res = await sendFCMNotification({
      token: fcmToken,
      title: payload.title,
      body: payload.body,
      deepLink,
      data: {
        tag: payload.tag || 'saarthi-alert',
        url: deepLink,
      },
    });

    return NextResponse.json({ ok: res.success, sent: res.success ? 1 : 0, error: res.error });
  }

  return handlePushDispatch(type, endpoint, daysSince, { title, body, url, image, tag });
}
