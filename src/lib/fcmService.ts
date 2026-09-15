import crypto from 'crypto';

interface FCMMessagePayload {
  token: string;
  title: string;
  body: string;
  deepLink?: string;
  data?: Record<string, string>;
}

function base64UrlEncode(data: string | Buffer): string {
  const buf = typeof data === 'string' ? Buffer.from(data) : data;
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Generates Google OAuth2 Access Token from Service Account JSON using native Node.js crypto
 */
async function getFCMAccessToken(serviceAccount: any): Promise<string | null> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
    const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signatureInput);
    const signature = base64UrlEncode(signer.sign(serviceAccount.private_key));

    const jwt = `${signatureInput}.${signature}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    const data = await res.json();
    return data.access_token || null;
  } catch (err) {
    console.error('[FCM] Error generating access token:', err);
    return null;
  }
}

/**
 * Sends a native Android lock-screen FCM push notification via Google FCM HTTP v1 API
 */
export async function sendFCMNotification(
  payload: FCMMessagePayload
): Promise<{ success: boolean; error?: string }> {
  const serviceAccountRaw = process.env.FCM_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountRaw) {
    return { success: false, error: 'FCM_SERVICE_ACCOUNT_KEY not configured in server environment' };
  }

  let serviceAccount: any;
  try {
    serviceAccount = JSON.parse(serviceAccountRaw);
  } catch {
    return { success: false, error: 'Failed to parse FCM_SERVICE_ACCOUNT_KEY JSON' };
  }

  const accessToken = await getFCMAccessToken(serviceAccount);
  if (!accessToken) {
    return { success: false, error: 'Failed to authenticate with Google FCM OAuth2' };
  }

  const projectId = serviceAccount.project_id || 'saarthi-b5ab7';
  const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

  const fcmPayload = {
    message: {
      token: payload.token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: {
        deepLink: payload.deepLink || 'https://www.saarthiguide.in',
        ...(payload.data || {}),
      },
      android: {
        priority: 'high',
        notification: {
          channel_id: 'saarthi_live_alerts',
          sound: 'default',
        },
      },
    },
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fcmPayload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[FCM] Send failed:', errText);
      return { success: false, error: errText };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[FCM] Fetch error:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}
