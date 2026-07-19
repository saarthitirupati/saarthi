import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { data, error } = await supabase.from('places').select('*').eq('id', id).single();
    if (!error && data) {
      return NextResponse.json({ place: data });
    }
  } catch (err) {
    console.error('Failed to fetch place from Supabase:', err);
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  try {
    const { data: schemaRow } = await supabase.from('places').select('*').limit(1);
    const validKeys = schemaRow && schemaRow.length > 0 ? new Set(Object.keys(schemaRow[0])) : null;

    const cleanUpdates: any = {};
    for (const [k, v] of Object.entries(body)) {
      if (v !== undefined && (!validKeys || validKeys.has(k)) && k !== 'id' && k !== 'created_at' && k !== 'updated_at') {
        cleanUpdates[k] = v;
      }
    }
    
    cleanUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from('places').update(cleanUpdates).eq('id', id).select();
    if (error) throw error;

    return NextResponse.json({ place: data[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { error } = await supabase.from('places').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
