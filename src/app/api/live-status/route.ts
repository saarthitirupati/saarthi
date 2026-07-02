import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to map WMO weather codes to human-readable strings
function getWeatherCondition(code: number) {
  if (code === 0) return 'Clear Sky';
  if (code >= 1 && code <= 3) return 'Partly Cloudy';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 67) return 'Rainy';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Clear Sky';
}

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

    // 2. Fetch real-time weather from Open-Meteo for Tirupati
    let temp = 24;
    let condition = 'Partly Cloudy';
    try {
      // Tirupati coords: 13.6288, 79.4192
      const weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=13.6288&longitude=79.4192&current=temperature_2m,weather_code', { next: { revalidate: 300 } });
      if (weatherRes.ok) {
        const weatherData = await weatherRes.json();
        temp = Math.round(weatherData.current.temperature_2m);
        condition = getWeatherCondition(weatherData.current.weather_code);
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
