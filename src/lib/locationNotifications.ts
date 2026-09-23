/**
 * Saarthi Location-Based Notification Engine
 * 
 * First-Principles Rule:
 * Every recommendation and notification must be explainable.
 * If we cannot explain WHY a notification was triggered, it must not be shown.
 * 
 * Features:
 * 1. Proactive Geofence Arrival: Tirumala Hilltop, Alipiri Gate, Srivari Mettu, Tirupati Hubs.
 * 2. Proximity to Sacred Places: Within 350m of a must-visit heritage spot / theertham.
 * 3. Strict anti-spam cooldowns (18-24 hrs) and battery-efficient distance gates.
 */

import {
  calculateDistance,
  isCoordinateOnTirumalaHill,
  ALIPIRI_GATE,
  TIRUMALA_CENTER,
  TIRUPATI_CENTER
} from '@/utils/location';
import { PLACES } from '@/data/places';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface LocationNotificationEvent {
  id: string;
  title: string;
  body: string;
  url: string;
  tag: string;
  reason: string;
  coords: LatLng;
  timestamp: number;
}

const SRIVARI_METTU_COORDS = { lat: 13.6215, lng: 79.3148 };
const COOLDOWN_KEY = 'saarthi_location_notif_cooldowns';
const LAST_REASON_KEY = 'saarthi_last_location_notif_reason';
const ZONE_COOLDOWN_MS = 18 * 60 * 60 * 1000; // 18 hours
const PLACE_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

// Helper: Check if cooldown has expired for an event key
function isCooldownExpired(key: string, cooldownMs: number): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem(COOLDOWN_KEY);
    if (!raw) return true;
    const cooldowns: Record<string, number> = JSON.parse(raw);
    const lastFired = cooldowns[key];
    if (!lastFired) return true;
    return Date.now() - lastFired > cooldownMs;
  } catch {
    return true;
  }
}

// Helper: Record cooldown timestamp
function recordCooldown(key: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(COOLDOWN_KEY);
    const cooldowns: Record<string, number> = raw ? JSON.parse(raw) : {};
    cooldowns[key] = Date.now();
    localStorage.setItem(COOLDOWN_KEY, JSON.stringify(cooldowns));
  } catch {}
}

/**
 * Get the explanation of why the last location-based notification was sent.
 */
export function getLastLocationNotificationReason(): { tag: string; reason: string; timestamp: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LAST_REASON_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Evaluates coordinates against pilgrimage zones and nearby shrines.
 * Returns an explainable notification event if a threshold is met and cooldown expired.
 */
export function evaluateLocationNotification(coords: LatLng): LocationNotificationEvent | null {
  if (!coords || typeof coords.lat !== 'number' || typeof coords.lng !== 'number') {
    return null;
  }

  // 1. ZONE 1: Tirumala Hilltop Arrival
  if (isCoordinateOnTirumalaHill(coords.lat, coords.lng)) {
    const zoneId = 'zone_tirumala_hill';
    if (isCooldownExpired(zoneId, ZONE_COOLDOWN_MS)) {
      return {
        id: zoneId,
        title: '📍 Welcome to Tirumala Hilltop',
        body: 'Live Sarva Darshan queues & free Annaprasadam at Tarigonda Vengamamba complex are active.',
        url: '/darshan/ssd-token',
        tag: 'zone-arrival-tirumala',
        reason: 'Triggered by physical arrival at Tirumala hilltop coordinates.',
        coords,
        timestamp: Date.now()
      };
    }
  }

  // 2. ZONE 2: Alipiri Gate & Foothills Arrival (within 1.5 km of Alipiri Gate)
  const distToAlipiri = calculateDistance(coords.lat, coords.lng, ALIPIRI_GATE.lat, ALIPIRI_GATE.lng);
  if (distToAlipiri <= 1.5) {
    const zoneId = 'zone_alipiri_gate';
    if (isCooldownExpired(zoneId, ZONE_COOLDOWN_MS)) {
      return {
        id: zoneId,
        title: '⛩️ Arrived at Alipiri Gate',
        body: 'Ghat road transit: 28 min min speed limit. Alipiri footpath (3,550 steps) luggage counter active.',
        url: '/route',
        tag: 'zone-arrival-alipiri',
        reason: 'Triggered by arrival near Alipiri Gate & footpath base.',
        coords,
        timestamp: Date.now()
      };
    }
  }

  // 3. ZONE 3: Srivari Mettu Footpath Base (within 1.2 km)
  const distToMettu = calculateDistance(coords.lat, coords.lng, SRIVARI_METTU_COORDS.lat, SRIVARI_METTU_COORDS.lng);
  if (distToMettu <= 1.2) {
    const zoneId = 'zone_srivari_mettu';
    if (isCooldownExpired(zoneId, ZONE_COOLDOWN_MS)) {
      return {
        id: zoneId,
        title: '🥾 At Srivari Mettu Footpath',
        body: 'Direct trek to Tirumala: 2,388 steps (~2-3 hours). Free TTD luggage counter is open at the entrance.',
        url: '/route',
        tag: 'zone-arrival-srivarimettu',
        reason: 'Triggered by arrival at Srivari Mettu traditional footpath base.',
        coords,
        timestamp: Date.now()
      };
    }
  }

  // 4. ZONE 4: Tirupati Transit City Center (within 2.5 km of Railway Station / Central Bus Stand)
  const distToTirupatiCenter = calculateDistance(coords.lat, coords.lng, TIRUPATI_CENTER.lat, TIRUPATI_CENTER.lng);
  if (distToTirupatiCenter <= 2.5 && !isCoordinateOnTirumalaHill(coords.lat, coords.lng)) {
    const zoneId = 'zone_tirupati_hub';
    if (isCooldownExpired(zoneId, ZONE_COOLDOWN_MS)) {
      return {
        id: zoneId,
        title: '🎫 In Tirupati: Offline SSD Counters',
        body: 'Free token counters are open at Vishnu Nivasam (opp. Railway Stn) & Srinivasam (opp. Bus Stand).',
        url: '/darshan/ssd-token',
        tag: 'zone-arrival-tirupati',
        reason: 'Triggered by presence in Tirupati transit center near major offline SSD token hubs.',
        coords,
        timestamp: Date.now()
      };
    }
  }

  // 5. PROXIMITY: Within 350 meters of a Must-Visit Historic Place or Theertham
  const mustVisitSpots = PLACES.filter(p => p.coordinates && p.isMustVisit);
  let closestSpot: typeof mustVisitSpots[0] | null = null;
  let minSpotDistance = Infinity;

  for (const spot of mustVisitSpots) {
    if (!spot.coordinates) continue;
    const d = calculateDistance(coords.lat, coords.lng, spot.coordinates.lat, spot.coordinates.lng);
    const dMeters = Math.round(d * 1000);
    if (dMeters <= 350 && dMeters < minSpotDistance) {
      minSpotDistance = dMeters;
      closestSpot = spot;
    }
  }

  if (closestSpot) {
    const spotKey = `proximity_place_${closestSpot.id}`;
    if (isCooldownExpired(spotKey, PLACE_COOLDOWN_MS)) {
      const deityOrInfo = closestSpot.spiritualInfo?.god || closestSpot.shortIntro || closestSpot.category;
      return {
        id: spotKey,
        title: `🛕 Nearby: ${closestSpot.name}`,
        body: `${minSpotDistance}m away • ${deityOrInfo}. Tap for timings, dress code & history.`,
        url: `/place/${closestSpot.id}`,
        tag: `proximity-${closestSpot.id}`,
        reason: `Triggered because you are within ${minSpotDistance}m of ${closestSpot.name}.`,
        coords,
        timestamp: Date.now()
      };
    }
  }

  return null;
}

/**
 * Checks location against zones and fires a local notification if applicable.
 * Includes user permission guard and stores explainability record.
 */
export async function checkAndDispatchLocationNotification(coords: LatLng): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Check notification permission
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }

  const event = evaluateLocationNotification(coords);
  if (!event) return false;

  try {
    const reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.ready.catch(() => null) : null;
    const origin = window.location.origin || 'https://www.saarthiguide.in';

    const options: any = {
      body: event.body,
      icon: new URL('/icon-192.png', origin).href,
      badge: new URL('/icon-96.png', origin).href,
      tag: event.tag,
      renotify: true,
      data: { url: event.url, reason: event.reason },
      vibrate: [200, 100, 200]
    };

    if (reg && typeof reg.showNotification === 'function') {
      await reg.showNotification(event.title, options);
    } else {
      new Notification(event.title, options);
    }

    // Record cooldown and explainability reason
    recordCooldown(event.id);
    localStorage.setItem(
      LAST_REASON_KEY,
      JSON.stringify({ tag: event.tag, reason: event.reason, timestamp: Date.now() })
    );

    console.log(`[LocationNotification] Dispatched "${event.title}". Reason: ${event.reason}`);
    return true;
  } catch (err) {
    console.warn('[LocationNotification] Dispatch error:', err);
    return false;
  }
}
