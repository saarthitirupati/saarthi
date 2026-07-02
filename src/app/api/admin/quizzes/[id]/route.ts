import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { data, error } = await supabase.from('quizzes').select('*').eq('id', id).single();
    if (error) throw error;
    return NextResponse.json({ quiz: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();

    const updates = {
      question: body.question,
      difficulty: body.difficulty,
      category: body.category,
      image: body.image,
      options: body.options,
      correctAnswer: body.correctAnswer,
      explanation: body.explanation,
      relatedStory: body.relatedStory,
      relatedTemple: body.relatedTemple,
      xpReward: body.xpReward !== undefined ? Number(body.xpReward) : undefined,
      isActive: body.isActive !== undefined ? !!body.isActive : undefined
    };

    const cleanUpdates: any = {};
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined) cleanUpdates[k] = v;
    }

    const { data, error } = await supabase.from('quizzes').update(cleanUpdates).eq('id', id).select();
    if (error) throw error;

    return NextResponse.json({ quiz: data[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { error } = await supabase.from('quizzes').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
