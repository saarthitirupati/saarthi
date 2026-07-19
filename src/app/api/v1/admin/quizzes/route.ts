import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('quizzes').select('*').order('createdAt', { ascending: false });
    if (error) throw error;
    return NextResponse.json({ quizzes: data || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const doc = {
      question: body.question,
      difficulty: body.difficulty || 'beginner',
      category: body.category || 'tirumala',
      image: body.image || '',
      options: body.options || [],
      correctAnswer: body.correctAnswer,
      explanation: body.explanation || '',
      relatedStory: body.relatedStory || null,
      relatedTemple: body.relatedTemple || null,
      xpReward: Number(body.xpReward) || 10,
      isActive: body.isActive !== undefined ? !!body.isActive : true
    };

    const { data, error } = await supabase.from('quizzes').insert([doc]).select();
    if (error) throw error;

    return NextResponse.json({ quiz: data[0] }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
