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
    const localAlerts = await readLocalAlerts();
    
    if (!Array.isArray(localAlerts)) {
      return NextResponse.json([]);
    }

    const activeLocalAlerts = localAlerts
      .filter((a: any) => {
        if (!a || a.status !== 'Published') return false;
        if (!a.expiry_time) return true; // Keep active if no expiry set
        const expTime = new Date(a.expiry_time).getTime();
        return !isNaN(expTime) && expTime > Date.now();
      })
      .sort((a: any, b: any) => {
        const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tB - tA;
      });

    return NextResponse.json(activeLocalAlerts);
  } catch (error: any) {
    console.error('API Error (/api/v1/alerts):', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const id = body.id || (Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2));

    const newAlert = {
      id,
      title: body.title,
      description: body.description,
      image: body.image || '',
      category: body.category || 'Advisory',
      severity: body.severity || 'Medium',
      popup_type: body.popup_type || 'Popup',
      cta: body.cta || 'None',
      status: body.status || 'Published',
      target_location: body.target_location || 'All Users',
      start_time: body.start_time || now,
      expiry_time: body.expiry_time || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      created_at: now,
      updated_at: now
    };

    // 1. Attempt Supabase live_alerts insert
    try {
      const { data, error } = await supabase.from('live_alerts').insert([newAlert]).select();
      if (!error && data && data[0]) {
        return NextResponse.json(data[0], { status: 201 });
      }
    } catch (sbErr) {
      console.warn('Supabase live_alerts insert notice:', sbErr);
    }

    // 2. Attempt local filesystem write (local dev fallback)
    try {
      const localAlerts = await readLocalAlerts();
      if (Array.isArray(localAlerts)) {
        localAlerts.unshift(newAlert);
        await writeLocalAlerts(localAlerts);
      }
    } catch (fsErr) {
      console.warn('Vercel read-only filesystem environment:', fsErr);
    }

    return NextResponse.json(newAlert, { status: 201 });
  } catch (error: any) {
    console.error('API Error (/api/v1/alerts POST):', error);
    return NextResponse.json({ error: error?.message || 'Failed to create alert' }, { status: 400 });
  }
}

