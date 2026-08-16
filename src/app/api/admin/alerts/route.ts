import { NextResponse } from 'next/server';
import { fetchLiveAlerts, saveLiveAlert, deleteLiveAlert } from '@/lib/alertsStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const alerts = await fetchLiveAlerts(true);
    return NextResponse.json({ alerts });
  } catch (e: any) {
    return NextResponse.json({ alerts: [] });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const alert = await saveLiveAlert(data);
    return NextResponse.json(alert, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await deleteLiveAlert(id);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
