import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const EMAIL    = process.env.ADMIN_EMAIL || 'admin@saarthiguide.in';
const PASSWORD = process.env.ADMIN_PASSWORD || 'Saarthi@2026';
const TOKEN    = 'saarthi_admin_token_2026';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (email === EMAIL && password === PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('admin_token', TOKEN, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 24h
      sameSite: 'lax',
    });
    return NextResponse.json({ ok: true, token: TOKEN });
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set('admin_token', '', { maxAge: 0, path: '/' });
  return NextResponse.json({ ok: true });
}
