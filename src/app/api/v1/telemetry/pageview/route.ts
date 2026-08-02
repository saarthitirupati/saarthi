import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Memory cache fallback for ultra-fast telemetry ingestion
const memoryLogs: Array<{
  sessionId: string;
  path: string;
  title?: string;
  placeId?: string;
  storyId?: string;
  deviceType?: string;
  timestamp: string;
}> = [];

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
    memoryLogs.unshift({
      sessionId: cleanSessionId,
      path: cleanPath,
      title: title || cleanPath,
      placeId,
      storyId,
      deviceType: deviceType || 'Mobile',
      timestamp
    });
    if (memoryLogs.length > 500) memoryLogs.pop();

    // Async write to Supabase database
    try {
      await supabase.from('page_views').insert({
        session_id: cleanSessionId,
        path: cleanPath,
        page_title: title || cleanPath,
        place_id: placeId || null,
        story_id: storyId || null,
        device_type: deviceType || 'Mobile',
        referrer: referrer || null,
        created_at: timestamp
      });

      // Upsert visitor session
      await supabase.from('visitor_sessions').upsert({
        session_id: cleanSessionId,
        last_seen_at: timestamp,
        device_type: deviceType || 'Mobile'
      }, { onConflict: 'session_id' });
    } catch {
      // Silently fall back to in-memory store
    }

    return NextResponse.json({ success: true, timestamp });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Telemetry ingestion failed' }, { status: 500 });
  }
}

export function getMemoryLogs() {
  return memoryLogs;
}
