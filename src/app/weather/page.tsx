'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CloudSun,  Sun, Droplets, Wind, MapPin } from 'lucide-react';
import { useTrip } from '@/components/TripContext';
import { TIRUPATI_CENTER } from '@/utils/location';

export default function WeatherPage() {
  const router = useRouter();
  const { userLocation } = useTrip();
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lat = userLocation?.lat || TIRUPATI_CENTER.lat;
    const lng = userLocation?.lng || TIRUPATI_CENTER.lng;

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`)
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [userLocation]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F5', paddingBottom: 40, fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => router.back()} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
          <ChevronLeft size={28} color="#1F2937" />
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#1F2937' }}>Local Weather</h1>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>Loading live weather...</div>
      ) : weather ? (
        <div style={{ padding: '0 24px' }}>
          
          <div style={{ background: 'linear-gradient(135deg, #FFB75E 0%, #ED8F03 100%)', borderRadius: 24, padding: 32, color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 12px 30px rgba(237, 143, 3, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.9, marginBottom: 16 }}>
              <MapPin size={16} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>{userLocation ? 'Your Location' : 'Tirupati, AP'}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1 }}>
                  {Math.round(weather.current?.temperature_2m || 0)}°
                </div>
                <div style={{ fontSize: 16, marginTop: 8, opacity: 0.9 }}>
                  Feels like {Math.round(weather.current?.apparent_temperature || 0)}°
                </div>
              </div>
              <Sun size={80} color="white" style={{ opacity: 0.9 }} />
            </div>

            <div style={{ display: 'flex', gap: 24, marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Wind size={20} />
                <span style={{ fontSize: 14 }}>{weather.current?.wind_speed_10m} km/h</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Droplets size={20} />
                <span style={{ fontSize: 14 }}>{weather.current?.relative_humidity_2m}%</span>
              </div>
            </div>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 32, marginBottom: 16, color: '#1F2937' }}>7-Day Forecast</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {weather.daily?.time?.slice(0, 7).map((date: string, i: number) => (
              <div key={date} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '16px 20px', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#4B5563', width: 100 }}>
                  {i === 0 ? 'Today' : new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <CloudSun size={24} color="#F59E0B" />
                <div style={{ display: 'flex', gap: 16, fontWeight: 600 }}>
                  <span style={{ color: '#1F2937' }}>{Math.round(weather.daily.temperature_2m_max[i])}°</span>
                  <span style={{ color: '#9CA3AF' }}>{Math.round(weather.daily.temperature_2m_min[i])}°</span>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      ) : (
        <div style={{ padding: 40, textAlign: 'center', color: '#EF4444' }}>Failed to load weather data.</div>
      )}
    </div>
  );
}
