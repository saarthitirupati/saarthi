import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, eventType, entityType, entityId, metadata } = body;

    if (!sessionId || !eventType) {
      return NextResponse.json({ error: 'Missing sessionId or eventType' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('user_events')
      .insert([{
        session_id: sessionId,
        event_type: eventType,
        entity_type: entityType || null,
        entity_id: entityId || null,
        metadata: metadata || {}
      }])
      .select();

    if (error) throw error;

    return NextResponse.json({ ok: true, event: data[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
