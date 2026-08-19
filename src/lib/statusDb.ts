import { supabase } from '@/lib/supabase';
import fs from 'fs/promises';
import path from 'path';

const LOCAL_STATUS_FILE = path.join(process.cwd(), 'data', 'status.json');

// --- Tirumala Live Status types -----------------------------------------------

export interface DarshanTypeStatus {
  name: string;             // e.g. "Sarva Darshan (Free)"
  waitTime: string;         // e.g. "12-15 hours"
  peakHours: string;        // e.g. "Weekends 6 AM - 10 PM"
}

export interface SsdTokenSlot {
  slotTime: string;       // e.g. "9:00 AM - 10:00 AM"
  status: 'available' | 'filling' | 'closed';
  tokensLeft?: string;    // e.g. "~200 remaining" or "Full"
}

export interface SsdCounter {
  name: string;
  description: string;
}

export interface TirumalaStatus {
  waitTime: string;
  crowdLevel: 'low' | 'moderate' | 'high' | 'very-high';
  sevaStatus: string;
  notice: string;
  lastUpdated: string;
  darshanSpeed: 'fast' | 'normal' | 'slow';
  accommodationStatus: 'available' | 'limited' | 'full';
  ladduAvailability: 'available' | 'limited' | 'no-stock';
  weather: string;
  bestTime: string;            // e.g. "Now", "5:30 PM", "Tomorrow 6 AM"
  darshans: DarshanTypeStatus[];
  ssdTokenStatus: 'issuing' | 'paused' | 'closed-for-day';
  ssdNextTokenTime: string;
  ssdTokenSlots: SsdTokenSlot[];
  ssdNotice: string;
  ssdTimingsGuide: string;
  ssdCounters: SsdCounter[];
}

const DEFAULT_STATUS: TirumalaStatus = {
  waitTime: '2-3 hours',
  bestTime: '',
  crowdLevel: 'moderate',
  sevaStatus: 'All sevas open',
  notice: '',
  lastUpdated: new Date().toISOString(),
  darshanSpeed: 'normal',
  accommodationStatus: 'available',
  ladduAvailability: 'available',
  weather: 'Pleasant, 24°C',
  darshans: [
    { name: 'Sarva Darshan (Free)', waitTime: '12-15 hours', peakHours: 'Daily 10 AM - 6 PM' },
    { name: 'Special Entry (₹300)', waitTime: '3-4 hours', peakHours: 'Daily 9 AM - 3 PM' },
    { name: 'Divya Darshan (Footpath)', waitTime: '8-10 hours', peakHours: 'Daily 8 AM - 4 PM' },
    { name: 'VIP / Srivani Break', waitTime: '1.5 hours', peakHours: 'Daily 6 AM - 8 AM' }
  ],
  ssdTokenStatus: 'issuing',
  ssdNextTokenTime: '2:00 PM',
  ssdTokenSlots: [
    { slotTime: '5:00 AM - 7:00 AM', status: 'closed', tokensLeft: 'Full' },
    { slotTime: '7:00 AM - 9:00 AM', status: 'closed', tokensLeft: 'Full' },
    { slotTime: '9:00 AM - 11:00 AM', status: 'filling', tokensLeft: '~200 remaining' },
    { slotTime: '11:00 AM - 1:00 PM', status: 'available', tokensLeft: 'Available' },
    { slotTime: '2:00 PM - 4:00 PM', status: 'available', tokensLeft: 'Available' },
    { slotTime: '4:00 PM - 6:00 PM', status: 'available', tokensLeft: 'Available' },
  ],
  ssdNotice: '',
  ssdTimingsGuide: 'Offline free SSD tokens are released daily starting at 3:00 AM / 4:00 AM. Batches are allocated hourly for that day\'s Darshan. Counters close as soon as the daily quota runs out (~15,000 - 20,000 tokens).',
  ssdCounters: [
    { name: 'Vishnu Nivasam Counter', description: 'Located opposite Tirupati Railway Station (Highly convenient for train travelers)' },
    { name: 'Srinivasam Complex Counter', description: 'Located opposite Tirupati RTC Central Bus Stand (Ideal for bus travelers)' },
    { name: 'Bhudevi Complex Counter', description: 'Located near Alipiri Footpath Link Road (Ideal for pedestrian pilgrims)' },
  ],
};

let memoryStatus: TirumalaStatus = { ...DEFAULT_STATUS };
let lastFetchTime = 0;
let fileLoaded = false;

async function ensureFileLoaded() {
  if (fileLoaded) return;
  try {
    const data = await fs.readFile(LOCAL_STATUS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    // Strip any accidentally persisted error fields
    delete (parsed as any).error;
    memoryStatus = { ...DEFAULT_STATUS, ...parsed };
    fileLoaded = true;
  } catch (e) {
    fileLoaded = true;
  }
}

async function writeLocalStatus(status: TirumalaStatus) {
  try {
    await fs.writeFile(LOCAL_STATUS_FILE, JSON.stringify(status, null, 2));
  } catch (e) {}
}

export async function readStatus(): Promise<TirumalaStatus> {
  await ensureFileLoaded();
  const now = Date.now();
  // Cache for 3 seconds to reduce Supabase queries while remaining hyper-responsive
  if (now - lastFetchTime < 3000) {
    return memoryStatus;
  }

  try {
    const { data: metrics, error } = await supabase
      .from('live_metrics')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !metrics) {
      lastFetchTime = now;
      return memoryStatus;
    }

    // Check timestamp: don't let older db data overwrite fresher local/in-memory update
    const dbUpdatedAt = metrics.updated_at ? new Date(metrics.updated_at).getTime() : 0;
    const localUpdatedAt = memoryStatus.lastUpdated ? new Date(memoryStatus.lastUpdated).getTime() : 0;
    if (dbUpdatedAt > 0 && localUpdatedAt > 0 && dbUpdatedAt < localUpdatedAt) {
      lastFetchTime = now;
      return memoryStatus;
    }

    // 1. If full_status_json is present in Supabase, parse it directly for 100% field fidelity
    if (metrics.full_status_json) {
      try {
        const parsed = JSON.parse(metrics.full_status_json);
        memoryStatus = {
          ...DEFAULT_STATUS,
          ...parsed,
          lastUpdated: metrics.updated_at || parsed.lastUpdated || new Date().toISOString()
        };
        lastFetchTime = now;
        await writeLocalStatus(memoryStatus);
        return memoryStatus;
      } catch (jsonErr) {
        console.warn("Failed to parse full_status_json from Supabase:", jsonErr);
      }
    }

    // 2. Column-by-column fallback if full_status_json is not yet populated
    const totalMins: number = metrics.crowd_wait_minutes ?? 0;
    let waitTimeVal: string = memoryStatus.waitTime || '2-3 hours';
    if (totalMins > 0) {
      if (totalMins >= 60) {
        const h = Math.floor(totalMins / 60);
        const m = totalMins % 60;
        waitTimeVal = m > 0 ? `${h}h ${m}m` : `${h} ${h === 1 ? 'hour' : 'hours'}`;
      } else {
        waitTimeVal = `${totalMins} mins`;
      }
    }

    const crowdLvl = (metrics.crowd_level?.toLowerCase() || memoryStatus.crowdLevel || 'moderate') as TirumalaStatus['crowdLevel'];

    let updatedDarshans: TirumalaStatus['darshans'] = memoryStatus.darshans;
    if (metrics.darshans_json) {
      try { updatedDarshans = JSON.parse(metrics.darshans_json); } catch {}
    } else if (metrics.sarva_darshan_wait) {
      updatedDarshans = [
        { name: 'Sarva Darshan (Free)', waitTime: metrics.sarva_darshan_wait || '12-15 hours', peakHours: 'Daily 10 AM - 6 PM' },
        { name: 'Special Entry (₹300)', waitTime: metrics.special_entry_wait || '3-4 hours', peakHours: 'Daily 9 AM - 3 PM' },
        { name: 'Divya Darshan (Footpath)', waitTime: metrics.divya_darshan_wait || '8-10 hours', peakHours: 'Daily 8 AM - 4 PM' },
        { name: 'VIP / Srivani Break', waitTime: metrics.srivani_darshan_wait || '1.5 hours', peakHours: 'Daily 6 AM - 8 AM' }
      ];
    }

    let ssdSlots = memoryStatus.ssdTokenSlots;
    if (metrics.ssd_token_slots) {
      try { ssdSlots = JSON.parse(metrics.ssd_token_slots); } catch {}
    }
    let ssdCounters = memoryStatus.ssdCounters;
    if (metrics.ssd_counters) {
      try { ssdCounters = JSON.parse(metrics.ssd_counters); } catch {}
    }

    const resolvedSsdStatus = (metrics.ssd_token_status && metrics.ssd_token_status !== '')
      ? (metrics.ssd_token_status as TirumalaStatus['ssdTokenStatus'])
      : (memoryStatus.ssdTokenStatus || 'issuing');

    const resolvedNextTokenTime = (metrics.ssd_next_token_time !== undefined && metrics.ssd_next_token_time !== null && metrics.ssd_next_token_time !== '')
      ? metrics.ssd_next_token_time
      : (memoryStatus.ssdNextTokenTime || '');

    const resolvedNotice = (metrics.ssd_notice !== undefined && metrics.ssd_notice !== null && metrics.ssd_notice !== '')
      ? metrics.ssd_notice
      : (memoryStatus.ssdNotice || '');

    const resolvedTimingsGuide = metrics.ssd_timings_guide || memoryStatus.ssdTimingsGuide || DEFAULT_STATUS.ssdTimingsGuide;

    memoryStatus = {
      ...DEFAULT_STATUS,
      ...memoryStatus,
      waitTime: waitTimeVal,
      crowdLevel: crowdLvl,
      bestTime: metrics.best_time || memoryStatus.bestTime || '',
      darshans: updatedDarshans,
      accommodationStatus: (metrics.parking_status?.toLowerCase() === 'full' ? 'full' : (memoryStatus.accommodationStatus || 'available')) as TirumalaStatus['accommodationStatus'],
      ladduAvailability: (metrics.laddu_availability || memoryStatus.ladduAvailability || 'available') as TirumalaStatus['ladduAvailability'],
      weather: metrics.weather || memoryStatus.weather || DEFAULT_STATUS.weather,
      sevaStatus: metrics.seva_status || memoryStatus.sevaStatus || DEFAULT_STATUS.sevaStatus,
      notice: metrics.notice !== undefined && metrics.notice !== null ? metrics.notice : (memoryStatus.notice || ''),
      darshanSpeed: (metrics.darshan_speed || memoryStatus.darshanSpeed || 'normal') as TirumalaStatus['darshanSpeed'],
      ssdTokenStatus: resolvedSsdStatus,
      ssdNextTokenTime: resolvedNextTokenTime,
      ssdTokenSlots: ssdSlots && ssdSlots.length > 0 ? ssdSlots : memoryStatus.ssdTokenSlots,
      ssdNotice: resolvedNotice,
      ssdTimingsGuide: resolvedTimingsGuide,
      ssdCounters: ssdCounters && ssdCounters.length > 0 ? ssdCounters : memoryStatus.ssdCounters,
      lastUpdated: metrics.updated_at || memoryStatus.lastUpdated || new Date().toISOString(),
    };
    
    lastFetchTime = now;
    await writeLocalStatus(memoryStatus);
    return memoryStatus;
  } catch {
    lastFetchTime = now;
    return memoryStatus;
  }
}

export async function updateStatus(updates: Partial<TirumalaStatus>): Promise<TirumalaStatus> {
  await ensureFileLoaded();
  const current = memoryStatus;
  const next = { ...current, ...updates, lastUpdated: new Date().toISOString() };
  memoryStatus = next;
  lastFetchTime = Date.now(); // keep fresh cache to serve updated state instantly
  
  await writeLocalStatus(next);

  try {
    const payload: any = { 
      updated_at: new Date().toISOString(),
      full_status_json: JSON.stringify(next)
    };
    
    if (updates.crowdLevel) {
      payload.crowd_level = updates.crowdLevel.charAt(0).toUpperCase() + updates.crowdLevel.slice(1);
    }
    
    if (updates.waitTime) {
      let mins = 45;
      if (updates.waitTime.includes('h')) {
        const parts = updates.waitTime.split('h');
        const hours = parseInt(parts[0]);
        const m = parseInt(parts[1] || '0');
        mins = (hours * 60) + m;
      } else {
        mins = parseInt(updates.waitTime) || 45;
      }
      payload.crowd_wait_minutes = mins;
    }

    if (updates.darshans) {
      const sd = updates.darshans.find(d => d.name.includes('Sarva'));
      if (sd) payload.sarva_darshan_wait = sd.waitTime;
      
      const se = updates.darshans.find(d => d.name.includes('Special'));
      if (se) payload.special_entry_wait = se.waitTime;
      
      const dd = updates.darshans.find(d => d.name.includes('Divya'));
      if (dd) payload.divya_darshan_wait = dd.waitTime;

      const sv = updates.darshans.find(d => d.name.includes('Break') || d.name.includes('Srivani'));
      if (sv) payload.srivani_darshan_wait = sv.waitTime;

      // Persist full darshan array as JSON
      payload.darshans_json = JSON.stringify(updates.darshans);
    }

    if (updates.accommodationStatus) {
      payload.parking_status = updates.accommodationStatus === 'full' ? 'full' : 'available';
    }

    // Persist SSD and other fields as columns + JSON blob
    if (updates.ssdTokenStatus !== undefined) payload.ssd_token_status = updates.ssdTokenStatus;
    if (updates.ssdNextTokenTime !== undefined) payload.ssd_next_token_time = updates.ssdNextTokenTime;
    if (updates.ssdTokenSlots !== undefined) payload.ssd_token_slots = JSON.stringify(updates.ssdTokenSlots);
    if (updates.ssdNotice !== undefined) payload.ssd_notice = updates.ssdNotice;
    if (updates.ssdTimingsGuide !== undefined) payload.ssd_timings_guide = updates.ssdTimingsGuide;
    if (updates.ssdCounters !== undefined) payload.ssd_counters = JSON.stringify(updates.ssdCounters);
    if (updates.notice !== undefined) payload.notice = updates.notice;
    if (updates.bestTime !== undefined) payload.best_time = updates.bestTime;
    if (updates.weather !== undefined) payload.weather = updates.weather;
    if (updates.sevaStatus !== undefined) payload.seva_status = updates.sevaStatus;

    await supabase
      .from('live_metrics')
      .upsert({ id: 1, ...payload });

  } catch (e) {
    console.error("Supabase live_metrics update failed:", e);
  }

  return next;
}

// ── Fuel Rates ────────────────────────────────────────────────────────────────

export interface FuelRates {
  petrol: number;
  diesel: number;
  lastUpdated: string;
}

let memoryFuel: FuelRates = {
  petrol: 108.50,
  diesel: 96.20,
  lastUpdated: new Date().toISOString()
};

export function readFuelRates(): FuelRates {
  return memoryFuel;
}

export function updateFuelRates(updates: Partial<FuelRates>): FuelRates {
  memoryFuel = { ...memoryFuel, ...updates, lastUpdated: new Date().toISOString() };
  return memoryFuel;
}

// ── Traffic Stats ─────────────────────────────────────────────────────────────

export interface TrafficEntry { date: string; path: string; count: number }

let memoryTraffic: TrafficEntry[] = [];

function getMockTraffic(): TrafficEntry[] {
  if (memoryTraffic.length > 0) return memoryTraffic;
  const pages = ['/', '/explore', '/planner', '/plans', '/generating'];
  const entries: TrafficEntry[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const date = d.toISOString().split('T')[0];
    for (const pg of pages) {
      const base = pg === '/' ? 80 : pg === '/explore' ? 50 : 30;
      entries.push({ date, path: pg, count: Math.floor(base + Math.random() * 40) });
    }
  }
  memoryTraffic = entries;
  return entries;
}

export function readTraffic(): TrafficEntry[] {
  return getMockTraffic();
}

export function recordView(pagePath: string) {
  const entries = getMockTraffic();
  const today = new Date().toISOString().split('T')[0];
  const ex = entries.find(e => e.date === today && e.path === pagePath);
  if (ex) ex.count++; else entries.push({ date: today, path: pagePath, count: 1 });
  memoryTraffic = entries;
}

export function getTrafficSummary() {
  const entries = getMockTraffic();
  const last7: { date: string; total: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const date = d.toISOString().split('T')[0];
    const total = entries.filter(e => e.date === date).reduce((s, e) => s + e.count, 0);
    last7.push({ date, total });
  }
  const today = new Date().toISOString().split('T')[0];
  const todayTotal = entries.filter(e => e.date === today).reduce((s, e) => s + e.count, 0);
  const allTotal   = entries.reduce((s, e) => s + e.count, 0);
  const topPage    = [...entries].sort((a, b) => b.count - a.count)[0]?.path ?? '/';
  return { last7, todayTotal, allTotal, topPage };
}
