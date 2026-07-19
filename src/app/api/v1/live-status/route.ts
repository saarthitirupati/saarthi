import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';



export async function GET() {
  try {
    // 1. Fetch live metrics from Supabase
    const { data: metrics, error } = await supabase
      .from('live_metrics')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (error) {
      console.error("Error fetching live_metrics:", error);
    }

    // 2. Fetch real-time weather from OpenWeatherMap for Tirupati
    let temp = 24;
    let condition = 'Partly Cloudy';
    try {
      // Tirupati coords: 13.6288, 79.4192
      const weatherRes = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=13.6288&lon=79.4192&appid=ab2b5b5caea6dd0bed58ece8c88a78fb&units=metric', { next: { revalidate: 300 } });
      if (weatherRes.ok) {
        const weatherData = await weatherRes.json();
        temp = Math.round(weatherData.main.temp);
        if (weatherData.weather && weatherData.weather.length > 0) {
          condition = weatherData.weather[0].description.replace(/\b\w/g, (l: string) => l.toUpperCase());
        }
      }
    } catch (e) {
      console.error("Weather fetch failed, using fallback:", e);
    }

    const liveStatus = {
      location: 'Tirupati',
      crowd: {
        location: 'Tirumala',
        waitMinutes: metrics?.crowd_wait_minutes || 45,
        status: metrics?.crowd_level || (metrics?.crowd_wait_minutes > 60 ? 'High' : 'Moderate'),
        sarvaDarshan: metrics?.sarva_darshan_wait || '16-20 hours',
        specialEntry: metrics?.special_entry_wait || '3-5 hours',
        divyaDarshan: metrics?.divya_darshan_wait || '1-1.5 hours',
        ssdTokens: metrics?.srivani_darshan_wait || 'Time slot based'},
      weather: {
        temperatureCelsius: temp,
        condition: condition},
      transit: {
        nextRtcBusMinutes: metrics?.next_bus_minutes || 12,
        route: 'Tirupati → Tirumala'},
      parking: {
        status: metrics?.parking_status || 'Available',
        location: metrics?.parking_location || 'Near Alipiri'},
      templeAlerts: [
        { id: 1, message: 'Special entry darshan queue is moving faster than expected.' }
      ],
      festivalsToday: 2,
      nearbyPlacesCount: 12};

    return NextResponse.json(liveStatus);
  } catch {
    return NextResponse.json({ error: 'Failed to load live status' }, { status: 500 });
  }
}
