import { NextResponse } from 'next/server';
import { getPlaces, getPlacesByCategory } from '@/lib/db';
import { ApiResponse } from '@/types/api';
import { Place } from '@/types/place';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'tirupati';
    const category = searchParams.get('category');
    
    let places: Place[];
    if (category) {
      places = await getPlacesByCategory(category) as Place[];
    } else {
      places = await getPlaces(city) as Place[];
    }
    
    const response: ApiResponse<Place[]> = {
      success: true,
      data: places,
    };
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('API Error (/api/v1/places):', error);
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: 'Failed to fetch places',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
