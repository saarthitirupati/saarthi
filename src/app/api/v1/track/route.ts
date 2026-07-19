import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { path } = await req.json();
    if (path) {
      // Upsert: Insert new row or increment count if path+date exists
      const date = new Date().toISOString().split('T')[0];
      
      // We can do this in two steps since we don't have an RPC function:
      // First try to get the existing row
      const { data } = await supabase
        .from('page_views')
        .select('id, count')
        .eq('path', path)
        .eq('date', date)
        .single();
        
      if (data) {
        await supabase
          .from('page_views')
          .update({ count: data.count + 1 })
          .eq('id', data.id);
      } else {
        await supabase
          .from('page_views')
          .insert([{ path, date, count: 1 }]);
      }
    }
  } catch (err) {
    console.error('Tracking error:', err);
  }
  return NextResponse.json({ ok: true });
}

