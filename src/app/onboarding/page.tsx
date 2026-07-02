'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bus } from 'lucide-react';
import styles from './Onboarding.module.css';

const ONBOARDING_SLIDES = [
  {
    id: 'discover',
    title: 'Discover places\nwith meaning',
    description: 'Explore temples, waterfalls, heritage sites and hidden gems curated for you.',
    image: '/assets/onboarding/discover.png',
    icon: <MapPin size={24} color="#8B5C3E" />,
  },
  {
    id: 'reach',
    title: 'Know how\nto reach',
    description: 'Check RTC options, travel time, cost for bus, car or bike and the best routes.',
    image: '/assets/onboarding/reach.png',
    icon: <Bus size={24} color="#8B5C3E" />,
  },
  {
    id: 'story',
    title: 'Understand\nthe story',
    description: 'Read brief history, see photos and watch videos to connect with the place.',
    image: '/assets/onboarding/story.png',
    icon: null, // Third slide doesn't have a center floating icon
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleSkip = () => {
    finishOnboarding();
  };

  const finishOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    router.push('/');
  };

  if (!isMounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDF1E6' }}>
        <div style={{ 
          width: '40px', height: '40px', border: '4px solid #E9801D', 
          borderTopColor: 'transparent', borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const slide = ONBOARDING_SLIDES[currentSlide];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0
    })
  };

  return (
    <div className={styles.container}>
      {/* Header with Skip button */}
      <header className={styles.header}>
        <button className={styles.skipButton} onClick={handleSkip}>
          Skip
        </button>
      </header>

      {/* Main Content Area */}
      <div className={styles.contentArea}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            className={styles.slide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            {/* Illustration */}
            <div className={styles.imageWrapper}>
              <div 
                className={styles.image} 
                style={{ backgroundImage: `url(${slide.image})` }} 
              />
              {slide.icon && (
                <div className={styles.floatingIcon}>
                  {slide.icon}
                </div>
              )}
            </div>

            {/* Text Content */}
            <div className={styles.textContent}>
              <h1 className={styles.title}>{slide.title}</h1>
              <p className={styles.description}>{slide.description}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer (Dots + Button) */}
      <div className={styles.footer}>
        <div className={styles.pagination}>
          {ONBOARDING_SLIDES.map((_, index) => (
            <div 
              key={index} 
              className={`${styles.dot} ${index === currentSlide ? styles.dotActive : ''}`} 
            />
          ))}
        </div>
        
        <button className={styles.nextButton} onClick={handleNext}>
          {currentSlide === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
}
