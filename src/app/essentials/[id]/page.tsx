'use client';

import { use, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, MapPin, Clock, ShieldAlert, Navigation, Info, Check, X,
  Lock, Utensils, Scissors, Bed, ShoppingBag, HelpCircle, FileText,
  Share2, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp,
  Briefcase, Smartphone, Footprints, Droplets, Bus, Sparkles
} from 'lucide-react';
import styles from '../Essentials.module.css';

import { KNOWLEDGE_ITEMS, FAQ_ITEMS } from '@/content/knowledge';
import { useTrip } from '@/components/TripContext';
import { useLanguage } from '@/lib/useLanguage';
import { calculateDrivingDistance, TIRUPATI_CENTER, isCoordinateOnTirumalaHill, isWithinTirupatiRegion } from '@/utils/location';

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
  bus: Bus,
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
  const [showProhibited, setShowProhibited] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [showFaqs, setShowFaqs] = useState(false);

  // Dynamic time calculation in Indian Standard Time (UTC+5:30)
  const currentHourIST = useMemo(() => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + (3600000 * 5.5));
    return istTime.getHours() + (istTime.getMinutes() / 60);
  }, []);

  // Dynamic default active decision based on essential id and current time
  const initialDecisionId = useMemo(() => {
    if (id === 'secure-belongings') return 'phone';
    if (id === 'free-meals') {
      if (currentHourIST >= 10.5 && currentHourIST < 16) return 'lunch';
      if (currentHourIST >= 17 && currentHourIST < 23) return 'dinner';
      return 'lunch';
    }
    if (id === 'hair-offering') return 'main';
    if (id === 'accommodation') return 'pac';
    return 'default';
  }, [id, currentHourIST]);

  const [selectedDecisionId, setSelectedDecisionId] = useState<string>(initialDecisionId);

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

  // Dynamic context distance: only show walk time if within walkable radius (<= 2km)
  const liveDistance = useMemo(() => {
    if (!item?.coordinates) return null;
    const distKm = calculateDrivingDistance(
      effectiveLocation.lat,
      effectiveLocation.lng,
      item.coordinates.lat,
      item.coordinates.lng,
      Boolean(isTirumalaSpot)
    );
    const isWalkable = distKm <= 2;
    const walkMins = Math.max(1, Math.round(distKm * 12));
    const distM = Math.round(distKm * 1000);
    const distLabel = distKm < 1 ? `${distM} m` : `${distKm.toFixed(1)} km`;

    return {
      label: distLabel,
      walkMins: isWalkable ? walkMins : null,
      displayText: isWalkable 
        ? `${distLabel} away · ${walkMins}m walk`
        : `${distLabel} away`
    };
  }, [effectiveLocation, item, isTirumalaSpot]);

  if (!isMounted) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: '36px', height: '36px', border: '3px solid #0F5132',
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
        ? encodeURIComponent(`${customQuery} Tirumala`) 
        : `${item.coordinates.lat},${item.coordinates.lng}`;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  // Dynamic CTA Target Calculation based on current user selection
  const dynamicCtaInfo = (() => {
    if (item.id === 'secure-belongings') {
      if (selectedDecisionId === 'phone') {
        return {
          title: lang === 'te' ? 'VQC-I మొబైల్ కౌంటర్‌కు నావిగేట్ చేయండి' : 'Navigate to VQC-I Mobile Deposit',
          dest: 'VQC-I Mobile Deposit'
        };
      }
      if (selectedDecisionId === 'luggage') {
        return {
          title: lang === 'te' ? 'PAC-2 లాకర్ కాంప్లెక్స్‌కు నావిగేట్ చేయండి' : 'Navigate to PAC-2 Locker Complex',
          dest: 'PAC-2 Madhava Nilayam'
        };
      }
      return {
        title: lang === 'te' ? 'పాదరక్షల స్టాండ్‌కు నావిగేట్ చేయండి' : 'Navigate to VQC Footwear Stand',
        dest: 'VQC Footwear Counter'
      };
    }
    if (item.id === 'free-meals') {
      if (selectedDecisionId === 'lunch') {
        return {
          title: lang === 'te' ? 'అన్నప్రసాద భోజన శాలకు నావిగేట్ చేయండి' : 'Navigate to Vengamamba Lunch Feast',
          dest: 'Tarigonda Vengamamba Annaprasadam'
        };
      }
      if (selectedDecisionId === 'dinner') {
        return {
          title: lang === 'te' ? 'రాత్రి భోజన శాలకు నావిగేట్ చేయండి' : 'Navigate to Vengamamba Dinner',
          dest: 'Tarigonda Vengamamba Annaprasadam'
        };
      }
      return {
        title: lang === 'te' ? 'క్యూ కాంప్లెక్స్ వివరాలు చూడండి' : 'Navigate to VQC Queue Compartments',
        dest: 'Vaikuntam Queue Complex'
      };
    }
    if (item.id === 'hair-offering') {
      if (selectedDecisionId === 'mini') {
        return {
          title: lang === 'te' ? 'సమీప ఉప కల్యాణకట్టకు నావిగేట్ చేయండి' : 'Navigate to Mini Kalyanakatta (PAC-1)',
          dest: 'PAC 1 Kalyanakatta'
        };
      }
      if (selectedDecisionId === 'bath') {
        return {
          title: lang === 'te' ? 'ఉచిత వేడినీటి స్నాన ఘాట్లకు నావిగేట్ చేయండి' : 'Navigate to Free Bathing Ghats',
          dest: 'Kalyanakatta Bathing'
        };
      }
      return {
        title: lang === 'te' ? 'ప్రధాన కల్యాణకట్టకు నావిగేట్ చేయండి' : 'Navigate to Main Kalyanakatta (24/7)',
        dest: 'Main Kalyanakatta'
      };
    }
    if (item.id === 'accommodation') {
      if (selectedDecisionId === 'cro') {
        return {
          title: lang === 'te' ? 'కొండపై CRO కార్యాలయానికి నావిగేట్ చేయండి' : 'Navigate to CRO Allotment Office',
          dest: 'CRO'
        };
      }
      if (selectedDecisionId === 'transit') {
        return {
          title: lang === 'te' ? 'విష్ణు నివాసం (తిరుపతి)కి నావిగేట్ చేయండి' : 'Navigate to Vishnu Nivasam (Downhill)',
          dest: 'Vishnu Nivasam'
        };
      }
      return {
        title: lang === 'te' ? 'ఉచిత PAC విశ్రాంతి హాళ్లకు నావిగేట్ చేయండి' : 'Navigate to Free PAC Rest Halls',
        dest: 'PAC 1'
      };
    }
    return {
      title: lang === 'te' ? 'కేంద్రానికి నావిగేట్ చేయండి' : `Navigate to ${item.name}`,
      dest: item.name
    };
  })();

  // Meal live serving indicators
  const isLunchActive = currentHourIST >= 10.5 && currentHourIST < 16;
  const isDinnerActive = currentHourIST >= 17 && currentHourIST < 23;

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
          <p className={styles.headerSubtitle}>{lang === 'te' ? 'దర్శనానికి ముందు' : 'Before Darshan'}</p>
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

      {/* Scrollable Container with Bottom Padding for Sticky 56px CTA */}
      <div className={styles.scrollArea} style={{ paddingBottom: 'calc(76px + max(12px, env(safe-area-inset-bottom, 12px)))', gap: '18px' }}>
        
        {/* COMPACT HERO */}
        <div className={styles.compactHero}>
          <div className={styles.heroPreHeading}>
            {lang === 'te' ? 'దర్శనానికి ముందు' : 'BEFORE DARSHAN'}
          </div>
          <h2 className={styles.heroMainTitle}>{item.name}</h2>
          <p className={styles.heroDesc}>
            {item.id === 'secure-belongings' 
              ? (lang === 'te' ? 'దర్శనానికి వెళ్లే ముందు లోపలికి అనుమతించని వస్తువులను భద్రపరచండి.' : 'Store items that cannot be taken inside.')
              : item.id === 'free-meals'
              ? (lang === 'te' ? 'భక్తులందరికీ నిరంతర పరిశుద్ధ ఉచిత అన్నప్రసాదం.' : 'Fresh satvik dining for all pilgrims.')
              : item.id === 'hair-offering'
              ? (lang === 'te' ? '24/7 ఉచిత కల్యాణకట్ట సేవలు & వేడినీటి స్నానాలు.' : 'Sanitized 24/7 tonsure & free hot showers.')
              : item.id === 'accommodation'
              ? (lang === 'te' ? 'ఉచిత PAC విశ్రాంతి హాళ్లు & గదుల కేటాయింపు.' : 'Free PAC rest halls & room allotment.')
              : item.description}
          </p>
          <div className={styles.heroLocationLine}>
            <MapPin size={13} color="#0F5132" />
            <span>{item.location} · {liveDistance ? liveDistance.displayText : 'Tirumala Hill'}</span>
          </div>
        </div>

        {/* DECISION CARDS (WHAT -> WHERE -> ACTION) */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 className={styles.sectionTitle} style={{ fontSize: '14.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, color: '#0F172A' }}>
            {item.id === 'secure-belongings' 
              ? (lang === 'te' ? 'ఎక్కడికి వెళ్లాలి?' : 'Where Should I Go?')
              : item.id === 'free-meals'
              ? (lang === 'te' ? 'ఎక్కడ భోజనం చేయవచ్చు?' : 'Where Can I Eat Now?')
              : item.id === 'hair-offering'
              ? (lang === 'te' ? 'తలనీలాల కోసం ఎక్కడికి వెళ్లాలి?' : 'Where Should I Go for Tonsure?')
              : (lang === 'te' ? 'గది ఎక్కడ పొందవచ్చు?' : 'Where Can I Get a Room?')}
          </h3>

          <div className={styles.utilityDecisionGrid}>
            {/* SECURE BELONGINGS MATRIX */}
            {item.id === 'secure-belongings' && (
              <>
                {/* 1. Mobile Phone */}
                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'phone' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('phone')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Smartphone size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>
                      {lang === 'te' ? 'మొబైల్ ఫోన్లు' : 'Mobile Phone'}
                    </h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    VQC-I & VQC-II
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    Free · Exit pickup
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink}
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('phone'); handleOpenMap('VQC-I Mobile Deposit'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                {/* 2. Heavy Luggage */}
                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'luggage' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('luggage')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Briefcase size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>
                      {lang === 'te' ? 'ప్రయాణ లగేజీ & బ్యాగులు' : 'Heavy Luggage'}
                    </h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    PAC-2 / PAC-5
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    Free · Open 24/7
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink}
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('luggage'); handleOpenMap('PAC-2 Madhava Nilayam'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                {/* 3. Shoes & Footwear */}
                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'shoes' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('shoes')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Footprints size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>
                      {lang === 'te' ? 'పాదరక్షలు (చెప్పులు)' : 'Shoes'}
                    </h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Free stands near entrance
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    Free · Token provided
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink}
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('shoes'); handleOpenMap('VQC Footwear Counter'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* FREE MEALS MATRIX */}
            {item.id === 'free-meals' && (
              <>
                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'lunch' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('lunch')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Utensils size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>Traditional Lunch Feast</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Tarigonda Vengamamba Complex
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    10:30 AM – 4:00 PM · Free satvik meal
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('lunch'); handleOpenMap('Tarigonda Vengamamba Annaprasadam'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'dinner' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('dinner')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Utensils size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>Evening & Night Dinner</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Tarigonda Vengamamba Complex
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    5:00 PM – 11:00 PM · Free satvik meal
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('dinner'); handleOpenMap('Tarigonda Vengamamba Annaprasadam'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'queue' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('queue')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Droplets size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>In-Queue Food & Milk</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Inside VQC Waiting Compartments
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    Continuous 24/7 · Direct to seats
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <span style={{ fontSize: '12.5px', color: '#0F5132', fontWeight: 600 }}>Inside Queue Line</span>
                  </div>
                </div>
              </>
            )}

            {/* HAIR OFFERING MATRIX */}
            {item.id === 'hair-offering' && (
              <>
                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'main' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('main')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Scissors size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>Main Kalyanakatta Complex</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Opp. Annaprasadam Complex
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    Open 24/7 · 4 Floors · Free
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('main'); handleOpenMap('Main Kalyanakatta Tirumala'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'mini' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('mini')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Scissors size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>Mini Kalyanakattas (9 Centers)</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    PAC-1, PAC-2, PAC-3 & Rest Houses
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    2:00 AM – 10:00 PM · Shorter queues
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('mini'); handleOpenMap('PAC 1 Kalyanakatta Tirumala'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'bath' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('bath')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Droplets size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>Free Bathing Ghats</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Attached to Kalyanakatta & PACs
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    24/7 Continuous Hot Geysers · Free
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('bath'); handleOpenMap('Kalyanakatta Bathing Tirumala'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ACCOMMODATION MATRIX */}
            {item.id === 'accommodation' && (
              <>
                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'pac' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('pac')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Bed size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>Free PAC Rest Halls</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    PAC-1 to PAC-5 & Madhava Nilayam
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    100% Free · 24/7 Security & Lockers
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('pac'); handleOpenMap('PAC 1 Tirumala'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'cro' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('cro')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <MapPin size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>Hilltop Offline Allotment (CRO)</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Central Reception Office, Opp. Bus Stand
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    3–4 AM Window · ₹100 / ₹500 Rooms
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('cro'); handleOpenMap('CRO Tirumala'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>

                <div 
                  className={`${styles.utilityDecisionCard} ${selectedDecisionId === 'transit' ? styles.utilityDecisionCardActive : ''}`}
                  onClick={() => setSelectedDecisionId('transit')}
                >
                  <div className={styles.utilityDecisionTop}>
                    <div className={styles.utilityDecisionIconBox}>
                      <Bus size={16} />
                    </div>
                    <h4 className={styles.utilityDecisionName}>Tirupati Downhill Transit Rooms</h4>
                  </div>
                  <p className={styles.utilityDecisionWhere}>
                    Vishnu Nivasam & Srinivasam Complex
                  </p>
                  <p className={styles.utilityDecisionMeta}>
                    Opp. Railway Station & Bus Stand
                  </p>
                  <div className={styles.utilityDecisionActionRow}>
                    <button 
                      className={styles.utilityDecisionLink} 
                      onClick={(e) => { e.stopPropagation(); setSelectedDecisionId('transit'); handleOpenMap('Vishnu Nivasam Tirupati'); }}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* BEFORE YOU GO */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 className={styles.sectionTitle} style={{ fontSize: '14.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, color: '#0F172A' }}>
            {lang === 'te' ? 'వెళ్లే ముందు' : 'Before You Go'}
          </h3>

          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#15803D', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0 }} />
              <span>{lang === 'te' ? 'ఒరిజినల్ ఆధార్ కార్డు / ప్రభుత్వ ఫోటో గుర్తింపు కార్డు' : 'Physical Aadhaar or Govt Photo ID'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#15803D', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0 }} />
              <span>{lang === 'te' ? 'దర్శన టికెట్ ప్రింట్‌అవుట్ లేదా బార్‌కోడ్' : 'Darshan ticket (physical or barcode)'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#15803D', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="#16A34A" style={{ flexShrink: 0 }} />
              <span>{lang === 'te' ? 'కొద్దిగా నగదు ₹50–₹100 (లడ్డూ లేదా తాళం కొరకు)' : 'Small cash ₹50–₹100'}</span>
            </div>
          </div>

          {/* Prohibited Items Accordion (Soft Red) */}
          <div className={styles.prohibitedAccordionCard}>
            <button 
              className={styles.prohibitedAccordionHeader}
              onClick={() => setShowProhibited(p => !p)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={15} color="#DC2626" />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#991B1B' }}>
                  {lang === 'te' ? 'క్యూలోకి తీసుకెళ్లకూడని వస్తువులు' : 'Items not allowed inside'}
                </span>
              </div>
              {showProhibited ? <ChevronUp size={16} color="#991B1B" /> : <ChevronDown size={16} color="#991B1B" />}
            </button>

            {showProhibited && (
              <div className={styles.accordionBody}>
                <div style={{ fontSize: '11.5px', color: '#991B1B', fontStyle: 'italic', marginBottom: '2px' }}>
                  {lang === 'te' 
                    ? 'స్కానర్ వద్ద భద్రతా సిబ్బంది తిప్పి పంపుతారు. దర్శనానికి ముందే డిపాజిట్ చేయండి.'
                    : 'Flagged by metal detectors; strictly barred by sanctum security. Deposit these before entering.'}
                </div>
                {item.requirements?.prohibited?.map((req, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#B91C1C', fontWeight: 600 }}>
                    <X size={14} color="#DC2626" style={{ flexShrink: 0 }} />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* HOW IT WORKS (COLLAPSIBLE NEUTRAL ACCORDION) */}
        {item.procedureTimeline && item.procedureTimeline.length > 0 && (
          <div className={styles.neutralAccordionCard}>
            <button 
              className={styles.neutralAccordionHeader}
              onClick={() => setShowTimeline(p => !p)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#475569" />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                  {lang === 'te' ? 'విధానం ఎలా పనిచేస్తుంది?' : 'How It Works'}
                </span>
              </div>
              {showTimeline ? <ChevronUp size={16} color="#475569" /> : <ChevronDown size={16} color="#475569" />}
            </button>

            {showTimeline && (
              <div className={styles.accordionBody}>
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
              </div>
            )}
          </div>
        )}

        {/* OFFICIAL LOCATIONS (COLLAPSIBLE NEUTRAL ACCORDION) */}
        {item.subLocations && item.subLocations.length > 0 && (
          <div className={styles.neutralAccordionCard}>
            <button 
              className={styles.neutralAccordionHeader}
              onClick={() => setShowAllLocations(p => !p)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#0F5132" />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                  {lang === 'te' ? 'అధికారిక కేంద్రాలు & కౌంటర్లు' : 'Official Locations'}
                </span>
              </div>
              {showAllLocations ? <ChevronUp size={16} color="#0F5132" /> : <ChevronDown size={16} color="#0F5132" />}
            </button>

            {showAllLocations && (
              <div className={styles.accordionBody}>
                {item.subLocations.map((loc, idx) => (
                  <div key={idx} className={styles.subLocationCard} style={{ padding: '10px 12px' }}>
                    <div className={styles.subLocationInfo}>
                      <h4 className={styles.subLocationName} style={{ fontSize: '13.5px' }}>{loc.name}</h4>
                      <div className={styles.subLocationMeta} style={{ fontSize: '11.5px' }}>
                        <span>{loc.distance}</span>
                        <span style={{ color: '#16A34A', fontWeight: 700 }}>• {loc.status}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleOpenMap(loc.name)}
                      className={styles.utilityDecisionLink}
                    >
                      <span>Directions →</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FREQUENTLY ASKED QUESTIONS (COLLAPSIBLE NEUTRAL ACCORDION) */}
        {relatedFaqs.length > 0 && (
          <div className={styles.neutralAccordionCard}>
            <button 
              className={styles.neutralAccordionHeader}
              onClick={() => setShowFaqs(p => !p)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={16} color="#475569" />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                  {lang === 'te' ? 'తరచుగా అడిగే ప్రశ్నలు' : 'Frequently Asked Questions'}
                </span>
              </div>
              {showFaqs ? <ChevronUp size={16} color="#475569" /> : <ChevronDown size={16} color="#475569" />}
            </button>

            {showFaqs && (
              <div className={styles.accordionBody}>
                {relatedFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id;
                  return (
                    <div key={faq.id} className={`${styles.faqAccordionItem} ${isExpanded ? styles.faqAccordionItemActive : ''}`}>
                      <div 
                        className={styles.faqAccordionQuestion}
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      >
                        <span style={{ fontSize: '13px' }}>{faq.question}</span>
                        {isExpanded ? <ChevronUp size={15} color="#0F5132" /> : <ChevronDown size={15} color="#64748B" />}
                      </div>
                      {isExpanded && (
                        <div className={styles.faqAccordionAnswer} style={{ fontSize: '12.5px', lineHeight: 1.45 }}>
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 56px CONTEXTUAL STICKY BOTTOM NAVIGATION ACTION */}
      <div className={styles.stickyCtaContainer}>
        <button 
          className={styles.primaryStickyCta}
          onClick={() => handleOpenMap(dynamicCtaInfo.dest)}
        >
          <Navigation size={18} />
          <span>{dynamicCtaInfo.title}</span>
        </button>
      </div>
    </div>
  );
}
