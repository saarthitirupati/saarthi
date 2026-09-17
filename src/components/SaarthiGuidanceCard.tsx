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
  tertiaryPill?: GuidancePill;
  footerNote?: string;
  className?: string;
}

export default function SaarthiGuidanceCard({
  dayName,
  guidanceTitle,
  quote = '"In calm faith, seek Srivari"',
  primaryPill,
  secondaryPill,
  tertiaryPill,
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

  const defaultTertiaryPill: GuidancePill = {
    label: 'Optimal Time',
    title: 'Best Morning Hours',
    url: '/route'
  };

  const pPill = primaryPill || defaultPrimaryPill;
  const sPill = secondaryPill || defaultSecondaryPill;
  const tPill = tertiaryPill || defaultTertiaryPill;

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

      {/* Three Action Pills Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px', width: '100%' }}>
        {/* Card 1 (Gold / Sacred Shrine) */}
        <div 
          onClick={() => handlePillClick(pPill)}
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '12px',
            padding: '8px 4px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '2px',
            minWidth: 0,
            overflow: 'hidden',
            transition: 'transform 0.15s ease, border-color 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#D97706', fontSize: '9.5px', fontWeight: 800, minWidth: 0, maxWidth: '100%' }}>
            <Flame size={12} color="#D97706" style={{ flexShrink: 0 }} />
            <span style={{ color: '#B45309', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pPill.label}</span>
          </div>
          <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#78350F', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
            {pPill.title}
          </span>
        </div>

        {/* Card 2 (Soft Blue / Best Route) */}
        <div 
          onClick={() => handlePillClick(sPill)}
          style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '12px',
            padding: '8px 4px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '2px',
            minWidth: 0,
            overflow: 'hidden',
            transition: 'transform 0.15s ease, border-color 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#2563EB', fontSize: '9.5px', fontWeight: 800, minWidth: 0, maxWidth: '100%' }}>
            <Navigation size={12} color="#2563EB" style={{ flexShrink: 0 }} />
            <span style={{ color: '#1D4ED8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sPill.label}</span>
          </div>
          <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#1E40AF', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
            {sPill.title}
          </span>
        </div>

        {/* Card 3 (Soft Emerald / Optimal Time) */}
        <div 
          onClick={() => handlePillClick(tPill)}
          style={{
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: '12px',
            padding: '8px 4px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '2px',
            minWidth: 0,
            overflow: 'hidden',
            transition: 'transform 0.15s ease, border-color 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#059669', fontSize: '9.5px', fontWeight: 800, minWidth: 0, maxWidth: '100%' }}>
            <Sparkles size={12} color="#059669" style={{ flexShrink: 0 }} />
            <span style={{ color: '#047857', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tPill.label}</span>
          </div>
          <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#065F46', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
            {tPill.title}
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
