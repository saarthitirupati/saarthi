import { NextResponse } from 'next/server';
import { readStatus, updateStatus } from '@/lib/statusDb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await readStatus();
    return NextResponse.json(status);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updated = await updateStatus(body);
    return NextResponse.json(updated);
  } catch (e: any) {
    console.error('Error updating status in admin API:', e);
    return NextResponse.json({ error: e.message || 'Failed to update status' }, { status: 400 });
  }
}

