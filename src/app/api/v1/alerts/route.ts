import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs/promises';
import path from 'path';

const LOCAL_ALERTS_FILE = path.join(process.cwd(), 'data', 'live_alerts.json');

async function readLocalAlerts() {
  try {
    const content = await fs.readFile(LOCAL_ALERTS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeLocalAlerts(alerts: any[]) {
  await fs.writeFile(LOCAL_ALERTS_FILE, JSON.stringify(alerts, null, 2));
}

export async function GET(request: Request) {
  try {
    const now = new Date().toISOString();

    // TODO: re-enable once 'live_alerts' table is created in Supabase
    // const { data, error } = await supabase.from('live_alerts').select('*')...

    const localAlerts = await readLocalAlerts();
    const activeLocalAlerts = localAlerts
      .filter((a: any) => a.status === 'Published' && new Date(a.expiry_time) > new Date(now))
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json(activeLocalAlerts);
  } catch (error: any) {
    console.error('API Error (/api/v1/alerts):', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const id = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

    const newAlert = {
      id,
      title: body.title,
      description: body.description,
      category: body.category,
      severity: body.severity,
      popup_type: body.popup_type,
      cta: body.cta,
      status: body.status || 'Published',
      target_location: body.target_location || 'All Users',
      start_time: body.start_time || now,
      expiry_time: body.expiry_time || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      created_at: now,
      updated_at: now
    };

    // TODO: re-enable once 'live_alerts' table is created in Supabase
    const localAlerts = await readLocalAlerts();
    localAlerts.unshift(newAlert);
    await writeLocalAlerts(localAlerts);

    return NextResponse.json(newAlert);
  } catch (error: any) {
    console.error('API Error (/api/v1/alerts POST):', error);
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
  }
}

