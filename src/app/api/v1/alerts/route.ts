import { NextResponse } from 'next/server';
import { fetchLiveAlerts, saveLiveAlert, deleteLiveAlert } from '@/lib/alertsStore';
import { isAuthorizedAdmin } from '@/lib/authGuard';
import { pushNotifyAll } from '@/lib/pushNotify';

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

    const shouldSendPush = body.sendPush !== false;
    if (shouldSendPush && createdAlert && (createdAlert.status === 'Published' || (createdAlert as any).active)) {
      try {
        await pushNotifyAll({
          title: createdAlert.title ? createdAlert.title : 'Tirumala Operational Alert',
          body: createdAlert.description || (createdAlert as any).message || '',
          url: '/alerts',
          tag: `alert-${createdAlert.id || 'live'}`,
          target_location: createdAlert.target_location || 'All Users',
          category: createdAlert.category,
          image: createdAlert.image || undefined
        });
      } catch (err) {
        console.error('[PushNotify] Error broadcasting live alert:', err);
      }
    }

    return NextResponse.json(createdAlert, { status: 201 });
  } catch (error: any) {
    console.error('API Error (/api/v1/alerts POST):', error);
    return NextResponse.json({ error: error?.message || 'Failed to create alert' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const isAuthed = await isAuthorizedAdmin(request);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Missing alert ID' }, { status: 400 });
    }

    const updatedAlert = await saveLiveAlert(body);

    const shouldSendPush = body.sendPush === true;
    if (shouldSendPush && updatedAlert && (updatedAlert.status === 'Published' || (updatedAlert as any).active)) {
      try {
        await pushNotifyAll({
          title: updatedAlert.title ? updatedAlert.title : 'Tirumala Operational Alert',
          body: updatedAlert.description || (updatedAlert as any).message || '',
          url: '/alerts',
          tag: `alert-${updatedAlert.id || 'live'}`,
          target_location: updatedAlert.target_location || 'All Users',
          category: updatedAlert.category,
          image: updatedAlert.image || undefined
        });
      } catch (err) {
        console.error('[PushNotify] Error broadcasting updated alert:', err);
      }
    }

    return NextResponse.json(updatedAlert, { status: 200 });
  } catch (error: any) {
    console.error('API Error (/api/v1/alerts PUT):', error);
    return NextResponse.json({ error: error?.message || 'Failed to update alert' }, { status: 400 });
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
