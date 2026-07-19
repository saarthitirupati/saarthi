import { NextResponse } from 'next/server';
import { getLiveUpdates, getDarshanTypes, getAlerts } from '@/lib/db';
import { ApiResponse } from '@/types/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'tirupati';
    
    const [updates, darshans, alerts] = await Promise.all([
      getLiveUpdates(city),
      getDarshanTypes(city),
      getAlerts(city)
    ]);
    
    const response: ApiResponse<any> = {
      success: true,
      data: { updates, darshans, alerts }
    };
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('API Error (/api/v1/live):', error);
    const response: ApiResponse<null> = {
      success: false,
      data: null,
      error: 'Failed to fetch live updates'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
