'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Flame, Navigation } from 'lucide-react';

interface GuidancePill {
  label: string;
  title: string;
  url?: string;
  onClick?: () => void;
}

interface SaarthiGuidanceCardProps {
  dayName?: string;
  guidanceTitle?: string;
  quote?: string;
  primaryPill?: GuidancePill;
  secondaryPill?: GuidancePill;
  footerNote?: string;
  className?: string;
}

export default function SaarthiGuidanceCard({
  dayName,
  guidanceTitle,
  quote = '"In calm faith, seek Srivari"',
  primaryPill,
  secondaryPill,
  footerNote = 'Based on live queue data • Verified recently',
  className
}: SaarthiGuidanceCardProps) {
  const router = useRouter();

  // Dynamic day of week if not provided
  const currentDay = useMemo(() => {
    if (dayName) return dayName;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }, [dayName]);

  const defaultTitle = `${currentDay}: Visit Goddess Padmavathi at Tiruchanur first.`;
  const displayTitle = guidanceTitle || defaultTitle;

  const defaultPrimaryPill: GuidancePill = {
    label: 'Sacred Shrine',
    title: 'Sri Padmavathi Ammavari',
    url: '/place/padmavathi-temple'
  };

  const defaultSecondaryPill: GuidancePill = {
    label: 'Best Route',
    title: 'Local Shrines',
    url: '/explore'
  };

  const pPill = primaryPill || defaultPrimaryPill;
  const sPill = secondaryPill || defaultSecondaryPill;

  const handlePillClick = (pill: GuidancePill) => {
    if (pill.onClick) {
      pill.onClick();
    } else if (pill.url) {
      if (pill.url.startsWith('http')) {
        window.open(pill.url, '_blank', 'noopener,noreferrer');
      } else {
        router.push(pill.url);
      }
    }
  };

  return (
    <div 
      className={className}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1.5px solid #E2E8F0',
        borderRadius: '20px',
        padding: '16px 18px',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        margin: '12px 0'
      }}
    >
      {/* Top Row Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803D', fontWeight: 900, fontSize: '12px', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
          <Sparkles size={15} color="#15803D" />
          <span>SAARTHI GUIDANCE</span>
        </div>
        <span style={{ fontSize: '12px', fontStyle: 'italic', fontWeight: 600, color: '#92400E' }}>
          {quote}
        </span>
      </div>

      {/* Main Guidance Title */}
      <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.35, letterSpacing: '-0.01em' }}>
        {displayTitle}
      </h3>

      {/* Two Action Pills Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {/* Left Pill (Gold / Sacred Shrine) */}
        <div 
          onClick={() => handlePillClick(pPill)}
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '14px',
            padding: '10px 12px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            transition: 'transform 0.15s ease, border-color 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#D97706', fontSize: '11px', fontWeight: 800 }}>
            <Flame size={13} color="#D97706" />
            <span style={{ color: '#B45309' }}>{pPill.label}</span>
          </div>
          <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#78350F', lineHeight: 1.25 }}>
            {pPill.title}
          </span>
        </div>

        {/* Right Pill (Soft Blue / Best Route) */}
        <div 
          onClick={() => handlePillClick(sPill)}
          style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '14px',
            padding: '10px 12px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            transition: 'transform 0.15s ease, border-color 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563EB', fontSize: '11px', fontWeight: 800 }}>
            <Navigation size={13} color="#2563EB" />
            <span style={{ color: '#1D4ED8' }}>{sPill.label}</span>
          </div>
          <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#1E40AF', lineHeight: 1.25 }}>
            {sPill.title}
          </span>
        </div>
      </div>

      {/* Footer Meta Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: 600, color: '#64748B', paddingTop: '2px' }}>
        <Sparkles size={13} color="#15803D" />
        <span>{footerNote}</span>
      </div>
    </div>
  );
}
