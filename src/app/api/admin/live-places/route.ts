import { NextResponse } from 'next/server';
import { readStatus } from '@/lib/statusDb';

let mockLivePlaces = [
  { id: 'uuid-1', name: 'Tirumala Venkateswara Temple', time: '2-3', crowd: 'EXTREME', parking: 'FULL', updated: '2 mins ago' },
  { id: 'uuid-2', name: 'Kapila Theertham', time: '1', crowd: 'HIGH', parking: 'AVAILABLE', updated: '15 mins ago' },
  { id: 'uuid-3', name: 'Sri Govindaraja Swamy Temple', time: '0.5', crowd: 'MEDIUM', parking: 'AVAILABLE', updated: '1 hour ago' },
];

export async function GET() {
  const globalStatus = await readStatus();
  
  // Sync the mock array with the true global status for Tirumala so it's accurate on load
  mockLivePlaces = mockLivePlaces.map(place => {
    if (place.id === 'uuid-1') {
      return {
        ...place,
        time: globalStatus.waitTime,
        crowd: globalStatus.crowdLevel.toUpperCase(),
        parking: globalStatus.accommodationStatus === 'full' ? 'FULL' : 'AVAILABLE'
      };
    }
    return place;
  });

  return NextResponse.json({ places: mockLivePlaces });
}

export async function POST(req: Request) {
  try {
    const { id, updates } = await req.json();
    mockLivePlaces = mockLivePlaces.map(place => {
      if (place.id === id) {
        return {
          ...place,
          ...updates,
          updated: 'Just now'
        };
      }
      return place;
    });
    return NextResponse.json({ success: true, places: mockLivePlaces });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
