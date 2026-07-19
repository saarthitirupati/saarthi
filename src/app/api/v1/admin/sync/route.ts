import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ success: false, error: 'Deprecated in Stage 1: Static data syncing removed.' }, { status: 410 });
}
