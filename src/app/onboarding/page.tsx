'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Check, ArrowLeft, Clock, Compass, ShieldCheck, 
  MapPin, Calendar, Users, Heart, Sparkles, Globe,
  Bell, Download, BookOpen, ChevronRight, Lock, Landmark,
  Sun, Activity
} from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import styles from './Onboarding.module.css';

interface LanguageOption {
  code: string;
  nativeName: string;
  englishName: string;
}

// Framer Motion Animation Settings
const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 24 }
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const popIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 20 }
  }
};

const drawCheck = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeInOut' as const }
  }
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isMounted, setIsMounted] = useState(false);

  // Permissions switches
  const [locationPerm, setLocationPerm] = useState(true);
  const [notifPerm, setNotifPerm] = useState(true);

  // Oracle loading simulator ticks
  const [loadingTick, setLoadingTick] = useState(0);

  // Unused state and variables removed

  useEffect(() => {
    setIsMounted(true);
    const savedName = localStorage.getItem('saarthi_user_name');
    if (savedName) setName(savedName);

    const savedLanguage = localStorage.getItem('saarthi_user_language');
    if (savedLanguage) setSelectedLanguage(savedLanguage);
  }, []);

  // Step 3 (Oracle Loading) redirect sequence
  useEffect(() => {
    if (step === 3) {
      const interval = setInterval(() => {
        setLoadingTick(t => {
          if (t >= 4) {
            clearInterval(interval);
            finish();
            return 4;
          }
          return t + 1;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step]);

  const LANGUAGES: LanguageOption[] = [
    { code: 'en', nativeName: 'English', englishName: 'English' }
  ];

  const nextStep = () => {
    if (step === 2 && !name.trim()) return;
    setStep(s => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const finish = () => {
    const finalName = name.trim() || 'Traveler';
    localStorage.setItem('hasSeenOnboarding', 'true');
    localStorage.setItem('saarthi_user_name', finalName);
    localStorage.setItem('saarthi_user_language', selectedLanguage);
    
    // Save permissions
    localStorage.setItem('saarthi_location_enabled', locationPerm ? 'true' : 'false');
    localStorage.setItem('saarthi_notif_enabled', notifPerm ? 'true' : 'false');

    // Remove any previous plannerInput interests if we are removing Step 3
    const existingStateStr = localStorage.getItem('jeevapath_trip_state');
    let existingState = {};
    if (existingStateStr) {
      try { existingState = JSON.parse(existingStateStr); } catch {}
    }
    const updatedState = {
      ...existingState,
      plannerInput: {
        ...(existingState as any).plannerInput,
        interests: []
      }
    };
    localStorage.setItem('jeevapath_trip_state', JSON.stringify(updatedState));

    window.location.href = '/';
  };

  if (!isMounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAF7' }}>
        <div style={{
          width: '40px', height: '40px', border: '4px solid #0F5132',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 2 active navigation steps before loading screen
  const progressPct = (step / 2) * 100;

  return (
    <div className={styles.container} style={{ background: step === 3 ? '#0A2518' : 'radial-gradient(circle at top, #FFFFFF 0%, #FAFAF7 100%)' }}>
      
      {/* Decorative Rotating Mandala */}
      {step < 3 && (
        <div className={styles.rotatingMandala} />
      )}

      {/* Header */}
      {step < 3 && (
        <header className={styles.header} style={{ justifyContent: step > 1 ? 'space-between' : 'flex-end', zIndex: 10 }}>
          {step > 1 && (
            <motion.button 
              className={styles.backButton} 
              onClick={prevStep} 
              aria-label="Back"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <ArrowLeft size={18} style={{ color: '#1A1A1A' }} />
            </motion.button>
          )}
          {step === 1 && (
            <motion.button 
              className={styles.skipButton} 
              onClick={() => setStep(3)}
              whileHover={{ x: 2 }}
              style={{ color: '#0F5132', fontWeight: 700 }}
            >
              Skip
            </motion.button>
          )}
        </header>
      )}

      {/* Progress Bar Container */}
      {step < 3 && (
        <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(15, 81, 50, 0.08)', position: 'relative', zIndex: 10 }}>
          <motion.div 
            style={{ height: '100%', background: 'linear-gradient(90deg, #0F5132 0%, #C89B3C 100%)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          />
        </div>
      )}

      {/* Content Area */}
      <div className={styles.contentArea} style={{ zIndex: 5 }}>
        <AnimatePresence mode="wait">
          
          {/* Step 1: Welcome Screen (Mockup Design) */}
          {step === 1 && (
            <motion.div
              key="step1"
              className={styles.slide}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              {/* Header Image */}
              <div style={{
                width: '100%',
                height: '180px',
                borderRadius: '24px',
                backgroundImage: 'url(/assets/temples/kapila-theertham.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginBottom: '20px',
                backgroundColor: '#0F5132'
              }} />

              {/* Brand Logo */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '-12px 0 8px 0' }}>
                <Logo size={72} />
              </div>

              {/* Text Content */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
                  Welcome to Saarthi
                </h1>
                <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.5, margin: 0, padding: '0 12px' }}>
                  Your trusted companion for a smooth &amp; meaningful journey in Tirupati.
                </p>
              </div>

              {/* Three Value Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                {[
                  { title: 'Live Updates', desc: 'Real-time darshan, crowd levels, and instant alerts.', color: '#059669', bg: '#E5F3EB', icon: Activity },
                  { title: 'Curated Places', desc: 'Detailed guides for temples, nature, and hidden gems.', color: '#D97706', bg: '#FFF7ED', icon: Compass },
                  { title: 'Travel Essentials', desc: 'Official rules, transport options, and helpful checklists.', color: '#2563EB', bg: '#EFF6FF', icon: BookOpen }
                ].map((card, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '16px',
                      padding: '14px 16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: card.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <card.icon size={20} style={{ color: card.color }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 2px 0' }}>{card.title}</h3>
                      <p style={{ fontSize: '12px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Name Input */}
          {step === 2 && (
            <motion.div
              key="step2"
              className={styles.slide}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div className={styles.textContent} variants={cardVariants} style={{ marginTop: '40px', marginBottom: '24px' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '20px', 
                  backgroundColor: 'rgba(200, 155, 60, 0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#C89B3C', 
                  margin: '0 auto 16px auto', 
                  boxShadow: '0 4px 12px rgba(200, 155, 60, 0.1)' 
                }}>
                  <User size={28} />
                </div>
                <h1 className={styles.title} style={{ color: '#1A1A1A', fontSize: '24px', fontWeight: 800 }}>What should we call you?</h1>
                <p className={styles.description}>We'll personalize your dashboard &amp; recommendations.</p>
              </motion.div>

              <motion.div className={styles.inputWrapper} variants={cardVariants} style={{ width: '100%', padding: '0 10px' }}>
                <input
                  type="text"
                  className={styles.nameInput}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && name.trim() && nextStep()}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    borderRadius: '20px',
                    border: '2px solid rgba(15, 81, 50, 0.1)',
                    fontSize: '16px',
                    fontWeight: 700,
                    textAlign: 'center',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
                    transition: 'all 0.3s',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    color: '#1A1A1A'
                  }}
                  autoFocus
                />
                <p style={{ fontSize: '12px', color: '#718096', marginTop: '12px', textAlign: 'center', fontWeight: 500 }}>
                  e.g. Raghav, Sreeja, Mahesh
                </p>
              </motion.div>

              <motion.div 
                className={styles.privacyNote} 
                variants={cardVariants}
                style={{ 
                  margin: 'auto auto 20px',
                  background: 'rgba(15, 81, 50, 0.05)',
                  border: '1px solid rgba(15, 81, 50, 0.1)',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  maxWidth: '320px'
                }}
              >
                <div style={{ color: '#0F5132', flexShrink: 0 }}><Lock size={16} /></div>
                <span className={styles.privacyText} style={{ color: '#0F5132', fontSize: '11px', fontWeight: 600, lineHeight: 1.4 }}>
                  Your privacy is our priority. We never share your details; they are stored strictly on this device.
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* Step 3: Ready */}
          {step === 3 && (
            <motion.div
              key="step3"
              className={styles.slide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                justifyContent: 'center',
                background: '#071C12',
                minHeight: '100%',
                position: 'absolute',
                inset: 0,
                zIndex: 100,
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ marginBottom: '24px' }}
              >
                <Logo size={80} />
              </motion.div>

              {/* App name */}
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  color: '#F4EFE6',
                  fontSize: '26px',
                  fontWeight: 700,
                  fontFamily: 'Playfair Display, Georgia, serif',
                  margin: '0 0 10px 0',
                  letterSpacing: '0.01em'
                }}
              >
                Saarthi
              </motion.h2>

              {/* Calm tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{
                  color: '#8A9A90',
                  fontSize: '13px',
                  fontWeight: 400,
                  margin: '0 0 48px 0',
                  letterSpacing: '0.01em'
                }}
              >
                Getting your guide ready…
              </motion.p>

              {/* Simple progress bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ width: '160px', height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${(loadingTick / 4) * 100}%` }}
                  transition={{ ease: 'easeInOut', duration: 0.6 }}
                  style={{ height: '100%', background: '#C89B3C', borderRadius: '2px' }}
                />
              </motion.div>

              {/* Blessing */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.45 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                style={{
                  color: '#C89B3C',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  margin: '52px 0 0 0'
                }}
              >
                Om Sri Venkateshaya Namaha
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation Bar */}
      {step < 3 && (
        <footer className={styles.footer} style={{ zIndex: 10, background: 'transparent' }}>
          <div className={styles.pagination}>
            {[1, 2].map((s) => (
               <div 
                key={s} 
                className={`${styles.dot} ${step === s ? styles.dotActive : ''}`} 
                style={{
                  backgroundColor: step === s ? '#0F5132' : 'rgba(15, 81, 50, 0.15)',
                  transform: step === s ? 'scale(1.4)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            ))}
          </div>
          
          <motion.button
            className={styles.nextButton}
            onClick={nextStep}
            disabled={step === 2 && !name.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '20px',
              padding: '16px 24px',
              background: '#0F5132',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(15, 81, 50, 0.25)',
              border: 'none',
              fontSize: '15px',
              fontWeight: 800
            }}
          >
            {step === 2 ? (
              <>
                <Sparkles size={18} /> Let&apos;s Go!
              </>
            ) : (
              <>
                Continue <ChevronRight size={18} />
              </>
            )}
          </motion.button>
        </footer>
      )}
    </div>
  );
}
