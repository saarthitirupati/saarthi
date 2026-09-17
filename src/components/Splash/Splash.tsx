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
    setIsVisible(false);
    setTimeout(onFinish, 350); // 350ms smooth exit cross-fade
  }, [onFinish]);

  useEffect(() => {
    // 🔔 Sacred bronze temple chime (0.2s)
    const soundTimer = setTimeout(() => {
      playTempleBellChime();
    }, 200);

    const v = videoRef.current;
    if (v) {
      v.defaultMuted = true;
      v.muted = true;
      v.play().catch(() => {});
    }

    // Safety fallback timer (12s) - allows full 9.4s video to finish naturally via onEnded
    const safetyTimer = setTimeout(() => {
      handleFinish();
    }, 12000);

    return () => {
      clearTimeout(soundTimer);
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
        >
          <video
            ref={videoRef}
            src="/banner/saarthi-splashscreen.mp4"
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
              e.currentTarget.play().catch(() => {});
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
              transition: 'opacity 0.4s ease-in-out'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
