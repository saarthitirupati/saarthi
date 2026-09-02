import fs from 'fs';
import path from 'path';
import { Place } from '@/data/places';
import { supabase } from '@/lib/supabase';

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
  petrol: 108.50,
  diesel: 96.20,
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

// ── Marketing Campaigns & Physical QR Scans (Supabase Persistent DB) ─────────

export async function readCampaignsAsync(): Promise<MarketingCampaign[]> {
  try {
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const campaigns: MarketingCampaign[] = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        category: c.category,
        location: c.location,
        destination: c.destination,
        status: c.status as 'active' | 'paused',
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      }));
      try { writeCampaigns(campaigns); } catch {}
      return campaigns;
    }
  } catch (err) {
    console.error('Error reading campaigns from Supabase:', err);
  }
  return readCampaigns();
}

export function readCampaigns(): MarketingCampaign[] {
  ensureDir();
  if (!fs.existsSync(CAMPAIGNS_FILE)) {
    try { fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(DEFAULT_CAMPAIGNS, null, 2)); } catch {}
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
  try {
    ensureDir();
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
  } catch {}
}

export async function addCampaignAsync(data: Omit<MarketingCampaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<MarketingCampaign> {
  const slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
  const id = `cmp_${Date.now().toString(36)}`;
  const nowStr = new Date().toISOString();

  const campaign: MarketingCampaign = {
    ...data,
    id,
    slug,
    createdAt: nowStr,
    updatedAt: nowStr,
  };

  try {
    await supabase.from('marketing_campaigns').insert([{
      id: campaign.id,
      name: campaign.name,
      slug: campaign.slug,
      category: campaign.category,
      location: campaign.location,
      destination: campaign.destination,
      status: campaign.status,
      created_at: campaign.createdAt,
      updated_at: campaign.updatedAt,
    }]);
  } catch (err) {
    console.error('Supabase add campaign error:', err);
  }

  try {
    const campaigns = readCampaigns();
    campaigns.unshift(campaign);
    writeCampaigns(campaigns);
  } catch {}

  return campaign;
}

export function addCampaign(data: Omit<MarketingCampaign, 'id' | 'createdAt' | 'updatedAt'>): MarketingCampaign {
  const slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
  const campaign: MarketingCampaign = {
    ...data,
    id: `cmp_${Date.now().toString(36)}`,
    slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  addCampaignAsync(data).catch(() => {});
  return campaign;
}

export async function updateCampaignAsync(id: string, updates: Partial<MarketingCampaign>): Promise<MarketingCampaign | null> {
  const nowStr = new Date().toISOString();
  const dbUpdates: any = { updated_at: nowStr };
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.location !== undefined) dbUpdates.location = updates.location;
  if (updates.destination !== undefined) dbUpdates.destination = updates.destination;
  if (updates.status !== undefined) dbUpdates.status = updates.status;

  try {
    const { data } = await supabase
      .from('marketing_campaigns')
      .update(dbUpdates)
      .or(`id.eq.${id},slug.eq.${id}`)
      .select('*');

    if (data && data[0]) {
      const updated: MarketingCampaign = {
        id: data[0].id,
        name: data[0].name,
        slug: data[0].slug,
        category: data[0].category,
        location: data[0].location,
        destination: data[0].destination,
        status: data[0].status,
        createdAt: data[0].created_at,
        updatedAt: data[0].updated_at,
      };
      try { updateCampaign(id, updates); } catch {}
      return updated;
    }
  } catch (err) {
    console.error('Supabase update campaign error:', err);
  }

  return updateCampaign(id, updates);
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

export async function readScansAsync(limit: number = 100): Promise<MarketingScan[]> {
  try {
    const { data, error } = await supabase
      .from('marketing_scans')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!error && data) {
      return data.map((s: any) => ({
        id: s.id,
        campaignId: s.campaign_id,
        campaignSlug: s.campaign_slug,
        device: s.device,
        browser: s.browser,
        os: s.os,
        language: s.language,
        referer: s.referer,
        timestamp: s.created_at,
      }));
    }
  } catch (err) {
    console.error('Error reading scans from Supabase:', err);
  }
  return readScans();
}

export function readScans(): MarketingScan[] {
  ensureDir();
  if (!fs.existsSync(SCANS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(SCANS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export async function logMarketingScanAsync(scanData: Omit<MarketingScan, 'id' | 'timestamp'>): Promise<MarketingScan> {
  const scanId = `scn_${scanData.campaignId || scanData.campaignSlug}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const nowStr = new Date().toISOString();

  const scan: MarketingScan = {
    ...scanData,
    id: scanId,
    timestamp: nowStr,
  };

  try {
    await supabase.from('marketing_scans').insert([{
      id: scan.id,
      campaign_id: scan.campaignId,
      campaign_slug: scan.campaignSlug,
      device: scan.device || 'Mobile',
      browser: scan.browser || 'Browser',
      os: scan.os || 'Mobile',
      language: scan.language || 'en-US',
      referer: scan.referer || 'QR Code',
      created_at: scan.timestamp,
    }]);
  } catch (err) {
    console.error('Supabase log marketing scan error:', err);
  }

  try {
    const scans = readScans();
    scans.unshift(scan);
    ensureDir();
    fs.writeFileSync(SCANS_FILE, JSON.stringify(scans.slice(0, 3000), null, 2));
  } catch {}

  return scan;
}

export function logMarketingScan(scanData: Omit<MarketingScan, 'id' | 'timestamp'>): MarketingScan {
  const scanId = `scn_${scanData.campaignId || scanData.campaignSlug}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const scan: MarketingScan = {
    ...scanData,
    id: scanId,
    timestamp: new Date().toISOString(),
  };

  logMarketingScanAsync(scanData).catch(() => {});
  return scan;
}

export async function getGrowthHubMetricsAsync() {
  const campaigns = await readCampaignsAsync();
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = now.toISOString().split('T')[0];
  const todayMidnightIso = today.toISOString();

  let totalScans = 0;
  let todayScans = 0;
  let allScanRows: any[] = [];

  try {
    // 1. Fetch exact total count from Supabase
    const totRes = await supabase.from('marketing_scans').select('*', { count: 'exact', head: true });
    if (totRes.count !== null && totRes.count !== undefined) {
      totalScans = totRes.count;
    }

    // 2. Fetch exact today's count from Supabase
    const tdRes = await supabase.from('marketing_scans').select('*', { count: 'exact', head: true }).gte('created_at', todayMidnightIso);
    if (tdRes.count !== null && tdRes.count !== undefined) {
      todayScans = tdRes.count;
    }

    // 3. Fetch up to 10,000 scan events for accurate campaign distribution
    const { data: scanData } = await supabase
      .from('marketing_scans')
      .select('campaign_id, campaign_slug, device, os, browser, referer, created_at')
      .order('created_at', { ascending: false })
      .limit(10000);

    if (scanData) {
      allScanRows = scanData;
      if (totalScans === 0) totalScans = scanData.length;
    }
  } catch (err) {
    console.error('Error fetching Supabase growth metrics:', err);
  }

  // Fallback to local files if Supabase was completely empty
  if (allScanRows.length === 0) {
    const localScans = readScans();
    totalScans = Math.max(totalScans, localScans.length);
    todayScans = Math.max(todayScans, localScans.filter(s => s.timestamp && s.timestamp.startsWith(todayStr)).length);
    allScanRows = localScans.map(s => ({
      campaign_id: s.campaignId,
      campaign_slug: s.campaignSlug,
      device: s.device,
      os: s.os,
      browser: s.browser,
      referer: s.referer,
      created_at: s.timestamp,
    }));
  }

  const campaignScanMap: Record<string, number> = {};
  const campaignTodayMap: Record<string, number> = {};
  const deviceBreakdown: Record<string, number> = { 'Android': 0, 'iOS': 0, 'Desktop': 0, 'Other': 0 };
  const osBreakdown: Record<string, number> = {};
  const browserBreakdown: Record<string, number> = {};

  allScanRows.forEach(s => {
    const cid = (s.campaign_id || '').toLowerCase().trim();
    const cslug = (s.campaign_slug || '').toLowerCase().trim();
    const isToday = s.created_at && (s.created_at.startsWith(todayStr) || s.created_at >= todayMidnightIso);

    if (cid) {
      campaignScanMap[cid] = (campaignScanMap[cid] || 0) + 1;
      if (isToday) campaignTodayMap[cid] = (campaignTodayMap[cid] || 0) + 1;
    }
    if (cslug && cslug !== cid) {
      campaignScanMap[cslug] = (campaignScanMap[cslug] || 0) + 1;
      if (isToday) campaignTodayMap[cslug] = (campaignTodayMap[cslug] || 0) + 1;
    }

    // Devices
    const dev = s.device || (s.os === 'iOS' ? 'iPhone' : s.os === 'Android' ? 'Android Mobile' : 'Desktop');
    if (dev.toLowerCase().includes('android')) deviceBreakdown['Android']++;
    else if (dev.toLowerCase().includes('iphone') || dev.toLowerCase().includes('ios') || dev.toLowerCase().includes('ipad')) deviceBreakdown['iOS']++;
    else if (dev.toLowerCase().includes('desktop') || dev.toLowerCase().includes('mac') || dev.toLowerCase().includes('windows')) deviceBreakdown['Desktop']++;
    else deviceBreakdown['Other']++;

    // OS
    const osName = s.os || 'Unknown';
    osBreakdown[osName] = (osBreakdown[osName] || 0) + 1;

    // Browser
    const brName = s.browser || 'Browser';
    browserBreakdown[brName] = (browserBreakdown[brName] || 0) + 1;
  });

  let topCampaign: MarketingCampaign | null = null;
  let maxScans = -1;

  campaigns.forEach(c => {
    const cId = c.id.toLowerCase();
    const cSlug = c.slug.toLowerCase();
    const countById = campaignScanMap[cId] || 0;
    const countBySlug = campaignScanMap[cSlug] || 0;
    const actualCnt = Math.max(countById, countBySlug);

    campaignScanMap[c.id] = actualCnt;
    campaignScanMap[c.slug] = actualCnt;
    campaignScanMap[cId] = actualCnt;
    campaignScanMap[cSlug] = actualCnt;

    const todayById = campaignTodayMap[cId] || 0;
    const todayBySlug = campaignTodayMap[cSlug] || 0;
    const actualToday = Math.max(todayById, todayBySlug);

    campaignTodayMap[c.id] = actualToday;
    campaignTodayMap[c.slug] = actualToday;
    campaignTodayMap[cId] = actualToday;
    campaignTodayMap[cSlug] = actualToday;

    if (actualCnt > maxScans) {
      maxScans = actualCnt;
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
    deviceBreakdown,
    osBreakdown,
    browserBreakdown,
  };
}

export function getGrowthHubMetrics() {
  const campaigns = readCampaigns();
  const scans = readScans();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const totalScans = scans.length;
  const todayScans = scans.filter(s => s.timestamp && s.timestamp.startsWith(todayStr)).length;

  const campaignScanMap: Record<string, number> = {};
  const campaignTodayMap: Record<string, number> = {};

  scans.forEach(s => {
    if (s.campaignId) {
      campaignScanMap[s.campaignId] = (campaignScanMap[s.campaignId] || 0) + 1;
      if (s.timestamp && s.timestamp.startsWith(todayStr)) {
        campaignTodayMap[s.campaignId] = (campaignTodayMap[s.campaignId] || 0) + 1;
      }
    }
    if (s.campaignSlug) {
      campaignScanMap[s.campaignSlug] = (campaignScanMap[s.campaignSlug] || 0) + 1;
      if (s.timestamp && s.timestamp.startsWith(todayStr)) {
        campaignTodayMap[s.campaignSlug] = (campaignTodayMap[s.campaignSlug] || 0) + 1;
      }
    }
  });

  let topCampaign: MarketingCampaign | null = null;
  let maxScans = -1;

  campaigns.forEach(c => {
    const countById = campaignScanMap[c.id] || 0;
    const countBySlug = campaignScanMap[c.slug] || 0;
    const actualCnt = Math.max(countById, countBySlug);
    campaignScanMap[c.id] = actualCnt;
    campaignScanMap[c.slug] = actualCnt;

    if (actualCnt > maxScans) {
      maxScans = actualCnt;
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

