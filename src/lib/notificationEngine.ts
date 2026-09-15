import { supabase } from '@/lib/supabase';

export type NotificationType = 'temple_update' | 'crowd_alert' | 'travel_alert' | 'daily_guidance';
export type SeverityLevel = 'high' | 'medium' | 'low';

export interface StructuredNotificationPayload {
  notificationType: NotificationType;
  eventId: string;
  title: string;
  body: string;
  deepLink: string;
  severity: SeverityLevel;
  createdAt: string;
}

export interface DispatchFilterOptions {
  category: 'crowd_alerts' | 'temple_updates' | 'travel_alerts' | 'daily_guidance';
  onlyTirupatiRegion?: boolean;
}

// In-memory cooldown cache to prevent duplicate alerts within X minutes
const cooldownCache: Record<string, number> = {};
const COOLDOWN_MS = 60 * 60 * 1000; // 1 Hour Default Cooldown per event transition

/**
 * Checks state transition guard and cooldown window before queueing a notification.
 */
export function isStateTransitionValid(eventId: string): boolean {
  const lastFired = cooldownCache[eventId];
  const now = Date.now();

  if (lastFired && now - lastFired < COOLDOWN_MS) {
    console.log(`[NotificationEngine] Cooldown active for ${eventId}. Suppressing duplicate alert.`);
    return false;
  }

  cooldownCache[eventId] = now;
  return true;
}

/**
 * Core Event -> Decision -> Audience -> Telemetry Engine
 */
export async function dispatchNotificationEvent(
  payload: StructuredNotificationPayload,
  filter: DispatchFilterOptions
): Promise<{ success: boolean; audienceCount: number; error?: string }> {
  try {
    // 1. Check State Transition & Cooldown Guard
    if (!isStateTransitionValid(payload.eventId)) {
      return { success: false, audienceCount: 0, error: 'Event suppressed by cooldown guard' };
    }

    // 2. Determine Targeted Audience from user_devices & preferences
    let query = supabase
      .from('user_devices')
      .select('device_id, platform, fcm_token, web_subscription, user_notification_preferences!inner(*)')
      .eq('is_active', true);

    if (filter.category === 'crowd_alerts') {
      query = query.eq('user_notification_preferences.crowd_alerts', true);
    } else if (filter.category === 'temple_updates') {
      query = query.eq('user_notification_preferences.temple_updates', true);
    } else if (filter.category === 'travel_alerts') {
      query = query.eq('user_notification_preferences.travel_alerts', true);
    }

    if (filter.onlyTirupatiRegion) {
      query = query.eq('is_in_tirupati', true);
    }

    const { data: targetDevices, error: fetchErr } = await query;

    if (fetchErr) {
      console.error('[NotificationEngine] Error fetching audience:', fetchErr);
      return { success: false, audienceCount: 0, error: fetchErr.message };
    }

    const audienceCount = targetDevices?.length || 0;
    console.log(`[NotificationEngine] Dispatching event "${payload.eventId}" to ${audienceCount} target devices.`);

    // 3. Log Observability & Telemetry Entry
    await supabase.from('notification_telemetry').insert({
      event_id: payload.eventId,
      event_type: payload.notificationType,
      title: payload.title,
      body: payload.body,
      audience_count: audienceCount,
      fcm_accepted: audienceCount, // Will be updated during FCM Admin SDK batch dispatch
      invalid_tokens: 0,
      created_at: payload.createdAt,
    });

    return { success: true, audienceCount };
  } catch (err: any) {
    console.error('[NotificationEngine] Execution Exception:', err);
    return { success: false, audienceCount: 0, error: err?.message || 'Unknown error' };
  }
}
