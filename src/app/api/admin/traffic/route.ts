import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTrafficSummary, readTraffic } from '@/lib/adminDb';

export async function GET() {
  try {
    const { data: dbEntries, error } = await supabase
      .from('page_views')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;

    if (dbEntries && dbEntries.length > 0) {
      // Calculate summary statistics from Supabase database entries
      const last7: { date: string; total: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const date = d.toISOString().split('T')[0];
        const total = dbEntries
          .filter((e: any) => e.date === date)
          .reduce((sum: number, e: any) => sum + e.count, 0);
        last7.push({ date, total });
      }

      const today = new Date().toISOString().split('T')[0];
      const todayTotal = dbEntries
        .filter((e: any) => e.date === today)
        .reduce((sum: number, e: any) => sum + e.count, 0);

      const allTotal = dbEntries.reduce((sum: number, e: any) => sum + e.count, 0);
      
      const topPage = [...dbEntries].sort((a: any, b: any) => b.count - a.count)[0]?.path ?? '/';

      const entries = dbEntries.map((e: any) => ({
        date: e.date,
        path: e.path,
        count: e.count
      }));

      return NextResponse.json({ last7, todayTotal, allTotal, topPage, entries });
    }
  } catch (err) {
    console.error('Failed to fetch real-time traffic from Supabase:', err);
  }

  // Fallback to local traffic.json if Supabase is empty or fails
  const summary = getTrafficSummary();
  const entries = readTraffic();
  return NextResponse.json({ ...summary, entries });
}
