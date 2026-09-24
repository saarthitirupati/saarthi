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
import { useLanguage } from '@/lib/useLanguage';
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
  'shield-check': ShieldCheck,
  sparkles: Sparkles,
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
  'map-pin': MapPin,
  info: Info,
  'alert-triangle': AlertTriangle
};

export default function EssentialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const lang = useLanguage();
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
              <AlertTriangle size={18} color="#D97706" />
              <span>{lang === 'te' ? 'దర్శనానికి ముందు ఇది ఎందుకు తప్పనిసరి?' : 'Why This is Required Before Queue Entry'}</span>
            </div>
            <p className={styles.whyItMattersText}>
              {item.whyItMatters}
            </p>
            {item.id === 'secure-belongings' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginTop: '4px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #FDE68A', borderRadius: '12px', padding: '10px', fontSize: '11.5px', color: '#92400E', lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <ShieldAlert size={14} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>Sanctum Scanners:</strong> Metal detectors flag all electronics & smartwatches.</div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #FDE68A', borderRadius: '12px', padding: '10px', fontSize: '11.5px', color: '#92400E', lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <Clock size={14} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>No Queue Reset:</strong> Avoid being turned back at security checkpoints.</div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #FDE68A', borderRadius: '12px', padding: '10px', fontSize: '11.5px', color: '#92400E', lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <Sparkles size={14} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>100% Free TTD:</strong> Zero charges; never pay unauthorized touts outside.</div>
                </div>
              </div>
            )}
            {item.id === 'free-meals' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginTop: '4px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '10px', fontSize: '11.5px', color: '#166534', lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <Sparkles size={14} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>No Ticket Required:</strong> Completely free for every single devotee. Walk in directly.</div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '10px', fontSize: '11.5px', color: '#166534', lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <Utensils size={14} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>Unlimited Satvik Food:</strong> Fresh hot rice, sambar, rasam, curry & buttermilk on banana leaf.</div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '10px', fontSize: '11.5px', color: '#166534', lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <Clock size={14} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>Served Inside Queue:</strong> If in VQC darshan compartments, food is delivered to your seat.</div>
                </div>
              </div>
            )}
            {item.id === 'hair-offering' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginTop: '4px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '10px', fontSize: '11.5px', color: '#166534', lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <Sparkles size={14} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>100% Free & No Tips:</strong> Sealed blades and barbers provided free by TTD. Zero tipping.</div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '10px', fontSize: '11.5px', color: '#166534', lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <Clock size={14} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>Open 24/7 Non-Stop:</strong> Main complex operates round the clock with dedicated gender floors.</div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '10px', fontSize: '11.5px', color: '#166534', lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <Droplets size={14} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>Free Hot Baths:</strong> Spacious geyser shower halls immediately adjacent to shaving bays.</div>
                </div>
              </div>
            )}
            {item.id === 'accommodation' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginTop: '4px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '10px', fontSize: '11.5px', color: '#1E40AF', lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <ShieldCheck size={14} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>Darshan Ticket Link:</strong> Online booking strictly requires confirmed Darshan/Seva ticket (min 2 pilgrims).</div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '10px', fontSize: '11.5px', color: '#1E40AF', lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <Clock size={14} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>3–4 AM Walk-in Window:</strong> ₹100/₹500 budget rooms at CRO counter exhaust rapidly each morning.</div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '10px', fontSize: '11.5px', color: '#1E40AF', lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <MapPin size={14} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div><strong>Downhill & PAC Backups:</strong> Free PAC 1–4 halls & downhill Tirupati hubs ensure safe, guaranteed stay.</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SAARTHI GUIDANCE CARD */}
        {item.id === 'secure-belongings' ? (
          <SaarthiGuidanceCard
            guidanceTitle={lang === 'te' 
              ? 'సారథి సలహా: మొబైల్ ఫోన్‌ను ప్రధాన లగేజ్ నుంచి వేరుగా ఉంచండి.'
              : 'Pro Tip: Keep Your Mobile Phone Separate from Main Luggage Bags.'}
            quote={lang === 'te' ? 'దర్శనం తర్వాత 45 నిమిషాలు ఆదా అవుతుంది' : 'Saves 45 mins after Darshan'}
            primaryPill={{
              label: 'Phone Sealing',
              title: 'VQC-I & II Booths',
              url: '#sublocations'
            }}
            secondaryPill={{
              label: 'Free Lockers',
              title: 'PAC-2 Madhava Nilayam',
              url: '#sublocations'
            }}
            tertiaryPill={{
              label: 'Mandatory ID',
              title: 'Physical Aadhaar',
              url: '#requirements'
            }}
            footerNote={lang === 'te' 
              ? 'మొబైల్ ఫోన్లు ఆలయ నిష్క్రమణ ద్వారం (లడ్డూ కౌంటర్ల వద్ద) వెంటనే లభిస్తాయి.' 
              : 'Why: Phones can be collected right at the temple exit gate, while luggage stays in PAC halls.'}
          />
        ) : item.id === 'free-meals' ? (
          <SaarthiGuidanceCard
            guidanceTitle={lang === 'te' 
              ? 'సారథి మార్గదర్శి: అన్నప్రసాదం 100% ఉచితం. టికెట్లు లేదా టోకెన్లు అవసరం లేదు.'
              : 'Saarthi Guidance: 100% Free Annaprasadam. Zero Tickets or Tokens Needed.'}
            quote={lang === 'te' ? 'అన్నదానం పరమ పవిత్రం — నిత్యాన్నదానం' : 'Annadanam Param Danam — Sacred Continuous Dining'}
            primaryPill={{
              label: 'Central Mega Hall',
              title: 'Vengamamba Complex',
              url: '#sublocations'
            }}
            secondaryPill={{
              label: 'Inside Queue Lines',
              title: 'VQC Compartments',
              url: '#sublocations'
            }}
            tertiaryPill={{
              label: 'Daily Schedule',
              title: '8:30 AM – 11:00 PM',
              url: '#timings'
            }}
            footerNote={lang === 'te' 
              ? 'దర్శనం కంపార్ట్‌మెంట్లలో ఉన్న భక్తులకు నేరుగా ఉచిత ఆహార ప్యాకెట్లు, మజ్జిగ & పాలు నిరంతరం అందిస్తారు.' 
              : 'Devotees inside VQC darshan waiting compartments receive free food packets, buttermilk, and milk continuously without leaving their seats.'}
          />
        ) : item.id === 'hair-offering' ? (
          <SaarthiGuidanceCard
            guidanceTitle={lang === 'te' 
              ? 'సారథి సలహా: నూతన సాంప్రదాయ దుస్తులు & తువ్వాలు వెంట ఉంచుకోండి. క్షురకులకు ఎలాంటి టిప్స్ ఇవ్వవద్దు.'
              : 'Pro Tip: Carry Spare Clothes & Towel. Never Pay Tips to Barbers (100% Free TTD).'}
            quote={lang === 'te' ? 'తలనీలాలు సమర్పణ — పరమ భక్తితో అహంకార త్యాగం' : 'Sacred Tonsure (Mundan) — Pure Surrender of Ego'}
            primaryPill={{
              label: 'Main 24/7 Complex',
              title: 'Opp. Annadhanam',
              url: '#sublocations'
            }}
            secondaryPill={{
              label: '9 Cottage Centers',
              title: 'Nandakam / SVRH / PAC',
              url: '#sublocations'
            }}
            tertiaryPill={{
              label: 'Adjoining Facility',
              title: 'Free Hot Bath',
              url: '#bath'
            }}
            footerNote={lang === 'te' 
              ? 'చిన్నారుల మొదటి ముండన్ కోసం కుటుంబ ఆచారం ప్రకారం కొద్దిగా జుట్టును ప్రత్యేక వస్త్ర సంచిలో సేకరించవచ్చు.' 
              : 'For infants, inform the barber beforehand if your family custom requires collecting the first ceremonial lock of hair into a pouch.'}
          />
        ) : item.id === 'accommodation' ? (
          <SaarthiGuidanceCard
            guidanceTitle={lang === 'te' 
              ? 'సారథి సలహా: కొండపై గదులు లభించకపోతే వెంటనే ఉచిత PAC సముదాయాలు లేదా తిరుపతి విష్ణు నివాసానికి వెళ్లండి.'
              : 'Pro Tip: If Hilltop Rooms are Full, Head Directly to Free PAC Halls or Tirupati Town.'}
            quote={lang === 'te' ? 'ఒరిజినల్ ఆధార్ కార్డు తప్పనిసరి — దళారులను నమ్మవద్దు' : 'Original Aadhaar Mandatory — Zero Broker Tolerance'}
            primaryPill={{
              label: 'CRO Walk-in',
              title: 'Opp. Bus Stand',
              url: '#sublocations'
            }}
            secondaryPill={{
              label: 'Online Portal',
              title: '3 Months Advance',
              url: '#sublocations'
            }}
            tertiaryPill={{
              label: 'Free Dormitories',
              title: 'PAC-1 to PAC-4',
              url: '#sublocations'
            }}
            footerNote={lang === 'te' 
              ? 'ఆన్‌లైన్ రూమ్ బుకింగ్ కొరకు దర్శన టికెట్ తప్పనిసరి. కేటాయింపు సమయంలో బస చేసే ప్రతి యాత్రికుడికి బయోమెట్రిక్ ముఖ గుర్తింపు నిర్వహిస్తారు.' 
              : 'Online room quota requires a confirmed Darshan ticket. Live biometric facial scan of all staying adults is performed upon key collection.'}
          />
        ) : (
          <SaarthiGuidanceCard />
        )}

        {/* QUICK DECISION: WHAT TO DEPOSIT WHERE (FOR ANY DEVOTEE TO INSTANTLY UNDERSTAND) */}
        {item.id === 'secure-belongings' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#D97706" />
              <h3 className={styles.sectionTitle} style={{ fontSize: '16.5px' }}>
                {lang === 'te' ? 'ఏ వస్తువు ఎక్కడ భద్రపరచాలి? (స్పష్టమైన మార్గదర్శి)' : 'Quick Decision: What to Deposit Where'}
              </h3>
            </div>
            <div className={styles.decisionFlowGrid}>
              {/* Card 1: Mobile */}
              <div className={styles.decisionFlowCard} style={{ borderLeft: '4px solid #2563EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Smartphone size={15} color="#2563EB" />
                    Mobile Phones
                  </span>
                  <span className={styles.decisionFlowTag} style={{ background: '#DBEAFE', color: '#1E40AF' }}>Exit Pickup</span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.35 }}>
                  <strong>Where:</strong> VQC-I & VQC-II Entrance Booths (3 min walk)
                </div>
                <div style={{ fontSize: '11px', color: '#0F5132', background: '#F0FDF4', padding: '5px 8px', borderRadius: '6px', fontWeight: 700, lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                  <Info size={13} color="#059669" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <div><strong>Why here:</strong> Tagged to your token and handed back right at temple exit (near Laddu counters). No walking back to locker halls!</div>
                </div>
              </div>

              {/* Card 2: Luggage */}
              <div className={styles.decisionFlowCard} style={{ borderLeft: '4px solid #D97706' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Briefcase size={15} color="#D97706" />
                    Heavy Luggage
                  </span>
                  <span className={styles.decisionFlowTag} style={{ background: '#FEF3C7', color: '#92400E' }}>Free Locker</span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.35 }}>
                  <strong>Where:</strong> PAC-2 Madhava Nilayam or PAC-1 to 5
                </div>
                <div style={{ fontSize: '11px', color: '#92400E', background: '#FFFBEB', padding: '5px 8px', borderRadius: '6px', fontWeight: 700, lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                  <Info size={13} color="#92400E" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <div><strong>Why here:</strong> Large bags cannot pass through narrow sanctum queue cages. Free steel cubicle with key and 24/7 armed CCTV guard.</div>
                </div>
              </div>

              {/* Card 3: Footwear */}
              <div className={styles.decisionFlowCard} style={{ borderLeft: '4px solid #16A34A' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Footprints size={15} color="#16A34A" />
                    Shoes & Chappals
                  </span>
                  <span className={styles.decisionFlowTag} style={{ background: '#DCFCE7', color: '#166534' }}>Free Stand</span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.35 }}>
                  <strong>Where:</strong> Free stands opposite VQC Entrance
                </div>
                <div style={{ fontSize: '11px', color: '#166534', background: '#F0FDF4', padding: '5px 8px', borderRadius: '6px', fontWeight: 700, lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                  <Info size={13} color="#166534" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <div><strong>Why here:</strong> Leather & shoes strictly forbidden on sacred stone. Counter is positioned near exit path so you don’t burn your bare feet on hot granite.</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* OPERATING MEAL TIMINGS & SACRED MENU MATRIX (FOR FREE-MEALS) */}
        {item.id === 'free-meals' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} id="timings">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="#D97706" />
              <h3 className={styles.sectionTitle} style={{ fontSize: '16.5px' }}>
                {lang === 'te' ? 'అన్నప్రసాదం సమయాలు & మెనూ వివరాలు' : 'Official Meal Timings & Sacred Menu'}
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '-4px 0 2px 0', fontWeight: 600 }}>
              {lang === 'te' ? 'రోజూ వేలాది మంది భక్తులకు స్వచ్ఛమైన, ఉచిత భోజన సేవలు' : 'Daily hygienic vegetarian satvik food served free of cost to all pilgrims'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {/* Timing 1: Breakfast */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '4px solid #F59E0B', borderRadius: '14px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Utensils size={15} color="#F59E0B" />
                    Breakfast (Tiffin)
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#B45309', background: '#FEF3C7', padding: '3px 8px', borderRadius: '6px' }}>
                    8:30 AM – 10:30 AM
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  <strong>Menu:</strong> Hot Upma, Ven Pongal, Sambar & Fresh Coconut Chutney.
                </div>
                <div style={{ fontSize: '11px', color: '#92400E', background: '#FFFBEB', padding: '5px 8px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={12} color="#D97706" style={{ flexShrink: 0 }} />
                  <span><strong>Why:</strong> Quick morning replenishment for footpath walkers & tonsure devotees.</span>
                </div>
              </div>

              {/* Timing 2: Lunch */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '4px solid #16A34A', borderRadius: '14px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Utensils size={15} color="#16A34A" />
                    Traditional Lunch Feast
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', background: '#DCFCE7', padding: '3px 8px', borderRadius: '6px' }}>
                    10:30 AM – 4:00 PM
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  <strong>Menu:</strong> Steamed Rice, Sambar, Rasam, Vegetable Curry, Chutney & Curd/Buttermilk on plantain leaf.
                </div>
                <div style={{ fontSize: '11px', color: '#166534', background: '#F0FDF4', padding: '5px 8px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={12} color="#16A34A" style={{ flexShrink: 0 }} />
                  <span><strong>Why:</strong> Main unlimited meal. 4 mega dining halls seat 4,000+ devotees per batch continuously.</span>
                </div>
              </div>

              {/* Timing 3: Cleaning Break */}
              <div style={{ background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: '14px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', fontWeight: 700 }}>
                  <Clock size={14} color="#64748B" />
                  Service Pause for Hall Deep Cleaning:
                </div>
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#475569', background: '#E2E8F0', padding: '3px 8px', borderRadius: '6px' }}>
                  4:00 PM – 5:00 PM
                </span>
              </div>

              {/* Timing 4: Dinner */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '4px solid #2563EB', borderRadius: '14px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Utensils size={15} color="#2563EB" />
                    Evening & Night Dinner
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E40AF', background: '#DBEAFE', padding: '3px 8px', borderRadius: '6px' }}>
                    5:00 PM – 11:00 PM
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  <strong>Menu:</strong> Hot Steamed Rice, Sambar, Rasam, Fresh Vegetable Curry & Refreshing Buttermilk.
                </div>
                <div style={{ fontSize: '11px', color: '#1E40AF', background: '#EFF6FF', padding: '5px 8px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={12} color="#2563EB" style={{ flexShrink: 0 }} />
                  <span><strong>Why:</strong> Open till 11:00 PM so devotees completing evening darshan get pure hot food.</span>
                </div>
              </div>

              {/* Timing 5: In-Queue Continuous */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '4px solid #7C3AED', borderRadius: '14px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Droplets size={15} color="#7C3AED" />
                    In-Queue Compartments (VQC I & II)
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#6D28D9', background: '#EDE9FE', padding: '3px 8px', borderRadius: '6px' }}>
                    Continuous Service
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  <strong>Delivered To Seat:</strong> Pulihora, Curd Rice packets, fresh Buttermilk, RO Water, and warm Milk for infants.
                </div>
                <div style={{ fontSize: '11px', color: '#6D28D9', background: '#F5F3FF', padding: '5px 8px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={12} color="#7C3AED" style={{ flexShrink: 0 }} />
                  <span><strong>Why:</strong> Srivari Seva volunteers bring food inside locked waiting compartments so you never need to leave your line.</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* KALYANAKATTA CENTRES & ESSENTIAL FACILITIES MATRIX (FOR HAIR-OFFERING) */}
        {item.id === 'hair-offering' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} id="bath">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Scissors size={16} color="#D97706" />
              <h3 className={styles.sectionTitle} style={{ fontSize: '16.5px' }}>
                {lang === 'te' ? 'కల్యాణకట్ట కేంద్రాలు & ముఖ్య సదుపాయాలు' : 'Kalyanakatta Centers & Essential Facilities'}
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '-4px 0 2px 0', fontWeight: 600 }}>
              {lang === 'te' ? 'భక్తుల సౌకర్యార్థం ప్రధాన సముదాయం మరియు 9 ఉప కేంద్రాలు' : 'Choose the closest center to your cottage to save up to 45 minutes'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {/* Card 1: Main 24/7 Complex */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '4px solid #2563EB', borderRadius: '14px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Scissors size={15} color="#2563EB" />
                    Main Kalyanakatta Complex
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E40AF', background: '#DBEAFE', padding: '3px 8px', borderRadius: '6px' }}>
                    Open 24/7
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  <strong>Location:</strong> Directly opposite the Annadhanam Complex.
                </div>
                <div style={{ fontSize: '11px', color: '#1E40AF', background: '#EFF6FF', padding: '5px 8px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={12} color="#2563EB" style={{ flexShrink: 0 }} />
                  <span><strong>Why:</strong> Massive 4-story facility with 500+ barbers and separate dedicated floors for women, men, and children.</span>
                </div>
              </div>

              {/* Card 2: 9 Mini Satellite Centers */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '4px solid #16A34A', borderRadius: '14px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="#16A34A" />
                    9 Mini Satellite Centers
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', background: '#DCFCE7', padding: '3px 8px', borderRadius: '6px' }}>
                    Cottage Hubs
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  <strong>Locations:</strong> Near Nandakam, SVRH, Rambagicha Guest House, and PAC dormitories.
                </div>
                <div style={{ fontSize: '11px', color: '#166534', background: '#F0FDF4', padding: '5px 8px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={12} color="#16A34A" style={{ flexShrink: 0 }} />
                  <span><strong>Why:</strong> Ideal for families and elderly staying in cottages. Shorter morning lines without walking across hilltop.</span>
                </div>
              </div>

              {/* Card 3: Free Hot Water Bathing */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '4px solid #D97706', borderRadius: '14px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Droplets size={15} color="#D97706" />
                    Adjoining Hot Water Baths
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#B45309', background: '#FEF3C7', padding: '3px 8px', borderRadius: '6px' }}>
                    100% Free
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  <strong>Access:</strong> Clean bathrooms with running hot water located right inside each tonsure building.
                </div>
                <div style={{ fontSize: '11px', color: '#92400E', background: '#FFFBEB', padding: '5px 8px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={12} color="#D97706" style={{ flexShrink: 0 }} />
                  <span><strong>Why:</strong> Wash away loose hair clippings immediately before changing into fresh traditional clothes for darshan.</span>
                </div>
              </div>

              {/* Card 4: Baby Mundan & Custom Lock */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '4px solid #7C3AED', borderRadius: '14px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={15} color="#7C3AED" />
                    Baby Mundan & Custom Lock
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#6D28D9', background: '#EDE9FE', padding: '3px 8px', borderRadius: '6px' }}>
                    Custom Ritual
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  <strong>Tip:</strong> Carry a small cloth pouch to collect the first holy lock of hair if your family custom requires.
                </div>
                <div style={{ fontSize: '11px', color: '#6D28D9', background: '#F5F3FF', padding: '5px 8px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={12} color="#7C3AED" style={{ flexShrink: 0 }} />
                  <span><strong>Why:</strong> Inform the barber before shaving begins; they will cut and hand over the first ceremonial lock with care.</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* BOOKING CHANNELS & ACCOMMODATION TIERS MATRIX (FOR ACCOMMODATION) */}
        {item.id === 'accommodation' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} id="booking-tiers">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bed size={16} color="#D97706" />
              <h3 className={styles.sectionTitle} style={{ fontSize: '16.5px' }}>
                {lang === 'te' ? 'వసతి విభాగాలు & బుకింగ్ మార్గాలు' : 'Official Booking Channels & Accommodation Tiers'}
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '-4px 0 2px 0', fontWeight: 600 }}>
              {lang === 'te' ? 'బడ్జెట్ కాటేజీల నుండి ఉచిత డార్మిటరీల వరకు పూర్తి మార్గదర్శి' : 'Complete guide from ₹100/₹500 budget cottages to free PAC dormitories'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {/* Card 1: Online Advance Quota */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '4px solid #2563EB', borderRadius: '14px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={15} color="#2563EB" />
                    Online TTD Portal
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#1D4ED8', background: '#DBEAFE', padding: '3px 8px', borderRadius: '6px' }}>
                    3 Months Advance
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  <strong>Requirement:</strong> Requires confirmed Darshan/Seva ticket (min 2 pilgrims) on mobile login. Max 1 room per Aadhaar per 30 days.
                </div>
                <div style={{ fontSize: '11px', color: '#1E40AF', background: '#EFF6FF', padding: '5px 8px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={12} color="#2563EB" style={{ flexShrink: 0 }} />
                  <span><strong>Why:</strong> Prevents touts & bulk bots from locking rooms before pilgrims have confirmed darshan.</span>
                </div>
              </div>

              {/* Card 2: Offline CRO Spot Allotment */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '4px solid #16A34A', borderRadius: '14px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} color="#16A34A" />
                    CRO Spot Allotment (₹100/₹500)
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', background: '#DCFCE7', padding: '3px 8px', borderRadius: '6px' }}>
                    Best at 3–4 AM
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  <strong>Location:</strong> CRO counters opp. Bus Stand. Physical Aadhaar cards of all staying adults + biometric facial scanning mandatory.
                </div>
                <div style={{ fontSize: '11px', color: '#166534', background: '#F0FDF4', padding: '5px 8px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={12} color="#16A34A" style={{ flexShrink: 0 }} />
                  <span><strong>Why:</strong> Budget ₹100 rooms run out within hours of opening; queuing before dawn gives highest success rate.</span>
                </div>
              </div>

              {/* Card 3: Free Carpeted Dormitories */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '4px solid #D97706', borderRadius: '14px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={15} color="#D97706" />
                    Free PAC Dormitory Halls
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#B45309', background: '#FEF3C7', padding: '3px 8px', borderRadius: '6px' }}>
                    100% Free • PAC 1–4
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  <strong>Facilities:</strong> Massive carpeted halls with 24/7 security guards, steel luggage lockers, and running hot-water baths.
                </div>
                <div style={{ fontSize: '11px', color: '#92400E', background: '#FFFBEB', padding: '5px 8px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={12} color="#D97706" style={{ flexShrink: 0 }} />
                  <span><strong>Why:</strong> Guaranteed cost-free hilltop sanctuary so no pilgrim family is stranded if paid cottages are sold out.</span>
                </div>
              </div>

              {/* Card 4: Tirupati Downhill Complexes */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '4px solid #7C3AED', borderRadius: '14px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="#7C3AED" />
                    Tirupati Downhill Complexes
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#6D28D9', background: '#EDE9FE', padding: '3px 8px', borderRadius: '6px' }}>
                    Srinivasam & Vishnu
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  <strong>Locations:</strong> Vishnu Nivasam (opp. Railway Station), Srinivasam & Madhavam (opp. RTC Bus Stand).
                </div>
                <div style={{ fontSize: '11px', color: '#6D28D9', background: '#F5F3FF', padding: '5px 8px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={12} color="#7C3AED" style={{ flexShrink: 0 }} />
                  <span><strong>Why:</strong> Thousands of rooms available downhill; direct uphill electric buses leave from doorstep every 5 minutes.</span>
                </div>
              </div>
            </div>
          </section>
        )}

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
                <h3 className={styles.sectionTitle}>
                  {item.id === 'secure-belongings' 
                    ? (lang === 'te' ? 'మీ వద్ద ఉన్న వస్తువులు ఏమిటి?' : 'What Are You Carrying?')
                    : item.id === 'free-meals'
                    ? (lang === 'te' ? 'అన్నప్రసాదం సేవలు & విభాగాలు' : 'Annaprasadam Services & Halls')
                    : item.id === 'hair-offering'
                    ? (lang === 'te' ? 'కల్యాణకట్ట విభాగాలు & సేవలు' : 'Tonsuring Facilities & Rituals')
                    : item.id === 'accommodation'
                    ? (lang === 'te' ? 'వసతి విభాగాలు & బుకింగ్ ఎంపికలు' : 'Accommodation Tiers & Booking Options')
                    : (lang === 'te' ? 'విభాగాలు & సదుపాయాలు' : 'Categories & Facilities')}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 600 }}>
                  {item.id === 'secure-belongings'
                    ? (lang === 'te' ? 'నిబంధనలు మరియు కౌంటర్లను చూడటానికి ఒక వర్గాన్ని ఎంచుకోండి' : 'Tap an item category to filter rules & deposit counters')
                    : (lang === 'te' ? 'వివరాలు తెలుసుకోవడానికి విభాగాన్ని ఎంచుకోండి' : 'Tap to explore specific facilities, locations and timings')}
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
                    {cat.whereToDeposit && (
                      <div className={styles.itemCategoryWhere}>
                        <MapPin size={13} color="#2563EB" style={{ flexShrink: 0 }} />
                        <span><strong>{lang === 'te' ? 'ఎక్కడ భద్రపరచాలి:' : 'Where to Deposit:'}</strong> {cat.whereToDeposit}</span>
                      </div>
                    )}
                    {cat.whyNeeded && (
                      <div className={styles.itemCategoryWhy}>
                        <Sparkles size={13} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span><strong>{lang === 'te' ? 'ఎందుకు అవసరం:' : 'Why Required:'}</strong> {cat.whyNeeded}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SUB-LOCATIONS LIST & COUNTER FINDER */}
        {item.subLocations && item.subLocations.length > 0 && (
          <section className={styles.subLocationsSection} id="sublocations">
            <div className={styles.sectionHeaderRow}>
              <div>
                <h3 className={styles.sectionTitle}>
                  {item.id === 'free-meals'
                    ? (lang === 'te' ? 'అధికారిక అన్నప్రసాదం కేంద్రాలు' : 'Official Annaprasadam Centers & Locations')
                    : item.id === 'hair-offering'
                    ? (lang === 'te' ? 'అధికారిక కల్యాణకట్ట కేంద్రాలు' : 'Official Kalyanakatta Tonsure Centers')
                    : item.id === 'accommodation'
                    ? (lang === 'te' ? 'అధికారిక కేటాయింపు కార్యాలయాలు & సముదాయాలు' : 'Official Allotment Offices & Rest House Complexes')
                    : (lang === 'te' ? 'అధికారిక డిపాజిట్ కేంద్రాలు & లాకర్లు' : 'Official Deposit Locations & Counters')}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 600 }}>
                  {item.id === 'free-meals'
                    ? (lang === 'te' ? 'తిరుమలలో ఉచిత పవిత్ర భోజన వితరణ కేంద్రాలు' : 'Free sanctified meal serving complexes & distribution stalls in Tirumala')
                    : item.id === 'hair-offering'
                    ? (lang === 'te' ? 'ప్రధాన సముదాయం మరియు 9 ఉప-కేంద్రాలు' : 'Main 24/7 complex and 9 satellite rest house centers across Tirumala')
                    : item.id === 'accommodation'
                    ? (lang === 'te' ? 'కొండపై CRO కౌంటర్లు, PAC ఉచిత హాళ్లు మరియు తిరుపతి సముదాయాలు' : 'Hilltop CRO counter, free PAC halls, and downhill Tirupati transit complexes')
                    : (lang === 'te' ? 'తిరుమల యాత్రికుల రవాణా కేంద్రాల వద్ద ఉచిత TTD కౌంటర్లు' : 'Free TTD counters around Tirumala transit hubs')}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <h4 className={styles.subLocationName}>{loc.name}</h4>
                        {loc.bestFor && (
                          <span className={styles.subLocationBestFor} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <Sparkles size={11} color="#0F5132" />
                            {loc.bestFor}
                          </span>
                        )}
                      </div>
                      <div className={styles.subLocationMeta}>
                        {isCloseBy && <span className={styles.subLocationWalk}>Walk • {loc.walkTime}</span>}
                        <span>{distVal !== null ? `${distVal} km` : loc.distance}</span>
                        <span style={{ color: '#16A34A', fontWeight: 700 }}>• {loc.status}</span>
                      </div>
                      {loc.whyRecommended && (
                        <div className={styles.subLocationWhy}>
                          <strong>{lang === 'te' ? 'ఈ కేంద్రాన్ని ఎందుకు ఎంచుకోవాలి:' : 'Why choose this center:'}</strong> {loc.whyRecommended}
                        </div>
                      )}
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
            <h3 className={styles.sectionTitle}>
              {item.id === 'free-meals'
                ? (lang === 'te' ? 'అన్నప్రసాదం భోజన విధివిధానం' : 'Step-by-Step Annaprasadam Dining Flow')
                : item.id === 'hair-offering'
                ? (lang === 'te' ? 'తలనీలాలు సమర్పించే పద్ధతి' : 'Step-by-Step Tonsure & Bathing Flow')
                : item.id === 'accommodation'
                ? (lang === 'te' ? 'గది కేటాయింపు & చెక్‌ఇన్ విధానం' : 'Step-by-Step Room Allotment & Check-in Flow')
                : (lang === 'te' ? 'వస్తువుల సమర్పణ & తిరిగి పొందే విధానం' : 'Step-by-Step Deposit & Retrieval Flow')}
            </h3>
            <div className={styles.timelineList}>
              {item.procedureTimeline.map((step) => (
                <div key={step.stepNumber} className={styles.timelineItem}>
                  <div className={styles.timelineBadge}>{step.stepNumber}</div>
                  <div className={styles.timelineContent}>
                    <h4 className={styles.timelineStepTitle}>{step.title}</h4>
                    {step.description && <p className={styles.timelineStepDesc}>{step.description}</p>}
                    {step.whyThisStep && (
                      <div className={styles.timelineWhy}>
                        <Info size={13} color="#0284C7" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span><strong>{lang === 'te' ? 'ఈ దశ ఎందుకు ముఖ్యం:' : 'Why this step matters:'}</strong> {step.whyThisStep}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* REQUIREMENTS CHECKLIST (ALLOWED / PROHIBITED) */}
        {item.requirements && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} id="requirements">
            <h3 className={styles.sectionTitle}>
              {item.id === 'free-meals'
                ? (lang === 'te' ? 'అన్నప్రసాదం నిబంధనలు: ఏమి అనుసరించాలి / నిషేధించబడినవి?' : 'Dining Guidelines: What to Bring / Prohibited')
                : item.id === 'hair-offering'
                ? (lang === 'te' ? 'కల్యాణకట్ట నిబంధనలు: ఏమి తీసుకురావాలి / నిషేధాలు' : 'Tonsure Guidelines: What to Bring / Prohibited')
                : item.id === 'accommodation'
                ? (lang === 'te' ? 'వసతి నిబంధనలు: ఏమి సమర్పించాలి / నిషేధాలు' : 'Accommodation Requirements: What to Carry / Prohibited')
                : (lang === 'te' ? 'క్యూ నిబంధనలు: ఏమి తీసుకెళ్లాలి / ఏమి ఇవ్వాలి?' : 'Need to Carry / Queue Rules')}
            </h3>
            <div className={styles.requirementsContainer}>
              {/* Allowed / Required */}
              <div className={styles.reqBoxAllowed}>
                <h4 className={styles.reqTitle} style={{ color: '#16A34A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="#16A34A" />
                  {item.id === 'free-meals' 
                    ? (lang === 'te' ? 'తీసుకురావలసినవి' : 'What to Bring')
                    : item.id === 'hair-offering'
                    ? (lang === 'te' ? 'వెంట ఉంచుకోవలసినవి' : 'What to Bring')
                    : item.id === 'accommodation'
                    ? (lang === 'te' ? 'సమర్పించవలసినవి (తప్పనిసరి)' : 'What to Carry (Compulsory)')
                    : (lang === 'te' ? 'జేబులో ఉంచుకోవలసినవి' : 'What to Carry (Keep in Pockets)')}
                </h4>
                <div style={{ fontSize: '11px', color: '#15803D', fontStyle: 'italic', marginBottom: '4px' }}>
                  {item.id === 'free-meals'
                    ? (lang === 'te' ? 'ఎందుకు: పవిత్ర ప్రసాదం స్వీకరించడానికి భక్తిశ్రద్ధలు మరియు శుభ్రమైన చేతులు చాలు.' : 'Why: Devotional reverence & clean hands are all you need.')
                    : item.id === 'hair-offering'
                    ? (lang === 'te' ? 'ఎందుకు: స్నానానంతరం దర్శనానికి నూతన సాంప్రదాయ దుస్తులు అవసరం.' : 'Why: Essential for hot shower immediately after tonsure & Darshan entry.')
                    : item.id === 'accommodation'
                    ? (lang === 'te' ? 'ఎందుకు: నకిలీ బుకింగ్‌లు మరియు దళారులను అరికట్టడానికి ఒరిజినల్ ఆధార్ & బయోమెట్రిక్ ముఖ గుర్తింపు తప్పనిసరి.' : 'Why: Original Aadhaar & biometric facial scan mandatory to eliminate black-market room reselling.')
                    : (lang === 'te' ? 'ఎందుకు: ప్రవేశ ధృవీకరణ & లడ్డూ కొనుగోలు కొరకు అవసరం.' : 'Why allowed: Needed for entry verification & purchasing holy prasadams.')}
                </div>
                {item.requirements.carry.map((req, idx) => (
                  <div key={idx} className={styles.reqItem} style={{ color: '#15803D' }}>
                    <Check size={14} color="#16A34A" style={{ flexShrink: 0 }} />
                    <span>{req}</span>
                  </div>
                ))}
              </div>

              {/* Prohibited */}
              <div className={styles.reqBoxProhibited}>
                <h4 className={styles.reqTitle} style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <XCircle size={16} color="#DC2626" />
                  {item.id === 'free-meals'
                    ? (lang === 'te' ? 'ఖచ్చితంగా నిషేధించబడినవి' : 'Strictly Prohibited')
                    : item.id === 'hair-offering'
                    ? (lang === 'te' ? 'కల్యాణకట్టలో ఖచ్చితంగా నిషిద్ధం' : 'Strictly Prohibited (Zero Tipping)')
                    : item.id === 'accommodation'
                    ? (lang === 'te' ? 'ఖచ్చితంగా నిషేధించబడినవి' : 'Strictly Prohibited (Zero Brokerage)')
                    : (lang === 'te' ? 'క్యూలోకి తీసుకెళ్లకూడనివి' : 'Strictly Do Not Carry (Must Deposit)')}
                </h4>
                <div style={{ fontSize: '11px', color: '#991B1B', fontStyle: 'italic', marginBottom: '4px' }}>
                  {item.id === 'free-meals'
                    ? (lang === 'te' ? 'ఎందుకు: అన్నం పరబ్రహ్మ స్వరూపం — ఆహార వృధా మరియు పాదరక్షలు నిషిద్ధం.' : 'Why prohibited: Food wastage and footwear desecrate the sanctity of sacred dining.')
                    : item.id === 'hair-offering'
                    ? (lang === 'te' ? 'ఎందుకు: క్షురకులకు టిప్స్ ఇవ్వడం TTD నిబంధనల ప్రకారం చట్టవిరుద్ధం. ఉల్లంఘిస్తే ఫిర్యాదు చేయండి.' : 'Why prohibited: Tipping barbers is strictly illegal; TTD employs them with full salaries. Report any demand.')
                    : item.id === 'accommodation'
                    ? (lang === 'te' ? 'ఎందుకు: దళారుల ద్వారా గదులు తీసుకోవడం నేరం; కాటేజీలలో వంట చేయడం అగ్ని ప్రమాదాల దృష్ట్యా నిషేధం.' : 'Why prohibited: Unofficial room booking through brokers is punishable; cooking in rooms is banned for fire safety.')
                    : (lang === 'te' ? 'ఎందుకు: స్కానర్ వద్ద భద్రతా సిబ్బంది తిప్పి పంపుతారు.' : 'Why prohibited: Flagged by scanners; strictly barred by shrine security.')}
                </div>
                {item.requirements.prohibited.map((req, idx) => (
                  <div key={idx} className={styles.reqItem} style={{ color: '#B91C1C' }}>
                    <X size={14} color="#DC2626" style={{ flexShrink: 0 }} />
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
