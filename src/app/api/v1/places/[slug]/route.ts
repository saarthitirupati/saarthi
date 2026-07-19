import { NextResponse } from 'next/server';
import { getPlaceBySlug } from '@/lib/db';
import { ApiResponse } from '@/types/api';
import { Place } from '@/types/place';

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const place = await getPlaceBySlug(params.slug) as Place | null;
    if (!place) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: 'Place not found'
      };
      return NextResponse.json(response, { status: 404 });
    }
    const response: ApiResponse<Place> = {
      success: true,
      data: place
    };
    return NextResponse.json(response);
  } catch (error: any) {
    console.error(`API Error (/api/v1/places/${params.slug}):`, error);
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: 'Failed to fetch place'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
