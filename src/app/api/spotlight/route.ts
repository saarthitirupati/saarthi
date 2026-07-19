import { NextResponse } from 'next/server';
import { readStatus } from '@/lib/statusDb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await readStatus();
    
    // Parse wait time hours
    const match = status.waitTime.match(/(\d+)/);
    const hours = match ? parseInt(match[1], 10) : 3;

    let spotlight = {
      type: 'today_suggestion',
      title: 'Visit Kapila Theertham',
      subtitle: 'Sacred Waterfalls & Shrines',
      description: 'Ideal time to explore. The crowd is light and weather is pleasant for outdoor sightseeing.',
      actionText: 'Explore Temple',
      actionLink: '/place/kapila-theertham',
      color: 'orange'
    };

    if (hours >= 8) {
      spotlight = {
        type: 'crowd_alert',
        title: 'Heavy Tirumala Rush',
        subtitle: `Wait time is currently ${status.waitTime}`,
        description: 'Bypass the peak hours. Explore ancient heritage sites in Tirupati town first to avoid long queues.',
        actionText: 'See Nearby Temples',
        actionLink: '/explore',
        color: 'red'
      };
    } else if (status.accommodationStatus === 'full') {
      spotlight = {
        type: 'accommodation_alert',
        title: 'Tirumala Parking Full',
        subtitle: 'Limited local availability',
        description: 'TTD parking slots are currently filled up. Consider taking a local RTC bus from Tirupati central bus stand.',
        actionText: 'Transit Details',
        actionLink: '/essentials',
        color: 'purple'
      };
    } else if (/rain/i.test(status.weather)) {
      spotlight = {
        type: 'weather_status',
        title: 'Light Showers Expected',
        subtitle: 'Umbrellas recommended',
        description: 'Ghat roads are slippery but open. Keep tracking live road warnings in Saarthi.',
        actionText: 'View Transit Tips',
        actionLink: '/essentials',
        color: 'sky'
      };
    }

    return NextResponse.json({ spotlight });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
