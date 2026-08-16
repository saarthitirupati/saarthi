import { supabase } from '@/lib/supabase';
import fs from 'fs/promises';
import path from 'path';

export interface LiveAlert {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: 'Emergency' | 'High Priority' | 'Advisory' | 'Information';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  popup_type: 'Banner' | 'Popup' | 'Fullscreen';
  cta: 'Open Queue' | 'Open Essentials' | 'Open Maps' | 'Open Parking' | 'None';
  status: 'Draft' | 'Published' | 'Expired' | 'Archived';
  target_location: 'All Users' | 'Tirumala' | 'Tirupati' | 'Alipiri' | 'Nearby';
  start_time: string;
  expiry_time: string;
  created_at: string;
  updated_at: string;
}

const LOCAL_ALERTS_FILE = path.join(process.cwd(), 'data', 'live_alerts.json');

// Memory cache store for serverless environment persistence fallback
let IN_MEMORY_ALERTS: LiveAlert[] = [];
const DELETED_ALERT_IDS = new Set<string>();

async function readLocalAlerts(): Promise<LiveAlert[]> {
  try {
    const content = await fs.readFile(LOCAL_ALERTS_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalAlerts(alerts: LiveAlert[]) {
  try {
    await fs.writeFile(LOCAL_ALERTS_FILE, JSON.stringify(alerts, null, 2));
  } catch (e) {
    // Ignore read-only filesystem errors on Vercel
  }
}

export async function fetchLiveAlerts(showAll = false): Promise<LiveAlert[]> {
  const now = Date.now();
  let dbAlerts: LiveAlert[] | null = null;

  // 1. Try fetching from Supabase
  try {
    let query = supabase.from('live_alerts').select('*');
    if (!showAll) {
      query = query.eq('status', 'Published');
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error && Array.isArray(data)) {
      dbAlerts = data as LiveAlert[];
    }
  } catch (err) {
    console.warn('Supabase live_alerts fetch warning:', err);
  }

  // 2. Fetch local fallback if Supabase not available
  const baseAlerts = dbAlerts !== null ? dbAlerts : await readLocalAlerts();

  // 3. Combine with in-memory created alerts, excluding deleted IDs
  const combinedMap = new Map<string, LiveAlert>();

  for (const a of [...IN_MEMORY_ALERTS, ...baseAlerts]) {
    if (a && a.id && !DELETED_ALERT_IDS.has(a.id) && !combinedMap.has(a.id)) {
      combinedMap.set(a.id, a);
    }
  }

  const allList = Array.from(combinedMap.values());

  // 4. Apply filtering and sorting
  const filtered = allList.filter((a) => {
    if (!a) return false;
    if (DELETED_ALERT_IDS.has(a.id)) return false;
    if (showAll) return true;
    if (a.status !== 'Published') return false;
    if (!a.expiry_time) return true;
    const exp = new Date(a.expiry_time).getTime();
    return !isNaN(exp) && exp > now;
  });

  return filtered.sort((a, b) => {
    const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return tB - tA;
  });
}

export async function saveLiveAlert(alertData: Partial<LiveAlert>): Promise<LiveAlert> {
  const now = new Date().toISOString();
  const id = alertData.id || Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

  const newAlert: LiveAlert = {
    id,
    title: alertData.title || '',
    description: alertData.description || (alertData as any).message || '',
    image: alertData.image || '',
    category: alertData.category || 'Advisory',
    severity: alertData.severity || 'Medium',
    popup_type: alertData.popup_type || 'Banner',
    cta: alertData.cta || 'None',
    status: alertData.status || 'Published',
    target_location: alertData.target_location || 'All Users',
    start_time: alertData.start_time || now,
    expiry_time: alertData.expiry_time || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    created_at: now,
    updated_at: now
  };

  // Remove from deleted set if re-created
  DELETED_ALERT_IDS.delete(id);

  // Add to in-memory list
  IN_MEMORY_ALERTS = [newAlert, ...IN_MEMORY_ALERTS.filter((a) => a.id !== id)];

  // 1. Try Supabase insert
  try {
    await supabase.from('live_alerts').insert([newAlert]);
  } catch (e) {
    console.warn('Supabase live_alerts insert warning:', e);
  }

  // 2. Try writing to local file
  try {
    const local = await readLocalAlerts();
    const updatedLocal = [newAlert, ...local.filter((a) => a.id !== id)];
    await writeLocalAlerts(updatedLocal);
  } catch (e) {}

  return newAlert;
}

export async function deleteLiveAlert(id: string): Promise<boolean> {
  if (!id) return false;

  DELETED_ALERT_IDS.add(id);
  IN_MEMORY_ALERTS = IN_MEMORY_ALERTS.filter((a) => a.id !== id);

  // 1. Try Supabase delete
  try {
    await supabase.from('live_alerts').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase live_alerts delete warning:', e);
  }

  // 2. Try local file delete
  try {
    const local = await readLocalAlerts();
    const updatedLocal = local.filter((a) => a.id !== id);
    await writeLocalAlerts(updatedLocal);
  } catch (e) {}

  return true;
}
