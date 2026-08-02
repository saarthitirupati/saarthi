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
  let entries: TrafficEntry[] = [];
  let needsWrite = false;

  if (!fs.existsSync(TRAFFIC_FILE)) {
    entries = seedTraffic();
    needsWrite = true;
  } else {
    try {
      entries = JSON.parse(fs.readFileSync(TRAFFIC_FILE, 'utf-8'));
      if (entries.length === 0) {
        entries = seedTraffic();
        needsWrite = true;
      }
    } catch {
      entries = seedTraffic();
      needsWrite = true;
    }
  }

  // Ensure dates are not stale: if no entry exists for today, backfill the last 7 days dynamically
  const today = new Date().toISOString().split('T')[0];
  const hasToday = entries.some(e => e.date === today);
  if (!hasToday) {
    const pages = ['/', '/explore', '/planner', '/plans', '/generating'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const date = d.toISOString().split('T')[0];
      const hasDate = entries.some(e => e.date === date);
      if (!hasDate) {
        for (const pg of pages) {
          const base = pg === '/' ? 80 : pg === '/explore' ? 50 : 30;
          entries.push({ date, path: pg, count: Math.floor(base + Math.random() * 40) });
        }
        needsWrite = true;
      }
    }
  }

  if (needsWrite) {
    fs.writeFileSync(TRAFFIC_FILE, JSON.stringify(entries, null, 2));
  }
  return entries;
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
  darshans: DarshanTypeStatus[];
  ssdTokenStatus: 'issuing' | 'paused' | 'closed-for-day';
  ssdNextTokenTime: string;    // e.g. "2:00 PM" or "Tomorrow 5 AM"
  ssdTokenSlots: SsdTokenSlot[];
  ssdNotice: string;           // e.g. "Tokens exhausted for morning slots"
  ssdTimingsGuide: string;
  ssdCounters: SsdCounter[];
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

// ── Fuel Rates ────────────────────────────────────────────────────────────────

export interface FuelRates {
  petrol: number;
  diesel: number;
  lastUpdated: string;
}

const DEFAULT_FUEL: FuelRates = {
  petrol: 118.00,
  diesel: 105.00,
  lastUpdated: new Date().toISOString()
};

export function readFuelRates(): FuelRates {
  ensureDir();
  const FUEL_FILE = path.join(DATA_DIR, 'fuel.json');
  if (!fs.existsSync(FUEL_FILE)) {
    fs.writeFileSync(FUEL_FILE, JSON.stringify(DEFAULT_FUEL, null, 2));
    return DEFAULT_FUEL;
  }
  try {
    return { ...DEFAULT_FUEL, ...JSON.parse(fs.readFileSync(FUEL_FILE, 'utf-8')) };
  } catch {
    return DEFAULT_FUEL;
  }
}

export function updateFuelRates(updates: Partial<FuelRates>): FuelRates {
  const current = readFuelRates();
  const next: FuelRates = { ...current, ...updates, lastUpdated: new Date().toISOString() };
  ensureDir();
  const FUEL_FILE = path.join(DATA_DIR, 'fuel.json');
  fs.writeFileSync(FUEL_FILE, JSON.stringify(next, null, 2));
  return next;
}

// ── Growth Hub & Marketing Campaigns ───────────────────────────────────────────

export type CampaignCategory = 
  | 'apsrtc' 
  | 'hotel' 
  | 'taxi' 
  | 'auto' 
  | 'temple' 
  | 'railway' 
  | 'airport' 
  | 'food_court' 
  | 'festival' 
  | 'flyer' 
  | 'business_card' 
  | 'volunteer' 
  | 'other';

export interface MarketingCampaign {
  id: string;
  name: string;
  slug: string;
  category: CampaignCategory;
  location: string;
  destination: string;
  status: 'active' | 'paused';
  createdAt: string;
  updatedAt: string;
}

export interface MarketingScan {
  id: string;
  campaignId: string;
  campaignSlug: string;
  timestamp: string;
  device: string;
  browser: string;
  os: string;
  language: string;
  referer: string;
  ipHash?: string;
}

const CAMPAIGNS_FILE = path.join(DATA_DIR, 'campaigns.json');
const SCANS_FILE = path.join(DATA_DIR, 'scans.json');

const DEFAULT_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'cmp_apsrtc_01',
    name: 'APSRTC Bus Stickers',
    slug: 'apsrtc',
    category: 'apsrtc',
    location: 'Tirupati Bus Station & Fleet',
    destination: '/darshan',
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cmp_bhimas_01',
    name: 'Hotel Bhimas Reception',
    slug: 'bhimas',
    category: 'hotel',
    location: 'Bhimas Grand Entrance',
    destination: '/explore',
    status: 'active',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cmp_alipiri_01',
    name: 'Alipiri Mettu Kiosk Standee',
    slug: 'alipiri',
    category: 'temple',
    location: 'Alipiri Footstep Entry',
    destination: '/places/alipiri-mettu',
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cmp_cab_01',
    name: 'Tirupati Station Cab Decal #104',
    slug: 'cab-01',
    category: 'taxi',
    location: 'Railway Station Taxi Stand',
    destination: '/',
    status: 'active',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export function readCampaigns(): MarketingCampaign[] {
  ensureDir();
  if (!fs.existsSync(CAMPAIGNS_FILE)) {
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(DEFAULT_CAMPAIGNS, null, 2));
    return DEFAULT_CAMPAIGNS;
  }
  try {
    const data = JSON.parse(fs.readFileSync(CAMPAIGNS_FILE, 'utf-8'));
    return Array.isArray(data) && data.length > 0 ? data : DEFAULT_CAMPAIGNS;
  } catch {
    return DEFAULT_CAMPAIGNS;
  }
}

export function writeCampaigns(campaigns: MarketingCampaign[]): void {
  ensureDir();
  fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
}

export function addCampaign(data: Omit<MarketingCampaign, 'id' | 'createdAt' | 'updatedAt'>): MarketingCampaign {
  const campaigns = readCampaigns();
  const slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
  
  // Check duplicate slug
  const existingIdx = campaigns.findIndex(c => c.slug === slug);
  if (existingIdx !== -1) {
    throw new Error(`Campaign with slug "${slug}" already exists.`);
  }

  const campaign: MarketingCampaign = {
    ...data,
    id: `cmp_${Date.now().toString(36)}`,
    slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  campaigns.unshift(campaign);
  writeCampaigns(campaigns);
  return campaign;
}

export function updateCampaign(id: string, updates: Partial<MarketingCampaign>): MarketingCampaign | null {
  const campaigns = readCampaigns();
  const idx = campaigns.findIndex(c => c.id === id || c.slug === id);
  if (idx === -1) return null;

  const updated: MarketingCampaign = {
    ...campaigns[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  campaigns[idx] = updated;
  writeCampaigns(campaigns);
  return updated;
}

export function readScans(): MarketingScan[] {
  ensureDir();
  if (!fs.existsSync(SCANS_FILE)) {
    // Generate initial dummy scan events for default campaigns
    const seedScans: MarketingScan[] = [];
    const campaigns = readCampaigns();
    const now = Date.now();
    
    campaigns.forEach((c, cIdx) => {
      const count = (4 - cIdx) * 140 + 45;
      for (let i = 0; i < count; i++) {
        seedScans.push({
          id: `scn_${c.id}_${i}`,
          campaignId: c.id,
          campaignSlug: c.slug,
          timestamp: new Date(now - Math.random() * 7 * 86400000).toISOString(),
          device: i % 3 === 0 ? 'iPhone (iOS)' : i % 2 === 0 ? 'Samsung (Android)' : 'Mobile Browser',
          browser: i % 4 === 0 ? 'Safari' : 'Chrome Mobile',
          os: i % 3 === 0 ? 'iOS 17' : 'Android 14',
          language: 'en-US',
          referer: 'QR Camera Scan',
        });
      }
    });

    fs.writeFileSync(SCANS_FILE, JSON.stringify(seedScans, null, 2));
    return seedScans;
  }
  try {
    return JSON.parse(fs.readFileSync(SCANS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export function logMarketingScan(scanData: Omit<MarketingScan, 'id' | 'timestamp'>): MarketingScan {
  const scans = readScans();
  const scan: MarketingScan = {
    ...scanData,
    id: `scn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  };

  scans.unshift(scan);
  ensureDir();
  fs.writeFileSync(SCANS_FILE, JSON.stringify(scans, null, 2));
  return scan;
}

export function getGrowthHubMetrics() {
  const campaigns = readCampaigns();
  const scans = readScans();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const totalScans = scans.length;
  const todayScans = scans.filter(s => s.timestamp.startsWith(todayStr)).length;

  // Scan count per campaign
  const campaignScanMap: Record<string, number> = {};
  const campaignTodayMap: Record<string, number> = {};

  scans.forEach(s => {
    campaignScanMap[s.campaignId] = (campaignScanMap[s.campaignId] || 0) + 1;
    if (s.timestamp.startsWith(todayStr)) {
      campaignTodayMap[s.campaignId] = (campaignTodayMap[s.campaignId] || 0) + 1;
    }
  });

  // Top campaign
  let topCampaign: MarketingCampaign | null = null;
  let maxScans = -1;

  campaigns.forEach(c => {
    const cnt = campaignScanMap[c.id] || 0;
    if (cnt > maxScans) {
      maxScans = cnt;
      topCampaign = c;
    }
  });

  return {
    totalScans,
    todayScans,
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    topCampaign: topCampaign ? {
      id: (topCampaign as MarketingCampaign).id,
      name: (topCampaign as MarketingCampaign).name,
      scans: maxScans,
    } : null,
    campaignScanMap,
    campaignTodayMap,
  };
}

