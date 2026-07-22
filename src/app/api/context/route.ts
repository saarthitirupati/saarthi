import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // In a real implementation, this would fetch live data from weather APIs, 
  // TTD APIs (for crowd), and local event databases.
  
  // For Stage 1 Beta, we return a mock context.
  // We can eventually parse query params to override this for testing.
  const { searchParams } = new URL(request.url);
  
  return NextResponse.json({
    weather: searchParams.get('weather') || 'Sunny',
    temp: parseInt(searchParams.get('temp') || '28', 10),
    crowdLevel: searchParams.get('crowdLevel') || 'MEDIUM',
    dayOfWeek: searchParams.get('dayOfWeek') || 'Monday',
    time: searchParams.get('time') || '10:00',
    festival: null, // e.g. "Vaikunta Ekadasi"
    location: {
      lat: parseFloat(searchParams.get('lat') || '13.6288'),
      lng: parseFloat(searchParams.get('lng') || '79.4192'),
      name: 'Railway Station' // Mocked nearby landmark
    }
  });
}
