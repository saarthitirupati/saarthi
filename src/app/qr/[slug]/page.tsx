'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Car, Sparkles, MapPin, ArrowRight, ShieldCheck, Clock, Map, UtensilsCrossed } from 'lucide-react';

export default function QRScanTransitionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const direct = searchParams?.get('direct') === '1';

  const [campaignName, setCampaignName] = useState<string>('Tirupati Cab Decal');
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
      backgroundColor: '#070E1A',
      color: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 16px',
      fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Sacred Radiant Ambience Background Glows */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '380px',
        height: '380px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(245, 158, 11, 0.08) 50%, rgba(7, 14, 26, 0) 75%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        filter: 'blur(32px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '320px',
        height: '240px',
        background: 'radial-gradient(circle, rgba(6, 95, 70, 0.18) 0%, rgba(7, 14, 26, 0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        filter: 'blur(40px)'
      }} />

      {/* Main Glassmorphism Welcome Card */}
      <div style={{
        maxWidth: '390px',
        width: '100%',
        background: 'linear-gradient(180deg, rgba(26, 38, 57, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '28px',
        padding: '32px 22px 26px 22px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        position: 'relative',
        zIndex: 1,
        animation: 'cardEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Official Saarthi Logo with Halo */}
        <div style={{
          position: 'relative',
          width: '76px',
          height: '76px',
          margin: '0 auto 16px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4), rgba(245, 158, 11, 0.3))',
            filter: 'blur(8px)',
            opacity: 0.85
          }} />
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '22px',
            background: 'linear-gradient(145deg, #0d281e 0%, #064e3b 100%)',
            border: '1.5px solid rgba(52, 211, 153, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 28px -6px rgba(5, 150, 105, 0.45)',
            padding: '10px'
          }}>
            <img 
              src="/assets/logo.png" 
              alt="Saarthi Guide" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))'
              }}
            />
          </div>
        </div>

        {/* Brand Tagline */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '999px',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(52, 211, 153, 0.25)',
          fontSize: '11.5px',
          fontWeight: 700,
          color: '#34D399',
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
          marginBottom: '10px'
        }}>
          <Sparkles size={12} color="#FBBF24" />
          <span>SAARTHI PILGRIM GUIDE</span>
        </div>

        {/* Welcome Greeting */}
        <h1 style={{
          fontSize: '23px',
          fontWeight: 800,
          color: '#FFFFFF',
          marginBottom: '4px',
          lineHeight: '1.25',
          letterSpacing: '-0.3px'
        }}>
          Namaste &amp; Welcome! 🙏
        </h1>
        <p style={{
          fontSize: '12.5px',
          fontWeight: 600,
          color: '#FDE68A',
          marginBottom: '14px',
          letterSpacing: '0.2px'
        }}>
          శ్రీ వేంకటేశ్వర స్వామి దివ్య క్షేత్రానికి స్వాగతం
        </p>

        {/* Verified Cab Decal Partner Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '7px',
          padding: '6px 14px',
          borderRadius: '12px',
          backgroundColor: 'rgba(30, 41, 59, 0.65)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          fontSize: '12px',
          color: '#94A3B8',
          marginBottom: '20px',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 8px #10B981',
            display: 'inline-block'
          }} />
          <Car size={13} color="#38BDF8" style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Connected via <strong style={{ color: '#F1F5F9', fontWeight: 600 }}>{campaignName}</strong>
          </span>
        </div>

        {/* Pilgrim Value Features Mini Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '22px'
        }}>
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '14px',
            padding: '10px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Clock size={16} color="#F59E0B" />
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#E2E8F0', lineHeight: '1.2' }}>Live Queue &amp; Tokens</span>
          </div>

          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '14px',
            padding: '10px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Map size={16} color="#34D399" />
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#E2E8F0', lineHeight: '1.2' }}>Offline Precinct Maps</span>
          </div>

          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '14px',
            padding: '10px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px'
          }}>
            <UtensilsCrossed size={16} color="#38BDF8" />
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#E2E8F0', lineHeight: '1.2' }}>Free Meals &amp; Lockers</span>
          </div>
        </div>

        {/* Progress & Launch Button */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(52, 211, 153, 0.2)',
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
            <span style={{ color: '#E2E8F0', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                display: 'inline-block',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: '2px solid #10B981',
                borderTopColor: 'transparent',
                animation: 'spin 0.7s linear infinite'
              }} />
              Opening Live Guide...
            </span>
            <span style={{ color: '#34D399', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              {progress}%
            </span>
          </div>

          {/* Smooth Gradient Progress Bar */}
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #059669 0%, #10B981 70%, #F59E0B 100%)',
              borderRadius: '999px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </div>

        {/* Instant Launch Action Button */}
        <button
          onClick={handleImmediateRedirect}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 18px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <span>Open Guide Now</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Trust & Assistance Footer */}
      <div style={{
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11.5px',
        color: '#64748B'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#10B981" />
          <span style={{ color: '#94A3B8', fontWeight: 500 }}>Verified Tirupati &amp; Tirumala Assistance</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748B' }}>
          <MapPin size={11} color="#64748B" />
          <span>100% Free Pilgrim Guide • No Sign-up Required</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

