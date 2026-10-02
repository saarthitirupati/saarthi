'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Download, X, Star, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=in.saarthiguide.travel';

export function TopAppDownloadBanner() {
  const lang = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';
    const isWebView = /wv|Android.*Version\/[0-9.]+|SaarthiApp/i.test(ua) || (window as any).AndroidInterface !== undefined;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    const dismissed = sessionStorage.getItem('saarthi_app_banner_dismissed');
    if (!isWebView && !isStandalone && !dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('saarthi_app_banner_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        style={{
          background: 'linear-gradient(135deg, #0F5132 0%, #064E3B 100%)',
          color: '#FFFFFF',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '13px',
          boxShadow: '0 2px 8px rgba(15,81,50,0.25)',
          position: 'relative',
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <Smartphone size={20} color="#FDE047" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '13px', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{lang === 'te' ? 'సారథి అఫీషియల్ ఆండ్రాయిడ్ యాప్' : 'Official Saarthi Android App'}</span>
              <span style={{ background: '#FDE047', color: '#0F5132', fontSize: '10px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>
                FREE
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#D1FAE5', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {lang === 'te' 
                ? 'ఆఫ్‌లైన్ ఆలయ మ్యాప్‌లు & ప్రత్యక్ష దర్శన సమాచారం' 
                : '100% Offline Maps, Real-time Tokens & Darshan Alerts'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#FDE047',
              color: '#0F5132',
              fontWeight: 800,
              fontSize: '12px',
              padding: '7px 14px',
              borderRadius: '20px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Download size={14} strokeWidth={2.5} />
            <span>{lang === 'te' ? 'ఇన్‌స్టాల్ చేయండి' : 'Install App'}</span>
          </a>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close app banner"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function ContextualAppDownloadCard({ title, subtitle }: { title?: string; subtitle?: string }) {
  const lang = useLanguage();
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';
    if (/wv|Android.*Version\/[0-9.]+|SaarthiApp/i.test(ua) || (window as any).AndroidInterface !== undefined) {
      setIsWebView(true);
    }
  }, []);

  if (isWebView) return null;

  return (
    <div
      style={{
        margin: '20px 0',
        padding: '16px 20px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #0F5132 0%, #064E3B 100%)',
        color: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(15,81,50,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Smartphone size={24} color="#FDE047" />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
              {title || (lang === 'te' ? 'యాప్‌లో ఆఫ్‌లైన్ మ్యాప్‌లను ఉపయోగించండి' : 'Get Offline Maps & Live Alerts on App')}
            </h4>
            <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#D1FAE5', lineHeight: 1.4 }}>
              {subtitle || (lang === 'te' ? 'తిరుమల కొండపై నెట్‌వర్క్ లేకపోయినా 100% పనిచేస్తుంది.' : 'Works smoothly even without mobile network on Tirumala Hills.')}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#FDE047', fontWeight: 600 }}>
          <Star size={12} fill="#FDE047" />
          <Star size={12} fill="#FDE047" />
          <Star size={12} fill="#FDE047" />
          <Star size={12} fill="#FDE047" />
          <Star size={12} fill="#FDE047" />
          <span style={{ marginLeft: '4px', color: '#FFFFFF' }}>4.9 · 100% Free</span>
        </div>

        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#FDE047',
            color: '#0F5132',
            fontWeight: 800,
            fontSize: '13px',
            padding: '8px 16px',
            borderRadius: '20px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
          }}
        >
          <Download size={15} strokeWidth={2.5} />
          <span>{lang === 'te' ? 'యాప్ డౌన్‌లోడ్' : 'Download App'}</span>
        </a>
      </div>
    </div>
  );
}
