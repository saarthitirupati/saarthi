'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Star, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

const DISMISS_KEY = 'saarthi_app_banner_dismissed_until';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=in.saarthiguide.travel';

/**
 * Checks if the current visitor is already running inside the installed app
 * (Android TWA, WebView, or Standalone PWA).
 */
export function isInsideApp(): boolean {
  if (typeof window === 'undefined') return true;
  const ua = navigator.userAgent || '';
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((window.navigator as any).standalone) ||
    Boolean((window as any).SaarthiNative) ||
    Boolean((window as any).Android) ||
    Boolean((window as any).isSaarthiApp) ||
    /wv/i.test(ua) ||
    document.referrer.includes('android-app://')
  );
}

export function AppInstallBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    // Rule 1: NEVER show inside the installed Android app or standalone PWA
    if (isInsideApp()) {
      return;
    }

    // Rule 2: Respect 7-day dismissal cooldown
    try {
      const dismissedUntil = localStorage.getItem(DISMISS_KEY);
      if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
        return;
      }
    } catch {}

    // Listen for PWA install event if supported by browser
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show banner smoothly after initial page load (1.5s delay so page content appears first)
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice.catch(() => null);
      if (choice?.outcome === 'accepted') {
        setVisible(false);
        return;
      }
    }
    // Fallback directly to Google Play Store listing
    window.open(PLAY_STORE_URL, '_blank', 'noopener,noreferrer');
  };

  const handleDismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + SEVEN_DAYS_MS));
    } catch {}
  };

  if (!mounted || !visible) return null;

  return (
    <aside
      aria-label="Download Saarthi Mobile App"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 45,
        width: '100%',
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
        animation: 'fadeIn 0.3s ease-out',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        {/* App Icon */}
        <div style={{
          width: 40,
          height: 40,
          minWidth: 40,
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: '#0F5132',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255, 215, 0, 0.35)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          <Image
            src="/icon-192.png"
            alt="Saarthi App Icon"
            width={40}
            height={40}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Text Details */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Saarthi: Divine Guide
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              fontSize: '10px',
              fontWeight: 800,
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              padding: '1px 5px',
              borderRadius: 4
            }}>
              <Star size={10} fill="#F59E0B" color="#F59E0B" /> 4.9
            </span>
          </div>
          <p style={{
            fontSize: '11px',
            color: '#94A3B8',
            margin: '2px 0 0 0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            Offline maps on hill • Live SSD alerts • 1.7 MB
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={handleInstallClick}
          type="button"
          style={{
            backgroundColor: '#0F5132',
            color: '#FFFFFF',
            border: '1px solid #10B981',
            borderRadius: 8,
            padding: '7px 12px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
          }}
        >
          <Download size={13} strokeWidth={2.5} />
          <span>Get App</span>
        </button>

        <button
          onClick={handleDismiss}
          type="button"
          aria-label="Dismiss app download prompt"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>
      </div>
    </aside>
  );
}
