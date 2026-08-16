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
  try {
    await fs.writeFile(LOCAL_ALERTS_FILE, JSON.stringify(alerts, null, 2));
  } catch (e) {}
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Missing alert ID' }, { status: 400 });

    const now = new Date().toISOString();

    // 1. Delete/Expire in Supabase
    try {
      const { error } = await supabase
        .from('live_alerts')
        .delete()
        .eq('id', id);

      if (!error) {
        // Also clean up local file if present
        try {
          const localAlerts = await readLocalAlerts();
          const filtered = localAlerts.filter((a: any) => a.id !== id);
          await writeLocalAlerts(filtered);
        } catch (e) {}
        return NextResponse.json({ success: true, id });
      }
    } catch (err) {
      console.warn('Supabase delete error:', err);
    }

    // 2. Fallback to local file deletion
    try {
      const localAlerts = await readLocalAlerts();
      const filtered = localAlerts.filter((a: any) => a.id !== id);
      await writeLocalAlerts(filtered);
      return NextResponse.json({ success: true, id });
    } catch (e) {}

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete alert' }, { status: 500 });
  }
}
