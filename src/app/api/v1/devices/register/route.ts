import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deviceId, platform, fcmToken, webSubscription, isInTirupati, language } = body;

    if (!deviceId || !platform) {
      return NextResponse.json({ error: 'Missing deviceId or platform' }, { status: 400 });
    }

    const now = new Date().toISOString();

    // 1. Dual Registration: Register into push_subscriptions so native app receives broadcasts immediately
    if (fcmToken && typeof fcmToken === 'string' && fcmToken.trim().length > 20) {
      try {
        const { error: subErr } = await supabase.from('push_subscriptions').upsert(
          {
            endpoint: `https://fcm.googleapis.com/fcm/native/${fcmToken.trim()}`,
            keys_p256dh: 'native_android_fcm',
            keys_auth: 'native_android_fcm',
            subscribed_at: now,
            last_seen_at: now,
          },
          { onConflict: 'endpoint' }
        );
        if (subErr) {
          console.warn('[DeviceRegistration] push_subscriptions fallback error:', subErr.message);
        }
      } catch (err: any) {
        console.warn('[DeviceRegistration] push_subscriptions fallback exception:', err?.message);
      }
    }

    // 2. Upsert Device Entry into user_devices (if table exists)
    try {
      const { error: deviceErr } = await supabase.from('user_devices').upsert(
        {
          device_id: deviceId,
          platform,
          fcm_token: fcmToken || null,
          web_subscription: webSubscription || null,
          is_in_tirupati: Boolean(isInTirupati),
          user_language: language || 'en',
          is_active: true,
          updated_at: now,
        },
        { onConflict: 'device_id' }
      );

      if (deviceErr) {
        console.warn('[DeviceRegistration] user_devices table upsert:', deviceErr.message);
      } else {
        // Ensure Notification Preferences exist
        await supabase.from('user_notification_preferences').upsert(
          {
            device_id: deviceId,
            crowd_alerts: true,
            temple_updates: true,
            travel_alerts: true,
            daily_guidance: false,
            updated_at: now,
          },
          { onConflict: 'device_id' }
        );
      }
    } catch (_tableErr) {
      // Gracefully continue using push_subscriptions fallback
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DeviceRegistration] Exception:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
