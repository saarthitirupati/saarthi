'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, ClipboardCheck, Sparkles, Check, 
  MapPin, Clock, ChevronRight, HelpCircle, ChevronDown, ChevronUp, X, Navigation, Info,
  Lock, Utensils, Scissors, Bed, ShoppingBag, ShieldAlert, Phone, AlertTriangle, FileText, Footprints, Bell
} from 'lucide-react';
import styles from './Essentials.module.css';

import { KNOWLEDGE_ITEMS, FAQ_ITEMS, CHECKLIST_ITEMS, KnowledgeItem } from '@/content/knowledge';
import { useRealtimeStatus } from '@/lib/useRealtimeStatus';

// Map iconName strings to Lucide React components
import { 
  Briefcase, Smartphone, Droplets, Users, Hospital, Bus, Shirt, Camera
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

export default function PilgrimEssentialsPage() {
  const router = useRouter();
  const { status } = useRealtimeStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [dismissedNotice, setDismissedNotice] = useState(false);

  const noticeText = status?.notice || 'Free Luggage Locker Counters open 24/7 at PAC-1, PAC-2 & PAC-5. Mobile deposit counters operating at VQC entrance.';

  const noticeTimeStr = useMemo(() => {
    if (!status?.lastUpdated) return 'Updated recently';
    const diffMins = Math.max(1, Math.round((Date.now() - new Date(status.lastUpdated).getTime()) / 60000));
    if (diffMins < 60) return `Updated ${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Updated ${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Updated ${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }, [status?.lastUpdated]);

  const noticeIsStale = useMemo(() => {
    if (!status?.lastUpdated) return false;
    return (Date.now() - new Date(status.lastUpdated).getTime()) > 24 * 60 * 60 * 1000;
  }, [status?.lastUpdated]);

  // Initialize client states
  useEffect(() => {
    setIsMounted(true);
    
    // Load checklist state from localStorage
    const savedState: Record<string, boolean> = {};
    CHECKLIST_ITEMS.forEach(item => {
      const val = localStorage.getItem(item.localStorageKey);
      savedState[item.id] = val === 'true';
    });
    setChecklistState(savedState);
  }, []);

  // Update checklist item
  const handleToggleCheck = (itemId: string, storageKey: string) => {
    const newState = !checklistState[itemId];
    setChecklistState(prev => ({ ...prev, [itemId]: newState }));
    localStorage.setItem(storageKey, String(newState));
  };

  // Calculate checklist progress
  const checklistStats = useMemo(() => {
    const total = CHECKLIST_ITEMS.length;
    const checked = Object.values(checklistState).filter(Boolean).length;
    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
    return { total, checked, pct };
  }, [checklistState]);

  // Primary 6 Intent Cards
  const primaryIntents = useMemo(() => {
    return [
      {
        id: 'secure-belongings',
        title: 'Secure Belongings',
        subtitle: 'Free Lockers & Mobile Deposit',
        status: '6 Locations • Open',
        statusType: 'green',
        icon: Lock,
        hint: 'Phone • Luggage • Electronics'
      },
      {
        id: 'free-meals',
        title: 'Free Meals',
        subtitle: 'Annaprasadam Complex',
        status: 'Serving • 11 AM Onwards',
        statusType: 'green',
        icon: Utensils,
        hint: 'Food • Lunch • Dinner'
      },
      {
        id: 'hair-offering',
        title: 'Hair Offering',
        subtitle: 'Kalyana Katta Complex',
        status: 'Main Complex • 24/7',
        statusType: 'green',
        icon: Scissors,
        hint: 'Tonsure • Shaving'
      },
      {
        id: 'accommodation',
        title: 'Accommodation',
        subtitle: 'CRO Office & PAC Halls',
        status: 'Check Availability',
        statusType: 'amber',
        icon: Bed,
        hint: 'Rooms • Dormitory • Hall'
      },
      {
        id: 'shopping',
        title: 'Official Shopping',
        subtitle: 'TTD Books & Prasadam Shops',
        status: 'Open 8 AM - 9 PM',
        statusType: 'green',
        icon: ShoppingBag,
        hint: 'Laddus • Photos • Puja'
      },
      {
        id: 'emergency',
        title: 'Emergency Help',
        subtitle: 'Police, Medical & Lost & Found',
        status: 'Active 24/7',
        statusType: 'red',
        icon: ShieldAlert,
        hint: 'Hospital • Police • 108'
      }
    ];
  }, []);

  // Filter items by search query & natural language aliases
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase().trim();
    
    return KNOWLEDGE_ITEMS.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const descMatch = item.description.toLowerCase().includes(query);
      const aliasMatch = item.searchAliases?.some(alias => alias.includes(query) || query.includes(alias));
      return nameMatch || descMatch || aliasMatch;
    });
  }, [searchQuery]);

  // Filter FAQs based on search query
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_ITEMS.slice(0, 4);
    const query = searchQuery.toLowerCase().trim();
    return FAQ_ITEMS.filter(faq => {
      const qMatch = faq.question.toLowerCase().includes(query);
      const aMatch = faq.answer.toLowerCase().includes(query);
      const aliasMatch = faq.searchAliases?.some(alias => alias.includes(query));
      return qMatch || aMatch || aliasMatch;
    });
  }, [searchQuery]);

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

  const handleCardClick = (id: string) => {
    router.push(`/essentials/${id}`);
  };

  const handleCallEmergency = () => {
    window.location.href = 'tel:108';
  };

  return (
    <div className={styles.container}>
      {/* Sticky Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/')} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className={styles.headerTitle}>Pilgrim Essentials</h1>
          <p className={styles.headerSubtitle}>Everything you need before your visit</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/alerts" aria-label="Notifications" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', textDecoration: 'none', color: '#0F172A' }}>
            <Bell size={20} />
          </Link>
          <button 
            className={styles.iconButton} 
            onClick={() => setShowChecklist(p => !p)} 
            aria-label="Checklist"
          >
            <ClipboardCheck size={20} color={showChecklist ? '#D97706' : '#0F172A'} />
          </button>
        </div>
      </header>

      {/* Main Scroll Content */}
      <div className={styles.scrollArea}>
        
        {/* Search Bar (56px Height - Clean and Focused) */}
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <Search size={20} color="#64748B" />
            <input 
              type="text"
              className={styles.searchInput}
              placeholder="Search lockers, food, rooms, tonsure..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} color="#64748B" />
              </button>
            )}
          </div>
        </div>

        {/* Today's Notice Card (Conditional) */}
        {!dismissedNotice && !searchQuery && noticeText && (
          <motion.div 
            className={styles.noticeBanner}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ flex: 1 }}>
              <div className={styles.noticeHeader}>
                <AlertTriangle size={14} color="#D97706" />
                <span>{noticeIsStale ? 'Notice' : "Today's Notice"}</span>
              </div>
              <p className={styles.noticeContent}>
                {noticeText}
              </p>
              <div className={styles.noticeTime}>{noticeTimeStr}</div>
            </div>
            <button 
              onClick={() => setDismissedNotice(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400E', padding: '2px' }}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        {/* Stateful Darshan Checklist Drawer */}
        <AnimatePresence>
          {showChecklist && (
            <motion.section 
              className={styles.checklistCard}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className={styles.checklistHeader}>
                <h3 className={styles.checklistTitle}>
                  <ClipboardCheck size={18} color="#D97706" />
                  Pre-Darshan Readiness
                </h3>
                <span className={styles.checklistProgress}>{checklistStats.checked} / {checklistStats.total} ({checklistStats.pct}%)</span>
              </div>
              
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: `${checklistStats.pct}%` }} />
              </div>

              <div className={styles.checklistItems}>
                {CHECKLIST_ITEMS.map((item) => {
                  const isChecked = !!checklistState[item.id];
                  return (
                    <div 
                      key={item.id} 
                      className={styles.checkItem}
                      onClick={() => handleToggleCheck(item.id, item.localStorageKey)}
                    >
                      <div className={`${styles.checkbox} ${isChecked ? styles.checkboxChecked : ''}`}>
                        {isChecked && <Check size={14} color="#FFFFFF" />}
                      </div>
                      <span className={`${styles.checkItemText} ${isChecked ? styles.checkItemChecked : ''}`}>
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button className={styles.minimizeBtn} onClick={() => setShowChecklist(false)}>
                Hide Checklist
              </button>
            </motion.section>
          )}
        </AnimatePresence>

        {/* SEARCH RESULTS VIEW */}
        {searchResults ? (
          <section className={styles.primaryGridSection}>
            <div className={styles.sectionHeaderRow}>
              <h2 className={styles.sectionTitle}>
                Search Results ({searchResults.length})
              </h2>
            </div>
            {searchResults.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>
                <HelpCircle size={36} color="#94A3B8" style={{ marginBottom: '8px' }} />
                <p style={{ margin: 0, fontWeight: 600 }}>No facilities found matching "{searchQuery}"</p>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>Try searching for "Phone", "Locker", "Food", "Room", or "Hair"</p>
              </div>
            ) : (
              <div className={styles.primaryGrid}>
                {searchResults.map((item) => {
                  const IconComponent = ICON_MAP[item.iconName] || Info;
                  return (
                    <div 
                      key={item.id} 
                      className={styles.primaryCard}
                      onClick={() => handleCardClick(item.id)}
                    >
                      <div className={styles.primaryCardIconBox}>
                        <IconComponent size={24} />
                      </div>
                      <div>
                        <h3 className={styles.primaryCardTitle}>{item.name}</h3>
                        <p className={styles.primaryCardSub}>{item.shortDescription}</p>
                      </div>
                      <div className={styles.primaryCardFooter}>
                        <span className={styles.statusGreen}>{item.status}</span>
                        <ChevronRight size={16} color="#64748B" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          /* PRIMARY 4 PHOTO-FIRST SERVICE CARDS */
          <section className={styles.primaryGridSection}>
            <div className={styles.sectionHeaderRow}>
              <div>
                <h2 className={styles.sectionTitle}>What You Need Right Now</h2>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 600 }}>
                  Essential facilities before your darshan
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '12px' }}>
              {[
                {
                  id: 'secure-belongings',
                  title: 'Free Lockers & Mobile Deposit',
                  subtitle: 'Secure phones, smart watches & luggage before entering VQC queue',
                  status: '🟢 6 Locations Open',
                  statusColor: '#16A34A',
                  icon: Lock,
                  image: 'https://res.cloudinary.com/kniegqlj/image/upload/v1786968161/IMG_6992_cq6gls.jpg',
                  cta: 'Navigate →'
                },
                {
                  id: 'free-meals',
                  title: 'Free Annaprasadam Meals',
                  subtitle: 'Continuous hot, sacred vegetarian meals at Tarigonda Vengamamba Complex',
                  status: '🟢 Serving Now',
                  statusColor: '#16A34A',
                  icon: Utensils,
                  image: 'https://res.cloudinary.com/kniegqlj/image/upload/v1786968272/Annaprasadam-4-copy_lyo86v.jpg',
                  cta: 'Navigate →'
                },
                {
                  id: 'hair-offering',
                  title: 'Kalyana Katta (Hair Offering)',
                  subtitle: 'Sacred head tonsure counters with token-free sanitized service',
                  status: '🟢 Open 24/7',
                  statusColor: '#16A34A',
                  icon: Scissors,
                  image: 'https://res.cloudinary.com/kniegqlj/image/upload/v1786968353/painted-sign-board-of-kalyanakatta-balaji-temple-tirupati-andhra-pradesh-F5M0J1_p7hkr5.jpg',
                  cta: 'Navigate →'
                },
                {
                  id: 'accommodation',
                  title: 'Accommodation & PAC Rest Halls',
                  subtitle: 'Free pilgrim rest halls & TTD CRO room reservation counters',
                  status: '🟡 Halls Available',
                  statusColor: '#D97706',
                  icon: Bed,
                  image: 'https://res.cloudinary.com/kniegqlj/image/upload/v1786968555/maxresdefault_fwmwke.jpg',
                  cta: 'Navigate →'
                }
              ].map((service) => {
                const IconComp = service.icon;
                return (
                  <div 
                    key={service.id}
                    onClick={() => handleCardClick(service.id)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.04)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    {/* PHOTO BANNER */}
                    <div style={{
                      height: '130px',
                      width: '100%',
                      backgroundImage: `url(${service.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(6px)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 800
                      }}>
                        <span>{service.status}</span>
                      </div>
                    </div>

                    {/* CONTENT & 1 CTA */}
                    <div style={{ padding: '16px 18px 18px' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                        {service.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 14px', lineHeight: '1.4', fontWeight: 500 }}>
                        {service.subtitle}
                      </p>
                      
                      <button
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '14px',
                          backgroundColor: '#0F5132',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(15, 81, 50, 0.18)'
                        }}
                      >
                        <span>{service.cta}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SECONDARY SERVICES SECTION */}
            <div style={{ marginTop: '28px', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px' }}>
                Support & Emergency Services
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div
                  onClick={() => handleCardClick('shopping')}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <ShoppingBag size={20} color="#0F5132" />
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>Official Shopping</span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>TTD Books & Laddus</span>
                </div>

                <div
                  onClick={() => handleCardClick('emergency')}
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '16px',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <ShieldAlert size={20} color="#DC2626" />
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#991B1B', marginTop: '4px' }}>Emergency Help</span>
                  <span style={{ fontSize: '11px', color: '#B91C1C' }}>Police & Medical 24/7</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQs SECTION */}
        <section className={styles.faqSection}>
          <div className={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' } as any}>
            <HelpCircle size={18} color="#D97706" />
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>
          
          <div className={styles.faqList}>
            {filteredFAQs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div key={faq.id} className={styles.faqItem}>
                  <div 
                    className={styles.faqQuestion}
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  >
                    <span>{faq.question}</span>
                    {isExpanded ? <ChevronUp size={18} color="#D97706" /> : <ChevronDown size={18} color="#64748B" />}
                  </div>
                  {isExpanded && (
                    <div className={styles.faqAnswer}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
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
