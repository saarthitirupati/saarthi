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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const now = new Date().toISOString();

  try {
    // Attempt Supabase status update to Expired/Archived
    const { data, error } = await supabase
      .from('live_alerts')
      .update({ status: 'Expired', expiry_time: now, updated_at: now })
      .eq('id', id)
      .select();

    if (!error && data) {
      return NextResponse.json({ success: true, alert: data[0] });
    }
    console.warn('Supabase delete failed, updating local fallback', error);
  } catch (err) {
    console.warn('Supabase delete error, using local fallback', err);
  }

  // Fallback to local JSON
  const localAlerts = await readLocalAlerts();
  const index = localAlerts.findIndex((alert: any) => alert.id === id);
  if (index !== -1) {
    localAlerts[index].status = 'Expired';
    localAlerts[index].expiry_time = now;
    localAlerts[index].updated_at = now;
    await writeLocalAlerts(localAlerts);
    return NextResponse.json({ success: true, alert: localAlerts[index] });
  }

  return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
}
