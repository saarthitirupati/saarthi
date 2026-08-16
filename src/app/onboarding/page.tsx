'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Check, ArrowLeft, Compass, 
  Sparkles, Globe, ChevronRight, Lock, 
  BookOpen, Activity 
} from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import styles from './Onboarding.module.css';

interface LanguageOption {
  code: 'en' | 'te';
  flag: string;
  nativeName: string;
  subText: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', flag: '🇮🇳', nativeName: 'English', subText: 'Continue in English' },
  { code: 'te', flag: '🇮🇳', nativeName: 'తెలుగు', subText: 'తెలుగులో కొనసాగండి' }
];

const TRANSLATIONS = {
  en: {
    selectLanguage: 'Choose Your Language',
    selectLanguageSub: 'మీ భాషను ఎంచుకోండి',
    welcomeTitle: 'Welcome to Saarthi',
    welcomeSub: 'Your trusted companion for a smooth & meaningful journey in Tirupati.',
    cards: [
      { title: 'Live Updates', desc: 'Real-time darshan, crowd levels, and instant alerts.', color: '#059669', bg: '#E5F3EB', icon: Activity },
      { title: 'Curated Places', desc: 'Detailed guides for temples, nature, and hidden gems.', color: '#D97706', bg: '#FFF7ED', icon: Compass },
      { title: 'Travel Essentials', desc: 'Official rules, transport options, and helpful checklists.', color: '#2563EB', bg: '#EFF6FF', icon: BookOpen }
    ],
    nameTitle: 'What should we call you?',
    nameDesc: "We'll personalize your dashboard & recommendations.",
    namePlaceholder: 'Enter your name',
    nameExamples: 'e.g. Raghav, Sreeja, Mahesh',
    privacyNote: 'Your privacy is our priority. We never share your details; they are stored strictly on this device.',
    btnContinue: 'Continue',
    btnLetsGo: "Let's Go!",
    loadingTagline: 'Getting your guide ready...',
    blessing: 'OM SRI VENKATESHAYA NAMAHA',
    skip: 'Skip'
  },
  te: {
    selectLanguage: 'మీ భాషను ఎంచుకోండి',
    selectLanguageSub: 'Choose Your Language',
    welcomeTitle: 'సారథికి స్వాగతం',
    welcomeSub: 'తిరుపతి యాత్రను సులభంగా, ఆధ్యాత్మికంగా అనుభవించేందుకు మీ విశ్వసనీయ సహచరి.',
    cards: [
      { title: 'లైవ్ సమాచారం', desc: 'దర్శనం లైవ్ సమయాలు, రద్దీ వివరాలు, తక్షణ హెచ్చరికలు.', color: '#059669', bg: '#E5F3EB', icon: Activity },
      { title: 'దర్శనీయ స్థలాలు', desc: 'ఆలయాలు, ప్రకృతి అందాలు, ఆధ్యాత్మిక క్షేత్రాల సమగ్ర మార్గదర్శిని.', color: '#D97706', bg: '#FFF7ED', icon: Compass },
      { title: 'యాత్రా సదుపాయాలు', desc: 'అధికారిక నిబంధనలు, రవాణా వివరాలు, సులువైన పరిశీలనల జాబితా.', color: '#2563EB', bg: '#EFF6FF', icon: BookOpen }
    ],
    nameTitle: 'మిమ్మల్ని ఏమని పిలవాలి?',
    nameDesc: 'మీ తిరుమల యాత్ర వివరాలను మీ కోసం ప్రత్యేకంగా తీర్చిదిద్దుతాం.',
    namePlaceholder: 'మీ పేరు నమోదు చేయండి',
    nameExamples: 'ఉదా: రాఘవ్, శ్రీజ, మహేష్',
    privacyNote: 'మీ గోప్యత మా బాధ్యత. మీ వివరాలు సురక్షితంగా కేవలం మీ ఫోన్‌లోనే ఉంటాయి.',
    btnContinue: 'కొనసాగండి',
    btnLetsGo: 'ప్రారంభిద్దాం',
    loadingTagline: 'మీ యాత్ర మార్గదర్శిని సిద్ధం అవుతోంది...',
    blessing: 'ఓం శ్రీ వెంకటేశాయ నమః',
    skip: 'దాటవేయి'
  }
};

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

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'te'>('en');
  const [isMounted, setIsMounted] = useState(false);

  const [locationPerm] = useState(true);
  const [notifPerm] = useState(true);

  const [loadingTick, setLoadingTick] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    const savedName = localStorage.getItem('saarthi_user_name');
    if (savedName) setName(savedName);

    const savedLanguage = localStorage.getItem('saarthi_user_language') as 'en' | 'te';
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'te')) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    if (step === 4) {
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

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  const nextStep = () => {
    if (step === 3 && !name.trim()) return;
    setStep(s => Math.min(s + 1, 4));
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const finish = () => {
    const defaultName = selectedLanguage === 'te' ? 'యాత్రికులు' : 'Traveler';
    const finalName = name.trim() || defaultName;
    localStorage.setItem('hasSeenOnboarding', 'true');
    localStorage.setItem('saarthi_user_name', finalName);
    localStorage.setItem('saarthi_user_language', selectedLanguage);
    
    localStorage.setItem('saarthi_location_enabled', locationPerm ? 'true' : 'false');
    localStorage.setItem('saarthi_notif_enabled', notifPerm ? 'true' : 'false');

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

  const progressPct = (step / 3) * 100;

  return (
    <div className={styles.container} style={{ background: step === 4 ? '#0A2518' : 'radial-gradient(circle at top, #FFFFFF 0%, #FAFAF7 100%)' }}>
      
      {step < 4 && (
        <div className={styles.rotatingMandala} />
      )}

      {step < 4 && (
        <header className={styles.header} style={{ zIndex: 10 }}>
          {step > 1 ? (
            <motion.button 
              className={styles.backButton} 
              onClick={prevStep} 
              aria-label="Back"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
            >
              <ArrowLeft size={18} style={{ color: '#0F172A' }} />
            </motion.button>
          ) : (
            <div style={{ width: 40 }} />
          )}
          {step < 3 ? (
            <motion.button 
              className={styles.skipButton} 
              onClick={() => setStep(4)}
              whileHover={{ x: 2 }}
              style={{ color: '#0F5132', fontWeight: 800, fontSize: '14px' }}
            >
              {t.skip}
            </motion.button>
          ) : (
            <div style={{ width: 40 }} />
          )}
        </header>
      )}

      {step < 4 && (
        <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(15, 81, 50, 0.08)', position: 'relative', zIndex: 10 }}>
          <motion.div 
            style={{ height: '100%', background: 'linear-gradient(90deg, #0F5132 0%, #C89B3C 100%)' }}
            initial={{ width: 0 }}
            animate={{ width: progressPct + '%' }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          />
        </div>
      )}

      <div className={styles.contentArea} style={{ zIndex: 5 }}>
        <AnimatePresence mode="wait">
          
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 8px 0' }}>
                  <Logo size={48} />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                  <h1 style={{ fontSize: '19px', fontWeight: 900, color: '#0F172A', margin: '0 0 4px 0', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Globe size={18} style={{ color: '#0F5132' }} /> {t.selectLanguage}
                  </h1>
                  <p style={{ fontSize: '12.5px', color: '#64748B', lineHeight: 1.35, margin: 0 }}>
                    {t.selectLanguageSub}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                  {LANGUAGES.map((lang) => {
                    const isSelected = selectedLanguage === lang.code;
                    return (
                      <motion.button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          localStorage.setItem('saarthi_user_language', lang.code);
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '13px 16px',
                          borderRadius: '16px',
                          background: isSelected ? 'rgba(15, 81, 50, 0.04)' : '#FFFFFF',
                          border: isSelected ? '2px solid #0F5132' : '1px solid #E2E8F0',
                          boxShadow: isSelected ? '0 4px 16px rgba(15, 81, 50, 0.12)' : '0 2px 8px rgba(0,0,0,0.03)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '20px' }}>{lang.flag}</span>
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>{lang.nativeName}</div>
                            <div style={{ fontSize: '11.5px', fontWeight: 600, color: isSelected ? '#0F5132' : '#64748B', marginTop: '1px' }}>{lang.subText}</div>
                          </div>
                        </div>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: isSelected ? 'none' : '2px solid #CBD5E1',
                          background: isSelected ? '#0F5132' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <footer className={styles.footer}>
                <div className={styles.pagination}>
                  {[1, 2, 3].map((s) => (
                    <div 
                      key={s} 
                      className={styles.dot + (step === s ? ' ' + styles.dotActive : '')} 
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderRadius: '16px',
                    padding: '13px 20px',
                    background: '#0F5132',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 24px rgba(15, 81, 50, 0.25)',
                    border: 'none',
                    fontSize: '14.5px',
                    fontWeight: 800
                  }}
                >
                  {t.btnContinue} <ChevronRight size={18} />
                </motion.button>
              </footer>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              className={styles.slide}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '4px 0 8px 0'
                }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '18px',
                    background: 'linear-gradient(135deg, #FFFDF7 0%, #FEF3C7 100%)',
                    border: '1.5px solid #FDE68A',
                    boxShadow: '0 6px 16px rgba(200, 155, 60, 0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Logo size={36} />
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <h1 style={{ fontSize: '19px', fontWeight: 900, color: '#0F172A', margin: '0 0 3px 0', letterSpacing: '-0.02em' }}>
                    <span className="notranslate">{t.welcomeTitle}</span>
                  </h1>
                  <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.35, margin: 0, padding: '0 8px' }}>
                    {t.welcomeSub}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  {t.cards.map((card, idx) => {
                    const CardIcon = card.icon;
                    return (
                      <div 
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '14px',
                          padding: '8px 12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: card.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <CardIcon size={16} style={{ color: card.color }} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '0 0 1px 0' }}>{card.title}</h3>
                          <p style={{ fontSize: '11px', color: '#64748B', margin: 0, lineHeight: 1.3 }}>{card.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <footer className={styles.footer}>
                <div className={styles.pagination}>
                  {[1, 2, 3].map((s) => (
                    <div 
                      key={s} 
                      className={styles.dot + (step === s ? ' ' + styles.dotActive : '')} 
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderRadius: '16px',
                    padding: '13px 20px',
                    background: '#0F5132',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 24px rgba(15, 81, 50, 0.25)',
                    border: 'none',
                    fontSize: '14.5px',
                    fontWeight: 800
                  }}
                >
                  {t.btnContinue} <ChevronRight size={18} />
                </motion.button>
              </footer>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              className={styles.slide}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <motion.div className={styles.textContent} variants={cardVariants} style={{ marginTop: '4px', marginBottom: '10px' }}>
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '14px', 
                    backgroundColor: 'rgba(200, 155, 60, 0.15)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#C89B3C', 
                    margin: '0 auto 8px auto', 
                    boxShadow: '0 4px 12px rgba(200, 155, 60, 0.1)' 
                  }}>
                    <User size={22} />
                  </div>
                  <h1 className={styles.title} style={{ color: '#1A1A1A', fontSize: '19px', fontWeight: 800, margin: '0 0 3px 0' }}>{t.nameTitle}</h1>
                  <p className={styles.description} style={{ fontSize: '12px', margin: 0 }}>{t.nameDesc}</p>
                </motion.div>

                <motion.div className={styles.inputWrapper} variants={cardVariants} style={{ width: '100%', padding: '0 4px' }}>
                  <input
                    type="text"
                    className={styles.nameInput}
                    placeholder={t.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && name.trim() && nextStep()}
                    style={{
                      width: '100%',
                      padding: '13px 18px',
                      borderRadius: '16px',
                      border: '2px solid rgba(15, 81, 50, 0.12)',
                      fontSize: '15px',
                      fontWeight: 700,
                      textAlign: 'center',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
                      transition: 'all 0.3s',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      color: '#1A1A1A',
                      boxSizing: 'border-box'
                    }}
                    autoFocus
                  />
                  <p style={{ fontSize: '11px', color: '#718096', marginTop: '6px', textAlign: 'center', fontWeight: 500 }}>
                    {t.nameExamples}
                  </p>
                </motion.div>

                <motion.div 
                  className={styles.privacyNote} 
                  variants={cardVariants}
                  style={{ 
                    margin: '8px auto 0',
                    background: 'rgba(15, 81, 50, 0.05)',
                    border: '1px solid rgba(15, 81, 50, 0.1)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    maxWidth: '320px'
                  }}
                >
                  <div style={{ color: '#0F5132', flexShrink: 0 }}><Lock size={13} /></div>
                  <span className={styles.privacyText} style={{ color: '#0F5132', fontSize: '10.5px', fontWeight: 600, lineHeight: 1.3 }}>
                    {t.privacyNote}
                  </span>
                </motion.div>
              </div>

              <footer className={styles.footer}>
                <div className={styles.pagination}>
                  {[1, 2, 3].map((s) => (
                    <div 
                      key={s} 
                      className={styles.dot + (step === s ? ' ' + styles.dotActive : '')} 
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
                  disabled={!name.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderRadius: '16px',
                    padding: '13px 20px',
                    background: '#0F5132',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 24px rgba(15, 81, 50, 0.25)',
                    border: 'none',
                    fontSize: '14.5px',
                    fontWeight: 800
                  }}
                >
                  <Sparkles size={18} /> {t.btnLetsGo}
                </motion.button>
              </footer>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
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
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ marginBottom: '24px' }}
              >
                <Logo size={80} />
              </motion.div>

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
                {selectedLanguage === 'te' ? 'సారథి' : 'Saarthi'}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{
                  color: '#8A9A90',
                  fontSize: '13.5px',
                  fontWeight: 400,
                  margin: '0 0 48px 0',
                  letterSpacing: '0.01em',
                  textAlign: 'center'
                }}
              >
                {t.loadingTagline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ width: '160px', height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: ((loadingTick / 4) * 100) + '%' }}
                  transition={{ ease: 'easeInOut', duration: 0.6 }}
                  style={{ height: '100%', background: '#C89B3C', borderRadius: '2px' }}
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                style={{
                  color: '#C89B3C',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  margin: '52px 0 0 0',
                  textAlign: 'center'
                }}
              >
                {t.blessing}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
