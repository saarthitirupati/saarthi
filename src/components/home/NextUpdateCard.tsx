import React, { useState } from 'react';
import { Bell, Check, Clock, Heart } from 'lucide-react';

export function NextUpdateCard() {
  const [notified, setNotified] = useState(false);

  return (
    <div style={{ padding: '0 16px 20px 16px' }}>
      
      {/* CARING REASSURANCE BANNER */}
      <div style={{
        backgroundColor: '#ECFDF5',
        border: '1px solid #A7F3D0',
        borderRadius: '16px',
        padding: '14px 16px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <Heart size={20} color="#059669" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#065F46', lineHeight: '1.4' }}>
          Don't worry. Saarthi is watching live queue traffic and will remind you when it's the best time for Darshan.
        </div>
      </div>

      {/* NEXT UPDATE COUNTDOWN & RETENTION CARD */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
        borderRadius: '20px',
        padding: '18px',
        color: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
            NEXT AUTOMATIC UPDATE
          </div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', lineHeight: '1.3' }}>
            Queue expected to improve in <span style={{ color: '#34D399' }}>2h 15m</span>
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px', fontWeight: 500 }}>
            We'll send an alert directly to your phone.
          </div>
        </div>

        <button
          onClick={() => setNotified(!notified)}
          style={{
            backgroundColor: notified ? '#059669' : '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            flexShrink: 0
          }}
        >
          {notified ? (
            <>
              <Check size={16} />
              <span>Subscribed</span>
            </>
          ) : (
            <>
              <Bell size={16} />
              <span>Notify Me</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
