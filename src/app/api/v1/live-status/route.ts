import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

let cachedWeather: { temp: number; condition: string; timestamp: number } = {
  temp: 26,
  condition: 'Pleasant',
  timestamp: Date.now()
};

async function getWeatherFast(): Promise<{ temp: number; condition: string }> {
  const now = Date.now();
  if ((now - cachedWeather.timestamp) < 300000) {
    return { temp: cachedWeather.temp, condition: cachedWeather.condition };
  }

  try {
    const weatherRes = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=13.6288&longitude=79.4192&current=temperature_2m,weather_code',
      { signal: AbortSignal.timeout(400), next: { revalidate: 300 } }
    );
    if (weatherRes.ok) {
      const data = await weatherRes.json();
      if (data?.current) {
        const temp = Math.round(data.current.temperature_2m ?? 26);
        const code = data.current.weather_code ?? 0;
        let condition = 'Pleasant';
        if (code >= 1 && code <= 3) condition = 'Partly Cloudy';
        else if (code >= 51 && code <= 82) condition = 'Rainy';
        cachedWeather = { temp, condition, timestamp: now };
        return { temp, condition };
      }
    }
  } catch {
    // Return cached weather immediately on timeout/network failure
  }

  return { temp: cachedWeather.temp, condition: cachedWeather.condition };
}

async function fetchMetrics() {
  try {
    const promise = supabase.from('live_metrics').select('*').eq('id', 1).single();
    const timeoutPromise = new Promise<{ data: null }>((resolve) => setTimeout(() => resolve({ data: null }), 1500));
    const res = await Promise.race([promise, timeoutPromise]);
    return res.data;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    // Execute Supabase query & Weather fetch concurrently
    const [metrics, weather] = await Promise.all([
      fetchMetrics(),
      getWeatherFast()
    ]);

    const liveStatus = {
      location: 'Tirupati',
      crowd: {
        location: 'Tirumala',
        waitMinutes: metrics?.crowd_wait_minutes || 45,
        status: metrics?.crowd_level || (metrics?.crowd_wait_minutes > 60 ? 'High' : 'Moderate'),
        sarvaDarshan: metrics?.sarva_darshan_wait || '16-20 hours',
        specialEntry: metrics?.special_entry_wait || '3-5 hours',
        divyaDarshan: metrics?.divya_darshan_wait || '1-1.5 hours',
        ssdTokens: metrics?.srivani_darshan_wait || 'Time slot based'
      },
      weather: {
        temperatureCelsius: weather.temp,
        condition: weather.condition
      },
      transit: {
        nextRtcBusMinutes: metrics?.next_bus_minutes || 12,
        route: 'Tirupati → Tirumala'
      },
      parking: {
        status: metrics?.parking_status || 'Available',
        location: metrics?.parking_location || 'Near Alipiri'
      },
      templeAlerts: [
        { id: 1, message: 'Special entry darshan queue is moving faster than expected.' }
      ],
      festivalsToday: 2,
      nearbyPlacesCount: 12
    };

    return NextResponse.json(liveStatus);
  } catch {
    return NextResponse.json({
      location: 'Tirupati',
      crowd: {
        location: 'Tirumala',
        waitMinutes: 45,
        status: 'Moderate',
        sarvaDarshan: '16-20 hours',
        specialEntry: '3-5 hours',
        divyaDarshan: '1-1.5 hours',
        ssdTokens: 'Time slot based'
      },
      weather: {
        temperatureCelsius: 26,
        condition: 'Pleasant'
      },
      transit: {
        nextRtcBusMinutes: 12,
        route: 'Tirupati → Tirumala'
      },
      parking: {
        status: 'Available',
        location: 'Near Alipiri'
      },
      templeAlerts: [
        { id: 1, message: 'Special entry darshan queue is moving faster than expected.' }
      ],
      festivalsToday: 2,
      nearbyPlacesCount: 12
    });
  }
}
