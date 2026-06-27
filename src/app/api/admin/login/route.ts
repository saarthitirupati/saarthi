import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const EMAIL    = 'admin@jeevapath.in';
const PASSWORD = 'Admin@2024';
const TOKEN    = 'jeevapath_admin_2024';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (email === EMAIL && password === PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('admin_token', TOKEN, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 24h
      sameSite: 'strict',
    });
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set('admin_token', '', { maxAge: 0, path: '/' });
  return NextResponse.json({ ok: true });
}
