import { NextResponse } from 'next/server';

let mockAlerts = [
  {
    id: '1',
    title: 'Ghat Road Closed Temporarily',
    message: 'Due to heavy rain, the up ghat road is closed until 2:00 PM today. Please wait at Alipiri.',
    type: 'emergency',
    location: 'Tirumala',
    active: true,
    createdAt: new Date().toISOString()
  }
];

export async function GET() {
  return NextResponse.json({ alerts: mockAlerts });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newAlert = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    mockAlerts.push(newAlert);
    return NextResponse.json(newAlert);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    mockAlerts = mockAlerts.filter(a => a.id !== id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
