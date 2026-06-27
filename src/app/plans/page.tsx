'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTrip } from '@/components/TripContext';
import { PLACES } from '@/data/places';
import { Star, Clock, Wallet, Navigation, Sparkles, MapPin, ArrowRight, Car, HelpCircle } from 'lucide-react';
import styles from './Plans.module.css';
import { useState, useEffect } from 'react';

// Framer motion cascading animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 15 
    } 
  }
};

// Innovation #9: Zero-Clutter Itinerary Timeline Component with Cascading Animations
function PlanTimeline({ stops }: { stops: any[] }) {
  const router = useRouter();
  
  return (
    <motion.div 
      className={styles.timelineContainer}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className={styles.timelineLine} />
      
      {stops.map((stop, idx) => {
        const place = PLACES.find(p => p.id === stop.placeId);
        if (!place) return null;

        return (
          <motion.div 
            key={idx} 
            className={styles.timelineStep}
            variants={itemVariants}
          >
            {/* Time Indicator */}
            <div className={styles.timeMarker}>
              <span className={styles.arrivalTime}>{stop.arrivalTime}</span>
              <div className={styles.dot} />
            </div>

            {/* Stop Card */}
            <div 
              className={styles.timelineCard}
              onClick={() => router.push(`/place/${place.id}`)}
            >
              <div className={styles.stopImage} style={{ backgroundImage: `url(${place.image})` }} />
              <div className={styles.stopInfo}>
                <div className={styles.stopHeader}>
                  <h4>{place.name}</h4>
                  <span className={styles.durationTag}>{place.durationMins}m</span>
                </div>
                <div className={styles.stopMeta}>
                  <MapPin size={12} />
                  <span>{place.location}</span>
                </div>
              </div>
            </div>

            {/* Travel Connector (except for last stop) */}
            {idx < stops.length - 1 && (
              <div className={styles.travelConnector}>
                <div className={styles.travelDetails}>
                  <Car size={13} />
                  <span>{stop.travelToNext} mins travel</span>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default function PlansComparison() {
  const { generatedPlans, recommendations, savedPlaces, plannerInput, setGeneratedPlans } = useTrip();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  // ML States
  const [showMlPanel, setShowMlPanel] = useState(false);
  const [weights, setWeights] = useState<any>(null);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    setMounted(true);
    import('@/lib/recommendation-engine').then(m => {
      setWeights(m.getMLWeights());
    });
  }, []);

  const handleManualRetrain = async () => {
    setIsTraining(true);
    const m = await import('@/lib/recommendation-engine');
    
    // Train with user saves or a default list if none saved yet
    const trainPlaces = savedPlaces && savedPlaces.length > 0 ? savedPlaces : ['swami-pushkarini', 'venkateswara'];
    m.trainMLModel(trainPlaces);
    
    // Simulate real visual training progression delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Re-generate plans with updated weights
    const res = m.generatePlans(plannerInput);
    setGeneratedPlans(res.plans, res.recommendations);
    
    setWeights(m.getMLWeights());
    setIsTraining(false);
  };

  const handleResetWeights = async () => {
    const m = await import('@/lib/recommendation-engine');
    m.resetMLWeights();
    setWeights(m.getMLWeights());
    
    const res = m.generatePlans(plannerInput);
    setGeneratedPlans(res.plans, res.recommendations);
  };

  if (!mounted) return null;

  if (!generatedPlans || generatedPlans.length === 0) {
    return (
      <div className={styles.empty}>
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles size={56} color="var(--color-saffron-500)" />
        </motion.div>
        <h2>Generating your paths...</h2>
        <p>Wait a moment while we scan the sacred hills and design your optimal itinerary.</p>
        <button 
          className={styles.startBtn} 
          style={{ maxWidth: '240px', marginTop: '24px' }}
          onClick={() => router.push('/planner')}
        >
          Back to Planner
        </button>
      </div>
    );
  }

  const activePlan = generatedPlans[activeIndex];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>The 3 Chosen Paths</h1>
        <p>Optimized for your time, budget, and spiritual intent.</p>
      </header>

      {/* Plan Switcher */}
      <div className={styles.selector}>
        {generatedPlans.map((p, i) => (
          <button
            key={p.type}
            className={`${styles.selectorBtn} ${activeIndex === i ? styles.active : ''}`}
            onClick={() => setActiveIndex(i)}
          >
            <span className={styles.selectorEmoji}>{p.emoji}</span>
            <div className={styles.selectorText}>
              <span className={styles.selectorLabel}>{p.title}</span>
              <span className={styles.selectorPrice}>₹{p.totalCost}</span>
            </div>
            {activeIndex === i && (
              <motion.div 
                layoutId="activePlan" 
                className={styles.activeBg}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className={styles.planView}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activePlan.type}
            className={styles.planDetails}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {/* Strategy Summary Header */}
            <div className={styles.planOverview}>
              <div className={styles.planBadge}>
                <Sparkles size={12} />
                <span>{activePlan.title} Strategy</span>
              </div>
              <h2 className={styles.planTagline}>{activePlan.tagline}</h2>
              
              <div className={styles.planStats}>
                <div className={styles.statItem}>
                  <Clock size={18} />
                  <span>{Math.floor(activePlan.totalMins / 60)}h {activePlan.totalMins % 60}m</span>
                </div>
                <div className={styles.statItem}>
                  <Wallet size={18} />
                  <span>₹{activePlan.totalCost}</span>
                </div>
                <div className={styles.statItem}>
                  <Navigation size={18} />
                  <span>{activePlan.stops.length} Stops</span>
                </div>
              </div>
            </div>

            {/* Itinerary Timeline */}
            <div className={styles.timelineSection}>
              <h3 className={styles.sectionTitle}>
                <Navigation size={18} color="var(--color-teal-500)" />
                Peek into the Path
              </h3>
              <PlanTimeline stops={activePlan.stops} />
            </div>

            {/* Action CTA */}
            <button 
              className={styles.startBtn}
              onClick={() => router.push(`/itinerary/${activePlan.type}`)}
            >
              Confirm this Journey <ArrowRight size={20} />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* AI/ML Engine Dashboard */}
      {weights && (
        <div className={styles.mlDashboard}>
          <div className={styles.mlHeader} onClick={() => setShowMlPanel(!showMlPanel)}>
            <div className={styles.mlTitleContainer}>
              <Sparkles size={18} className={styles.aiSparkleIcon} />
              <div>
                <h3>On-Device ML Engine</h3>
                <p>Self-learning model weights trained on your interactions</p>
              </div>
            </div>
            <button className={styles.mlToggleBtn}>
              {showMlPanel ? 'Hide Model State' : 'Inspect Model State'}
            </button>
          </div>
          
          <AnimatePresence>
            {showMlPanel && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={styles.mlContent}
              >
                <div className={styles.mlMetricsGrid}>
                  <div className={styles.mlMetricCard}>
                    <span className={styles.metricLabel}>Optimization Algorithm</span>
                    <span className={styles.metricValue}>SGD + Sigmoid Activation</span>
                  </div>
                  <div className={styles.mlMetricCard}>
                    <span className={styles.metricLabel}>Feature Vectors</span>
                    <span className={styles.metricValue}>25 Dimensions</span>
                  </div>
                  <div className={styles.mlMetricCard}>
                    <span className={styles.metricLabel}>Training Epochs Run</span>
                    <span className={styles.metricValue}>{(weights.trainingCount || 0) * 15} iterations</span>
                  </div>
                </div>

                <div className={styles.weightsSection}>
                  <h4>Learned Interest Weights</h4>
                  <div className={styles.weightsGrid}>
                    {Object.entries(weights.interests).map(([interest, weightVal]: [string, any]) => (
                      <div key={interest} className={styles.weightRow}>
                        <span className={styles.weightName}>{interest}</span>
                        <div className={styles.weightBarContainer}>
                          <div 
                            className={styles.weightBar} 
                            style={{ width: `${Math.min(100, (weightVal / 5) * 100)}%` }} 
                          />
                        </div>
                        <span className={styles.weightValue}>{weightVal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.weightsSection}>
                  <h4>Learned Global Weights</h4>
                  <div className={styles.weightsGrid}>
                    <div className={styles.weightRow}>
                      <span className={styles.weightName}>User Rating Significance</span>
                      <div className={styles.weightBarContainer}>
                        <div className={styles.weightBar} style={{ width: `${Math.min(100, (weights.rating / 5) * 100)}%` }} />
                      </div>
                      <span className={styles.weightValue}>{weights.rating.toFixed(2)}</span>
                    </div>
                    <div className={styles.weightRow}>
                      <span className={styles.weightName}>Must Visit Priority</span>
                      <div className={styles.weightBarContainer}>
                        <div className={styles.weightBar} style={{ width: `${Math.min(100, (weights.mustVisit / 5) * 100)}%` }} />
                      </div>
                      <span className={styles.weightValue}>{weights.mustVisit.toFixed(2)}</span>
                    </div>
                    <div className={styles.weightRow}>
                      <span className={styles.weightName}>Duration Match Tolerance</span>
                      <div className={styles.weightBarContainer}>
                        <div className={styles.weightBar} style={{ width: `${Math.min(100, (weights.duration / 5) * 100)}%` }} />
                      </div>
                      <span className={styles.weightValue}>{weights.duration.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.mlActions}>
                  <button 
                    onClick={handleManualRetrain} 
                    disabled={isTraining}
                    className={styles.retrainBtn}
                  >
                    {isTraining ? 'Training Epochs...' : 'Force Epoch Training'}
                  </button>
                  <button 
                    onClick={handleResetWeights}
                    className={styles.resetWeightsBtn}
                  >
                    Reset Weights
                  </button>
                </div>
                
                {isTraining && (
                  <div className={styles.trainingOverlay}>
                    <div className={styles.spinner} />
                    <span>Running SGD Backpropagation...</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Contextual Alternatives */}
      {recommendations && recommendations.length > 0 && (
        <div className={styles.recommendationsSection}>
          <div className={styles.recHeader}>
            <h3>Contextual Alternatives</h3>
            <p>Places that fit your vibe and almost made the cut.</p>
          </div>
          <div className={styles.recGrid}>
            {recommendations.slice(0, 10).map((place) => (
              <div 
                key={place.id} 
                className={styles.recCard}
                onClick={() => router.push(`/place/${place.id}`)}
              >
                <div className={styles.recImage} style={{ backgroundImage: `url(${place.image})` }} />
                <div className={styles.recInfo}>
                  <h4>{place.name}</h4>
                  <div className={styles.recMeta}>
                    <Star size={12} fill="var(--color-saffron-500)" color="var(--color-saffron-500)" />
                    <span>{place.rating || '4.5'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
