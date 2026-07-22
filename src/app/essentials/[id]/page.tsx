'use client';

import { use, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Clock, ShieldAlert, Navigation, Info, Check, X,
  Lock, Utensils, Scissors, Bed, ShoppingBag, Phone, HelpCircle, ChevronRight, FileText
} from 'lucide-react';
import styles from '../Essentials.module.css';

import { KNOWLEDGE_ITEMS, FAQ_ITEMS } from '@/content/knowledge';
import { useTrip } from '@/components/TripContext';
import { calculateDistance } from '@/utils/location';

// Map iconName strings to Lucide React components
import { 
  Briefcase, Smartphone, Footprints, Droplets, Users, Hospital, Bus, Shirt, Camera
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  lock: Lock,
  utensils: Utensils,
  scissors: Scissors,
  bed: Bed,
  'shopping-bag': ShoppingBag,
  'shield-alert': ShieldAlert,
  briefcase: Briefcase,
  smartphone: Smartphone,
  footprints: Footprints,
  droplets: Droplets,
  users: Users,
  hospital: Hospital,
  bus: Bus,
  shirt: Shirt,
  camera: Camera
};

export default function EssentialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { userLocation } = useTrip();
  const item = KNOWLEDGE_ITEMS.find(t => t.id === id || t.intentId === id);

  // Real-time distance from user to this facility
  const liveDistance = useMemo(() => {
    if (!userLocation || !item?.coordinates) return null;
    const distKm = calculateDistance(userLocation.lat, userLocation.lng, item.coordinates.lat, item.coordinates.lng);
    const distM = Math.round(distKm * 1000);
    return {
      label: distM < 1000 ? `${distM} m` : `${distKm.toFixed(1)} km`,
      walkMins: Math.max(1, Math.round(distM / 80)), // ~80m/min walking pace
    };
  }, [userLocation, item]);

  if (!isMounted) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: '36px', height: '36px', border: '3px solid #D97706',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center', padding: '40px', textAlign: 'center' }}>
        <ShieldAlert size={48} color="#DC2626" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0F172A' }}>Essential Intent Not Found</h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '8px 0 20px 0' }}>The requested facility or intent action does not exist in our directory.</p>
        <button onClick={() => router.push('/essentials')} className={styles.ctaButton} style={{ width: 'auto', padding: '0 24px' }}>
          Back to Essentials
        </button>
      </div>
    );
  }

  const IconComp = ICON_MAP[item.iconName] || Info;

  // Handle Google Maps navigation
  const handleOpenMap = (customQuery?: string) => {
    if (item.coordinates) {
      const q = customQuery ? encodeURIComponent(customQuery) : `${item.coordinates.lat},${item.coordinates.lng}`;
      const url = `https://www.google.com/maps/search/?api=1&query=${q}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCallEmergency = () => {
    window.location.href = 'tel:108';
  };

  // Related FAQs
  const relatedFaqs = FAQ_ITEMS.filter(faq => 
    faq.searchAliases.some(alias => item.searchAliases.includes(alias)) || faq.category === item.category
  ).slice(0, 3);

  return (
    <div className={styles.container}>
      {/* Sticky Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/essentials')} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className={styles.headerTitle}>{item.name}</h1>
          <p className={styles.headerSubtitle}>{item.shortDescription}</p>
        </div>
        <div style={{ width: '36px' }} />
      </header>

      <div className={styles.scrollArea}>
        
        {/* INSIDE HERO BANNER CARD */}
        <div className={styles.insideHeader}>
          <div className={styles.insideHeroTitle}>
            <div className={styles.primaryCardIconBox} style={{ width: '48px', height: '48px' }}>
              <IconComp size={26} />
            </div>
            <span>{item.name}</span>
          </div>

          <p className={styles.insideHeroSubtitle}>{item.description}</p>

          <div className={styles.insideBadges}>
            <span className={styles.badgeOpen}>{item.status}</span>
            <span className={styles.badgeVerified}>Verified Today</span>
            {item.requirements?.mandatoryDoc && (
              <span className={styles.badgeVerified} style={{ background: '#FEF3C7', color: '#B45309', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={12} />
                {item.requirements.mandatoryDoc}
              </span>
            )}
          </div>
        </div>

        {/* SUB-LOCATIONS LIST */}
        {item.subLocations && item.subLocations.length > 0 && (
          <section className={styles.subLocationsSection}>
            <h3 className={styles.sectionTitle}>Locations & Counters</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {item.subLocations.map((loc, idx) => (
                <div key={idx} className={styles.subLocationCard}>
                  <div className={styles.subLocationInfo}>
                    <h4 className={styles.subLocationName}>{loc.name}</h4>
                    <div className={styles.subLocationMeta}>
                      <span className={styles.subLocationWalk}>Walk • {loc.walkTime}</span>
                      <span>{loc.distance}</span>
                      <span style={{ color: '#16A34A', fontWeight: 600 }}>• {loc.status}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleOpenMap(loc.name)}
                    style={{
                      background: '#F8F8F8', border: '1px solid #E5E5E5', borderRadius: '10px',
                      padding: '8px 12px', fontSize: '12px', fontWeight: 700, color: '#0E6B72',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    <Navigation size={12} />
                    Directions
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STEP-BY-STEP PROCEDURE TIMELINE */}
        {item.procedureTimeline && item.procedureTimeline.length > 0 && (
          <section className={styles.timelineSection}>
            <h3 className={styles.sectionTitle}>Step-by-Step Procedure</h3>
            <div className={styles.timelineList}>
              {item.procedureTimeline.map((step) => (
                <div key={step.stepNumber} className={styles.timelineItem}>
                  <div className={styles.timelineBadge}>{step.stepNumber}</div>
                  <div className={styles.timelineContent}>
                    <h4 className={styles.timelineStepTitle}>{step.title}</h4>
                    {step.description && <p className={styles.timelineStepDesc}>{step.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* REQUIREMENTS CHECKLIST (✓ / ✗) */}
        {item.requirements && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 className={styles.sectionTitle}>Need to Carry / Rules</h3>
            <div className={styles.requirementsContainer}>
              {/* Allowed / Required */}
              <div className={styles.reqBoxAllowed}>
                <h4 className={styles.reqTitle} style={{ color: '#16A34A' }}>✓ What to Carry</h4>
                {item.requirements.carry.map((req, idx) => (
                  <div key={idx} className={styles.reqItem} style={{ color: '#15803D' }}>
                    <Check size={14} color="#16A34A" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>

              {/* Prohibited */}
              <div className={styles.reqBoxProhibited}>
                <h4 className={styles.reqTitle} style={{ color: '#DC2626' }}>✗ Do Not Carry</h4>
                {item.requirements.prohibited.map((req, idx) => (
                  <div key={idx} className={styles.reqItem} style={{ color: '#B91C1C' }}>
                    <X size={14} color="#DC2626" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* VISITOR GUIDELINES & TIPS */}
        {item.tips && item.tips.length > 0 && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 className={styles.sectionTitle}>Pilgrim Tips & Advice</h3>
            <div style={{ background: '#F8F8F8', border: '1px solid #E5E5E5', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {item.tips.map((tip, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#475569', lineHeight: 1.45 }}>
                  <span style={{ color: '#D97706', fontWeight: 800 }}>✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RELATED FAQS */}
        {relatedFaqs.length > 0 && (
          <section className={styles.faqSection}>
            <h3 className={styles.sectionTitle} style={{ marginBottom: '12px' }}>Related Questions</h3>
            <div className={styles.faqList}>
              {relatedFaqs.map((faq) => (
                <div key={faq.id} className={styles.faqItem}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 4px 0', color: '#0F172A' }}>{faq.question}</h4>
                  <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.4 }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 48px HEIGHT GOOGLE MAPS CTA BUTTON */}
        {item.coordinates && (
          <button className={styles.ctaButton} onClick={() => handleOpenMap()}>
            <Navigation size={18} />
            Navigate via Google Maps ({liveDistance ? liveDistance.label : item.distance})
          </button>
        )}
      </div>

      {/* STICKY EMERGENCY HELP BAR */}
      <div className={styles.stickyEmergencyBar}>
        <div className={styles.emergencyLeft}>
          <ShieldAlert size={22} color="#FFFFFF" />
          <div>
            <h4 className={styles.emergencyTitle}>Emergency Help</h4>
            <p className={styles.emergencySub}>Police • Medical • Lost & Found</p>
          </div>
        </div>
        <button className={styles.emergencyCallBtn} onClick={handleCallEmergency}>
          <Phone size={14} />
          Call 108
        </button>
      </div>
    </div>
  );
}
