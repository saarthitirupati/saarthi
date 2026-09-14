import { NextResponse } from 'next/server';
import { fetchLiveAlerts, saveLiveAlert, deleteLiveAlert } from '@/lib/alertsStore';
import { isAuthorizedAdmin } from '@/lib/authGuard';
import { pushNotifyAll } from '@/lib/pushNotify';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const alerts = await fetchLiveAlerts(true);
    return NextResponse.json({ alerts });
  } catch (e: any) {
    return NextResponse.json({ alerts: [] });
  }
}

export async function POST(req: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }
    const data = await req.json();
    const alert = await saveLiveAlert(data);

    const alertBody = alert.description || (alert as any).message;
    if (alert && (alert.status === 'Published' || (alert as any).active) && alertBody) {
      pushNotifyAll({
        title: alert.title ? `🚨 ${alert.title}` : '🚨 Tirumala Operational Alert',
        body: alertBody,
        url: '/live',
        tag: `alert-${alert.id || 'live'}`
      }).catch((err) => {
        console.error('[PushNotify] Error broadcasting emergency alert:', err);
      });
    }

    return NextResponse.json(alert, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await deleteLiveAlert(id);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
