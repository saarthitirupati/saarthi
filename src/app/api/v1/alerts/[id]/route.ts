import { NextResponse } from 'next/server';
import { deleteLiveAlert } from '@/lib/alertsStore';

import { isAuthorizedAdmin } from '@/lib/authGuard';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthed = await isAuthorizedAdmin(request);
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Missing alert ID' }, { status: 400 });

    await deleteLiveAlert(id);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete alert' }, { status: 500 });
  }
}
