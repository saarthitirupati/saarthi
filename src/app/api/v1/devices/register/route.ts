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

    // 1. Upsert Device Entry
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
      console.error('[DeviceRegistration] Upsert Error:', deviceErr);
      return NextResponse.json({ error: 'Failed to update device registration' }, { status: 500 });
    }

    // 2. Ensure Default Notification Preferences exist
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DeviceRegistration] Exception:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
