/**
 * Saarthi Notification Payload Builders
 * One function per notification type — no sending logic here, just data.
 */

import { PLACES } from '@/data/places';
import { FESTIVALS_2026 } from '@/data/festivals';
import { getPanchangamData } from '@/lib/panchangam';

export interface NotificationPayload {
  title: string;
  body: string;
  icon: string;
  tag: string;
  url: string;
}

// Day-of-year helper (1–365)
function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000);
}

// Week number helper
function weekOfYear(): number {
  return Math.floor(dayOfYear() / 7);
}

export function buildDailySpotNotification(): NotificationPayload {
  const spots = PLACES.filter(p => p.coordinates && p.placeType !== 'food' && p.isMustVisit);
  const place = spots[dayOfYear() % spots.length];
  const p = getPanchangamData();
  return {
    title: 'Saarthi - Spot of the Day',
    body: `${place.name} • ${p.tithiEn}, ${p.vaaramEn}`,
    icon: '/icon-192.png',
    tag: 'daily-spot',
    url: '/explore',
  };
}

export function buildFestivalReminder(): NotificationPayload | null {
  const today = new Date();
  // Check for festivals at 7, 3, 1, 0 days ahead — return first match
  for (const days of [7, 3, 1, 0]) {
    const target = new Date(today);
    target.setDate(today.getDate() + days);
    const targetStr = target.toISOString().slice(0, 10);
    const festival = FESTIVALS_2026.find(f => f.date === targetStr);
    if (!festival) continue;
    const label = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `in ${days} days`;
    return {
      title: `${festival.name} - ${label}`,
      body: `${festival.location} • Expected: ${festival.expectedCrowd} crowd`,
      icon: '/icon-192.png',
      tag: 'festival-reminder',
      url: '/festivals',
    };
  }
  return null;
}

export function buildWeekendSuggestion(): NotificationPayload {
  const spots = PLACES.filter(p => p.coordinates && p.placeType !== 'food');
  const place = spots[weekOfYear() % spots.length];
  return {
    title: 'Weekend Yatra Idea',
    body: `Visit ${place.name} this weekend`,
    icon: '/icon-192.png',
    tag: 'weekend-suggestion',
    url: '/explore',
  };
}

export function buildReEngagementNotification(daysSince: number): NotificationPayload {
  if (daysSince >= 30) return {
    title: 'Saarthi misses you',
    body: "Tirumala is calling. Check today's live darshan wait time.",
    icon: '/icon-192.png', tag: 'reengagement', url: '/',
  };
  if (daysSince >= 15) return {
    title: 'Plan Your Next Yatra',
    body: 'Festival season ahead. See upcoming events at Tirumala.',
    icon: '/icon-192.png', tag: 'reengagement', url: '/festivals',
  };
  if (daysSince >= 7) return {
    title: 'SSD Token Update',
    body: 'New SSD slots may be available. Check live status now.',
    icon: '/icon-192.png', tag: 'reengagement', url: '/',
  };
  return {
    title: 'Daily Darshan Update',
    body: "See today's live queue times before your next Tirupati visit.",
    icon: '/icon-192.png', tag: 'reengagement', url: '/',
  };
}

export function buildWelcomeNotification(): NotificationPayload {
  return {
    title: 'Welcome to Saarthi',
    body: 'Live darshan times, SSD tokens & pilgrimage guidance — all free.',
    icon: '/icon-192.png',
    tag: 'welcome',
    url: '/',
  };
}
