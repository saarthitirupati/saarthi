'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo/Logo';
import styles from './Splash.module.css';

interface SplashScreenProps {
  onFinish: () => void;
  mode?: 'new' | 'existing';
  userName?: string;
  language?: 'en' | 'te';
}

export default function SplashScreen({
  onFinish,
  mode = 'existing',
  userName,
  language = 'en'
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isFinishedRef = useRef(false);

  const handleFinish = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsVisible(false);
    setTimeout(onFinish, 220); // 220ms smooth exit transition
  }, [onFinish]);

  const attachVideo = useCallback((node: HTMLVideoElement | null) => {
    if (node) {
      node.muted = true;
      node.defaultMuted = true;
      node.setAttribute('muted', '');
      node.setAttribute('playsinline', 'true');
      node.setAttribute('webkit-playsinline', 'true');
      node.setAttribute('x5-playsinline', 'true');
      node.play().then(() => setIsVideoReady(true)).catch(() => {});
    }
    (videoRef as any).current = node;
  }, []);

  useEffect(() => {
    // Existing users: strictly under 2 to 3 seconds -> 2000ms
    // New users: 3500ms
    const duration = mode === 'existing' ? 2000 : 3500;

    if (mode === 'existing') {
      // Smooth progress bar fill over 1.8 seconds
      const start = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min((elapsed / 1800) * 100, 100);
        setProgressWidth(pct);
        if (pct >= 100) clearInterval(progressInterval);
      }, 30);

      const timer = setTimeout(() => {
        clearInterval(progressInterval);
        handleFinish();
      }, duration);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(timer);
      };
    } else {
      const timer = setTimeout(() => {
        handleFinish();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [mode, handleFinish]);

  // ==========================================
  // 1. EXISTING USER SPLASH SCREEN (Under 2 to 3 seconds)
  // Matching user's exact sacred dark-green sanctum design
  // ==========================================
  if (mode === 'existing') {
    return (
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            className={styles.splashContainer}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            onTouchStart={handleFinish}
            onClick={handleFinish}
            style={{
              cursor: 'pointer',
              background: '#0A2518',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              position: 'fixed',
              inset: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 999999
            }}
          >
            {/* Saarthi Pin Logo */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Logo size={88} />
            </motion.div>

            {/* Sacred Brand Name */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              style={{
                color: '#F4EFE6',
                fontSize: 'clamp(24px, 3.5vw, 32px)',
                fontWeight: 700,
                fontFamily: 'Playfair Display, Georgia, serif',
                margin: '0 0 10px 0',
                letterSpacing: '0.01em',
                textAlign: 'center'
              }}
            >
              {language === 'te' ? 'సారథి' : 'Saarthi'}
            </motion.h2>

            {/* Status Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              style={{
                color: '#8A9A90',
                fontSize: '14px',
                fontWeight: 400,
                margin: '0 0 44px 0',
                letterSpacing: '0.01em',
                textAlign: 'center'
              }}
            >
              {language === 'te' ? 'మీ యాత్ర మార్గదర్శిని సిద్ధం అవుతోంది...' : 'Getting your guide ready...'}
            </motion.p>

            {/* Golden Animated Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                width: '180px',
                height: '3px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progressWidth}%`,
                  background: '#C89B3C',
                  borderRadius: '3px',
                  transition: 'width 0.06s linear'
                }}
              />
            </motion.div>

            {/* Devotional Chant at Bottom */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              style={{
                color: '#C89B3C',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                margin: '52px 0 0 0',
                textAlign: 'center'
              }}
            >
              {language === 'te' ? 'ఓం శ్రీ వేంకటేశాయ నమః' : 'OM SRI VENKATESHAYA NAMAHA'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ==========================================
  // 2. NEW USER SPLASH SCREEN
  // Sacred full-screen video/poster intro
  // ==========================================
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={styles.splashContainer}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          onTouchStart={handleFinish}
          onClick={handleFinish}
          style={{ cursor: 'pointer' }}
        >
          <video
            ref={attachVideo}
            src="/banner/splash-screen-logo.mp4"
            poster="/banner/splash_poster.webp"
            autoPlay
            loop={false}
            muted
            playsInline
            {...{
              'webkit-playsinline': 'true',
              'x5-playsinline': 'true',
              'x5-video-player-type': 'h5',
              'x5-video-player-fullscreen': 'false'
            } as any}
            disablePictureInPicture
            disableRemotePlayback
            controls={false}
            controlsList="nodownload nofallback noremoteplayback noplaybackrate"
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            onCanPlay={(e) => {
              e.currentTarget.defaultMuted = true;
              e.currentTarget.muted = true;
              e.currentTarget.play().then(() => setIsVideoReady(true)).catch(() => {});
            }}
            onLoadedData={(e) => {
              e.currentTarget.defaultMuted = true;
              e.currentTarget.muted = true;
              e.currentTarget.play().then(() => setIsVideoReady(true)).catch(() => {});
            }}
            onPlaying={() => setIsVideoReady(true)}
            onTimeUpdate={(e) => {
              if (e.currentTarget.currentTime > 0 && !isVideoReady) {
                setIsVideoReady(true);
              }
            }}
            onEnded={handleFinish}
            onError={handleFinish}
            className={styles.splashVideo}
            style={{
              opacity: isVideoReady ? 1 : 0,
              transition: 'opacity 0.35s ease-in-out'
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: [0.75, 1, 0.75], y: 0 }}
            transition={{
              opacity: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
              y: { duration: 0.5, ease: 'easeOut' }
            }}
            style={{
              position: 'absolute',
              bottom: 'max(36px, calc(env(safe-area-inset-bottom) + 18px))',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999999,
              pointerEvents: 'none'
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading, 'Plus Jakarta Sans', -apple-system, sans-serif)",
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '9999px',
                padding: '9px 24px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
              }}
            >
              Begin Pilgrimage →
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
