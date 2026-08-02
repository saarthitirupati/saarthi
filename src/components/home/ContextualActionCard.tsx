import React from 'react';
import Link from 'next/link';
import { Footprints, Sun, Sunset, Moon } from 'lucide-react';

export function ContextualActionCard({ liveStatus }: { liveStatus: any }) {
  if (!liveStatus) return null;

  const hr = new Date().getHours();
  const isMorning = hr >= 5 && hr < 12;
  const isAfternoon = hr >= 12 && hr < 17;
  const isEvening = hr >= 17 && hr < 21;
  const isNight = hr >= 21 || hr < 5;

  let message = '';
  let link = '/explore';
  let IconComponent = Footprints;
  let iconColor = '#166534';
  
  if (isMorning) {
    message = 'Best time to start Alipiri Mettu';
    link = '/place/srivari-mettu-path';
    IconComponent = Footprints;
    iconColor = '#166534';
  } else if (isAfternoon) {
    message = 'Crowd is heavy. Visit Kapila Theertham first.';
    link = '/place/kapila-theertham';
    IconComponent = Sun;
    iconColor = '#D97706';
  } else if (isEvening) {
    message = 'Perfect time for Govindaraja Swamy Temple.';
    link = '/place/govindaraja';
    IconComponent = Sunset;
    iconColor = '#C2410C';
  } else if (isNight) {
    message = 'Prepare for tomorrow\'s darshan.';
    link = '/essentials';
    IconComponent = Moon;
    iconColor = '#4338CA';
  }

  return (
    <div style={{ padding: '0 16px', marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Recommended
        </span>
        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: '#F0FDF4',
        border: '1px solid #BBF7D0',
        borderRadius: '16px',
        padding: '12px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <IconComponent size={18} color={iconColor} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>
            {message}
          </span>
        </div>
        <Link href={link} style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: '#166534',
          color: '#FFF',
          padding: '6px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 700,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          marginLeft: '12px'
        }}>
          View Plan
        </Link>
      </div>
    </div>
  );
}
