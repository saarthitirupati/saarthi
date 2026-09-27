import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { recordMemoryLog } from '@/lib/telemetryMemory';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, path, title, placeId, storyId, deviceType, referrer } = body || {};

    if (!path) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 });
    }

    const cleanSessionId = sessionId || `anon_${Math.random().toString(36).substring(2, 10)}`;
    const cleanPath = String(path).split('?')[0];
    const timestamp = new Date().toISOString();

    // Store in-memory fallback cache (max 500 items)
    recordMemoryLog({
      sessionId: cleanSessionId,
      path: cleanPath,
      title: title || cleanPath,
      placeId,
      storyId,
      deviceType: deviceType || 'Mobile',
      timestamp
    });

    // Async write to Supabase database (analytics_events) & local traffic ledger
    try {
      const { recordPageView } = await import('@/lib/adminDb');
      recordPageView(cleanPath);
    } catch {}

    try {
      await supabase.from('analytics_events').insert([{
        action: 'pageview',
        place_id: placeId || null,
        metadata: {
          path: cleanPath,
          title: title || cleanPath,
          session_id: cleanSessionId,
          device_type: deviceType || 'Mobile',
          referrer: referrer || null,
          created_at: timestamp
        }
      }]);
    } catch {
      // Silently fall back to in-memory store
    }

    return NextResponse.json({ success: true, timestamp });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Telemetry ingestion failed' }, { status: 500 });
  }
}
