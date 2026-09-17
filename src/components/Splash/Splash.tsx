'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playTempleBellChime } from '@/lib/audioBell';
import styles from './Splash.module.css';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
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

    const playVideo = () => {
      const v = videoRef.current;
      if (v) {
        v.setAttribute('muted', '');
        v.setAttribute('playsinline', 'true');
        v.setAttribute('webkit-playsinline', 'true');
        v.setAttribute('x5-playsinline', 'true');
        v.defaultMuted = true;
        v.muted = true;
        v.play().then(() => {
          setIsVideoPlaying(true);
        }).catch(() => {});
      }
    };

    playVideo();

    const handleGesture = () => {
      playVideo();
    };

    window.addEventListener('touchstart', handleGesture, { passive: true });
    window.addEventListener('click', handleGesture, { passive: true });

    // Safety fallback timer (12s) - allows full 9.4s video to finish naturally via onEnded
    const safetyTimer = setTimeout(() => {
      handleFinish();
    }, 12000);

    return () => {
      clearTimeout(soundTimer);
      clearTimeout(safetyTimer);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('click', handleGesture);
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
          onClick={() => {
            const v = videoRef.current;
            if (v && v.paused) {
              v.play().then(() => setIsVideoPlaying(true)).catch(() => {});
            }
          }}
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
              e.currentTarget.setAttribute('muted', '');
              e.currentTarget.defaultMuted = true;
              e.currentTarget.muted = true;
              e.currentTarget.play().then(() => setIsVideoPlaying(true)).catch(() => {});
            }}
            onLoadedData={(e) => {
              e.currentTarget.setAttribute('muted', '');
              e.currentTarget.defaultMuted = true;
              e.currentTarget.muted = true;
              e.currentTarget.play().then(() => setIsVideoPlaying(true)).catch(() => {});
            }}
            onPlaying={() => setIsVideoPlaying(true)}
            onTimeUpdate={(e) => {
              if (e.currentTarget.currentTime > 0 && !isVideoPlaying) {
                setIsVideoPlaying(true);
              }
            }}
            onEnded={handleFinish}
            onError={handleFinish}
            className={styles.splashVideo}
            style={{
              opacity: isVideoPlaying ? 1 : 0,
              transition: 'opacity 0.25s ease-in-out'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
