'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Users, Sparkles, Compass, 
  Zap, Check, ArrowLeft, Car, Bus, Footprints, Smile
} from 'lucide-react';
import styles from './Onboarding.module.css';

interface PresetProfile {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  plannerInput: {
    timeMins: number;
    budget: number;
    budgetTier: 'budget' | 'medium' | 'premium';
    interests: string[];
    groupType: 'solo' | 'family' | 'couple' | 'elderly';
    travelMode: 'walk' | 'public' | 'car';
  };
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<string>('family_spiritual');
  const [groupType, setGroupType] = useState<'solo' | 'family' | 'couple' | 'elderly'>('elderly');
  const [budgetTier, setBudgetTier] = useState<'budget' | 'medium' | 'premium'>('medium');
  const [travelMode, setTravelMode] = useState<'walk' | 'public' | 'car'>('car');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Pre-populate if name is already set
    const savedName = localStorage.getItem('saarthi_user_name');
    if (savedName) setName(savedName);
  }, []);

  const PRESETS: PresetProfile[] = [
    {
      id: 'family_spiritual',
      label: 'Spiritual Family',
      icon: <Users size={24} />,
      description: 'Low physical strain, rest buffers, accessibility, and side temples.',
      plannerInput: {
        timeMins: 1440,
        budget: 1500,
        budgetTier: 'medium',
        interests: ['spiritual', 'family'],
        groupType: 'elderly',
        travelMode: 'car'
      }
    },
    {
      id: 'solo_devotee',
      label: 'Solo Devotee',
      icon: <Sparkles size={24} />,
      description: 'Fast-paced, strict ritual timings, and queue forecasts.',
      plannerInput: {
        timeMins: 720,
        budget: 800,
        budgetTier: 'medium',
        interests: ['spiritual'],
        groupType: 'solo',
        travelMode: 'walk'
      }
    },
    {
      id: 'student_budget',
      label: 'Budget Student',
      icon: <Compass size={24} />,
      description: 'Adventure trails, cost-splitting, hidden waterfalls, and cheap eats.',
      plannerInput: {
        timeMins: 2160,
        budget: 500,
        budgetTier: 'budget',
        interests: ['nature', 'adventure', 'food', 'gems'],
        groupType: 'solo',
        travelMode: 'public'
      }
    },
    {
      id: 'quick_transit',
      label: 'Quick Transit',
      icon: <Zap size={24} />,
      description: 'Maximum convenience, premium stays, and direct taxi transport.',
      plannerInput: {
        timeMins: 480,
        budget: 3000,
        budgetTier: 'premium',
        interests: ['nature', 'shopping', 'photo'],
        groupType: 'couple',
        travelMode: 'car'
      }
    }
  ];

  // When a preset profile is selected, auto-update the individual logistics settings
  const handleSelectProfile = (id: string) => {
    setSelectedProfile(id);
    const preset = PRESETS.find(p => p.id === id);
    if (preset) {
      setGroupType(preset.plannerInput.groupType);
      setBudgetTier(preset.plannerInput.budgetTier);
      setTravelMode(preset.plannerInput.travelMode);
    }
  };

  const nextStep = () => {
    if (step === 1 && !name.trim()) return;
    setStep(s => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const finish = () => {
    const finalName = name.trim() || 'Explorer';
    localStorage.setItem('hasSeenOnboarding', 'true');
    localStorage.setItem('saarthi_user_name', finalName);

    // Get the selected preset values
    const selectedPreset = PRESETS.find(p => p.id === selectedProfile) || PRESETS[0];
    
    // Construct the planner input using the state overrides
    const finalPlannerInput = {
      timeMins: selectedPreset.plannerInput.timeMins,
      budget: budgetTier === 'budget' ? 500 : budgetTier === 'premium' ? 3000 : 1500,
      budgetTier: budgetTier,
      interests: selectedPreset.plannerInput.interests,
      groupType: groupType,
      travelMode: travelMode
    };

    // Save to the main useTripStore localStorage schema
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
      locationPermission: 'default',
      savedPlans: []
    };

    localStorage.setItem('jeevapath_trip_state', JSON.stringify(initialTripState));
    router.push('/');
  };

  if (!isMounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FCF8F2' }}>
        <div style={{
          width: '40px', height: '40px', border: '4px solid #E9801D',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const progressPct = (step / 3) * 100;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header} style={{ justifyContent: step > 1 ? 'space-between' : 'flex-end' }}>
        {step > 1 && (
          <button className={styles.backButton} onClick={prevStep} aria-label="Back">
            <ArrowLeft size={20} />
          </button>
        )}
        <button className={styles.skipButton} onClick={finish}>
          Skip Setup
        </button>
      </header>

      {/* Progress Line */}
      <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', position: 'relative' }}>
        <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: '#E9801D', transition: 'width 0.3s ease-out' }} />
      </div>

      {/* Content */}
      <div className={styles.contentArea}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              className={styles.slide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ justifyContent: 'center' }}
            >
              <div className={styles.logoWrapper}>
                <div
                  className={styles.logoImage}
                  style={{ backgroundImage: `url('/assets/logo.png')` }}
                />
              </div>
              <div className={styles.textContent}>
                <h1 className={styles.title}>Welcome to Saarthi</h1>
                <p className={styles.description}>Your intelligent Tirupati companion.<br />What should we call you?</p>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.nameInput}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && name.trim() && nextStep()}
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              className={styles.slide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.textContent} style={{ marginTop: '20px', marginBottom: '10px' }}>
                <h1 className={styles.title}>Choose Your Travel Profile</h1>
                <p className={styles.description}>Select a preset template to configure accessibility and routing defaults instantly.</p>
              </div>

              <div className={styles.stylesGrid}>
                {PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    className={`${styles.styleCard} ${selectedProfile === preset.id ? styles.styleCardActive : ''}`}
                    onClick={() => handleSelectProfile(preset.id)}
                  >
                    {selectedProfile === preset.id && (
                      <div className={styles.checkBadge}>
                        <Check size={12} color="#FFF" />
                      </div>
                    )}
                    <div className={styles.styleIconWrapper}>
                      {preset.icon}
                    </div>
                    <span className={styles.styleLabel}>{preset.label}</span>
                    <p style={{ fontSize: '11px', color: '#6B7280', textAlign: 'center', margin: 0, lineHeight: 1.3 }}>
                      {preset.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              className={styles.slide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.textContent} style={{ marginTop: '20px', marginBottom: '10px' }}>
                <h1 className={styles.title}>Logistics & Group Setup</h1>
                <p className={styles.description}>Fine-tune your travel details. We auto-adjust walk times and buffers based on your answers.</p>
              </div>

              <div className={styles.logisticsForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Who is traveling with you?</label>
                  <div className={styles.companionsGrid}>
                    <button 
                      className={`${styles.companionPill} ${groupType === 'elderly' ? styles.companionPillActive : ''}`}
                      onClick={() => setGroupType('elderly')}
                    >
                      Elderly Parents 👵
                    </button>
                    <button 
                      className={`${styles.companionPill} ${groupType === 'family' ? styles.companionPillActive : ''}`}
                      onClick={() => setGroupType('family')}
                    >
                      Family & Kids 👶
                    </button>
                    <button 
                      className={`${styles.companionPill} ${groupType === 'couple' ? styles.companionPillActive : ''}`}
                      onClick={() => setGroupType('couple')}
                    >
                      Couple / Friends 👫
                    </button>
                    <button 
                      className={`${styles.companionPill} ${groupType === 'solo' ? styles.companionPillActive : ''}`}
                      onClick={() => setGroupType('solo')}
                    >
                      Solo Devotee 🕉️
                    </button>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Choose your budget level</label>
                  <div className={styles.buttonGroup}>
                    <button 
                      className={`${styles.logisticsBtn} ${budgetTier === 'budget' ? styles.logisticsBtnActive : ''}`}
                      onClick={() => setBudgetTier('budget')}
                    >
                      Budget
                    </button>
                    <button 
                      className={`${styles.logisticsBtn} ${budgetTier === 'medium' ? styles.logisticsBtnActive : ''}`}
                      onClick={() => setBudgetTier('medium')}
                    >
                      Standard
                    </button>
                    <button 
                      className={`${styles.logisticsBtn} ${budgetTier === 'premium' ? styles.logisticsBtnActive : ''}`}
                      onClick={() => setBudgetTier('premium')}
                    >
                      Premium
                    </button>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Preferred Transit Mode</label>
                  <div className={styles.buttonGroup}>
                    <button 
                      className={`${styles.logisticsBtn} ${travelMode === 'car' ? styles.logisticsBtnActive : ''}`}
                      onClick={() => setTravelMode('car')}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Car size={16} /> Cab / Car
                    </button>
                    <button 
                      className={`${styles.logisticsBtn} ${travelMode === 'public' ? styles.logisticsBtnActive : ''}`}
                      onClick={() => setTravelMode('public')}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Bus size={16} /> Public Bus
                    </button>
                    <button 
                      className={`${styles.logisticsBtn} ${travelMode === 'walk' ? styles.logisticsBtnActive : ''}`}
                      onClick={() => setTravelMode('walk')}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Footprints size={16} /> Footpath
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.pagination}>
          <div className={`${styles.dot} ${step === 1 ? styles.dotActive : ''}`} />
          <div className={`${styles.dot} ${step === 2 ? styles.dotActive : ''}`} />
          <div className={`${styles.dot} ${step === 3 ? styles.dotActive : ''}`} />
        </div>
        <button
          className={styles.nextButton}
          onClick={step === 3 ? finish : nextStep}
          disabled={step === 1 && !name.trim()}
        >
          {step === 3 ? 'Generate Operating Plan' : 'Continue'}
        </button>
      </footer>
    </div>
  );
}
