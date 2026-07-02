import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CloudSun, Users, CalendarHeart, AlertTriangle } from 'lucide-react';
import styles from './QuickGlance.module.css';
import { useRealtimeStatus } from '@/lib/useRealtimeStatus';
import { useTrip } from '@/components/TripContext';
import { TIRUPATI_CENTER } from '@/utils/location';

export default function QuickGlance() {
  const { status } = useRealtimeStatus();
  const { userLocation } = useTrip();
  const [weather, setWeather] = useState('...');
  
  useEffect(() => {
    // Fetch live weather based on user location or fallback to Tirupati
    const lat = userLocation?.lat || TIRUPATI_CENTER.lat;
    const lng = userLocation?.lng || TIRUPATI_CENTER.lng;
    
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m`)
      .then(res => res.json())
      .then(data => {
        if (data.current?.temperature_2m) {
          setWeather(`${Math.round(data.current.temperature_2m)}°C`);
        }
      })
      .catch(console.error);
  }, [userLocation]);

  const items = [
    {
      id: 'crowd',
      icon: <Users size={18} color="#10B981" />,
      title: 'Tirumala Crowd',
      value: status?.waitTime ? `${status.waitTime} wait` : 'Loading...',
      statusColor: '#10B981',
      bg: 'rgba(16, 185, 129, 0.1)',
      href: '#live-status'
    },
    {
      id: 'weather',
      icon: <CloudSun size={18} color="#F59E0B" />,
      title: 'Weather',
      value: weather,
      statusColor: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.1)',
      href: '/weather'
    },
    {
      id: 'festivals',
      icon: <CalendarHeart size={18} color="#EC4899" />,
      title: 'Festivals Today',
      value: '2 Events',
      statusColor: '#EC4899',
      bg: 'rgba(236, 72, 153, 0.1)',
      href: '/festivals'
    },
    {
      id: 'alerts',
      icon: <AlertTriangle size={18} color="#EF4444" />,
      title: 'Temple Alerts',
      value: status?.notice ? '1 Update' : 'No Alerts',
      statusColor: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      href: '/alerts'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={item.href} className={styles.card}>
              <div className={styles.iconBox} style={{ background: item.bg }}>
                {item.icon}
              </div>
              <div className={styles.info}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.value} style={{ color: item.statusColor }}>
                  {item.value}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
