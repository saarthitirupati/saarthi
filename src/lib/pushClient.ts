// Saarthi Push Notification Client Utility
// Handles permission, PushManager subscription, and test notifications cleanly.

export type PushPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

const VAPID_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BG66lKYjVyCTBCyVvgT0qpmwpFaJ414JqzVUVNZ14KRQlcC5UdqDUOp9USQElQ2r7vO6P4fzYlX3oFRuu4oR5V8';

function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return buffer;
}

/**
 * Check if running inside native Android App (WebView).
 */
export function isNativeAndroidApp(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /wv/i.test(ua) || Boolean((window as any).isSaarthiApp) || Boolean((window as any).Android);
}

/**
 * Check current notification permission status.
 */
export function getNotificationPermission(): PushPermissionState {
  if (typeof window === 'undefined') {
    return 'unsupported';
  }
  if ('Notification' in window && 'serviceWorker' in navigator) {
    return Notification.permission as PushPermissionState;
  }
  if (isNativeAndroidApp()) {
    return localStorage.getItem('saarthi_notifications_enabled') === 'true' ? 'granted' : 'default';
  }
  return 'unsupported';
}

/**
 * Request notification permission via direct user gesture & subscribe to push.
 */
export async function subscribeToPushNotifications(): Promise<{
  success: boolean;
  permission: PushPermissionState;
  error?: string;
}> {
  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
    return { success: false, permission: 'unsupported', error: 'Notifications not supported on this device/browser.' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, permission: permission as PushPermissionState };
    }

    // Wait for Service Worker registration
    const reg = await navigator.serviceWorker.ready;
    if (!reg.pushManager) {
      // Notification API works even if pushManager is not supported (e.g. some webviews)
      await showLocalNotification(reg, 'Darshan Alerts Active', 'Saarthi will notify you of Tirumala queue & SSD updates.');
      return { success: true, permission: 'granted' };
    }

    let sub = await reg.pushManager.getSubscription();
    const savedVapid = localStorage.getItem('saarthi_vapid_key');

    // Auto-migrate if VAPID key was rotated or changed
    if (sub && VAPID_KEY && savedVapid !== VAPID_KEY) {
      try {
        await sub.unsubscribe();
      } catch {}
      sub = null;
    }

    if (!sub && VAPID_KEY) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_KEY),
      });
      localStorage.setItem('saarthi_vapid_key', VAPID_KEY);
    }

    // Register with backend if subscription exists
    if (sub) {
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub.toJSON()),
      }).catch(() => {});
    }

    // Save local flag
    localStorage.setItem('saarthi_notifications_enabled', 'true');

    // Trigger instant confirmation notification
    await showLocalNotification(
      reg,
      'Srivari Darshan Alerts Active',
      'You are subscribed to live Tirumala queue wait times, SSD token drops, and temple advisories.'
    );

    return { success: true, permission: 'granted' };
  } catch (err: any) {
    console.error('Subscription error:', err);
    return {
      success: false,
      permission: (typeof Notification !== 'undefined' ? Notification.permission : 'unsupported') as PushPermissionState,
      error: err?.message || 'Failed to subscribe',
    };
  }
}

/**
 * Trigger an immediate test notification to verify device receipt.
 */
export async function sendTestNotification(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const native = isNativeAndroidApp();
  if (!native && !('Notification' in window)) return false;

  try {
    if (!native && Notification.permission !== 'granted') {
      const res = await subscribeToPushNotifications();
      return res.success;
    }

    const reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.ready.catch(() => null) : null;
    let serverPushTriggered = false;

    // Dispatch real high-priority push through server to test FCM delivery to status bar
    if (reg?.pushManager) {
      try {
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          const resp = await fetch('/api/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              endpoint: sub.endpoint,
              title: 'Live Temple Alert Test',
              body: 'Govinda Govinda! Live alerts are active on your device top bar.',
              url: '/alerts',
              tag: 'test-push-' + Date.now(),
            }),
          });
          serverPushTriggered = resp.ok;
        }
      } catch (_e) {
        // Fallback to local notification
      }
    }

    // If server push was not triggered (e.g. offline/no sub), show local notification
    if (!serverPushTriggered) {
      await showLocalNotification(
        reg,
        'Live Temple Alert Test',
        'Govinda Govinda! Live alerts are active on your device top bar.'
      ).catch(() => {});
    }

    return true;
  } catch (err) {
    console.error('Test notification failed:', err);
    return false;
  }
}

/**
 * Silently syncs push subscription in the background ONLY if permission is already granted.
 * Does not prompt user, completely safe for page-load useEffect.
 */
export async function syncExistingPushSubscription(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('Notification' in window)) return;
  if (Notification.permission !== 'granted' || !VAPID_KEY) return;

  try {
    const reg = await navigator.serviceWorker.ready;
    if (!reg.pushManager) return;

    let sub = await reg.pushManager.getSubscription();
    const savedVapid = localStorage.getItem('saarthi_vapid_key');

    // Auto-migrate if VAPID key was rotated
    if (sub && savedVapid !== VAPID_KEY) {
      try {
        await sub.unsubscribe();
      } catch {}
      sub = null;
    }

    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_KEY),
      });
      localStorage.setItem('saarthi_vapid_key', VAPID_KEY);
    }

    if (sub) {
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub.toJSON()),
      });
    }
  } catch {
    // Silent fail on background refresh
  }
}

/**
 * Schedules a delayed high-priority push notification so user can close or minimize
 * the app and verify that the notification appears on the device top bar / lock screen.
 */
export async function sendDelayedBackgroundTestNotification(delaySeconds: number = 5): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    if (Notification.permission !== 'granted') {
      const res = await subscribeToPushNotifications();
      if (!res.success) return false;
    }

    const reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.ready.catch(() => null) : null;
    if (!reg?.pushManager) return false;

    const sub = await reg.pushManager.getSubscription();
    if (!sub) return false;

    const resp = await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: sub.endpoint,
        delay: delaySeconds,
        title: 'Tirumala Live Darshan Alert',
        body: 'Govinda Govinda! Live background alert delivered to your phone status bar.',
        url: '/alerts',
        tag: 'bg-test-' + Date.now(),
      }),
    });

    return resp.ok;
  } catch (err) {
    console.error('Background test push error:', err);
    return false;
  }
}

/**
 * Show notification helper with fallback to new Notification()
 */
async function showLocalNotification(
  reg: ServiceWorkerRegistration | null,
  title: string,
  body: string
): Promise<void> {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.saarthiguide.in';
  const options = {
    body,
    icon: new URL('/icon-192.png', origin).href,
    badge: new URL('/icon-96.png', origin).href,
    tag: 'saarthi-alert',
    renotify: true,
    data: { url: '/alerts' },
    vibrate: [200, 100, 200],
  };

  if (reg && 'showNotification' in reg) {
    await reg.showNotification(title, options);
  } else if (typeof Notification !== 'undefined') {
    new Notification(title, options);
  }
}
