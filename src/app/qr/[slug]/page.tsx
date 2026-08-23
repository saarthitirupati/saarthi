'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export default function QRScanTransitionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const direct = searchParams?.get('direct') === '1';

  const [campaignName, setCampaignName] = useState<string>('Tirupati Cab Partner');
  const [destination, setDestination] = useState<string>('/');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(15);

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

  // Simulated smooth progress bar
  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(60), 300);
    const timer2 = setTimeout(() => setProgress(95), 800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

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
              setProgress(100);
              window.location.href = data.destination;
            }, 1400);
          }
        } else {
          // Default fallback
          setTimeout(() => { 
            setProgress(100);
            window.location.href = '/'; 
          }, 1200);
        }
      })
      .catch(() => {
        setTimeout(() => { 
          setProgress(100);
          window.location.href = '/'; 
        }, 1200);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, direct]);

  const handleImmediateRedirect = () => {
    window.location.href = destination || '/';
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF8F4',
      backgroundImage: 'radial-gradient(at 50% 0%, #FFFDF8 0%, #F5EFE4 100%)',
      color: '#1E293B',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Divine Golden Ambient Aura */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, rgba(16, 185, 129, 0.08) 45%, rgba(250, 248, 244, 0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        filter: 'blur(36px)'
      }} />

      {/* Main Royal Sacred Card */}
      <div style={{
        maxWidth: '385px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(217, 119, 6, 0.22)',
        borderRadius: '28px',
        padding: '36px 24px 28px 24px',
        boxShadow: '0 20px 45px -10px rgba(180, 83, 9, 0.12), 0 8px 20px -6px rgba(0, 0, 0, 0.06)',
        position: 'relative',
        zIndex: 1,
        animation: 'cardEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Sacred Golden Logo Emblem */}
        <div style={{
          position: 'relative',
          width: '78px',
          height: '78px',
          margin: '0 auto 16px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '28px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(16, 185, 129, 0.2) 70%)',
            filter: 'blur(10px)',
            opacity: 0.8
          }} />
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '22px',
            background: '#FFFFFF',
            border: '1.5px solid rgba(217, 119, 6, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px -4px rgba(180, 83, 9, 0.18)',
            padding: '8px'
          }}>
            <img 
              src="/assets/logo.png" 
              alt="Saarthi Guide" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>

        {/* Sacred Sub-title Tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 14px',
          borderRadius: '999px',
          backgroundColor: '#FEF3C7',
          border: '1px solid #FDE68A',
          fontSize: '11px',
          fontWeight: 800,
          color: '#B45309',
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}>
          <Sparkles size={12} color="#D97706" />
          <span>SAARTHI PILGRIM GUIDE</span>
        </div>

        {/* Warm Welcome Greeting */}
        <h1 style={{
          fontSize: '24px',
          fontWeight: 900,
          color: '#1E293B',
          marginBottom: '4px',
          lineHeight: '1.25',
          letterSpacing: '-0.4px'
        }}>
          Namaste &amp; Welcome! 🙏
        </h1>
        <p style={{
          fontSize: '13px',
          fontWeight: 700,
          color: '#B45309',
          marginBottom: '26px',
          letterSpacing: '0.2px'
        }}>
          శ్రీ వేంకటేశ్వర స్వామి దివ్య క్షేత్రానికి స్వాగతం
        </p>

        {/* Sleek Golden Progress Section */}
        <div style={{
          backgroundColor: '#FBF9F5',
          border: '1px solid rgba(217, 119, 6, 0.15)',
          borderRadius: '16px',
          padding: '14px 16px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '12px'
          }}>
            <span style={{ color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: '2px solid #D97706',
                borderTopColor: 'transparent',
                animation: 'spin 0.7s linear infinite'
              }} />
              Opening Live Guide...
            </span>
            <span style={{ color: '#B45309', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
              {progress}%
            </span>
          </div>

          {/* Smooth Royal Gold to Emerald Progress Bar */}
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#E2E8F0',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #D97706 0%, #F59E0B 50%, #059669 100%)',
              borderRadius: '999px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </div>

        {/* Elegant Gold CTA Button */}
        <button
          onClick={handleImmediateRedirect}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '13px 20px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 10px 22px -5px rgba(5, 150, 105, 0.4)',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <span>Enter Live Guide Now</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Trust & Spiritual Heritage Footer */}
      <div style={{
        marginTop: '22px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: '#64748B'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={15} color="#059669" />
          <span style={{ color: '#334155', fontWeight: 600 }}>Verified Tirupati &amp; Tirumala Assistance</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#64748B' }}>
          <MapPin size={12} color="#D97706" />
          <span>100% Free • Live Darshan, Tokens &amp; Precinct Maps</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(14px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
