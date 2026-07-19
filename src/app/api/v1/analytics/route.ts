import { NextResponse } from 'next/server';
import { logEvent } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, placeId, metadata } = body;
    
    if (!action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    await logEvent(action, placeId, metadata);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
