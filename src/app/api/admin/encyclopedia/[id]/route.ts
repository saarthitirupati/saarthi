import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { data, error } = await supabase.from('encyclopedia').select('*').eq('id', id).single();
    if (error) throw error;
    return NextResponse.json({ article: data });
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
      category: body.category,
      keywords: body.keywords,
      content: body.content,
      summary: body.summary,
      coverImage: body.coverImage,
      references: body.references,
      relatedTemples: body.relatedTemples,
      relatedArticles: body.relatedArticles,
      isActive: body.isActive !== undefined ? !!body.isActive : undefined
    };

    const cleanUpdates: any = {};
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined) cleanUpdates[k] = v;
    }

    const { data, error } = await supabase.from('encyclopedia').update(cleanUpdates).eq('id', id).select();
    if (error) throw error;

    return NextResponse.json({ article: data[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { error } = await supabase.from('encyclopedia').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
