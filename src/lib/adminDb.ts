import fs from 'fs';
import path from 'path';
import { Place } from '@/data/places';

const DATA_DIR  = path.join(process.cwd(), 'data');
const PLACES_FILE  = path.join(DATA_DIR, 'dynamic-places.json');
const TRAFFIC_FILE = path.join(DATA_DIR, 'traffic.json');
const STATUS_FILE  = path.join(DATA_DIR, 'status.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ── Dynamic Places ────────────────────────────────────────────────────────────

export type DynamicPlace = Place & { _dynamic: true; _createdAt: string };

export function readDynamicPlaces(): DynamicPlace[] {
  ensureDir();
  if (!fs.existsSync(PLACES_FILE)) { fs.writeFileSync(PLACES_FILE, '[]'); return []; }
  try { return JSON.parse(fs.readFileSync(PLACES_FILE, 'utf-8')); } catch { return []; }
}

function writePlaces(p: DynamicPlace[]) {
  ensureDir();
  fs.writeFileSync(PLACES_FILE, JSON.stringify(p, null, 2));
}

export function addPlace(data: Omit<Place, 'travelEstimates'> & { travelEstimates?: Record<string, string> }): DynamicPlace {
  const places = readDynamicPlaces();
  const place: DynamicPlace = {
    ...data,
    travelEstimates: data.travelEstimates ?? {},
    _dynamic: true,
    _createdAt: new Date().toISOString(),
  } as DynamicPlace;
  places.push(place);
  writePlaces(places);
  return place;
}

export function updatePlace(id: string, updates: Partial<Place>): DynamicPlace | null {
  const places = readDynamicPlaces();
  const idx = places.findIndex(p => p.id === id);
  
  if (idx === -1) {
    // Check static fallback
    const { PLACES } = require('@/data/places');
    const staticPlace = PLACES.find((p: any) => p.id === id);
    if (!staticPlace) return null;
    
    // Promote to dynamic
    const promoted: DynamicPlace = {
      ...staticPlace,
      ...updates,
      _dynamic: true,
      _createdAt: new Date().toISOString(),
    };
    places.push(promoted);
    writePlaces(places);
    return promoted;
  }

  places[idx] = { ...places[idx], ...updates };
  writePlaces(places);
  return places[idx];
}

export function deletePlace(id: string): boolean {
  const places = readDynamicPlaces();
  const next = places.filter(p => p.id !== id);
  if (next.length === places.length) return false;
  writePlaces(next);
  return true;
}

// ── Traffic ───────────────────────────────────────────────────────────────────

export interface TrafficEntry { date: string; path: string; count: number }

function seedTraffic(): TrafficEntry[] {
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
  return entries;
}

export function readTraffic(): TrafficEntry[] {
  ensureDir();
  if (!fs.existsSync(TRAFFIC_FILE)) {
    const seed = seedTraffic();
    fs.writeFileSync(TRAFFIC_FILE, JSON.stringify(seed, null, 2));
    return seed;
  }
  try {
    const data = JSON.parse(fs.readFileSync(TRAFFIC_FILE, 'utf-8'));
    return data.length === 0 ? seedTraffic() : data;
  } catch { return seedTraffic(); }
}

export function recordView(pagePath: string) {
  const entries = readTraffic();
  const today = new Date().toISOString().split('T')[0];
  const ex = entries.find(e => e.date === today && e.path === pagePath);
  if (ex) ex.count++; else entries.push({ date: today, path: pagePath, count: 1 });
  ensureDir();
  fs.writeFileSync(TRAFFIC_FILE, JSON.stringify(entries, null, 2));
}

export function getTrafficSummary() {
  const entries = readTraffic();
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

// --- Tirumala Live Status -----------------------------------------------------

export interface DarshanTypeStatus {
  name: string;             // e.g. "Sarva Darshan (Free)"
  waitTime: string;         // e.g. "12-15 hours"
  peakHours: string;        // e.g. "Weekends 6 AM - 10 PM"
}

export interface TirumalaStatus {
  waitTime: string;         // e.g. "2-3 hours"
  crowdLevel: 'low' | 'moderate' | 'high' | 'very-high';
  sevaStatus: string;       // e.g. "All sevas open"
  notice: string;           // free-text notice / announcement
  lastUpdated: string;      // ISO timestamp
  darshanSpeed: 'fast' | 'normal' | 'slow';
  accommodationStatus: 'available' | 'limited' | 'full';
  ladduAvailability: 'available' | 'limited' | 'no-stock';
  weather: string;
  darshans: DarshanTypeStatus[];
}

const DEFAULT_STATUS: TirumalaStatus = {
  waitTime: '2-3 hours',
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
  ]
};

export function readStatus(): TirumalaStatus {
  ensureDir();
  if (!fs.existsSync(STATUS_FILE)) {
    fs.writeFileSync(STATUS_FILE, JSON.stringify(DEFAULT_STATUS, null, 2));
    return DEFAULT_STATUS;
  }
  try { 
    const data = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf-8'));
    return { ...DEFAULT_STATUS, ...data };
  }
  catch { return DEFAULT_STATUS; }
}

export function updateStatus(updates: Partial<TirumalaStatus>): TirumalaStatus {
  const current = readStatus();
  const next: TirumalaStatus = { ...current, ...updates, lastUpdated: new Date().toISOString() };
  ensureDir();
  fs.writeFileSync(STATUS_FILE, JSON.stringify(next, null, 2));
  return next;
}
