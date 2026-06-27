'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PlannerProvider, usePlanner } from '@/store/PlannerContext';
import TimeSelector from '@/components/planner/TimeSelector';
import BudgetSelector from '@/components/planner/BudgetSelector';
import MoodSelector from '@/components/planner/MoodSelector';
import InterestSelector from '@/components/planner/InterestSelector';
import GroupTravelSelector from '@/components/planner/GroupTravelSelector';
import styles from './page.module.css';
import { ArrowLeft, X } from 'lucide-react';
import { useTrip } from '@/components/TripContext';

const TOTAL_STEPS = 3;

const STEP_LABELS = ['Time', 'Budget', 'Interests'];

function PlannerFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { state } = usePlanner();
  const { setPlannerInput } = useTrip();

  const nextStep = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const prevStep = () => {
    if (step === 1) router.back();
    else setStep((s) => Math.max(s - 1, 1));
  };

  const handleGenerate = () => {
    // Build the full input object synchronously and store it
    const planInput = {
      timeMins:   state.timeAvailable ?? 180,
      budget:     state.budgetTier === 'budget' ? 500 : state.budgetTier === 'premium' ? 3000 : 1000,
      budgetTier: (state.budgetTier ?? 'medium') as 'budget' | 'medium' | 'premium',
      interests:  state.selectedInterests.length > 0 ? state.selectedInterests : ['nature', 'spiritual'],
    };

    // Store in sessionStorage so generating page can read it immediately
    sessionStorage.setItem('jeevapath_pending_plan', JSON.stringify(planInput));

    // Also update TripContext
    setPlannerInput(planInput);

    router.push('/generating');
  };

  const progressPct = (step / TOTAL_STEPS) * 100;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.closeButton} onClick={prevStep} aria-label="Back">
          {step === 1 ? <X size={22} /> : <ArrowLeft size={22} />}
        </button>

        <div className={styles.stepIndicator}>
          <span className={styles.stepText}>{STEP_LABELS[step - 1]}</span>
          <span className={styles.stepCount}>{step} / {TOTAL_STEPS}</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <motion.div
          className={styles.progressFill}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>

      {/* Step dots */}
      <div className={styles.stepDots}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i + 1 <= step ? styles.dotActive : ''}`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className={styles.contentArea}>
        <AnimatePresence mode="wait">
          {step === 1 && <TimeSelector key="time" onNext={nextStep} />}
          {step === 2 && <BudgetSelector key="budget" onNext={nextStep} onBack={prevStep} />}
          {step === 3 && <InterestSelector key="interest" onGenerate={handleGenerate} onBack={prevStep} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function PlannerPage() {
  return (
    <PlannerProvider>
      <PlannerFlow />
    </PlannerProvider>
  );
}
