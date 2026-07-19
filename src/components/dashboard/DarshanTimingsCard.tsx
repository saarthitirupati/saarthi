'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Clock, Bell, Ticket, Footprints, Sparkles, Coins } from 'lucide-react';

export default function DarshanTimingsCard() {
  const [status, setStatus] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');

  useEffect(() => {
    const fetchStatus = () => {
      fetch('/api/v1/status')
        .then(res => res.json())
        .then(data => {
          setStatus(data);
          setLastUpdated('Just now');
        })
        .catch(err => console.error(err));
    };

    fetchStatus();
    const pollTimer = setInterval(fetchStatus, 15000);
    const timer = setInterval(() => {
      setLastUpdated(prev => {
        if (prev === 'Just now') return '1 min ago';
        const match = prev.match(/(\d+)/);
        if (match) return `${parseInt(match[1], 10) + 1} mins ago`;
        return prev;
      });
    }, 60000);

    return () => { clearInterval(pollTimer); clearInterval(timer); };
  }, []);

  if (!status) return (
    <div style={{
      background: '#fff', borderRadius: '20px', padding: '24px',
      border: '1px solid #e7e5e4', display: 'flex', flexDirection: 'column', gap: '16px'
    }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          height: '72px', background: '#f5f5f4', borderRadius: '16px',
          animation: 'pulse 1.5s infinite ease-in-out'
        }} />
      ))}
    </div>
  );

  const parseWaitHours = (timeStr: string) => {
    if (!timeStr) return 99;
    const match = timeStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 99;
  };

  const getStatusColor = (hours: number) => {
    if (hours <= 2) return { text: '#059669', dot: '#10b981', bg: '#ecfdf5' };
    if (hours <= 5) return { text: '#d97706', dot: '#f59e0b', bg: '#fffbeb' };
    if (hours <= 10) return { text: '#ea580c', dot: '#f97316', bg: '#fff7ed' };
    return { text: '#dc2626', dot: '#ef4444', bg: '#fef2f2' };
  };

  const darshans = status?.darshans || [];

  const mapNameToId = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('sarva')) return 'sarva-darshan';
    if (lower.includes('300') || lower.includes('special')) return 'special-entry';
    if (lower.includes('footpath') || lower.includes('divya')) return 'divya-darshan';
    if (lower.includes('vip') || lower.includes('srivani')) return 'vip-break';
    return 'sarva-darshan';
  };

  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('300') || lower.includes('special')) return Ticket;
    if (lower.includes('footpath') || lower.includes('divya')) return Footprints;
    if (lower.includes('vip') || lower.includes('srivani')) return Sparkles;
    return Coins;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{
            fontSize: '18px', fontWeight: 800, color: '#1c1917',
            letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px', margin: 0
          }}>
            <Clock size={20} style={{ color: '#14532D' }} /> Darshan Timings
          </h2>
          <p style={{ color: '#78716c', fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>
            Today&apos;s estimated waiting times
          </p>
        </div>
      </div>

      {/* Notice */}
      {status.notice && (
        <div style={{
          background: '#fff7ed', border: '1px solid #fed7aa',
          color: '#9a3412', padding: '12px 14px', borderRadius: '14px',
          fontSize: '13px', fontWeight: 700, display: 'flex', gap: '8px', alignItems: 'center'
        }}>
          <Bell size={16} style={{ color: '#ea580c', flexShrink: 0 }} /> {status.notice}
        </div>
      )}

      {/* Darshan Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {darshans.map((d: any, idx: number) => {
          const hours = parseWaitHours(d.waitTime);
          const color = getStatusColor(hours);
          const IconComponent = getIcon(d.name);
          const darshanId = mapNameToId(d.name);

          return (
            <Link key={idx} href={`/darshan/${darshanId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                padding: '16px', borderRadius: '18px',
                border: '1px solid #e7e5e4', background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}>
                {/* Left */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <IconComponent size={18} style={{ color: '#6b7280', flexShrink: 0 }} />
                    <h3 style={{
                      fontWeight: 800, color: '#1c1917', fontSize: '14px',
                      lineHeight: 1.2, margin: 0, letterSpacing: '-0.01em'
                    }}>
                      {d.name.split(' (')[0]}
                    </h3>
                  </div>
                  <p style={{
                    color: '#78716c', fontSize: '11px', fontWeight: 600,
                    marginLeft: '30px', margin: '0 0 0 30px'
                  }}>
                    {d.name.includes('(')
                      ? d.name.substring(d.name.indexOf('(') + 1, d.name.indexOf(')'))
                      : d.peakHours || 'Estimated Wait'}
                  </p>
                </div>

                {/* Right — wait time badge */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '12px',
                    background: color.bg, marginBottom: '2px'
                  }}>
                    <span style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: color.dot, boxShadow: `0 0 6px ${color.dot}`
                    }} />
                    <span style={{
                      fontSize: '16px', fontWeight: 900, color: color.text,
                      letterSpacing: '-0.02em'
                    }}>
                      {d.waitTime}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '9px', fontWeight: 800, color: '#a8a29e',
                    textTransform: 'uppercase', letterSpacing: '0.5px', margin: '2px 0 0 0'
                  }}>
                    Estimated Wait
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Updated timestamp */}
      <div style={{
        fontSize: '10px', fontWeight: 800, color: '#a8a29e',
        textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px'
      }}>
        <Activity size={10} /> Updated {lastUpdated}
      </div>
    </div>
  );
}
