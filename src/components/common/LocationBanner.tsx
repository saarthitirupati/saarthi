'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Navigation, X } from 'lucide-react';
import { useTrip } from '@/components/TripContext';
import { useLanguage } from '@/lib/useLanguage';

export function LocationBanner() {
  const { locationPermission, locationSource, requestLocationPermission } = useTrip();
  const lang = useLanguage();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [needsPermissionFix, setNeedsPermissionFix] = useState(false);

  // Re-check dismissal state per session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('saarthi_location_prompt_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    }
  }, []);

  // When location is granted, clear dismissed state and error state
  useEffect(() => {
    if (locationPermission === 'granted' && locationSource === 'gps') {
      setIsDismissed(false);
      setNeedsPermissionFix(false);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('saarthi_location_prompt_dismissed');
      }
    }
  }, [locationPermission, locationSource]);

  // Only show if user explicitly denied or location is off / fallback, and hasn't dismissed this session
  const isOffOrDenied = locationPermission === 'denied' || (locationPermission === 'default' && locationSource === 'fallback');

  if (isDismissed || !isOffOrDenied) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('saarthi_location_prompt_dismissed', 'true');
    }
  };

  const handleEnable = async () => {
    setIsRequesting(true);
    setNeedsPermissionFix(false);
    const success = await requestLocationPermission();
    setIsRequesting(false);
    if (!success) {
      // Browser blocked permission at site settings level
      setNeedsPermissionFix(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.aside
        aria-label={lang === 'te' ? 'లొకేషన్ అలర్ట్' : 'Location Notice'}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          position: 'relative',
          zIndex: 40,
          backgroundColor: '#FFFBEB',
          borderBottom: '1px solid #FDE68A',
          boxShadow: '0 2px 8px rgba(180, 83, 9, 0.08)',
          padding: '10px 14px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          {/* Left: Icon & Description */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 280px', minWidth: 0 }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#FEF3C7',
              border: '1px solid #FCD34D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Compass size={16} color="#B45309" />
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{
                margin: 0,
                fontSize: '12px',
                lineHeight: 1.4,
                color: '#92400E',
                fontWeight: 600,
                fontFamily: lang === 'te' ? 'var(--font-telugu), var(--font-body)' : 'var(--font-body)',
                wordBreak: 'break-word'
              }}>
                {needsPermissionFix ? (
                  lang === 'te' 
                    ? 'లొకేషన్ బ్రౌజర్ సెట్టింగ్స్‌లో బ్లాక్ అయింది. దయచేసి సైట్ సెట్టింగ్స్‌లో లొకేషన్‌ను అనుమతించండి.'
                    : 'Location is blocked in browser settings. Please allow location in your browser site settings.'
                ) : (
                  lang === 'te'
                    ? 'లొకేషన్ ఆఫ్ చేయబడింది. ప్రత్యక్ష ఆలయ దూరాలు మరియు దర్శన మార్గాల కోసం ఆన్ చేయండి.'
                    : 'Location is turned off. Turn on location for live temple distances and accurate routes.'
                )}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleEnable}
              disabled={isRequesting}
              style={{
                backgroundColor: '#B45309',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 1px 3px rgba(180, 83, 9, 0.25)',
                fontFamily: 'var(--font-heading)',
                whiteSpace: 'nowrap'
              }}
            >
              <Navigation size={12} color="#FFFFFF" fill="#FFFFFF" />
              <span>
                {isRequesting 
                  ? (lang === 'te' ? 'గుర్తిస్తోంది...' : 'Detecting...')
                  : (lang === 'te' ? 'ఆన్ చేయండి' : 'Turn On')}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              style={{
                background: 'none',
                border: 'none',
                color: '#92400E',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.8
              }}
              title={lang === 'te' ? 'మూసివేయి' : 'Dismiss'}
              aria-label="Dismiss location banner"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
export default LocationBanner;
