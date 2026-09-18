import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

let cachedWeather: { temp: number; condition: string; timestamp: number } | null = null;

async function getWeatherFast(): Promise<{ temp: number; condition: string }> {
  const now = Date.now();
  if (cachedWeather && (now - cachedWeather.timestamp) < 300000) {
    return { temp: cachedWeather.temp, condition: cachedWeather.condition };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 600);

  try {
    const weatherRes = await fetch(
      'https://api.openweathermap.org/data/2.5/weather?lat=13.6288&lon=79.4192&appid=ab2b5b5caea6dd0bed58ece8c88a78fb&units=metric',
      { signal: controller.signal, next: { revalidate: 300 } }
    );
    clearTimeout(timeoutId);

    if (weatherRes.ok) {
      const weatherData = await weatherRes.json();
      const temp = Math.round(weatherData.main?.temp ?? 26);
      let condition = 'Pleasant';
      if (weatherData.weather && weatherData.weather.length > 0) {
        condition = weatherData.weather[0].description.replace(/\b\w/g, (l: string) => l.toUpperCase());
      }
      cachedWeather = { temp, condition, timestamp: now };
      return { temp, condition };
    }
  } catch {
    clearTimeout(timeoutId);
  }

  return cachedWeather ? { temp: cachedWeather.temp, condition: cachedWeather.condition } : { temp: 26, condition: 'Pleasant' };
}

async function fetchMetrics() {
  try {
    const { data } = await supabase.from('live_metrics').select('*').eq('id', 1).single();
    return data;
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
