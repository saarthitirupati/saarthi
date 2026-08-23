'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { darshanRegistry } from '@/content/darshans';
import styles from './page.module.css';
import { DarshanDetail } from '@/types/darshan';
import { 
  ArrowLeft, CheckCircle2, XCircle, Activity, Info, Coins, ShieldAlert, 
  MapPin, Sparkles, Shirt, Lightbulb, Droplet, UtensilsCrossed, 
  Toilet, Hospital, Accessibility, Baby, Clock, Share2, Check,
  Navigation, Ticket, Users, Zap, ShieldCheck, ChevronDown, Lock,
  RefreshCw, AlertCircle, Compass, Gift
} from 'lucide-react';
import { TirumalaStatus } from '@/lib/statusDb';
import { useLanguage } from '@/lib/useLanguage';

export default function DarshanDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';
  const id = rawId === 'ssd-tokens' || rawId === 'ssd' ? 'ssd-token' : rawId;
  const lang = useLanguage();

  const [data, setData] = useState<DarshanDetail | null>(null);
  const [liveWaitTime, setLiveWaitTime] = useState<string>('');
  const [crowdLevel, setCrowdLevel] = useState<'NORMAL' | 'MODERATE' | 'HIGH' | 'EXTREME'>('MODERATE');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  // Dynamic TTD Status Data
  const [ssdTokenStatus, setSsdTokenStatus] = useState<'issuing' | 'paused' | 'closed-for-day'>('closed-for-day');
  const [ssdNextTokenTime, setSsdNextTokenTime] = useState<string>('2:00 AM');
  const [ssdNotice, setSsdNotice] = useState<string>('');

  // Minimal Collapsible Sections (Roadmap open by default)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    roadmap: true,
    dress: false,
    amenities: false,
    whyWait: false
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  useEffect(() => {
    if (id && darshanRegistry[id]) {
      setData(darshanRegistry[id]);
    } else if (rawId && darshanRegistry[rawId]) {
      setData(darshanRegistry[rawId]);
    }
  }, [id, rawId]);

  const fetchStatus = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch('/api/v1/status', { cache: 'no-store' });
      if (res.ok) {
        const statusData: TirumalaStatus = await res.json();
        
        if (statusData.ssdTokenStatus) {
          setSsdTokenStatus(statusData.ssdTokenStatus);
        }
        if (statusData.ssdNextTokenTime) {
          setSsdNextTokenTime(statusData.ssdNextTokenTime);
        }
        if (statusData.ssdNotice) {
          setSsdNotice(statusData.ssdNotice);
        }

        const now = new Date();
        setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        if (statusData && statusData.darshans) {
          const mapNameToId = (name: string): string => {
            const lower = name.toLowerCase();
            if (lower.includes('sarva')) return 'sarva-darshan';
            if (lower.includes('300') || lower.includes('special')) return 'special-entry';
            if (lower.includes('ssd') || lower.includes('slotted') || lower.includes('token')) return 'ssd-token';
            if (lower.includes('footpath') || lower.includes('divya')) return 'divya-darshan';
            if (lower.includes('vip') || lower.includes('srivani')) return 'vip-break';
            return 'sarva-darshan';
          };

          const match = statusData.darshans.find((d: any) => mapNameToId(d.name) === id);
          if (match) {
            setLiveWaitTime(match.waitTime);
            const matchWait = match.waitTime || '';
            const matchNum = parseInt(matchWait.replace(/\D+/g, '')) || 0;
            if (matchNum >= 12 || /extreme|full|closed|heavy/i.test(matchWait)) {
              setCrowdLevel('EXTREME');
            } else if (matchNum >= 6 || /high|rush/i.test(matchWait)) {
              setCrowdLevel('HIGH');
            } else if (matchNum >= 3) {
              setCrowdLevel('MODERATE');
            } else {
              setCrowdLevel('NORMAL');
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch live status", err);
    } finally {
      setLoading(false);
      if (isManual) {
        setTimeout(() => setRefreshing(false), 500);
      }
    }
  };

  useEffect(() => {
    fetchStatus();

    const interval = setInterval(() => {
      fetchStatus();
    }, 20000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchStatus();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  if (!data) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading Pilgrim Guide...</p>
      </div>
    );
  }

  const themeColor = data.themeColor || '#0F5132';

  const getStepIcon = (index: number) => {
    switch(index) {
      case 1: return <MapPin size={17} />;
      case 2: return <ShieldCheck size={17} />;
      case 3: return <Users size={17} />;
      case 4: return <Navigation size={17} />;
      case 5: return <Sparkles size={17} />;
      case 6: return <Gift size={17} />;
      default: return <Compass size={17} />;
    }
  };

  const getFacilityVisual = (type: string) => {
    switch(type) {
      case 'water':      return { icon: <Droplet size={18} />, label: 'RO Water', color: '#0284C7', bg: '#F0F9FF' };
      case 'food':       return { icon: <UtensilsCrossed size={18} />, label: 'Annaprasadam', color: '#D97706', bg: '#FEF3C7' };
      case 'restroom':   return { icon: <Toilet size={18} />, label: 'Restrooms', color: '#475569', bg: '#F8FAFC' };
      case 'medical':    return { icon: <Hospital size={18} />, label: '24/7 Clinic', color: '#DC2626', bg: '#FEF2F2' };
      case 'wheelchair': return { icon: <Accessibility size={18} />, label: 'Wheelchair', color: '#7C3AED', bg: '#FAF5FF' };
      case 'infant':     return { icon: <Baby size={18} />, label: 'Infant Milk', color: '#DB2777', bg: '#FDF2F8' };
      default:           return { icon: <Sparkles size={18} />, label: 'Amenity', color: '#64748B', bg: '#F8FAFC' };
    }
  };

  return (
    <div className={styles.container}>
      
      {/* ── 1. MINIMAL APP BAR ── */}
      <header className={styles.topAppBar}>
        <button onClick={() => router.back()} className={styles.iconButton} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <div className={styles.appBarTitleBlock}>
          <span className={styles.livePulseIndicator} />
          <h1 className={`${styles.appBarTitle} ${lang === 'te' ? styles.teluguFont : ''}`}>
            {lang === 'te' ? (data.teluguTitle || data.title) : data.title}
          </h1>
        </div>
        <div className={styles.appBarActions}>
          <button 
            onClick={() => fetchStatus(true)} 
            className={`${styles.iconButton} ${refreshing ? styles.spinAnimation : ''}`} 
            aria-label="Refresh status"
            title="Refresh status"
          >
            <RefreshCw size={16} />
          </button>
          <button onClick={handleShare} className={styles.iconButton} aria-label="Share">
            {copied ? <Check size={16} color="#16A34A" /> : <Share2 size={16} />}
          </button>
        </div>
      </header>

      {/* Copy Toast */}
      {copied && (
        <div className={styles.toastNotification}>
          <CheckCircle2 size={15} /> Link copied to clipboard
        </div>
      )}

      {/* ── 2 & 3. RESPONSIVE DUAL-COLUMN LAYOUT ── */}
      <main className={styles.mainLayoutGrid}>

        {/* ── LEFT COLUMN: HERO STATUS CARD ── */}
        <div className={styles.leftColumn}>
          <section className={styles.heroStatusCard}>
            
            {/* Header: Icon + Title + Status Pill */}
            <div className={styles.cardHeaderRow}>
              <div className={styles.cardTitleWrap}>
                <div className={styles.cardTypeIcon} style={{ color: themeColor, backgroundColor: `${themeColor}12` }}>
                  <Ticket size={18} />
                </div>
                <h2 className={`${styles.cardMainHeading} ${lang === 'te' ? styles.teluguFont : ''}`}>
                  {lang === 'te' ? (data.teluguTitle || data.title) : data.title}
                </h2>
              </div>
              <span 
                className={styles.statusPill}
                style={{
                  backgroundColor: id === 'ssd-token' && ssdTokenStatus === 'closed-for-day' ? '#FEE2E2' : '#DCFCE7',
                  color: id === 'ssd-token' && ssdTokenStatus === 'closed-for-day' ? '#DC2626' : '#15803D'
                }}
              >
                {id === 'ssd-token' 
                  ? (ssdTokenStatus === 'closed-for-day' ? 'Closed for Day' : ssdTokenStatus === 'paused' ? 'Paused' : 'Issuing Now')
                  : `${crowdLevel} WAIT`}
              </span>
            </div>

            {/* Highlight Banner (Next Release / Key Metric) */}
            <div className={styles.highlightActionBanner}>
              <div className={styles.clockIconWrap}>
                <Clock size={18} color="#DC2626" />
              </div>
              <div className={styles.highlightBannerContent}>
                <span className={styles.highlightLabel}>
                  {id === 'ssd-token' ? 'Next Release / Issuing Time' : id === 'special-entry' ? 'Reporting Time Window' : 'Current Estimated Wait'}
                </span>
                <span className={styles.highlightValue}>
                  {id === 'ssd-token' 
                    ? (ssdNextTokenTime || '2:00 AM') 
                    : id === 'special-entry' 
                    ? '30 Mins Before Slot Time' 
                    : (liveWaitTime || data.waitTime)}
                </span>
              </div>
            </div>

            {/* Anxiety Relief Subtext */}
            <p className={styles.guidanceSubtext}>
              {id === 'ssd-token'
                ? 'Daily quota completed — next token release time indicated above'
                : id === 'special-entry'
                ? 'Report directly to ATC Car Parking entry with your original Aadhaar and printout'
                : 'Direct walk-in available 24/7 via Vaikuntam Queue Complex II'}
            </p>

            {/* Collection Centres / Landmark Spots */}
            {data.tokenLocations && data.tokenLocations.length > 0 && (
              <div className={styles.collectionCentresBlock}>
                <span className={styles.centresHeading}>Collection Centres</span>
                <div className={styles.centresList}>
                  {data.tokenLocations.map((loc, idx) => (
                    <div key={idx} className={styles.centreItem}>
                      <MapPin size={14} className={styles.centrePinIcon} />
                      <div className={styles.centreText}>
                        <strong className={styles.centreName}>{loc.name.split(' Complex')[0]}</strong>
                        <span className={styles.centreLandmark}> • {loc.landmark.replace('Directly opposite ', 'Opp. ').replace('Opposite ', 'Opp. ').split('(')[0].trim()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ground Truth Notice Box */}
            <div className={styles.groundNoticeBox}>
              <Clock size={16} className={styles.groundNoticeIcon} />
              <div className={styles.groundNoticeText}>
                {ssdNotice ? (
                  <span>{ssdNotice}</span>
                ) : id === 'ssd-token' ? (
                  <span>* 🔹 SSD Tokens – Current Status* Quota Opens @ 2:00 AM daily across all Tirupati centers until quota exhausts.</span>
                ) : id === 'special-entry' ? (
                  <span>* 🔹 ₹300 Special Entry* Strict biometric check at Supatham/ATC gate. Only original IDs accepted.</span>
                ) : (
                  <span>* 🔹 Sarva Darshan* Free meals, hot beverages, and drinking water served continuously in all compartments.</span>
                )}
              </div>
            </div>

          </section>
        </div>

        {/* ── RIGHT COLUMN: ACCORDIONS & DETAILS ── */}
        <div className={styles.rightColumn}>
          <div className={styles.accordionGroup}>

            {/* ── ACCORDION 1: JOURNEY ROADMAP (5 STEPS) ── */}
            <div className={styles.minimalAccordionCard}>
              <button 
                onClick={() => toggleSection('roadmap')} 
                className={styles.accordionHeader}
                aria-expanded={openSections.roadmap}
              >
                <div className={styles.accordionHeaderLeft}>
                  <div className={styles.sectionIconBadge} style={{ backgroundColor: `${themeColor}12`, color: themeColor }}>
                    <Navigation size={17} />
                  </div>
                  <div>
                    <h3 className={styles.accordionHeading}>Step-by-Step Darshan Flow</h3>
                    <span className={styles.accordionSubheading}>What happens upon arrival</span>
                  </div>
                </div>
                <div className={styles.accordionHeaderRight}>
                  <span className={styles.miniPillBadge}>{data.journeySteps.length} Steps</span>
                  <ChevronDown 
                    size={17} 
                    className={`${styles.chevron} ${openSections.roadmap ? styles.chevronRotated : ''}`} 
                  />
                </div>
              </button>

              {openSections.roadmap && (
                <div className={styles.accordionBody}>
                  <div className={styles.stepsTimeline}>
                    {data.journeySteps.map((step) => {
                      const isSelected = activeStep === step.step;
                      return (
                        <div 
                          key={step.step}
                          className={`${styles.stepNode} ${isSelected ? styles.stepNodeActive : ''}`}
                          onClick={() => setActiveStep(step.step)}
                        >
                          <div className={styles.stepBulletWrap}>
                            <div className={`${styles.stepBullet} ${isSelected ? styles.stepBulletActive : ''}`}>
                              {getStepIcon(step.step)}
                            </div>
                            {step.step < data.journeySteps.length && <div className={styles.stepConnectorLine} />}
                          </div>
                          <div className={styles.stepContent}>
                            <div className={styles.stepHeader}>
                              <span className={styles.stepNumberTag}>STEP {step.step}</span>
                              <h4 className={styles.stepTitle}>{step.title}</h4>
                            </div>
                            <p className={styles.stepDesc}>{step.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── ACCORDION 2: DRESS CODE & ENTRY PROTOCOL ── */}
            <div className={styles.minimalAccordionCard}>
              <button 
                onClick={() => toggleSection('dress')} 
                className={styles.accordionHeader}
                aria-expanded={openSections.dress}
              >
                <div className={styles.accordionHeaderLeft}>
                  <div className={styles.sectionIconBadge} style={{ backgroundColor: '#F0FDF4', color: '#16A34A' }}>
                    <Shirt size={17} />
                  </div>
                  <div>
                    <h3 className={styles.accordionHeading}>Dress Code &amp; Guidelines</h3>
                    <span className={styles.accordionSubheading}>Mandatory TTD traditional attire</span>
                  </div>
                </div>
                <div className={styles.accordionHeaderRight}>
                  <span className={styles.miniPillBadge}>Strict</span>
                  <ChevronDown 
                    size={17} 
                    className={`${styles.chevron} ${openSections.dress ? styles.chevronRotated : ''}`} 
                  />
                </div>
              </button>

              {openSections.dress && (
                <div className={styles.accordionBody}>
                  <div className={styles.rulesSplitGrid}>
                    <div className={styles.ruleBoxAllowed}>
                      <span className={styles.ruleBoxTitle}>
                        <CheckCircle2 size={15} /> Permitted Traditional Attire
                      </span>
                      <div className={styles.ruleTags}>
                        {data.dressCodeRules.allowed.map((rule, idx) => (
                          <span key={idx} className={styles.allowedChip}>✓ {rule}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className={styles.ruleBoxProhibited}>
                      <span className={styles.ruleBoxTitle}>
                        <XCircle size={15} /> Prohibited Clothing &amp; Items
                      </span>
                      <div className={styles.ruleTags}>
                        {data.dressCodeRules.prohibited.map((rule, idx) => (
                          <span key={idx} className={styles.prohibitedChip}>✕ {rule}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles.miniGuidanceNote}>
                    <ShieldAlert size={14} color="#D97706" style={{ flexShrink: 0 }} />
                    <span>Electronic devices, mobile phones, smartwatches &amp; footwear must be deposited in free lockers before VQC entry.</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── ACCORDION 3: COMPARTMENT AMENITIES (FREE SERVICES) ── */}
            <div className={styles.minimalAccordionCard}>
              <button 
                onClick={() => toggleSection('amenities')} 
                className={styles.accordionHeader}
                aria-expanded={openSections.amenities}
              >
                <div className={styles.accordionHeaderLeft}>
                  <div className={styles.sectionIconBadge} style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                    <UtensilsCrossed size={17} />
                  </div>
                  <div>
                    <h3 className={styles.accordionHeading}>Queue Facilities &amp; Care</h3>
                    <span className={styles.accordionSubheading}>Free amenities inside waiting halls</span>
                  </div>
                </div>
                <div className={styles.accordionHeaderRight}>
                  <span className={styles.miniPillBadge}>{data.facilities.length} Free</span>
                  <ChevronDown 
                    size={17} 
                    className={`${styles.chevron} ${openSections.amenities ? styles.chevronRotated : ''}`} 
                  />
                </div>
              </button>

              {openSections.amenities && (
                <div className={styles.accordionBody}>
                  <div className={styles.amenitiesGrid}>
                    {data.facilities.map((fac, idx) => {
                      const visual = getFacilityVisual(fac.type);
                      return (
                        <div key={idx} className={styles.amenityCard}>
                          <div className={styles.amenityIconWrap} style={{ backgroundColor: visual.bg, color: visual.color }}>
                            {visual.icon}
                          </div>
                          <div className={styles.amenityDetails}>
                            <strong className={styles.amenityName}>{visual.label}</strong>
                            <span className={styles.amenityNote}>{fac.notes}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── ACCORDION 4: WHY THIS WAIT TIME & PRO-TIPS ── */}
            <div className={styles.minimalAccordionCard}>
              <button 
                onClick={() => toggleSection('whyWait')} 
                className={styles.accordionHeader}
                aria-expanded={openSections.whyWait}
              >
                <div className={styles.accordionHeaderLeft}>
                  <div className={styles.sectionIconBadge} style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                    <Lightbulb size={17} />
                  </div>
                  <div>
                    <h3 className={styles.accordionHeading}>Why This Wait Time?</h3>
                    <span className={styles.accordionSubheading}>Explainable insights &amp; tips</span>
                  </div>
                </div>
                <div className={styles.accordionHeaderRight}>
                  <span className={styles.miniPillBadge} style={{ background: '#FEF3C7', color: '#92400E' }}>Insight</span>
                  <ChevronDown 
                    size={17} 
                    className={`${styles.chevron} ${openSections.whyWait ? styles.chevronRotated : ''}`} 
                  />
                </div>
              </button>

              {openSections.whyWait && (
                <div className={styles.accordionBody}>
                  <div className={styles.explainabilityBox}>
                    <p className={styles.explainabilityText}>
                      {data.whyWaitTimeExplanation || data.description}
                    </p>
                    {data.bestTimeToVisit && (
                      <div className={styles.bestTimeStrip}>
                        <Sparkles size={14} color="#D97706" />
                        <span><strong>Pro-Tip:</strong> {data.bestTimeToVisit}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </main>

      {/* ── 4. STICKY BOTTOM BUTTON ── */}
      <footer className={styles.bottomBarWrap}>
        <button onClick={() => router.push('/')} className={styles.returnDashboardBtn}>
          Back to Live Dashboard
        </button>
      </footer>

    </div>
  );
}



