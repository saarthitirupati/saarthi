'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSaarthiSonicIdent, stopSaarthiSonicIdent } from '@/lib/audioIdentity';
import styles from './Splash.module.css';

// Silky smooth spring-like deceleration curve (First Principle motion curve)
const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

// Authentic Sacred Pranava ॐ Vector Path (Mathematically extracted from Nirmala Devanagari)
const OM_PATH =
  'M 530.7 160.2 Q 532.0 160.5 533.2 160.5 Q 535.6 160.5 537.4 159.6 Q 539.3 158.8 540.6 157.3 Q 541.8 155.7 542.5 153.6 Q 543.2 151.5 543.2 148.9 Q 543.2 146.8 542.7 145.3 Q 542.3 143.8 541.5 142.8 Q 540.8 141.8 539.8 141.4 Q 538.8 141.0 537.8 141.0 Q 536.7 141.0 535.7 141.4 Q 534.8 141.8 533.9 142.6 Q 532.9 143.3 532.0 144.2 Q 531.2 145.1 530.3 146.1 Q 529.3 147.2 528.3 148.3 Q 527.2 149.3 526.1 150.1 Q 525.0 150.9 523.7 151.4 Q 522.5 151.8 521.0 151.8 Q 520.2 151.8 519.3 151.8 Q 518.5 151.7 517.5 151.4 L 517.4 151.5 Q 518.0 153.1 518.2 154.7 Q 518.5 156.3 518.5 157.8 Q 518.5 160.8 517.6 163.7 Q 516.7 166.6 514.8 168.9 Q 512.8 171.1 509.8 172.4 Q 506.8 173.8 502.7 173.8 Q 498.2 173.8 494.5 172.2 Q 490.8 170.6 487.8 168.0 Q 484.9 165.4 482.6 162.0 Q 480.4 158.6 478.8 155.0 Q 477.2 151.4 476.2 147.9 Q 475.3 144.4 474.8 141.6 L 479.8 139.3 Q 480.3 142.5 481.4 145.9 Q 482.4 149.2 483.9 152.4 Q 485.4 155.6 487.3 158.5 Q 489.3 161.3 491.6 163.5 Q 493.9 165.6 496.7 166.8 Q 499.4 168.1 502.5 168.1 Q 504.3 168.1 506.1 167.5 Q 507.8 167.0 509.2 165.8 Q 510.6 164.6 511.5 162.5 Q 512.3 160.5 512.3 157.4 Q 512.3 145.3 498.4 145.3 Q 497.8 145.3 497.0 145.3 Q 496.2 145.3 495.3 145.4 L 495.3 139.6 Q 495.6 139.6 496.2 139.7 Q 496.7 139.7 497.7 139.7 Q 501.2 139.7 503.8 139.0 Q 506.3 138.2 507.8 136.8 Q 509.4 135.5 510.1 133.7 Q 510.9 131.9 510.9 129.9 Q 510.9 126.0 508.6 123.9 Q 506.4 121.9 502.7 121.9 Q 500.9 121.9 498.9 122.5 Q 496.8 123.1 494.0 124.4 L 491.9 119.2 Q 497.6 116.2 503.0 116.2 Q 506.1 116.2 508.7 117.3 Q 511.3 118.3 513.1 120.1 Q 514.9 122.0 515.9 124.5 Q 516.9 127.1 516.9 130.1 Q 516.9 134.2 515.2 137.3 Q 513.4 140.5 509.9 142.3 L 509.9 142.6 Q 511.1 143.3 512.1 144.1 Q 513.1 144.9 513.6 145.3 Q 514.5 146.2 515.8 146.7 Q 517.1 147.1 518.3 147.1 Q 519.6 147.1 520.7 146.8 Q 521.8 146.5 522.8 145.9 Q 523.9 145.2 525.0 144.2 Q 526.1 143.1 527.5 141.6 Q 528.8 140.2 529.9 139.0 Q 531.1 137.8 532.4 137.0 Q 533.6 136.1 535.0 135.6 Q 536.4 135.2 538.0 135.2 Q 540.5 135.2 542.5 136.2 Q 544.6 137.3 546.1 139.3 Q 547.6 141.2 548.5 143.8 Q 549.4 146.4 549.4 149.5 Q 549.4 153.2 548.2 156.2 Q 547.1 159.3 545.0 161.6 Q 543.0 163.8 540.1 165.1 Q 537.3 166.4 533.8 166.4 Q 532.0 166.4 530.6 166.1 Z M 524.0 100.9 Q 524.0 98.8 525.2 97.5 Q 526.4 96.2 528.4 96.2 Q 529.4 96.2 530.2 96.5 Q 531.0 96.9 531.7 97.5 Q 532.3 98.2 532.6 99.1 Q 533.0 99.9 533.0 101.0 Q 533.0 102.0 532.7 102.8 Q 532.3 103.7 531.7 104.3 Q 531.1 104.9 530.3 105.3 Q 529.5 105.6 528.5 105.6 Q 527.5 105.6 526.7 105.3 Q 525.9 104.9 525.3 104.3 Q 524.7 103.7 524.4 102.8 Q 524.0 101.9 524.0 100.9 Z M 516.5 99.2 Q 517.2 101.1 518.1 103.3 Q 519.0 105.5 520.3 107.3 Q 521.7 109.0 523.7 110.2 Q 525.6 111.4 528.5 111.4 Q 530.3 111.4 532.0 110.9 Q 533.7 110.3 535.2 108.9 Q 536.7 107.5 538.0 105.2 Q 539.2 102.8 540.0 99.2 L 545.6 100.8 Q 544.6 104.4 543.0 107.5 Q 541.5 110.5 539.3 112.7 Q 537.2 114.9 534.4 116.1 Q 531.6 117.3 528.1 117.3 Q 521.7 117.3 517.4 113.2 Q 513.1 109.2 510.9 100.8 Z';

// Floating sacred camphor particles (Dynamic sacred atmosphere)
interface Particle {
  id: number;
  cx: number;
  cy: number;
  r: number;
  duration: number;
  delay: number;
  driftX: number;
}

function getDynamicSanctumPhase(): { telugu: string; english: string; period: string } {
  try {
    const now = new Date();
    // Indian Standard Time (IST) hour
    const istHour = (now.getUTCHours() + 5.5) % 24;
    if (istHour >= 4 && istHour < 8.5) {
      return { telugu: 'సుప్రభాత దర్శనం', english: 'Suprabhatam Darshan', period: 'dawn' };
    }
    if (istHour >= 8.5 && istHour < 12.5) {
      return { telugu: 'ప్రాతఃకాల దర్శనం', english: 'Morning Darshan', period: 'morning' };
    }
    if (istHour >= 12.5 && istHour < 16.5) {
      return { telugu: 'మధ్యాహ్న సమయం', english: 'Midday Sanctum', period: 'midday' };
    }
    if (istHour >= 16.5 && istHour < 20.5) {
      return { telugu: 'సాయం సంధ్యా హారతి', english: 'Sandhya Aarti', period: 'evening' };
    }
    return { telugu: 'ఏకాంత సేవ', english: 'Ekantha Seva', period: 'night' };
  } catch {
    return { telugu: 'దివ్య దర్శనం', english: 'Divine Darshan', period: 'day' };
  }
}

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);

  // Dynamic Live State
  const [sanctumPhase, setSanctumPhase] = useState(getDynamicSanctumPhase());
  const [userName, setUserName] = useState<string | null>(null);
  const [liveWaitTime, setLiveWaitTime] = useState<string | null>(null);
  const [liveCrowd, setLiveCrowd] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<'init' | 'syncing' | 'ready'>('init');

  // Generate 18 floating golden camphor/temple particles
  const particles = useMemo<Particle[]>(() => {
    const list: Particle[] = [];
    for (let i = 0; i < 18; i++) {
      list.push({
        id: i,
        cx: 140 + Math.random() * 744,
        cy: 220 + Math.random() * 580,
        r: 1.4 + Math.random() * 2.2,
        duration: 2.4 + Math.random() * 2.6,
        delay: Math.random() * 1.8,
        driftX: (Math.random() - 0.5) * 24,
      });
    }
    return list;
  }, []);

  const handleFinish = useCallback(() => {
    stopSaarthiSonicIdent();
    setIsVisible(false);
  }, []);

  const handleStartSound = useCallback(async () => {
    const started = await playSaarthiSonicIdent(true);
    if (started) {
      setIsAudioPlaying(true);
      setIsAutoplayBlocked(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let splashTimer: NodeJS.Timeout;

    // 1. Check local user name for dynamic personal greeting
    try {
      const isApp = window.matchMedia('(display-mode: standalone)').matches;
      const storedName = localStorage.getItem(isApp ? 'saarthi_user_name_app' : 'saarthi_user_name');
      if (storedName && isMounted) {
        setUserName(storedName.trim());
      }
    } catch {
      // safe fallback
    }

    // 2. Fetch live Tirumala status dynamically
    fetch('/api/v1/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        if (data.waitTime) setLiveWaitTime(data.waitTime.trim());
        if (data.crowdLevel) {
          const crowdMap: Record<string, string> = {
            low: 'సాధారణం (Normal)',
            moderate: 'మధ్యస్థం (Moderate)',
            high: 'రద్దీ (High)',
            'very-high': 'తీవ్ర రద్దీ (Peak)',
          };
          setLiveCrowd(crowdMap[data.crowdLevel] || data.crowdLevel);
        }
      })
      .catch(() => {
        // graceful offline fallback
      });

    // 3. Dynamic progressive loading stages
    const stepTimer1 = setTimeout(() => {
      if (isMounted) setLoadingStep('syncing');
    }, 1100);

    const stepTimer2 = setTimeout(() => {
      if (isMounted) setLoadingStep('ready');
    }, 2500);

    // 4. Sacred dawn soundscape playback
    const soundTimer = setTimeout(async () => {
      const started = await playSaarthiSonicIdent();
      if (!isMounted) return;
      if (started) {
        setIsAudioPlaying(true);
        setIsAutoplayBlocked(false);
      } else {
        setIsAutoplayBlocked(true);
      }
    }, 50);

    // 5. Total golden darshan window: 3.8s
    splashTimer = setTimeout(() => {
      if (isMounted) {
        handleFinish();
      }
    }, 3800);

    // 🛡️ Global gesture unlock
    const handleOneTimeGesture = async () => {
      const started = await playSaarthiSonicIdent(true);
      if (isMounted && started) {
        setIsAudioPlaying(true);
        setIsAutoplayBlocked(false);
      }
    };

    window.addEventListener('pointerdown', handleOneTimeGesture, { once: true });
    window.addEventListener('keydown', handleOneTimeGesture, { once: true });

    return () => {
      isMounted = false;
      clearTimeout(soundTimer);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(splashTimer);
      window.removeEventListener('pointerdown', handleOneTimeGesture);
      window.removeEventListener('keydown', handleOneTimeGesture);
      stopSaarthiSonicIdent();
    };
  }, [handleFinish]);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {isVisible && (
        <motion.div
          className={styles.splashContainer}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: SMOOTH_EASE }}
          onClick={() => {
            if (!isAudioPlaying && isAutoplayBlocked) {
              handleStartSound();
            } else {
              handleFinish();
            }
          }}
        >
          {/* 🌌 Atmospheric Sanctum Ambient Background */}
          <div className={styles.sanctumVignette} />

          {/* 🌟 Radiant Golden Sanctum Aura Glow */}
          <motion.div
            className={styles.centralGoldenAura}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 0.9, scale: 1.05 }}
            transition={{ duration: 1.4, ease: SMOOTH_EASE }}
          />

          {/* 🔴 DYNAMIC TOP LIVE TEMPLE TELEMETRY BADGE */}
          <motion.div
            className={styles.dynamicLiveBadge}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: SMOOTH_EASE }}
          >
            <span className={styles.livePulseDot} />
            <span className={styles.liveBadgePhase}>
              {sanctumPhase.telugu} • {sanctumPhase.english}
            </span>
            {liveWaitTime && (
              <>
                <span className={styles.liveBadgeDivider}>|</span>
                <span className={styles.liveBadgeDarshan}>
                  సర్వదర్శనం: {liveWaitTime}
                </span>
              </>
            )}
            {userName && (
              <>
                <span className={styles.liveBadgeDivider}>•</span>
                <span className={styles.liveBadgeUser}>
                  నమస్కారం, {userName}!
                </span>
              </>
            )}
          </motion.div>

          {/* 🛕 PURE VECTOR SVG CANVAS WITH HARDWARE-ACCELERATED ANIMATIONS */}
          <div className={styles.vectorCanvasWrapper}>
            <svg
              viewBox="0 0 1024 1024"
              className={styles.svgCanvas}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Deep Sanctum Emerald Background */}
                <radialGradient id="sanctumBg" cx="50%" cy="42%" r="65%">
                  <stop offset="0%" stopColor="#022819" />
                  <stop offset="55%" stopColor="#011C11" />
                  <stop offset="100%" stopColor="#000F09" />
                </radialGradient>

                {/* Warm Ambient Gold Glow in lower left */}
                <radialGradient id="ambientWarmAura" cx="15%" cy="85%" r="45%">
                  <stop offset="0%" stopColor="#D97706" stopOpacity="0.14" />
                  <stop offset="65%" stopColor="#B45309" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#000F09" stopOpacity="0" />
                </radialGradient>

                {/* Master Central Aura Glow */}
                <radialGradient id="centralAura" cx="50%" cy="33%" r="35%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.28" />
                  <stop offset="50%" stopColor="#D97706" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#011C11" stopOpacity="0" />
                </radialGradient>

                {/* Sacred 24K Gold Metallic Gradient */}
                <linearGradient id="divineGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFDF0" />
                  <stop offset="22%" stopColor="#FDE68A" />
                  <stop offset="55%" stopColor="#F59E0B" />
                  <stop offset="85%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>

                {/* Brilliant Gold Rim Highlight */}
                <linearGradient id="goldRim" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="30%" stopColor="#FEF08A" />
                  <stop offset="70%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#78350F" />
                </linearGradient>

                {/* Gold Shadow for Bevels */}
                <linearGradient id="goldShadow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B45309" />
                  <stop offset="50%" stopColor="#78350F" />
                  <stop offset="100%" stopColor="#451A03" />
                </linearGradient>

                {/* Pearlescent Conch Shell */}
                <linearGradient id="conchPearl" x1="20%" y1="10%" x2="85%" y2="90%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#F8FAFC" />
                  <stop offset="70%" stopColor="#E2E8F0" />
                  <stop offset="100%" stopColor="#CBD5E1" />
                </linearGradient>

                {/* Conch Inner Ambient Shadow */}
                <linearGradient id="conchInnerShadow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>

                {/* Sacred Vermilion Srichoornam Tilakam */}
                <linearGradient id="srichoornam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F87171" />
                  <stop offset="35%" stopColor="#EF4444" />
                  <stop offset="75%" stopColor="#DC2626" />
                  <stop offset="100%" stopColor="#991B1B" />
                </linearGradient>

                {/* Srichoornam Facet Highlight */}
                <linearGradient id="srichoornamHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FECACA" />
                  <stop offset="30%" stopColor="#EF4444" />
                  <stop offset="80%" stopColor="#DC2626" />
                  <stop offset="100%" stopColor="#991B1B" />
                </linearGradient>

                {/* White Namam Left Pillar (Illuminated Facet) */}
                <linearGradient id="namamLeftFacet" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="60%" stopColor="#F8FAFC" />
                  <stop offset="100%" stopColor="#E2E8F0" />
                </linearGradient>

                {/* White Namam Right Pillar (Inner Facet) */}
                <linearGradient id="namamRightFacet" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F1F5F9" />
                  <stop offset="60%" stopColor="#E2E8F0" />
                  <stop offset="100%" stopColor="#CBD5E1" />
                </linearGradient>

                {/* Pilgrimage Road Asphalt Surface */}
                <linearGradient id="roadSurface" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="45%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>

                {/* Road Golden Curb Edge */}
                <linearGradient id="roadCurb" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>

              {/* ✨ DYNAMIC FLOATING SACRED CAMPHOR / LIGHT PARTICLES */}
              <g id="dynamic-sacred-particles" opacity="0.8">
                {particles.map((p) => (
                  <motion.circle
                    key={p.id}
                    cx={p.cx}
                    cy={p.cy}
                    r={p.r}
                    fill="url(#goldRim)"
                    initial={{ opacity: 0.2, y: 0 }}
                    animate={{
                      opacity: [0.2, 0.9, 0.2],
                      y: [-12, -38],
                      x: [0, p.driftX],
                    }}
                    transition={{
                      duration: p.duration,
                      repeat: Infinity,
                      delay: p.delay,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </g>

              {/* 🌟 LAYER 1: ASTROLABE & CELESTIAL COMPASS HALO (Gentle Inward Rotation) */}
              <motion.g
                id="astrolabe-halo"
                initial={{ opacity: 0, rotate: -12 }}
                animate={{ opacity: 0.88, rotate: 0 }}
                transition={{ duration: 1.6, ease: SMOOTH_EASE }}
                style={{ transformOrigin: '512px 330px' }}
              >
                {/* Dotted Outer Orbit Ring */}
                <circle cx="512" cy="330" r="266" stroke="url(#divineGold)" strokeWidth="1.5" strokeDasharray="3.5 5.5" fill="none" opacity="0.75" />
                {/* Fine Middle Orbit Ring */}
                <circle cx="512" cy="330" r="195" stroke="url(#divineGold)" strokeWidth="0.8" strokeDasharray="2.5 4.5" fill="none" opacity="0.35" />
                {/* Inner Fine Orbit Ring */}
                <circle cx="512" cy="330" r="115" stroke="url(#divineGold)" strokeWidth="0.8" strokeDasharray="2 3" fill="none" opacity="0.22" />

                {/* 12 Astrolabe Celestial Rays */}
                <g stroke="url(#divineGold)" strokeWidth="0.8" strokeDasharray="3 6" opacity="0.38">
                  <line x1="512" y1="330" x2="512" y2="45" />
                  <line x1="512" y1="330" x2="512" y2="615" />
                  <line x1="512" y1="330" x2="227" y2="330" />
                  <line x1="512" y1="330" x2="797" y2="330" />
                  <line x1="512" y1="330" x2="324" y2="142" />
                  <line x1="512" y1="330" x2="700" y2="518" />
                  <line x1="512" y1="330" x2="700" y2="142" />
                  <line x1="512" y1="330" x2="324" y2="518" />
                  <line x1="512" y1="330" x2="416" y2="76" />
                  <line x1="512" y1="330" x2="608" y2="584" />
                  <line x1="512" y1="330" x2="608" y2="76" />
                  <line x1="512" y1="330" x2="416" y2="584" />
                </g>

                {/* 4 Cardinal Star Points on Orbit */}
                {/* Top */}
                <path d="M 512 54 L 518 64 L 512 74 L 506 64 Z" fill="url(#goldRim)" />
                <circle cx="512" cy="64" r="2.2" fill="#FFFFFF" />
                {/* Bottom */}
                <path d="M 512 586 L 518 596 L 512 606 L 506 596 Z" fill="url(#goldRim)" />
                <circle cx="512" cy="596" r="2.2" fill="#FFFFFF" />
                {/* Left */}
                <path d="M 236 330 L 246 324 L 256 330 L 246 336 Z" fill="url(#goldRim)" />
                <circle cx="246" cy="330" r="2.2" fill="#FFFFFF" />
                {/* Right */}
                <path d="M 768 330 L 778 324 L 788 330 L 778 336 Z" fill="url(#goldRim)" />
                <circle cx="778" cy="330" r="2.2" fill="#FFFFFF" />

                {/* Planetary Celestial Dots along the orbit */}
                <circle cx="380" cy="99" r="3.2" fill="url(#divineGold)" />
                <circle cx="644" cy="99" r="3.2" fill="url(#divineGold)" />
                <circle cx="253" cy="235" r="2.8" fill="url(#divineGold)" />
                <circle cx="771" cy="235" r="2.8" fill="url(#divineGold)" />
                <circle cx="253" cy="425" r="2.8" fill="url(#divineGold)" />
                <circle cx="771" cy="425" r="2.8" fill="url(#divineGold)" />
                <circle cx="380" cy="561" r="3.2" fill="url(#divineGold)" />
                <circle cx="644" cy="561" r="3.2" fill="url(#divineGold)" />
              </motion.g>

              {/* 🕉️ LAYER 2: THE GOLDEN ॐ (AUTHENTIC SACRED PRANAVA) */}
              <motion.g
                id="pranava-om"
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 1.1, ease: SMOOTH_EASE }}
                style={{ transformOrigin: '512px 135px' }}
              >
                {/* Pure Authentic ॐ Vector Glyph */}
                <path d={OM_PATH} fill="url(#divineGold)" stroke="url(#goldRim)" strokeWidth={0.8} />

                {/* Om Radiant Diamond Droplet below */}
                <path d="M 512 178 L 517 186 L 512 194 L 507 186 Z" fill="url(#goldRim)" />
                <circle cx="512" cy="186" r="1.5" fill="#FFFFFF" />
              </motion.g>

              {/* 🪷 LAYER 3: SRI PANCHAJANYA SHANKHA (SACRED CONCH SHELL) */}
              <motion.g
                id="sacred-shankha"
                initial={{ opacity: 0, x: -16, y: 4 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.32, duration: 1.1, ease: SMOOTH_EASE }}
                style={{ transformOrigin: '300px 330px' }}
                className={styles.shankhaFloat}
              >
                {/* Top Golden Flame Finial Spire */}
                <path
                  d="
                    M 300 216
                    C 306 228, 298 244, 304 256
                    C 308 262, 305 268, 300 272
                    C 295 268, 292 262, 296 256
                    C 302 244, 294 228, 300 216 Z
                  "
                  fill="url(#divineGold)"
                  stroke="url(#goldRim)"
                  strokeWidth="1.2"
                />
                <circle cx="300" cy="272" r="3.2" fill="url(#goldRim)" />

                {/* Main Pearlescent Shell Body */}
                <path
                  d="
                    M 300 272
                    C 264 276, 242 305, 245 338
                    C 248 368, 268 402, 290 436
                    C 294 440, 302 438, 302 430
                    C 302 414, 306 392, 318 368
                    C 332 340, 338 302, 300 272 Z
                  "
                  fill="url(#conchPearl)"
                  stroke="url(#divineGold)"
                  strokeWidth="2.2"
                />

                {/* Shell Left Shadow for 3D Volume */}
                <path
                  d="
                    M 300 272
                    C 264 276, 242 305, 245 338
                    C 248 368, 268 402, 290 436
                    C 278 405, 262 370, 260 342
                    C 258 312, 276 284, 300 272 Z
                  "
                  fill="url(#conchInnerShadow)"
                />

                {/* 3 Golden Spiral Relief Bands across the Shell */}
                <path d="M 248 322 C 270 332, 298 326, 326 306" stroke="url(#divineGold)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
                <path d="M 248 322 C 270 332, 298 326, 326 306" stroke="url(#goldRim)" strokeWidth="1.2" fill="none" strokeLinecap="round" />

                <path d="M 252 356 C 274 366, 300 356, 320 340" stroke="url(#divineGold)" strokeWidth="3.2" fill="none" strokeLinecap="round" />
                <path d="M 252 356 C 274 366, 300 356, 320 340" stroke="url(#goldRim)" strokeWidth="1.2" fill="none" strokeLinecap="round" />

                <path d="M 268 390 C 284 398, 300 390, 312 376" stroke="url(#divineGold)" strokeWidth="2.8" fill="none" strokeLinecap="round" />
                <path d="M 268 390 C 284 398, 300 390, 312 376" stroke="url(#goldRim)" strokeWidth="1.0" fill="none" strokeLinecap="round" />

                {/* Elegant Spiraling Shell Snout */}
                <path
                  d="
                    M 280 416
                    C 288 430, 290 438, 292 440
                    C 294 440, 300 434, 300 424
                    C 295 428, 287 425, 280 416 Z
                  "
                  fill="url(#divineGold)"
                />
              </motion.g>

              {/* ☸️ LAYER 4: SRI SUDARSHANA CHAKRA (SACRED COSMIC DISCUS) */}
              <motion.g
                id="sacred-chakra"
                initial={{ opacity: 0, x: 16, y: 4 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.32, duration: 1.1, ease: SMOOTH_EASE }}
                style={{ transformOrigin: '700px 330px' }}
              >
                {/* 4 Cardinal Golden Spearheads */}
                <polygon points="700,214 712,268 700,264 688,268" fill="url(#divineGold)" />
                <polygon points="700,214 700,264 688,268" fill="url(#goldRim)" />
                <line x1="700" y1="214" x2="700" y2="264" stroke="#FFFFFF" strokeWidth="1.2" />

                <polygon points="700,446 712,392 700,396 688,392" fill="url(#divineGold)" />
                <polygon points="700,446 700,396 688,392" fill="url(#goldRim)" />
                <line x1="700" y1="446" x2="700" y2="396" stroke="#FFFFFF" strokeWidth="1.2" />

                <polygon points="584,330 638,318 634,330 638,342" fill="url(#divineGold)" />
                <polygon points="584,330 634,330 638,318" fill="url(#goldRim)" />
                <line x1="584" y1="330" x2="634" y2="330" stroke="#FFFFFF" strokeWidth="1.2" />

                <polygon points="816,330 762,318 766,330 762,342" fill="url(#divineGold)" />
                <polygon points="816,330 766,330 762,318" fill="url(#goldRim)" />
                <line x1="816" y1="330" x2="766" y2="330" stroke="#FFFFFF" strokeWidth="1.2" />

                {/* Rotating Wheel Core (Continuous Majestic Cosmic Rotation) */}
                <motion.g
                  id="chakra-rotating-wheel"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '700px 330px' }}
                >
                  <circle cx="700" cy="330" r="68" stroke="url(#divineGold)" strokeWidth="5.5" fill="none" />
                  <circle cx="700" cy="330" r="70.5" stroke="url(#goldRim)" strokeWidth="1.2" fill="none" />
                  <circle cx="700" cy="330" r="65.5" stroke="url(#goldShadow)" strokeWidth="1.0" fill="none" />
                  <circle cx="700" cy="330" r="54" stroke="url(#divineGold)" strokeWidth="2.6" strokeDasharray="6 4" fill="none" />

                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const cos = Math.cos(rad);
                    const sin = Math.sin(rad);
                    const x1 = 700 + 20 * cos;
                    const y1 = 330 + 20 * sin;
                    const x2 = 700 + 54 * cos;
                    const y2 = 330 + 54 * sin;
                    return (
                      <g key={deg}>
                        <line x1={x1.toFixed(1)} y1={y1.toFixed(1)} x2={x2.toFixed(1)} y2={y2.toFixed(1)} stroke="url(#divineGold)" strokeWidth="3.2" strokeLinecap="round" />
                        <line x1={x1.toFixed(1)} y1={y1.toFixed(1)} x2={x2.toFixed(1)} y2={y2.toFixed(1)} stroke="url(#goldRim)" strokeWidth="1.2" strokeLinecap="round" />
                      </g>
                    );
                  })}

                  <circle cx="700" cy="330" r="21" fill="url(#divineGold)" stroke="url(#goldShadow)" strokeWidth="1.5" />
                  <circle cx="700" cy="330" r="16" fill="url(#goldRim)" />
                  <circle cx="700" cy="330" r="9" fill="url(#divineGold)" />
                  <polygon points="700,323 707,330 700,337 693,330" fill="#FFFFFF" />
                  <circle cx="700" cy="330" r="2.5" fill="#FEF08A" />
                </motion.g>
              </motion.g>

              {/* 🛕 LAYER 5: SRI VENKATESWARA TIRUNAMAM & SRICHOORNAM (CENTER SACRED EMBLEM) */}
              <motion.g
                id="sacred-namam"
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 1.0, ease: SMOOTH_EASE }}
                style={{ transformOrigin: '512px 350px' }}
                className={styles.namamGlow}
              >
                {/* LEFT WHITE PILLAR */}
                <polygon points="423,226 460,226 494,452 488,452" fill="url(#namamLeftFacet)" />
                <polygon points="460,226 492,226 498,452 494,452" fill="url(#namamRightFacet)" />
                <line x1="423" y1="226" x2="488" y2="452" stroke="url(#divineGold)" strokeWidth="1.6" />
                <line x1="423" y1="226" x2="492" y2="226" stroke="url(#goldRim)" strokeWidth="1.4" />

                {/* RIGHT WHITE PILLAR */}
                <polygon points="532,226 564,226 530,452 526,452" fill="url(#namamLeftFacet)" />
                <polygon points="564,226 601,226 536,452 530,452" fill="url(#namamRightFacet)" />
                <line x1="601" y1="226" x2="536" y2="452" stroke="url(#divineGold)" strokeWidth="1.6" />
                <line x1="532" y1="226" x2="601" y2="226" stroke="url(#goldRim)" strokeWidth="1.4" />

                {/* U-Base */}
                <path
                  d="
                    M 488 452 
                    C 498 462, 526 462, 536 452 
                    C 524 456, 500 456, 488 452 Z
                  "
                  fill="url(#namamLeftFacet)"
                  stroke="url(#divineGold)"
                  strokeWidth="1.2"
                />

                {/* Central Crimson Srichoornam */}
                <path
                  d="
                    M 512 215
                    C 500 260, 497 330, 506 430
                    C 508 438, 511 444, 512 444
                    C 513 444, 516 438, 518 430
                    C 527 330, 524 260, 512 215 Z
                  "
                  fill="url(#srichoornam)"
                />
                <path
                  d="
                    M 512 215
                    C 504 260, 502 330, 509 430
                    L 512 444
                    L 512 215 Z
                  "
                  fill="url(#srichoornamHighlight)"
                />
                <polygon points="512,206 517,214 512,218 507,214" fill="url(#goldRim)" />
                <circle cx="512" cy="214" r="1.5" fill="#FFFFFF" />
              </motion.g>

              {/* 🌸 LAYER 6: PADMA PEETHAM (GOLDEN BLOOMING LOTUS PEDESTAL) */}
              <motion.g
                id="padma-peetham"
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.9, ease: SMOOTH_EASE }}
                style={{ transformOrigin: '512px 512px' }}
              >
                <path d="M 512 516 C 455 515, 400 502, 384 485 C 406 484, 448 498, 512 516 Z" fill="url(#divineGold)" stroke="url(#goldRim)" strokeWidth="1.0" />
                <path d="M 512 516 C 569 515, 624 502, 640 485 C 618 484, 576 498, 512 516 Z" fill="url(#divineGold)" stroke="url(#goldRim)" strokeWidth="1.0" />
                <path d="M 512 514 C 460 505, 428 488, 416 468 C 440 464, 474 482, 512 514 Z" fill="url(#goldRim)" stroke="url(#divineGold)" strokeWidth="1.2" />
                <path d="M 512 514 C 564 505, 596 488, 608 468 C 584 464, 550 482, 512 514 Z" fill="url(#goldRim)" stroke="url(#divineGold)" strokeWidth="1.2" />
                <path d="M 512 510 C 480 490, 462 470, 456 448 C 476 446, 496 466, 512 510 Z" fill="url(#divineGold)" stroke="url(#goldRim)" strokeWidth="1.2" />
                <path d="M 512 510 C 544 490, 562 470, 568 448 C 548 446, 528 466, 512 510 Z" fill="url(#divineGold)" stroke="url(#goldRim)" strokeWidth="1.2" />
                <path d="M 512 432 C 526 460, 522 490, 512 510 C 502 490, 498 460, 512 432 Z" fill="url(#goldRim)" stroke="url(#divineGold)" strokeWidth="1.4" />
                <line x1="512" y1="432" x2="512" y2="510" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />
                <path d="M 512 512 L 520 522 L 512 530 L 504 522 Z" fill="url(#divineGold)" />
                <circle cx="512" cy="522" r="2.2" fill="#FFFFFF" />
              </motion.g>

              {/* 📜 LAYER 7: MASTER WORDMARK "SAARTHI" & PILGRIMAGE HIGHWAY */}
              <motion.g
                id="brand-wordmark"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.68, duration: 0.9, ease: SMOOTH_EASE }}
              >
                <text x="215" y="675" textAnchor="middle" fill="url(#divineGold)" fontFamily="'Cinzel', 'Playfair Display', Georgia, serif" fontSize="124" fontWeight="700">S</text>
                <text x="318" y="675" textAnchor="middle" fill="url(#divineGold)" fontFamily="'Cinzel', 'Playfair Display', Georgia, serif" fontSize="124" fontWeight="700">A</text>

                {/* 🛣️ SECOND 'A' WITH PILGRIMAGE HIGHWAY INTEGRATION */}
                <g id="letter-A-with-highway">
                  <polygon points="380,675 402,675 432,572 414,572" fill="url(#divineGold)" />
                  <polygon points="432,572 450,572 480,675 458,675" fill="url(#divineGold)" />
                  <polygon points="410,572 454,572 432,568" fill="url(#goldRim)" />
                  <polygon points="372,675 406,675 406,671 372,671" fill="url(#goldRim)" />
                  <polygon points="454,675 488,675 488,671 454,671" fill="url(#goldRim)" />

                  <path
                    d="
                      M 372 675
                      C 405 650, 422 630, 432 602
                      C 438 620, 452 648, 464 675
                      Z
                    "
                    fill="url(#roadSurface)"
                  />
                  <path d="M 372 675 C 405 650, 422 630, 432 602" stroke="url(#roadCurb)" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  <path d="M 464 675 C 452 648, 438 620, 432 602" stroke="url(#roadCurb)" strokeWidth="3.5" fill="none" strokeLinecap="round" />

                  {/* Animated Golden Pilgrimage Path */}
                  <motion.path
                    d="M 418 675 C 426 650, 430 626, 432 602"
                    stroke="#FEF08A"
                    strokeWidth="2.2"
                    strokeDasharray="3.5 3.5"
                    fill="none"
                    animate={{ strokeDashoffset: [-14, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                  />
                </g>

                <text x="532" y="675" textAnchor="middle" fill="url(#divineGold)" fontFamily="'Cinzel', 'Playfair Display', Georgia, serif" fontSize="124" fontWeight="700">R</text>
                <text x="626" y="675" textAnchor="middle" fill="url(#divineGold)" fontFamily="'Cinzel', 'Playfair Display', Georgia, serif" fontSize="124" fontWeight="700">T</text>
                <text x="716" y="675" textAnchor="middle" fill="url(#divineGold)" fontFamily="'Cinzel', 'Playfair Display', Georgia, serif" fontSize="124" fontWeight="700">H</text>
                <text x="804" y="675" textAnchor="middle" fill="url(#divineGold)" fontFamily="'Cinzel', 'Playfair Display', Georgia, serif" fontSize="124" fontWeight="700">I</text>
              </motion.g>

              {/* 📜 LAYER 8: TELUGU NAME, SUBTITLE & DEVOTIONAL BLESSING */}
              <motion.g
                id="brand-subtitles"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.88, duration: 0.9, ease: SMOOTH_EASE }}
              >
                <line x1="250" y1="724" x2="400" y2="724" stroke="url(#goldRim)" strokeWidth="2.0" opacity="0.9" />
                <circle cx="400" cy="724" r="3.0" fill="url(#goldRim)" />

                <line x1="624" y1="724" x2="774" y2="724" stroke="url(#goldRim)" strokeWidth="2.0" opacity="0.9" />
                <circle cx="624" cy="724" r="3.0" fill="url(#goldRim)" />

                <text
                  x="512"
                  y="736"
                  textAnchor="middle"
                  fill="url(#goldRim)"
                  fontFamily="'Noto Sans Telugu', 'Nirmala UI', system-ui, sans-serif"
                  fontSize="38"
                  fontWeight="700"
                  letterSpacing="0.08em"
                >
                  సారథి
                </text>

                <text
                  x="512"
                  y="780"
                  textAnchor="middle"
                  fill="#F1F5F9"
                  fontFamily="'Inter', system-ui, -apple-system, sans-serif"
                  fontSize="20"
                  fontWeight="600"
                  letterSpacing="0.28em"
                  opacity="0.9"
                >
                  YOUR DIVINE TIRUPATI COMPANION
                </text>

                {/* Golden Lotus Flourish */}
                <g id="subtitle-lotus-flourish" transform="translate(512, 824)">
                  <path d="M 0 -12 C 4 -4, 4 4, 0 8 C -4 4, -4 -4, 0 -12 Z" fill="url(#goldRim)" />
                  <path d="M 0 8 C -8 4, -14 -2, -16 -8 C -10 -8, -4 0, 0 8 Z" fill="url(#divineGold)" />
                  <path d="M 0 8 C 8 4, 14 -2, 16 -8 C 10 -8, 4 0, 0 8 Z" fill="url(#divineGold)" />
                  <circle cx="0" cy="8" r="2.0" fill="#FFFFFF" />
                  <line x1="-50" y1="8" x2="-22" y2="8" stroke="url(#divineGold)" strokeWidth="0.8" opacity="0.6" />
                  <line x1="22" y1="8" x2="50" y2="8" stroke="url(#divineGold)" strokeWidth="0.8" opacity="0.6" />
                </g>

                <text
                  x="512"
                  y="878"
                  textAnchor="middle"
                  fill="url(#goldRim)"
                  fontFamily="'Noto Sans Telugu', 'Nirmala UI', system-ui, sans-serif"
                  fontSize="30"
                  fontWeight="700"
                  letterSpacing="0.06em"
                  opacity="0.95"
                >
                  || ఓం నమో వేంకటేశాయ ||
                </text>
              </motion.g>
            </svg>
          </div>

          {/* ⚡ DYNAMIC LIVE LOADING STATUS TELEMETRY CAPTION */}
          <motion.div
            className={styles.dynamicStatusCaption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {loadingStep === 'init' && 'దివ్య సంకల్పం • Awakening Sacred Presence...'}
            {loadingStep === 'syncing' && 'ప్రత్యక్ష సమాచారం • Syncing Live Sanctum Timings...'}
            {loadingStep === 'ready' && (liveCrowd ? `దర్శన భాగ్యం • Tirumala Crowd: ${liveCrowd}` : 'దర్శన భాగ్యం • Sanctum Ready')}
          </motion.div>

          {/* 🔊 Sacred OM Sound Prompt (When autoplay requires user gesture) */}
          {isAutoplayBlocked && !isAudioPlaying && (
            <motion.button
              type="button"
              className={styles.soundPromptPill}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: SMOOTH_EASE }}
              onClick={(e) => {
                e.stopPropagation();
                handleStartSound();
              }}
            >
              <span className={styles.pulseDot} />
              <span className={styles.soundPromptTelugu}>దివ్య ప్రణవ నాదం</span>
              <span className={styles.soundPromptDivider}>•</span>
              <span className={styles.soundPromptEnglish}>Tap for Sacred Sound ॐ</span>
            </motion.button>
          )}

          {/* 🎵 Active Divine OM Soundwave Indicator */}
          {isAudioPlaying && (
            <motion.div
              className={styles.soundActivePill}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: SMOOTH_EASE }}
            >
              <span className={styles.soundActiveWave}>
                <span />
                <span />
                <span />
              </span>
              <span>ప్రణవ నాదం ॐ • Sacred Soundscape</span>
            </motion.div>
          )}

          {/* ⚡ Skip button */}
          <motion.button
            className={styles.skipPill}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.25 }}
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
          >
            Skip →
          </motion.button>

          {/* 🌟 Elegant Bottom Loading Progress Bar */}
          <div className={styles.loadingBarContainer}>
            <div className={styles.loadingBarFill} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
