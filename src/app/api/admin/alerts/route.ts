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

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('live_alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ alerts: data });
    }
  } catch (e) {}

  const local = await readLocalAlerts();
  return NextResponse.json({ alerts: local });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const now = new Date().toISOString();
    const id = data.id || (Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2));

    const newAlert = {
      id,
      title: data.title || '',
      description: data.description || data.message || '',
      image: data.image || '',
      category: data.category || 'Advisory',
      severity: data.severity || 'Medium',
      popup_type: data.popup_type || 'Banner',
      cta: data.cta || 'None',
      status: data.status || 'Published',
      target_location: data.target_location || 'All Users',
      start_time: data.start_time || now,
      expiry_time: data.expiry_time || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      created_at: now,
      updated_at: now
    };

    try {
      const { data: inserted, error } = await supabase
        .from('live_alerts')
        .insert([newAlert])
        .select();

      if (!error && inserted && inserted[0]) {
        return NextResponse.json(inserted[0]);
      }
    } catch (sbErr) {}

    return NextResponse.json(newAlert);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const now = new Date().toISOString();
    try {
      await supabase
        .from('live_alerts')
        .update({ status: 'Expired', expiry_time: now, updated_at: now })
        .eq('id', id);
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
