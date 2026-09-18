'use client';

import { use, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Clock, ShieldAlert, Navigation, Info, Check, X,
  Lock, Utensils, Scissors, Bed, ShoppingBag, Phone, HelpCircle, ChevronRight, FileText,
  Share2, AlertTriangle, CheckCircle2, XCircle, ChevronDown, ChevronUp, Sparkles, ShieldCheck
} from 'lucide-react';
import styles from '../Essentials.module.css';
import SaarthiGuidanceCard from '@/components/SaarthiGuidanceCard';

import { KNOWLEDGE_ITEMS, FAQ_ITEMS, SubLocation } from '@/content/knowledge';
import { useTrip } from '@/components/TripContext';
import { calculateDrivingDistance, TIRUPATI_CENTER, isCoordinateOnTirumalaHill, isWithinTirupatiRegion } from '@/utils/location';
import { SrivariNamamVector, LotusMandalaVector, TempleArchVector } from '@/components/common/DevotionalSvgIcons';

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
  camera: Camera,
  'file-text': FileText,
  clock: Clock,
  'map-pin': MapPin
};

export default function EssentialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { userLocation } = useTrip();
  const item = KNOWLEDGE_ITEMS.find(t => t.id === id || t.intentId === id);

  const isLocalUser = userLocation && isWithinTirupatiRegion(userLocation.lat, userLocation.lng);
  const effectiveLocation = isLocalUser ? userLocation! : TIRUPATI_CENTER;
  const isTirumalaSpot = item?.location?.toLowerCase().includes('tirumala') || 
                         item?.location?.toLowerCase().includes('vqc') || 
                         (item?.coordinates ? isCoordinateOnTirumalaHill(item.coordinates.lat, item.coordinates.lng) : false);

  // Real-time dynamic driving distance from user to this facility
  const liveDistance = useMemo(() => {
    if (!item?.coordinates) return null;
    const distKm = calculateDrivingDistance(
      effectiveLocation.lat,
      effectiveLocation.lng,
      item.coordinates.lat,
      item.coordinates.lng,
      Boolean(isTirumalaSpot)
    );
    const distM = Math.round(distKm * 1000);
    return {
      label: distKm < 1 ? `${distM} m` : `${distKm.toFixed(1)} km`,
      walkMins: Math.max(1, Math.round(distKm * 12)),
    };
  }, [effectiveLocation, item, isTirumalaSpot]);

  // Filtered categories breakdown
  const displayedCategories = useMemo(() => {
    if (!item?.itemCategories) return [];
    if (selectedCategoryFilter === 'all') return item.itemCategories;
    return item.itemCategories.filter(c => c.title.toLowerCase().includes(selectedCategoryFilter.toLowerCase()));
  }, [item?.itemCategories, selectedCategoryFilter]);

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
        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#0F172A' }}>Essential Facility Not Found</h2>
        <p style={{ fontSize: '13px', color: '#64748B', margin: '8px 0 20px 0' }}>The requested facility does not exist in our directory.</p>
        <button onClick={() => router.push('/essentials')} className={styles.ctaButton} style={{ width: 'auto', padding: '0 24px' }}>
          Back to Essentials
        </button>
      </div>
    );
  }

  const IconComp = ICON_MAP[item.iconName] || Info;

  const handleOpenMap = (customQuery?: string) => {
    if (item.coordinates) {
      const dest = customQuery 
        ? encodeURIComponent(`${customQuery} Tirupati`) 
        : `${item.coordinates.lat},${item.coordinates.lng}`;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCallEmergency = () => {
    window.location.href = 'tel:108';
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  // Related FAQs
  const relatedFaqs = FAQ_ITEMS.filter(faq => 
    faq.searchAliases.some(alias => item.searchAliases.includes(alias)) || faq.category === item.category
  ).slice(0, 4);

  return (
    <div className={styles.container}>
      {/* Sticky Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/essentials')} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', padding: '0 8px', textAlign: 'center' }}>
          <h1 className={styles.headerTitle}>{item.name}</h1>
          <p className={styles.headerSubtitle}>{item.shortDescription}</p>
        </div>
        <button className={styles.iconButton} onClick={handleShare} aria-label="Share">
          <Share2 size={18} />
        </button>
      </header>

      {/* Share Toast Notification */}
      {showShareToast && (
        <div style={{
          position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#0F172A', color: '#FFFFFF', padding: '8px 16px', borderRadius: '20px',
          fontSize: '12px', fontWeight: 700, zIndex: 99, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <CheckCircle2 size={14} color="#22C55E" />
          Link copied to clipboard!
        </div>
      )}

      <div className={styles.scrollArea}>
        
        {/* HERO BANNER CARD */}
        <div className={styles.insideHeader} style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFBEB 100%)', boxShadow: '0 4px 16px rgba(15,23,42,0.04)', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle Devotional Background Watermark */}
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1, pointerEvents: 'none' }}>
            <LotusMandalaVector size={130} opacity={0.9} />
          </div>
          <div className={styles.insideHeroTitle}>
            <div className={styles.primaryCardIconBox} style={{ width: '52px', height: '52px', background: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A', borderRadius: '16px', position: 'relative', zIndex: 1 }}>
              <IconComp size={28} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.01em' }}>{item.name}</span>
                <SrivariNamamVector size={20} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                <MapPin size={12} color="#64748B" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>{item.location}</span>
                {liveDistance && (
                  <span style={{ background: '#FEF3C7', color: '#B45309', padding: '1px 7px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                    {liveDistance.label} • {liveDistance.walkMins}m walk
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className={styles.insideHeroSubtitle} style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5 }}>
            {item.description}
          </p>

          <div className={styles.insideBadges}>
            <span className={styles.badgeOpen}>{item.status}</span>
            <span className={styles.badgeVerified}>Verified Today</span>
            {item.tag && <span className={styles.badgeVerified} style={{ background: '#FEF3C7', color: '#B45309' }}>{item.tag}</span>}
            {item.requirements?.mandatoryDoc && (
              <span className={styles.badgeVerified} style={{ background: '#FEE2E2', color: '#991B1B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <FileText size={12} />
                {item.requirements.mandatoryDoc}
              </span>
            )}
          </div>
        </div>

        {/* EXPLAINABLE RATIONALE CALLOUT ("WHY THIS MATTERS BEFORE DARSHAN") */}
        {item.whyItMatters && (
          <div className={styles.whyItMattersCard}>
            <div className={styles.whyItMattersHeader}>
              <AlertTriangle size={16} color="#D97706" />
              <span>Why This is Required Before Queue Entry</span>
            </div>
            <p className={styles.whyItMattersText}>
              {item.whyItMatters}
            </p>
          </div>
        )}

        {/* ✨ SAARTHI GUIDANCE CARD */}
        <SaarthiGuidanceCard />

        {/* FEATURE HIGHLIGHTS MATRIX (4 PILLARS) */}
        {item.highlights && item.highlights.length > 0 && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 className={styles.sectionTitle}>Key Facilities & Features</h3>
            <div className={styles.highlightsGrid}>
              {item.highlights.map((hl, idx) => {
                const HIcon = ICON_MAP[hl.iconName] || ShieldCheck;
                return (
                  <div key={idx} className={styles.highlightCard}>
                    <div className={styles.highlightIconBox}>
                      <HIcon size={20} />
                    </div>
                    <h4 className={styles.highlightTitle}>{hl.title}</h4>
                    <p className={styles.highlightSub}>{hl.subtitle}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* INTERACTIVE ITEM SELECTOR ("WHAT ARE YOU CARRYING?") */}
        {item.itemCategories && item.itemCategories.length > 0 && (
          <section className={styles.itemCategoriesSection}>
            <div className={styles.sectionHeaderRow}>
              <div>
                <h3 className={styles.sectionTitle}>What Are You Carrying?</h3>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 600 }}>
                  Tap an item category to filter rules & deposit counters
                </p>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className={styles.categoryFilterTabs}>
              <button 
                className={`${styles.categoryFilterTab} ${selectedCategoryFilter === 'all' ? styles.categoryFilterTabActive : ''}`}
                onClick={() => setSelectedCategoryFilter('all')}
              >
                All Items ({item.itemCategories.length})
              </button>
              {item.itemCategories.map((cat, idx) => {
                const isActive = selectedCategoryFilter.toLowerCase() === cat.title.toLowerCase() || 
                                 (selectedCategoryFilter !== 'all' && cat.title.toLowerCase().includes(selectedCategoryFilter.toLowerCase()));
                return (
                  <button 
                    key={idx}
                    className={`${styles.categoryFilterTab} ${isActive ? styles.categoryFilterTabActive : ''}`}
                    onClick={() => setSelectedCategoryFilter(isActive ? 'all' : cat.title)}
                  >
                    {cat.title.split('&')[0].trim()}
                  </button>
                );
              })}
            </div>

            {/* Filtered Item Cards Grid */}
            <div className={styles.itemCategoriesGrid}>
              {displayedCategories.map((cat, idx) => {
                const CIcon = ICON_MAP[cat.iconName] || Lock;
                return (
                  <div key={idx} className={styles.itemCategoryCard}>
                    <div className={styles.itemCategoryHeader}>
                      <div className={styles.itemCategoryLeft}>
                        <div className={styles.itemCategoryIconBox}>
                          <CIcon size={20} />
                        </div>
                        <h4 className={styles.itemCategoryTitle}>{cat.title}</h4>
                      </div>
                      <span className={styles.itemCategoryTag}>{cat.tag}</span>
                    </div>
                    <p className={styles.itemCategoryDesc}>{cat.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SUB-LOCATIONS LIST & COUNTER FINDER */}
        {item.subLocations && item.subLocations.length > 0 && (
          <section className={styles.subLocationsSection}>
            <div className={styles.sectionHeaderRow}>
              <div>
                <h3 className={styles.sectionTitle}>Official Deposit Locations & Counters</h3>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 600 }}>
                  Free TTD counters around Tirumala transit hubs
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {item.subLocations.map((loc, idx) => {
                const distVal = userLocation ? calculateDrivingDistance(userLocation.lat, userLocation.lng, item.coordinates.lat, item.coordinates.lng, Boolean(isTirumalaSpot)) : null;
                const isCloseBy = !distVal || distVal <= 2;
                return (
                  <div key={idx} className={styles.subLocationCard}>
                    <div className={styles.subLocationInfo}>
                      <h4 className={styles.subLocationName}>{loc.name}</h4>
                      <div className={styles.subLocationMeta}>
                        {isCloseBy && <span className={styles.subLocationWalk}>Walk • {loc.walkTime}</span>}
                        <span>{distVal !== null ? `${distVal} km` : loc.distance}</span>
                        <span style={{ color: '#16A34A', fontWeight: 700 }}>• {loc.status}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleOpenMap(loc.name)}
                      style={{
                        background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px',
                        padding: '8px 14px', fontSize: '12px', fontWeight: 800, color: '#059669',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0
                      }}
                    >
                      <Navigation size={13} />
                      Directions
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP-BY-STEP PROCEDURE TIMELINE */}
        {item.procedureTimeline && item.procedureTimeline.length > 0 && (
          <section className={styles.timelineSection}>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
              <TempleArchVector height={16} />
            </div>
            <h3 className={styles.sectionTitle}>Step-by-Step Deposit & Retrieval Flow</h3>
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

        {/* REQUIREMENTS CHECKLIST (ALLOWED / PROHIBITED) */}
        {item.requirements && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 className={styles.sectionTitle}>Need to Carry / Rules</h3>
            <div className={styles.requirementsContainer}>
              {/* Allowed / Required */}
              <div className={styles.reqBoxAllowed}>
                <h4 className={styles.reqTitle} style={{ color: '#16A34A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="#16A34A" />
                  What to Carry
                </h4>
                {item.requirements.carry.map((req, idx) => (
                  <div key={idx} className={styles.reqItem} style={{ color: '#15803D' }}>
                    <Check size={14} color="#16A34A" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>

              {/* Prohibited */}
              <div className={styles.reqBoxProhibited}>
                <h4 className={styles.reqTitle} style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <XCircle size={16} color="#DC2626" />
                  Do Not Carry
                </h4>
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
            <h3 className={styles.sectionTitle}>Pilgrim Advice & Pro-Tips</h3>
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '18px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {item.tips.map((tip, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#92400E', lineHeight: 1.45, fontWeight: 500, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RELATED FAQS ACCORDION */}
        {relatedFaqs.length > 0 && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 className={styles.sectionTitle}>Frequently Asked Questions</h3>
            <div className={styles.faqAccordionList}>
              {relatedFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div key={faq.id} className={`${styles.faqAccordionItem} ${isExpanded ? styles.faqAccordionItemActive : ''}`}>
                    <div 
                      className={styles.faqAccordionQuestion}
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                    >
                      <span>{faq.question}</span>
                      {isExpanded ? <ChevronUp size={18} color="#D97706" /> : <ChevronDown size={18} color="#64748B" />}
                    </div>
                    {isExpanded && (
                      <div className={styles.faqAccordionAnswer}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
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
