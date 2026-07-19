import { NextResponse } from 'next/server';
import { readFuelRates, updateFuelRates } from '@/lib/statusDb';

export async function GET() {
  const rates = readFuelRates();
  return NextResponse.json(rates);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { petrol, diesel } = body;
    if (typeof petrol !== 'number' || typeof diesel !== 'number') {
      return NextResponse.json({ error: 'Invalid fuel rates. Must be numbers.' }, { status: 400 });
    }
    const updated = updateFuelRates({ petrol, diesel });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
