import { NextResponse } from 'next/server';
import { readFuelRates } from '@/lib/statusDb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rates = readFuelRates();
    return NextResponse.json(rates, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch fuel rates' }, { status: 500 });
  }
}
