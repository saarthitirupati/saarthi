import { NextResponse } from 'next/server';

export const revalidate = 600; // cache 10 minutes

export async function GET() {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=13.6288&longitude=79.4192&current=temperature_2m,weather_code',
      { signal: AbortSignal.timeout(1000), next: { revalidate: 600 } }
    );
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (_err: any) {
    return NextResponse.json({
      current: {
        temperature_2m: 26,
        weather_code: 1
      },
      fallback: true
    });
  }
}
