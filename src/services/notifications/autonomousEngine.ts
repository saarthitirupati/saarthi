/**
 * Autonomous Dynamic Notification Engine
 * 
 * First-Principles Rule:
 * Runs automatically via scheduled cloud watchers without requiring human/admin clicks.
 * Evaluates real ground state (queue wait times, SSD counter openings, ghat curfews,
 * festivals, and weather) and dispatches timely, explainable, anti-spam alerts to subscribers.
 */

import { readStatus, TirumalaStatus } from '@/lib/statusDb';
import { FESTIVALS_2026 } from '@/data/festivals';
import { getPanchangamData } from '@/lib/panchangam';
import { pushNotifyAll } from '@/lib/pushNotify';
import fs from 'fs/promises';
import path from 'path';

export interface AutonomousDecision {
  shouldBroadcast: boolean;
  type: 'ghat_curfew' | 'ssd_morning' | 'festival_today' | 'optimal_queue' | 'daily_spot' | 'none';
  title: string;
  body: string;
  url: string;
  tag: string;
  reason: string;
  urgency: 'critical' | 'high' | 'normal';
}

export interface BroadcastLog {
  lastBroadcastDate: string; // YYYY-MM-DD in IST
  lastBroadcastType: string;
  lastBroadcastTime: string;
  totalSentCount: number;
}

const BROADCAST_FILE = path.join(process.cwd(), 'data', 'push_broadcast.json');
let inMemoryBroadcastLog: BroadcastLog = {
  lastBroadcastDate: '',
  lastBroadcastType: '',
  lastBroadcastTime: '',
  totalSentCount: 0
};

// Helper: Get current IST components
function getISTDate(): { dateStr: string; hour: number; minute: number } {
  const now = new Date();
  const istFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const parts = istFormatter.formatToParts(now);
  const find = (type: string) => parts.find(p => p.type === type)?.value || '';

  const dateStr = `${find('year')}-${find('month')}-${find('day')}`;
  const hour = parseInt(find('hour'), 10) || 0;
  const minute = parseInt(find('minute'), 10) || 0;

  return { dateStr, hour, minute };
}

async function getBroadcastLog(): Promise<BroadcastLog> {
  try {
    const data = await fs.readFile(BROADCAST_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    inMemoryBroadcastLog = { ...inMemoryBroadcastLog, ...parsed };
  } catch {
    // Memory fallback on read-only environments
  }
  return inMemoryBroadcastLog;
}

async function saveBroadcastLog(log: BroadcastLog): Promise<void> {
  inMemoryBroadcastLog = log;
  try {
    await fs.writeFile(BROADCAST_FILE, JSON.stringify(log, null, 2), 'utf-8');
  } catch {
    // Ignore read-only filesystem errors
  }
}

/**
 * Core Autonomous Decision Matrix
 */
export async function evaluateAutonomousTrigger(): Promise<AutonomousDecision> {
  const { dateStr, hour, minute } = getISTDate();
  const status: TirumalaStatus = await readStatus();
  const panchangam = getPanchangamData();
  const log = await getBroadcastLog();

  // 1. RULE 1: Night Ghat Road Curfew (9:00 PM - 10:15 PM IST)
  // Alipiri toll gate ascending road closes strictly at 11:00 PM.
  if (hour === 21 || (hour === 22 && minute <= 15)) {
    return {
      shouldBroadcast: true,
      type: 'ghat_curfew',
      title: '⚠️ Ghat Road Closes in 90 Mins',
      body: 'Alipiri toll gate stops ascending vehicles at 11:00 PM. Pass through toll now to avoid overnight hold.',
      url: '/route',
      tag: 'ghat-curfew',
      urgency: 'critical',
      reason: 'Current IST time is between 9:00 PM and 10:15 PM, approaching 11:00 PM ascending ghat road curfew.'
    };
  }

  // 2. RULE 2: Offline SSD Token Counters Opening (4:30 AM - 5:30 AM IST)
  // Counters open at 5:00 AM at Vishnu Nivasam & Srinivasam
  if (hour === 4 && minute >= 30 || hour === 5 && minute <= 30) {
    return {
      shouldBroadcast: true,
      type: 'ssd_morning',
      title: '🎫 Free SSD Counters Opening at 5:00 AM',
      body: 'Offline token counters opening shortly at Vishnu Nivasam & Srinivasam. Bring original Aadhaar cards for biometric issue.',
      url: '/darshan/ssd-token',
      tag: 'ssd-morning',
      urgency: 'high',
      reason: 'Early morning 5:00 AM counter opening window for same-day free Sarva Darshan tokens.'
    };
  }

  // Check if a broadcast was ALREADY sent today for normal/daytime rules
  const alreadyBroadcastToday = log.lastBroadcastDate === dateStr;
  if (alreadyBroadcastToday) {
    return {
      shouldBroadcast: false,
      type: 'none',
      title: '',
      body: '',
      url: '',
      tag: '',
      urgency: 'normal',
      reason: `Daily frequency cap active. Already sent ${log.lastBroadcastType} alert today (${dateStr}).`
    };
  }

  // 3. RULE 3: Major Temple Festival / Auspicious Tithi Today (6:30 AM - 9:30 AM IST)
  if (hour >= 6 && hour <= 9) {
    const todayFestival = FESTIVALS_2026.find(f => f.date === dateStr);
    const isSpecialTithi = panchangam.tithiEn.includes('Ekadashi') || panchangam.tithiEn.includes('Pournami');

    if (todayFestival) {
      return {
        shouldBroadcast: true,
        type: 'festival_today',
        title: `🪔 Today in Tirumala: ${todayFestival.name}`,
        body: `${todayFestival.location} • Special sevas & rituals today. Check live wait times before traveling.`,
        url: '/festivals',
        tag: 'festival-today',
        urgency: 'high',
        reason: `Matched official temple festival for today (${todayFestival.name}).`
      };
    }

    if (isSpecialTithi) {
      return {
        shouldBroadcast: true,
        type: 'festival_today',
        title: `🕉️ Auspicious ${panchangam.tithiEn} Today`,
        body: `Srivari Temple sacred observance day (${panchangam.pakshaEn} Paksha). Check live queue status.`,
        url: '/festivals',
        tag: 'festival-today',
        urgency: 'normal',
        reason: `Auspicious Vedic lunar tithi (${panchangam.tithiEn}) observed today.`
      };
    }
  }

  // 4. RULE 4: Optimal Queue Window (Sarva Darshan wait <= 8 hrs or darshan speed fast)
  const waitMinutes = status.darshans?.find(d => d.name.includes('Sarva'))?.waitTime;
  let parsedWaitHours = 14; // conservative default
  if (waitMinutes) {
    const match = waitMinutes.match(/(\d+)/);
    if (match) parsedWaitHours = parseInt(match[1], 10);
  }

  if (hour >= 8 && hour <= 19 && (parsedWaitHours <= 8 || status.darshanSpeed === 'fast')) {
    return {
      shouldBroadcast: true,
      type: 'optimal_queue',
      title: `🟢 Low Darshan Wait Time (~${parsedWaitHours} hrs)`,
      body: 'Sarva Darshan queue lines are moving smoothly right now. Favorable window to enter VQC-2 queue.',
      url: '/route',
      tag: 'optimal-queue',
      urgency: 'high',
      reason: `Sarva Darshan queue wait time (~${parsedWaitHours} hrs) is under the 8-hour low threshold.`
    };
  }

  // 5. RULE 5: Default Morning Spiritual Spotlight (7:30 AM - 10:30 AM IST)
  if (hour >= 7 && hour <= 10) {
    return {
      shouldBroadcast: true,
      type: 'daily_spot',
      title: '🙏 Morning Yatra Guidance — Saarthi',
      body: `Live queue, SSD token counts & free Annaprasadam timings updated for ${panchangam.vaaramEn}.`,
      url: '/',
      tag: 'daily-spot',
      urgency: 'normal',
      reason: 'Scheduled morning darshan status and essentials refresh.'
    };
  }

  return {
    shouldBroadcast: false,
    type: 'none',
    title: '',
    body: '',
    url: '',
    tag: '',
    urgency: 'normal',
    reason: `No critical event threshold met at current IST hour ${hour}:${minute}.`
  };
}

/**
 * Execute the Autonomous Notification Cycle
 */
export async function executeAutonomousCycle(dryRun: boolean = false): Promise<{
  executed: boolean;
  decision: AutonomousDecision;
  istTime: string;
}> {
  const { dateStr, hour, minute } = getISTDate();
  const istTime = `${dateStr} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} IST`;
  const decision = await evaluateAutonomousTrigger();

  if (!decision.shouldBroadcast) {
    return { executed: false, decision, istTime };
  }

  if (dryRun) {
    return { executed: false, decision, istTime };
  }

  // Dispatch push notifications to all subscribers
  await pushNotifyAll({
    title: decision.title,
    body: decision.body,
    url: decision.url,
    tag: decision.tag
  });

  // Record broadcast log to enforce frequency cap
  const currentLog = await getBroadcastLog();
  await saveBroadcastLog({
    lastBroadcastDate: dateStr,
    lastBroadcastType: decision.type,
    lastBroadcastTime: istTime,
    totalSentCount: currentLog.totalSentCount + 1
  });

  return { executed: true, decision, istTime };
}
