'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Compass, Sparkles, MapPin, ArrowRight, HandHeart } from 'lucide-react';

export default function QRScanTransitionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const direct = searchParams?.get('direct') === '1';

  const [campaignName, setCampaignName] = useState<string>('Saarthi Tirupati');
  const [destination, setDestination] = useState<string>('/');
  const [loading, setLoading] = useState(true);

  function getClientMeta() {
    if (typeof window === 'undefined') return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };
    const ua = navigator.userAgent;

    let os = 'Desktop / Web';
    if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/Macintosh/.test(ua)) os = 'macOS';
    else if (/Windows/.test(ua)) os = 'Windows';

    let browser = 'Browser';
    if (/Chrome/.test(ua)) browser = 'Chrome';
    else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
    else if (/Firefox/.test(ua)) browser = 'Firefox';

    const device = os === 'iOS' ? 'iPhone' : os === 'Android' ? 'Android Mobile' : 'Desktop';
    return { os, browser, device };
  }

  useEffect(() => {
    if (!slug) return;

    const meta = getClientMeta();

    // Log scan and fetch dynamic destination
    fetch(`/api/qr/${slug}/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        os: meta.os,
        browser: meta.browser,
        device: meta.device,
        referer: document.referrer || 'QR Camera Scan',
        language: navigator.language || 'en-US',
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.destination) {
          setDestination(data.destination);
          if (data.campaignName) setCampaignName(data.campaignName);

          if (direct) {
            window.location.href = data.destination;
          } else {
            setTimeout(() => {
              window.location.href = data.destination;
            }, 1400);
          }
        } else {
          // Default fallback
          setTimeout(() => { window.location.href = '/'; }, 1200);
        }
      })
      .catch(() => {
        setTimeout(() => { window.location.href = '/'; }, 1200);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, direct]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F172A',
      color: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic Background Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '320px',
        height: '320px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(15, 23, 42, 0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Main Card */}
      <div style={{
        maxWidth: '380px',
        width: '100%',
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '32px 24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 1,
        animation: 'fadeIn 0.5s ease-out'
      }}>
        {/* Brand Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
        }}>
          <Compass size={34} color="#FFFFFF" />
        </div>

        <div style={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#10B981',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <Sparkles size={14} />
          <span>Saarthi Travel Companion</span>
        </div>

          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', lineHeight: '1.3', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <HandHeart size={22} color="#ff9d5c" /> Namaste &amp; Welcome!
          </h1>

        <p style={{
          fontSize: '13px',
          color: '#94A3B8',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          Connecting from <strong style={{ color: '#E2E8F0' }}>{campaignName}</strong>
        </p>

        {/* Pulse Loading Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '14px',
          borderRadius: '14px',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            border: '2px solid #10B981',
            borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite'
          }} />
          <span style={{ fontSize: '13px', color: '#E2E8F0', fontWeight: 600 }}>
            Opening Live Information...
          </span>
        </div>

        <a
          href={destination}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#94A3B8',
            textDecoration: 'underline',
            transition: 'color 0.2s'
          }}
        >
          <span>Tap here if not redirected automatically</span>
          <ArrowRight size={12} />
        </a>
      </div>

      {/* Footer Badge */}
      <div style={{
        marginTop: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: '#64748B'
      }}>
        <MapPin size={13} color="#10B981" />
        <span>Tirupati & Tirumala Pilgrim Assistance</span>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
