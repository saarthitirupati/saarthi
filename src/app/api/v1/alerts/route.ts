import { NextResponse } from 'next/server';
import { fetchLiveAlerts, saveLiveAlert, deleteLiveAlert } from '@/lib/alertsStore';

import { isAuthorizedAdmin } from '@/lib/authGuard';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';
    const alerts = await fetchLiveAlerts(showAll);
    return NextResponse.json(alerts);
  } catch (error: any) {
    console.error('API Error (/api/v1/alerts GET):', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(request);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const body = await request.json();
    const createdAlert = await saveLiveAlert(body);
    return NextResponse.json(createdAlert, { status: 201 });
  } catch (error: any) {
    console.error('API Error (/api/v1/alerts POST):', error);
    return NextResponse.json({ error: error?.message || 'Failed to create alert' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(request);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing alert ID' }, { status: 400 });

    await deleteLiveAlert(id);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete alert' }, { status: 500 });
  }
}
