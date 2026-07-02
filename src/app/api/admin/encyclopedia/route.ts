import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('encyclopedia').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ encyclopedia: data || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.slug) body.slug = body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();

    const doc = {
      title: body.title,
      slug: body.slug,
      category: body.category || 'deity',
      keywords: body.keywords || [],
      content: body.content,
      summary: body.summary || '',
      coverImage: body.coverImage || '',
      references: body.references || [],
      relatedTemples: body.relatedTemples || [],
      relatedArticles: body.relatedArticles || [],
      isActive: body.isActive !== undefined ? !!body.isActive : true
    };

    const { data, error } = await supabase.from('encyclopedia').insert([doc]).select();
    if (error) throw error;

    return NextResponse.json({ article: data[0] }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
