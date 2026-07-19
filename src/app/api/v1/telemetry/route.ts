import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, eventType, entityType, entityId, metadata } = body;

    if (!sessionId || !eventType) {
      return NextResponse.json({ error: 'Missing sessionId or eventType' }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_events')
      .insert([{
        session_id: sessionId,
        event_type: eventType,
        entity_type: entityType || null,
        entity_id: entityId || null,
        metadata: metadata || {}
      }]);

    if (error) {
      // Log but don't surface — telemetry is non-critical
      console.warn('Telemetry insert skipped:', error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Telemetry API Error:', err);
    return NextResponse.json({ ok: false }, { status: 200 }); // never 500 to client
  }
}
