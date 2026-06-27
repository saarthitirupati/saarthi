import { NextResponse } from 'next/server';
import { getTrafficSummary, readTraffic } from '@/lib/adminDb';

export async function GET() {
  const summary = getTrafficSummary();
  const entries = readTraffic();
  return NextResponse.json({ ...summary, entries });
}
