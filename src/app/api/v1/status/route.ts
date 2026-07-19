import { NextResponse } from 'next/server';
import { readStatus } from '@/lib/statusDb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await readStatus();
    return NextResponse.json(status, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (e: any) {
    console.error('Failed to fetch status:', e);
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}

