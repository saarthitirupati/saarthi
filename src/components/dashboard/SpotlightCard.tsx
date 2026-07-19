'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, MapPin, CloudSun, Calendar, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import { useTrip } from '@/components/TripContext';

export default function SpotlightCard() {
  const [spotlight, setSpotlight] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { userLocation } = useTrip();
  const router = useRouter();

  useEffect(() => {
    const fetchSpotlight = async () => {
      let url = '/api/spotlight';
      if (userLocation) {
        url += `?lat=${userLocation.lat}&lng=${userLocation.lng}`;
      }
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.spotlight) setSpotlight(data.spotlight);
      } catch (err) {
        console.error('Failed to fetch Spotlight:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotlight();
    const interval = setInterval(fetchSpotlight, 10000);
    return () => clearInterval(interval);
  }, [userLocation]);

  if (loading || !spotlight) {
    return (
      <div style={{
        background: '#f5f5f4', borderRadius: '20px', height: '160px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid #e7e5e4', animation: 'pulse 1.5s infinite ease-in-out'
      }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e7e5e4' }} />
      </div>
    );
  }

  const themes: Record<string, {
    gradient: string; iconBg: string; btnBg: string; btnColor: string;
    subText: string; icon: React.ReactNode;
  }> = {
    red: {
      gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      iconBg: 'rgba(255,255,255,0.15)', btnBg: '#ffffff', btnColor: '#dc2626',
      subText: 'rgba(255,255,255,0.85)',
      icon: <AlertTriangle size={22} color="#fff" />
    },
    orange: {
      gradient: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
      iconBg: 'rgba(255,255,255,0.15)', btnBg: '#ffffff', btnColor: '#ea580c',
      subText: 'rgba(255,255,255,0.85)',
      icon: <Calendar size={22} color="#fff" />
    },
    sky: {
      gradient: 'linear-gradient(135deg, #0284c7 0%, #3b82f6 100%)',
      iconBg: 'rgba(255,255,255,0.15)', btnBg: '#ffffff', btnColor: '#0284c7',
      subText: 'rgba(255,255,255,0.85)',
      icon: <CloudSun size={22} color="#fff" />
    },
    emerald: {
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      iconBg: 'rgba(255,255,255,0.15)', btnBg: '#ffffff', btnColor: '#059669',
      subText: 'rgba(255,255,255,0.85)',
      icon: <MapPin size={22} color="#fff" />
    },
    indigo: {
      gradient: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
      iconBg: 'rgba(255,255,255,0.15)', btnBg: '#ffffff', btnColor: '#4338ca',
      subText: 'rgba(255,255,255,0.85)',
      icon: <BookOpen size={22} color="#fff" />
    },
    purple: {
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)',
      iconBg: 'rgba(255,255,255,0.15)', btnBg: '#ffffff', btnColor: '#7c3aed',
      subText: 'rgba(255,255,255,0.85)',
      icon: <Sparkles size={22} color="#fff" />
    }
  };

  const theme = themes[spotlight.color] || themes.indigo;

  return (
    <div
      onClick={() => router.push(spotlight.actionLink)}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: '20px',
        background: theme.gradient, color: '#ffffff', padding: '24px',
        cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        transition: 'transform 0.2s ease'
      }}
    >
      {/* Background icon */}
      <div style={{
        position: 'absolute', top: '16px', right: '16px', opacity: 0.15,
        transform: 'scale(3)'
      }}>
        {theme.icon}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-block', padding: '4px 10px',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
          borderRadius: '8px', fontSize: '10px', fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px'
        }}>
          {spotlight.type.replace('_', ' ')}
        </div>

        <h3 style={{
          fontSize: '22px', fontWeight: 900, letterSpacing: '-0.03em',
          lineHeight: 1.15, marginBottom: '4px'
        }}>
          {spotlight.title}
        </h3>

        <p style={{
          fontSize: '15px', fontWeight: 600, color: theme.subText, marginBottom: '6px'
        }}>
          {spotlight.subtitle}
        </p>

        <p style={{
          fontSize: '13px', color: theme.subText, opacity: 0.9,
          marginBottom: '20px', maxWidth: '85%', lineHeight: 1.45
        }}>
          {spotlight.description}
        </p>

        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '10px 16px', borderRadius: '12px', fontSize: '13px',
          fontWeight: 800, background: theme.btnBg, color: theme.btnColor,
          border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease'
        }}>
          {spotlight.actionText} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
