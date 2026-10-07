'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Download, X, Star, ShieldCheck, Share, PlusSquare, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=in.saarthiguide.travel';

export function IPhoneInstallModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const lang = useLanguage();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '16px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px 20px 28px 20px',
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            border: '1px solid #E2E8F0',
            color: '#0F172A',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          {/* Header Lockup */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0F5132 0%, #064E3B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(15, 81, 50, 0.25)',
              flexShrink: 0
            }}>
              <Smartphone size={24} color="#FDE047" />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0F172A', lineHeight: 1.2 }}>
                {lang === 'te' ? 'ఐఫోన్‌లో సారథిని ఇన్స్టాల్ చేయండి' : 'Install Saarthi on iPhone'}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '3px 0 0 0', fontWeight: 500 }}>
                {lang === 'te' ? 'యాప్ స్టోర్ లేకుండా ఉచితంగా హోమ్ స్క్రీన్‌కు జోడించండి' : 'Direct Home Screen App — No App Store Needed'}
              </p>
            </div>
          </div>

          {/* 2-Step Installation Guide */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {/* Step 1 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '12px 14px',
              borderRadius: '16px'
            }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Share size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                  {lang === 'te' ? '1. షేర్ బటన్ నొక్కండి' : '1. Tap the Share button'}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                  {lang === 'te' ? 'సఫారీ బ్రౌజర్ కింద ఉండే [↑] ఐకాన్ క్లిక్ చేయండి' : 'Tap [↑] at the bottom of your Safari browser bar'}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              padding: '12px 14px',
              borderRadius: '16px'
            }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <PlusSquare size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#14532D' }}>
                  {lang === 'te' ? '2. "Add to Home Screen" ఎంచుకోండి' : '2. Select "Add to Home Screen"'}
                </div>
                <div style={{ fontSize: '11.5px', color: '#166534', marginTop: '2px' }}>
                  {lang === 'te' ? 'జాబితాను క్రిందికి స్క్రోల్ చేసి [+] నొక్కండి' : 'Scroll down the options and tap [+] Add'}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Callout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            padding: '10px 12px',
            borderRadius: '12px',
            fontSize: '11.5px',
            color: '#92400E',
            fontWeight: 600,
            marginBottom: '16px'
          }}>
            <CheckCircle2 size={16} color="#D97706" style={{ flexShrink: 0 }} />
            <span>{lang === 'te' ? '100% ఆఫ్‌లైన్ మ్యాప్‌లు & ప్రత్యక్ష పుష్ నోటిఫికేషన్‌లు ఐఫోన్‌లో పనిచేస్తాయి.' : '100% Offline Maps & Live Push Notifications work seamlessly.'}</span>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            style={{
              width: '100%',
              backgroundColor: '#0F5132',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '14px',
              padding: '12px',
              borderRadius: '14px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 81, 50, 0.25)'
            }}
          >
            {lang === 'te' ? 'అర్థమైంది' : 'Got it!'}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function TopAppDownloadBanner() {
  const lang = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';
    const ios = /iPhone|iPad|iPod/i.test(ua);
    setIsIOS(ios);

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

  const handleInstallClick = (e: React.MouseEvent) => {
    if (isIOS) {
      e.preventDefault();
      setShowIOSModal(true);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          style={{
            background: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            color: '#0F5132',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '13px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
                background: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid #A7F3D0'
              }}
            >
              <Smartphone size={20} color="#059669" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '13px', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '6px', color: '#0F5132' }}>
                <span>
                  {isIOS 
                    ? (lang === 'te' ? 'సారథి ఐఫోన్ యాప్' : 'Official Saarthi iOS App')
                    : (lang === 'te' ? 'సారథి అఫీషియల్ ఆండ్రాయిడ్ యాప్' : 'Official Saarthi Android App')}
                </span>
                <span style={{ background: '#0F5132', color: '#FFFFFF', fontSize: '10px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>
                  FREE
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#047857', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {isIOS
                  ? (lang === 'te' ? 'ఐఫోన్ హోమ్ స్క్రీన్‌కు నేరుగా జోడించండి' : 'Install directly on iPhone Home Screen')
                  : (lang === 'te' 
                      ? 'ఆఫ్‌లైన్ ఆలయ మ్యాప్‌లు & ప్రత్యక్ష దర్శన సమాచారం' 
                      : '100% Offline Maps, Real-time Tokens & Darshan Alerts')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <a
              href={isIOS ? '#' : PLAY_STORE_URL}
              onClick={handleInstallClick}
              target={isIOS ? '_self' : '_blank'}
              rel="noopener noreferrer"
              style={{
                background: '#0F5132',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '12px',
                padding: '7px 14px',
                borderRadius: '20px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(15,81,50,0.2)',
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
                color: '#64748B',
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

      <IPhoneInstallModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
    </>
  );
}

export function ContextualAppDownloadCard({ title, subtitle }: { title?: string; subtitle?: string }) {
  const lang = useLanguage();
  const [isWebView, setIsWebView] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';
    setIsIOS(/iPhone|iPad|iPod/i.test(ua));

    if (/wv|Android.*Version\/[0-9.]+|SaarthiApp/i.test(ua) || (window as any).AndroidInterface !== undefined) {
      setIsWebView(true);
    }
  }, []);

  if (isWebView) return null;

  const handleInstallClick = (e: React.MouseEvent) => {
    if (isIOS) {
      e.preventDefault();
      setShowIOSModal(true);
    }
  };

  return (
    <>
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
                {title || (isIOS 
                  ? (lang === 'te' ? 'ఐఫోన్‌లో ఆఫ్‌లైన్ మ్యాప్‌లను ఉపయోగించండి' : 'Install Saarthi App on your iPhone')
                  : (lang === 'te' ? 'యాప్‌లో ఆఫ్‌లైన్ మ్యాప్‌లను ఉపయోగించండి' : 'Get Offline Maps & Live Alerts on App'))}
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
            href={isIOS ? '#' : PLAY_STORE_URL}
            onClick={handleInstallClick}
            target={isIOS ? '_self' : '_blank'}
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
            <span>{lang === 'te' ? 'యాప్ డౌన్‌లోడ్' : 'Install App'}</span>
          </a>
        </div>
      </div>

      <IPhoneInstallModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
    </>
  );
}

