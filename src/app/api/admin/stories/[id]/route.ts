import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { data, error } = await supabase.from('stories').select('*').eq('id', id).single();
    if (error) throw error;
    return NextResponse.json({ story: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();

    const updates = {
      title: body.title,
      slug: body.slug,
      subtitle: body.subtitle,
      snippet: body.snippet,
      fullText: body.fullText || body.content,
      image: body.image,
      readTime: body.readTime,
      category: body.category,
      keyTakeaway: body.keyTakeaway,
      audioUrl: body.audioUrl,
      relatedTemple: body.relatedTemple,
      tags: body.tags,
      isActive: body.isActive !== undefined ? !!body.isActive : undefined
    };

    const cleanUpdates: any = {};
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined) cleanUpdates[k] = v;
    }

    const { data, error } = await supabase.from('stories').update(cleanUpdates).eq('id', id).select();
    if (error) throw error;

    return NextResponse.json({ story: data[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { error } = await supabase.from('stories').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
