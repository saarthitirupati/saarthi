import { NextResponse } from 'next/server';
import { getFestivals } from '@/lib/db';
import { ApiResponse } from '@/types/api';
import { Festival, FESTIVALS_2026 } from '@/data/festivals';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'tirupati';
    const all = searchParams.get('all') === '1';
    
    let festivals: Festival[] = [];
    try {
      festivals = await getFestivals(city, all) as Festival[];
    } catch (e) {
      console.error('Supabase fetch failed, falling back to local festivals:', e);
    }
    
    if (!festivals || festivals.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      festivals = FESTIVALS_2026.filter(f => all || f.date >= today);
    }
    
    const response: ApiResponse<Festival[]> = {
      success: true,
      data: festivals
    };
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('API Error (/api/v1/festivals):', error);
    try {
      const { searchParams } = new URL(request.url);
      const all = searchParams.get('all') === '1';
      const today = new Date().toISOString().split('T')[0];
      const fallback = FESTIVALS_2026.filter(f => all || f.date >= today);
      return NextResponse.json({
        success: true,
        data: fallback
      });
    } catch {
      return NextResponse.json({
        success: false,
        data: [],
        error: 'Failed to fetch festivals'
      }, { status: 500 });
    }
  }
}
