import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { data, error } = await supabase.from('festivals').select('*').eq('id', id).single();
    if (error) throw error;
    return NextResponse.json({ festival: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();

    const updates = {
      slug: body.slug,
      name: body.name,
      description: body.description,
      festival_type: body.festival_type || body.category,
      date: body.date,
      gravity_score: body.gravity_score !== undefined ? Number(body.gravity_score) : undefined,
      crowd_level: body.crowd_level || body.expectedCrowd,
      recommended_time: body.recommended_time || body.recommendedTime,
      dress_code: body.dress_code || body.dressCode,
      parking_status: body.parking_status || body.parking,
      visitor_notes: body.visitor_notes || body.specialTips,
      is_major: body.is_major !== undefined ? !!body.is_major : undefined,
      image_url: body.image_url || body.coverImage,
      status: body.status
    };

    const cleanUpdates: any = {};
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined) cleanUpdates[k] = v;
    }

    const { data, error } = await supabase.from('festivals').update(cleanUpdates).eq('id', id).select();
    if (error) throw error;

    return NextResponse.json({ festival: data[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { error } = await supabase.from('festivals').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
