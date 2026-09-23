'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTempleBellChime } from '@/lib/audioBell';
import styles from './Splash.module.css';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isFinishedRef = useRef(false);

  const handleFinish = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {}
    }
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
    // 🔔 Sacred bronze temple chime (0.2s)
    const soundTimer = setTimeout(() => {
      playTempleBellChime();
    }, 200);

    const v = videoRef.current;
    if (v) {
      v.defaultMuted = true;
      v.muted = true;
      v.play().then(() => setIsVideoReady(true)).catch(() => {});
    }

    const handleKeyDown = () => {
      handleFinish();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Safety fallback timer (12s) - allows full 9.4s video to finish naturally via onEnded
    const safetyTimer = setTimeout(() => {
      handleFinish();
    }, 12000);

    return () => {
      clearTimeout(soundTimer);
      clearTimeout(safetyTimer);
      window.removeEventListener('keydown', handleKeyDown);
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
          onClick={handleFinish}
          onTouchEnd={handleFinish}
          role="button"
          tabIndex={0}
          aria-label="Touch anywhere to enter Saarthi"
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className={styles.touchHint}
          >
            <span className={styles.touchHintDot} />
            <span>Touch anywhere to enter</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
