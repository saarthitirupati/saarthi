import { NextResponse } from 'next/server';
import { getPlaceBySlug } from '@/lib/db';
import { ApiResponse } from '@/types/api';
import { Place } from '@/types/place';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/places/${params.slug}`, {
      next: { revalidate: 60 }
    });
    
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return NextResponse.json({
          success: true,
          data: json.data
        });
      }
    }
    
    if (res.status === 404) {
      return NextResponse.json({
        success: false,
        data: null,
        error: 'Place not found'
      }, { status: 404 });
    }
    
    throw new Error('Backend failed');
  } catch (error: any) {
    console.warn(`FastAPI backend failed for place ${params.slug}, falling back to database/static:`, error.message || error);
    try {
      const place = await getPlaceBySlug(params.slug) as Place | null;
      if (!place) {
        return NextResponse.json({
          success: false,
          data: null,
          error: 'Place not found'
        }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: place
      });
    } catch (fallbackError: any) {
      console.error('Fallback failed:', fallbackError);
      return NextResponse.json({
        success: false,
        data: null,
        error: 'Failed to fetch place'
      }, { status: 500 });
    }
  }
}
