import { useState, useEffect, useMemo } from 'react';
import { useRealtimeStatus } from '@/lib/useRealtimeStatus';

const FALLBACK_STATUS = {
  waitTime: '2-3 hours',
  crowdLevel: 'moderate' as const,
  sevaStatus: 'All sevas open',
  notice: '',
  lastUpdated: new Date().toISOString(),
  darshanSpeed: 'normal' as const,
  accommodationStatus: 'available' as const,
  ladduAvailability: 'available' as const,
  weather: 'Pleasant, 24°C',
  darshans: [
    { name: 'Sarva Darshan (Free)', waitTime: '12-15 hours', peakHours: 'Daily 10 AM - 6 PM' },
    { name: 'Special Entry (₹300)', waitTime: '3-4 hours', peakHours: 'Daily 9 AM - 3 PM' },
    { name: 'Divya Darshan (Footpath)', waitTime: '8-10 hours', peakHours: 'Daily 8 AM - 4 PM' },
    { name: 'VIP / Srivani Break', waitTime: '1.5 hours', peakHours: 'Daily 6 AM - 8 AM' }
  ],
  ssdTokenStatus: 'issuing' as const,
  ssdNextTokenTime: '2:00 PM',
  ssdTokenSlots: [
    { slotTime: '5:00 AM - 7:00 AM', status: 'closed' as const, tokensLeft: 'Full' },
    { slotTime: '7:00 AM - 9:00 AM', status: 'closed' as const, tokensLeft: 'Full' },
    { slotTime: '9:00 AM - 11:00 AM', status: 'filling' as const, tokensLeft: '~200 remaining' },
    { slotTime: '11:00 AM - 1:00 PM', status: 'available' as const, tokensLeft: 'Available' },
    { slotTime: '2:00 PM - 4:00 PM', status: 'available' as const, tokensLeft: 'Available' },
    { slotTime: '4:00 PM - 6:00 PM', status: 'available' as const, tokensLeft: 'Available' },
  ],
  ssdNotice: '',
  ssdTimingsGuide: 'Offline free SSD tokens are released daily starting at 3:00 AM / 4:00 AM. Batches are allocated hourly for that day\'s Darshan. Counters close as soon as the daily quota runs out (~15,000 - 20,000 tokens).',
  ssdCounters: [
    { name: 'Vishnu Nivasam Counter', description: 'Located opposite Tirupati Railway Station' },
    { name: 'Srinivasam Complex Counter', description: 'Located opposite Tirupati RTC Central Bus Stand' },
    { name: 'Bhudevi Complex Counter', description: 'Located near Alipiri Footpath Link Road' },
  ]
};

export function useLiveStatus() {
  const { status: rawLiveStatus } = useRealtimeStatus();
  const [realtimeWeather, setRealtimeWeather] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/weather')
      .then(res => res.json())
      .then(data => {
        if (data?.current) {
          const temp = Math.round(data.current.temperature_2m);
          const code = data.current.weather_code;
          let cond = 'Clear Sky';
          if (code >= 1 && code <= 3) cond = 'Partly Cloudy';
          else if (code === 45 || code === 48) cond = 'Foggy';
          else if (code >= 51 && code <= 67) cond = 'Rainy';
          else if (code >= 80 && code <= 82) cond = 'Rain Showers';
          else if (code >= 95 && code <= 99) cond = 'Thunderstorm';
          setRealtimeWeather(`${cond}, ${temp}°C`);
        }
      })
      .catch(console.error);
  }, []);

  const liveStatus = useMemo(() => {
    const base = rawLiveStatus || FALLBACK_STATUS;
    if (realtimeWeather) {
      return { ...base, weather: realtimeWeather };
    }
    return base;
  }, [rawLiveStatus, realtimeWeather]);

  const formattedWaitTime = useMemo(() => {
    if (!liveStatus) return '2-3 hours';
    const val = liveStatus.waitTime;
    if (!val) return '2-3 hours';
    const clean = val.trim();
    if (/^\d+$/.test(clean)) {
      const num = parseInt(clean, 10);
      return `${num} ${num === 1 ? 'hour' : 'hours'}`;
    }
    return clean;
  }, [liveStatus]);

  const weatherTemp = useMemo(() => {
    if (!liveStatus?.weather) return '27°C';
    const match = liveStatus.weather.match(/(\d+°C|\d+)/);
    if (match) {
      return match[0].includes('°C') ? match[0] : `${match[0]}°C`;
    }
    return '27°C';
  }, [liveStatus]);

  return { liveStatus, formattedWaitTime, weatherTemp };
}
