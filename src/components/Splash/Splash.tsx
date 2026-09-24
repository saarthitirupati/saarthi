'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Splash.module.css';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isFinishedRef = useRef(false);

  const handleFinish = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsVisible(false);
    setTimeout(onFinish, 350); // 350ms smooth exit cross-fade
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
    const v = videoRef.current;
    if (v) {
      v.defaultMuted = true;
      v.muted = true;
      v.play().then(() => setIsVideoReady(true)).catch(() => {});
    }

    // Safety fallback timer (12s) - allows full 9.4s video to finish naturally via onEnded
    const safetyTimer = setTimeout(() => {
      handleFinish();
    }, 12000);

    return () => {
      clearTimeout(safetyTimer);
    };
  }, [handleFinish]);

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
            animate={{ opacity: [0.7, 1, 0.7], y: 0 }}
            transition={{
              opacity: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' },
              y: { duration: 0.6, ease: 'easeOut' }
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
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                backgroundColor: 'rgba(15, 23, 42, 0.55)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                borderRadius: '9999px',
                padding: '8px 22px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
              }}
            >
              Touch anywhere to enter
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
