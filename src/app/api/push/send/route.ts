import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { supabase } from '@/lib/supabase';
import {
  buildDailySpotNotification,
  buildFestivalReminder,
  buildWeekendSuggestion,
  buildReEngagementNotification,
  buildWelcomeNotification,
  type NotificationPayload,
} from '@/lib/notifications';

function buildPayload(type: string, daysSince?: number): NotificationPayload | null {
  switch (type) {
    case 'daily_spot':   return buildDailySpotNotification();
    case 'festival':     return buildFestivalReminder();
    case 'weekend':      return buildWeekendSuggestion();
    case 'reengagement': return buildReEngagementNotification(daysSince ?? 3);
    case 'welcome':      return buildWelcomeNotification();
    default:             return null;
  }
}

async function handlePushDispatch(type: string, endpoint?: string, daysSince?: number) {
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
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

  const payload = buildPayload(type, daysSince);
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

function checkAuth(req: Request): boolean {
  if (!process.env.CRON_SECRET) return true; // Allow in local dev if no secret configured
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
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const url = new URL(req.url);
  const type = url.searchParams.get('type') || 'daily_spot';
  const endpoint = url.searchParams.get('endpoint') || undefined;
  return handlePushDispatch(type, endpoint);
}

export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type = 'daily_spot', endpoint, daysSince } = await req.json().catch(() => ({}));
  return handlePushDispatch(type, endpoint, daysSince);
}
