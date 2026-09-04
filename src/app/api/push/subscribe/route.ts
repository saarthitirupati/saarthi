import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const sub = await req.json();
    if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    await supabase.from('push_subscriptions').upsert(
      {
        endpoint: sub.endpoint,
        keys_p256dh: sub.keys.p256dh,
        keys_auth: sub.keys.auth,
      },
      { onConflict: 'endpoint' }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { endpoint } = await req.json();
    if (endpoint) {
      await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
