import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('stories').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ stories: data || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.slug) body.slug = body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    if (!body.id) body.id = body.slug;

    const doc = {
      id: body.id,
      title: body.title,
      slug: body.slug,
      subtitle: body.subtitle || '',
      snippet: body.snippet || '',
      fullText: body.fullText || body.content || '',
      image: body.image || '',
      readTime: body.readTime || '3 min read',
      category: body.category || 'mythology',
      keyTakeaway: body.keyTakeaway || '',
      audioUrl: body.audioUrl || '',
      relatedTemple: body.relatedTemple || null,
      tags: body.tags || [],
      isActive: body.isActive !== undefined ? !!body.isActive : true
    };

    const { data, error } = await supabase.from('stories').insert([doc]).select();
    if (error) throw error;

    return NextResponse.json({ story: data[0] }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
