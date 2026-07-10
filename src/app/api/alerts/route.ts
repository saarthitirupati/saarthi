import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs/promises';
import path from 'path';

const LOCAL_ALERTS_FILE = path.join(process.cwd(), 'data', 'live_alerts.json');

// Helper to ensure local alerts file exists
async function ensureLocalFile() {
  try {
    await fs.access(LOCAL_ALERTS_FILE);
  } catch {
    await fs.writeFile(LOCAL_ALERTS_FILE, JSON.stringify([]));
  }
}

// Helper to read local alerts
async function readLocalAlerts() {
  await ensureLocalFile();
  const content = await fs.readFile(LOCAL_ALERTS_FILE, 'utf-8');
  try {
    return JSON.parse(content);
  } catch {
    return [];
  }
}

// Helper to write local alerts
async function writeLocalAlerts(alerts: any[]) {
  await ensureLocalFile();
  await fs.writeFile(LOCAL_ALERTS_FILE, JSON.stringify(alerts, null, 2));
}

export async function GET() {
  const now = new Date().toISOString();
  
  try {
    // Attempt Supabase fetch
    const { data, error } = await supabase
      .from('live_alerts')
      .select('*')
      .eq('status', 'Published')
      .gt('expiry_time', now)
      .order('created_at', { ascending: false });

    if (!error && data) {
      return NextResponse.json(data);
    }
    
    // Log fallback warning
    console.warn('Supabase fetch failed or table missing, falling back to local JSON', error);
  } catch (err) {
    console.warn('Supabase fetch errored, falling back to local JSON', err);
  }

  // Fallback to local JSON file
  const localAlerts = await readLocalAlerts();
  const activeAlerts = localAlerts.filter((alert: any) => 
    alert.status === 'Published' && new Date(alert.expiry_time) > new Date(now)
  ).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json(activeAlerts);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    
    const alertId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newAlert = {
      id: alertId,
      title: body.title,
      description: body.description,
      category: body.category || 'Advisory',
      severity: body.severity || 'Medium',
      popup_type: body.popup_type || 'Banner',
      cta: body.cta || 'None',
      status: body.status || 'Published',
      target_location: body.target_location || 'All Users',
      start_time: body.start_time || now,
      expiry_time: body.expiry_time || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours default
      created_at: now,
      updated_at: now
    };

    // Attempt Supabase write
    try {
      const { data, error } = await supabase
        .from('live_alerts')
        .insert([newAlert])
        .select();

      if (!error && data) {
        return NextResponse.json(data[0]);
      }
      console.warn('Supabase insert failed, saving to local JSON fallback', error);
    } catch (e) {
      console.warn('Supabase write error, using local fallback', e);
    }

    // Local JSON fallback save
    const localAlerts = await readLocalAlerts();
    localAlerts.push(newAlert);
    await writeLocalAlerts(localAlerts);

    return NextResponse.json(newAlert);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
