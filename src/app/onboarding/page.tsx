'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Check, ArrowLeft, Clock, Compass, ShieldCheck, 
  MapPin, Calendar, Users, Heart, Sparkles, Globe,
  Bell, Download, BookOpen, ChevronRight, Lock
} from 'lucide-react';
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
  const [offlinePerm, setOfflinePerm] = useState(false);

  // Oracle loading simulator ticks
  const [loadingTick, setLoadingTick] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    const savedName = localStorage.getItem('saarthi_user_name');
    if (savedName) setName(savedName);

    const savedLanguage = localStorage.getItem('saarthi_user_language');
    if (savedLanguage) setSelectedLanguage(savedLanguage);
  }, []);

  // Step 5 (Oracle Loading) redirect sequence
  useEffect(() => {
    if (step === 5) {
      const interval = setInterval(() => {
        setLoadingTick(t => {
          if (t >= 4) {
            clearInterval(interval);
            finish();
            return 4;
          }
          return t + 1;
        });
      }, 900);
      return () => clearInterval(interval);
    }
  }, [step]);

  const LANGUAGES: LanguageOption[] = [
    { code: 'en', nativeName: 'English', englishName: 'English' },
    { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu' },
    { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi' },
    { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil' },
    { code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada' }
  ];

  const nextStep = () => {
    if (step === 2 && !name.trim()) return;
    setStep(s => Math.min(s + 1, 5));
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const finish = () => {
    const finalName = name.trim() || 'Traveler';
    localStorage.setItem('hasSeenOnboarding', 'true');
    localStorage.setItem('saarthi_user_name', finalName);
    localStorage.setItem('saarthi_user_language', selectedLanguage);
    localStorage.setItem('saarthi_offline_maps_enabled', offlinePerm ? 'true' : 'false');

    const finalPlannerInput = {
      timeMins: 1440, // 2 Days default
      budget: 1500,
      budgetTier: 'medium' as const,
      interests: ['spiritual'],
      groupType: 'family' as const,
      travelMode: 'car' as const
    };

    // Save initial state
    const initialTripState = {
      days: 0,
      savedMantras: [],
      savedPlaces: [],
      visitedPlaces: [],
      viewedPlaces: [],
      isInitialized: true,
      plannerInput: finalPlannerInput,
      generatedPlans: null,
      recommendations: null,
      userLocation: null,
      locationPermission: locationPerm ? 'granted' as const : 'denied' as const,
      savedPlans: []
    };

    localStorage.setItem('jeevapath_trip_state', JSON.stringify(initialTripState));
    window.location.href = '/';
  };

  if (!isMounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF8EB' }}>
        <div style={{
          width: '40px', height: '40px', border: '4px solid #F59E0B',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // 4 active navigation steps before loading screen
  const progressPct = (step / 4) * 100;

  return (
    <div className={styles.container} style={{ background: step === 5 ? '#0F172A' : 'radial-gradient(circle at top, #FFFBF5 0%, #F6EDE2 100%)' }}>
      
      {/* Decorative Rotating Mandala */}
      {step < 5 && (
        <div className={styles.rotatingMandala} />
      )}

      {/* Header */}
      {step < 5 && (
        <header className={styles.header} style={{ justifyContent: step > 1 ? 'space-between' : 'flex-end', zIndex: 10 }}>
          {step > 1 && (
            <motion.button 
              className={styles.backButton} 
              onClick={prevStep} 
              aria-label="Back"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                border: '1px solid #E7E3DD',
                boxShadow: '0 2px 8px rgba(139, 92, 62, 0.05)'
              }}
            >
              <ArrowLeft size={18} style={{ color: '#0F172A' }} />
            </motion.button>
          )}
          {step === 1 && (
            <motion.button 
              className={styles.skipButton} 
              onClick={finish}
              whileHover={{ x: 2 }}
              style={{ color: '#E9801D', fontWeight: 700 }}
            >
              Skip
            </motion.button>
          )}
        </header>
      )}

      {/* Progress Bar Container */}
      {step < 5 && (
        <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(15, 23, 42, 0.05)', position: 'relative', zIndex: 10 }}>
          <motion.div 
            style={{ height: '100%', background: 'linear-gradient(90deg, #E9801D 0%, #B0550C 100%)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          />
        </div>
      )}

      {/* Content Area */}
      <div className={styles.contentArea} style={{ zIndex: 5 }}>
        <AnimatePresence mode="wait">
          
          {/* Step 1: Welcome */}
          {step === 1 && (
            <motion.div
              key="step1"
              className={styles.slide}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ paddingBottom: '30px' }}
            >
              <motion.div className={styles.illustrationWrapper} variants={popIn} style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <div className={styles.templeHalo} />
                <div style={{
                  position: 'absolute',
                  inset: -10,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(233,128,29,0.08) 0%, transparent 70%)',
                  animation: 'logoPulse 3s infinite ease-in-out'
                }} />
                {/* Temple Silhouette SVG */}
                <svg width="100" height="100" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 2 }}>
                  <path d="M60 10L66 18H54L60 10Z" stroke="#E9801D" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M50 18H70V28H50V18Z" stroke="#E9801D" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M45 28H75V42H45V28Z" stroke="#E9801D" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M40 42H80V60H40V42Z" stroke="#E9801D" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M35 60H85V82H35V60Z" stroke="#E9801D" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M30 82H90V105H30V82Z" stroke="#E9801D" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M52 105V93C52 88.5817 55.5817 85 60 85C64.4183 85 68 88.5817 68 93V105" stroke="#E9801D" strokeWidth="2.5" strokeLinejoin="round"/>
                </svg>
              </motion.div>

              <motion.div className={styles.textContent} variants={cardVariants}>
                <h1 className={styles.title} style={{ color: '#0F172A', fontSize: '26px', fontWeight: 800 }}>Welcome to Saarthi 🙏</h1>
                <p className={styles.description} style={{ color: '#475569', fontSize: '13px', lineHeight: 1.6 }}>
                  Your trusted companion for a peaceful, informed and meaningful pilgrimage.
                </p>
              </motion.div>

              {/* Staggered features rendering */}
              <motion.div className={styles.featureList} variants={staggerContainer} style={{ width: '100%', marginTop: '20px' }}>
                {[
                  { icon: <Clock size={16} />, color: 'rgba(233,128,29,0.12)', stroke: '#E9801D', title: 'Live Crowd Updates', desc: 'Realtime wait times, parking, and queue status.' },
                  { icon: <Compass size={16} />, color: 'rgba(16,185,129,0.12)', stroke: '#10B981', title: 'Smart Recommendations', desc: 'Personalized routes and timings for your family.' },
                  { icon: <BookOpen size={16} />, color: 'rgba(59,130,246,0.12)', stroke: '#3B82F6', title: 'Pilgrim Essentials', desc: 'Find free lockers, safety guidelines, and locker keys.' },
                  { icon: <Download size={16} />, color: 'rgba(139,92,246,0.12)', stroke: '#8B5CF6', title: 'Offline Support', desc: 'Access temple guides and maps when networks fail.' }
                ].map((f, idx) => (
                  <motion.div 
                    key={idx} 
                    className={styles.featureItem} 
                    variants={cardVariants}
                    style={{
                      background: 'rgba(255, 255, 255, 0.75)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      borderRadius: '20px',
                      padding: '16px 20px',
                      boxShadow: '0 4px 16px rgba(139, 92, 62, 0.04)',
                      marginBottom: '12px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Color bar left accent */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      background: f.stroke
                    }} />
                    <div className={styles.featureIconWrapper} style={{ backgroundColor: f.color, color: f.stroke }}>
                      {f.icon}
                    </div>
                    <div className={styles.featureText}>
                      <span className={styles.featureTitle} style={{ color: '#0F172A', fontWeight: 700, fontSize: '13px' }}>{f.title}</span>
                      <span className={styles.featureDesc} style={{ color: '#64748B', fontSize: '11px' }}>{f.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
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
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(233, 128, 29, 0.12)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#E9801D', 
                  margin: '0 auto 16px auto', 
                  boxShadow: '0 4px 12px rgba(233,128,29,0.08)' 
                }}>
                  <User size={24} />
                </div>
                <h1 className={styles.title} style={{ color: '#0F172A', fontSize: '24px' }}>What should we call you?</h1>
                <p className={styles.description}>We&apos;ll personalize your pilgrimage guide.</p>
              </motion.div>

              <motion.div className={styles.inputWrapper} variants={cardVariants} style={{ width: '100%' }}>
                <input
                  type="text"
                  className={styles.nameInput}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && name.trim() && nextStep()}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    border: '2px solid #E2E8F0',
                    fontSize: '15px',
                    fontWeight: 700,
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    transition: 'all 0.3s'
                  }}
                  autoFocus
                />
                <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px', textAlign: 'center', fontWeight: 600 }}>
                  e.g. Raghav, Sreeja, Mahesh
                </p>
              </motion.div>

              <motion.div 
                className={styles.privacyNote} 
                variants={cardVariants}
                style={{ 
                  marginTop: '32px',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  maxWidth: '320px'
                }}
              >
                <div style={{ color: '#10B981', flexShrink: 0 }}><Lock size={16} /></div>
                <span className={styles.privacyText} style={{ color: '#065F46', fontSize: '10.5px', fontWeight: 600, lineHeight: 1.45 }}>
                  Your privacy is important. We never share your details and store them strictly on this device.
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* Step 3: Enable Permissions */}
          {step === 3 && (
            <motion.div
              key="step3"
              className={styles.slide}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div className={styles.textContent} variants={cardVariants} style={{ marginTop: '20px', marginBottom: '20px' }}>
                <h1 className={styles.title} style={{ color: '#0F172A', fontSize: '24px' }}>Enable Permissions</h1>
                <p className={styles.description}>Saarthi requires these to guide you correctly.</p>
              </motion.div>

              <motion.div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }} variants={staggerContainer}>
                {/* Location */}
                <motion.div 
                  className={styles.permItem} 
                  variants={cardVariants} 
                  style={{ 
                    borderRadius: '20px', 
                    padding: '16px 20px', 
                    background: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    boxShadow: '0 4px 16px rgba(139, 92, 62, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div className={styles.permIconWrapper} style={{ background: 'rgba(233, 128, 29, 0.12)', color: '#E9801D' }}><MapPin size={16} /></div>
                    <div className={styles.permText}>
                      <span className={styles.permTitle} style={{ color: '#0F172A', fontWeight: 700 }}>Location Access</span>
                      <span className={styles.permDesc}>Calculates distance to temples and triggers queue path alerts.</span>
                    </div>
                  </div>
                  <div 
                    className={`${styles.toggleSwitch} ${locationPerm ? styles.toggleSwitchActive : ''}`}
                    onClick={() => setLocationPerm(!locationPerm)}
                    style={{ background: locationPerm ? '#10B981' : '#CBD5E1' }}
                  >
                    <motion.div 
                      className={styles.toggleDot} 
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      style={{ x: locationPerm ? 20 : 0 }}
                    />
                  </div>
                </motion.div>

                {/* Notifications */}
                <motion.div 
                  className={styles.permItem} 
                  variants={cardVariants} 
                  style={{ 
                    borderRadius: '20px', 
                    padding: '16px 20px', 
                    background: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    boxShadow: '0 4px 16px rgba(139, 92, 62, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div className={styles.permIconWrapper} style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}><Bell size={16} /></div>
                    <div className={styles.permText}>
                      <span className={styles.permTitle} style={{ color: '#0F172A', fontWeight: 700 }}>Smart Notifications</span>
                      <span className={styles.permDesc}>Warns you of queue times spikes and changes in token status.</span>
                    </div>
                  </div>
                  <div 
                    className={`${styles.toggleSwitch} ${notifPerm ? styles.toggleSwitchActive : ''}`}
                    onClick={() => setNotifPerm(!notifPerm)}
                    style={{ background: notifPerm ? '#10B981' : '#CBD5E1' }}
                  >
                    <motion.div 
                      className={styles.toggleDot} 
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      style={{ x: notifPerm ? 20 : 0 }}
                    />
                  </div>
                </motion.div>

                {/* Offline Downloads */}
                <motion.div 
                  className={styles.permItem} 
                  variants={cardVariants} 
                  style={{ 
                    borderRadius: '20px', 
                    padding: '16px 20px', 
                    background: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    boxShadow: '0 4px 16px rgba(139, 92, 62, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div className={styles.permIconWrapper} style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6' }}><Download size={16} /></div>
                    <div className={styles.permText}>
                      <span className={styles.permTitle} style={{ color: '#0F172A', fontWeight: 700 }}>Offline Maps</span>
                      <span className={styles.permDesc}>Downloads temple guides for use where networks drop.</span>
                    </div>
                  </div>
                  <div 
                    className={`${styles.toggleSwitch} ${offlinePerm ? styles.toggleSwitchActive : ''}`}
                    onClick={() => setOfflinePerm(!offlinePerm)}
                    style={{ background: offlinePerm ? '#10B981' : '#CBD5E1' }}
                  >
                    <motion.div 
                      className={styles.toggleDot} 
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      style={{ x: offlinePerm ? 20 : 0 }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Step 4: Almost Ready */}
          {step === 4 && (
            <motion.div
              key="step4"
              className={styles.slide}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div className={styles.textContent} variants={cardVariants} style={{ marginTop: '40px', marginBottom: '24px' }}>
                <motion.div 
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(16, 185, 129, 0.12)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#10B981', 
                    margin: '0 auto 16px auto',
                    boxShadow: '0 4px 16px rgba(16,185,129,0.12)'
                  }}
                  variants={popIn}
                >
                  <Check size={32} strokeWidth={3.5} />
                </motion.div>
                <h1 className={styles.title} style={{ color: '#0F172A', fontSize: '24px' }}>Almost Ready</h1>
                <p className={styles.description}>Your customized companion is compiled.</p>
              </motion.div>

              <motion.div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }} variants={staggerContainer}>
                {[
                  'Spiritual Profile Created',
                  'Locale Language Saved',
                  'Permissions Setup Complete',
                  'Personalized Planner Ready'
                ].map((check, i) => (
                  <motion.div 
                    key={i} 
                    className={styles.checkRow} 
                    variants={cardVariants}
                    style={{ 
                      borderRadius: '20px', 
                      padding: '16px 20px', 
                      background: 'rgba(255, 255, 255, 0.75)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      boxShadow: '0 4px 16px rgba(139, 92, 62, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <motion.div className={styles.circleCheck} variants={popIn} style={{ background: '#10B981' }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <motion.path 
                          d="M2.5 6L5 8.5L9.5 3.5" 
                          stroke="#FFFFFF" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          variants={drawCheck}
                        />
                      </svg>
                    </motion.div>
                    <span className={styles.checkLabel} style={{ color: '#0F172A', fontWeight: 700 }}>{check}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Step 5: Oracle Loading (Navy screen) */}
          {step === 5 && (
            <motion.div
              key="step5"
              className={styles.slide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{ 
                justifyContent: 'center', 
                background: '#0F172A', 
                minHeight: '100%', 
                position: 'absolute', 
                inset: 0, 
                zIndex: 100, 
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {/* Spinning background rings */}
              <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                border: '1px solid rgba(233, 128, 29, 0.04)',
                pointerEvents: 'none'
              }} />

              <motion.h2 
                className={styles.title} 
                style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: 700 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                Consulting the Oracle
              </motion.h2>
              <p className={styles.description} style={{ color: '#94A3B8', marginTop: '6px', fontSize: '12px' }}>Preparing today&apos;s recommendations...</p>
              
              <div className={styles.oracleCircle}>
                <div className={styles.oracleRing} style={{ borderColor: 'rgba(233, 128, 29, 0.3)' }} />
                <div className={styles.oraclePulse} style={{ background: 'radial-gradient(circle, rgba(233, 128, 29, 0.15) 0%, transparent 70%)' }} />
                
                {/* Temple Silhouette SVG pulsing */}
                <motion.svg 
                  width="44" 
                  height="44" 
                  viewBox="0 0 120 120" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  style={{ zIndex: 10 }}
                  animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <path d="M60 10L66 18H54L60 10Z" stroke="#E9801D" strokeWidth="4" strokeLinejoin="round"/>
                  <path d="M50 18H70V28H50V18Z" stroke="#E9801D" strokeWidth="4" strokeLinejoin="round"/>
                  <path d="M45 28H75V42H45V28Z" stroke="#E9801D" strokeWidth="4" strokeLinejoin="round"/>
                  <path d="M40 42H80V60H40V42Z" stroke="#E9801D" strokeWidth="4" strokeLinejoin="round"/>
                  <path d="M35 60H85V82H35V60Z" stroke="#E9801D" strokeWidth="4" strokeLinejoin="round"/>
                  <path d="M30 82H90V105H30V82Z" stroke="#E9801D" strokeWidth="4" strokeLinejoin="round"/>
                </motion.svg>
              </div>
              <span className={styles.oracleSubText} style={{ color: '#E9801D', fontSize: '10px', letterSpacing: '2px', fontWeight: 700 }}>
                CALIBRATING ALGORITHMS
              </span>

              <div className={styles.oracleLoaderGrid} style={{ marginTop: '40px' }}>
                {[
                  { tick: 1, label: '☀️ Loading Weather' },
                  { tick: 2, label: '👥 Analyzing Crowd' },
                  { tick: 3, label: '🚗 Checking Parking' },
                  { tick: 4, label: '🛕 Personalizing Guide' }
                ].map((load) => {
                  const isChecked = loadingTick >= load.tick;
                  return (
                    <motion.div 
                      key={load.tick} 
                      className={styles.oracleLoaderItem}
                      animate={isChecked ? { scale: [0.95, 1.02, 1] } : {}}
                      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                      style={{ 
                        opacity: isChecked ? 1 : 0.25,
                        border: isChecked ? '1px solid rgba(233, 128, 29, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                        backgroundColor: isChecked ? 'rgba(233, 128, 29, 0.06)' : 'rgba(255,255,255,0.02)',
                        borderRadius: '16px',
                        padding: '12px 14px'
                      }}
                    >
                      <span style={{ fontSize: '12px' }}>
                        {isChecked ? '✨' : '⏳'}
                      </span>
                      <span className={styles.oracleLoaderText} style={{ color: isChecked ? '#FFF' : '#94A3B8', fontSize: '11px', fontWeight: 600 }}>
                        {load.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation Bar */}
      {step < 5 && (
        <footer className={styles.footer} style={{ zIndex: 10, background: 'transparent' }}>
          <div className={styles.pagination}>
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`${styles.dot} ${step === s ? styles.dotActive : ''}`} 
                style={{
                  backgroundColor: step === s ? '#E9801D' : 'rgba(15, 23, 42, 0.1)',
                  transform: step === s ? 'scale(1.3)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            ))}
          </div>
          
          <motion.button
            className={styles.nextButton}
            onClick={step === 4 ? () => setStep(5) : nextStep}
            disabled={step === 2 && !name.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '16px',
              padding: '14px 24px',
              background: '#0F172A',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
              border: 'none',
              fontSize: '14px',
              fontWeight: 800
            }}
          >
            {step === 4 ? (
              <>
                <Sparkles size={16} /> Start My Journey
              </>
            ) : (
              <>
                Continue <ChevronRight size={16} />
              </>
            )}
          </motion.button>
        </footer>
      )}
    </div>
  );
}
