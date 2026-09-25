'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, ClipboardCheck, Check, 
  ChevronRight, HelpCircle, ChevronDown, ChevronUp, X,
  Lock, Utensils, Scissors, Bed, ShoppingBag, ShieldAlert, Phone, AlertTriangle, Bell, Info
} from 'lucide-react';
import styles from './Essentials.module.css';

import { KNOWLEDGE_ITEMS, FAQ_ITEMS, CHECKLIST_ITEMS } from '@/content/knowledge';
import { useRealtimeStatus } from '@/lib/useRealtimeStatus';
import { SrivariNamamVector } from '@/components/common/DevotionalSvgIcons';

export default function PilgrimEssentialsPage() {
  const router = useRouter();
  const { status } = useRealtimeStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [dismissedNotice, setDismissedNotice] = useState(false);

  const noticeText = status?.notice || 'Ghat Road traffic is normal. Luggage Locker Complexes open 24/7 at PAC-1 to PAC-5.';

  const noticeTimeStr = useMemo(() => {
    if (!status?.lastUpdated) return 'Updated 1h ago';
    const diffMins = Math.max(1, Math.round((Date.now() - new Date(status.lastUpdated).getTime()) / 60000));
    if (diffMins < 60) return `Updated ${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Updated ${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Updated ${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
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
          width: '36px', height: '36px', border: '3px solid #0F5132',
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

  return (
    <div className={styles.container}>
      {/* Sticky Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/')} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div className={styles.headerTitleContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <SrivariNamamVector size={24} />
          <h1 style={{ margin: 0, fontFamily: "var(--font-sacred-serif), 'Cinzel', Georgia, serif" }}>
            Pilgrim Essentials
          </h1>
        </div>
        <div className={styles.headerActions}>
          <Link href="/alerts" aria-label="Notifications" className={styles.iconButton}>
            <Bell size={18} />
          </Link>
          <button 
            className={styles.iconButton} 
            onClick={() => setShowChecklist(p => !p)} 
            aria-label="Checklist"
          >
            <ClipboardCheck size={18} color={showChecklist ? '#0F5132' : '#0F172A'} />
          </button>
        </div>
      </header>

      {/* Main Scroll Content */}
      <div className={styles.scrollArea} style={{ paddingBottom: '32px', gap: '20px' }}>
        
        {/* Search Bar ("What are you looking for?") */}
        <div className={styles.searchContainer}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
            What are you looking for?
          </div>
          <div className={styles.searchBar}>
            <Search size={18} color="#64748B" />
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
                aria-label="Clear search"
              >
                <X size={16} color="#64748B" />
              </button>
            )}
          </div>
        </div>

        {/* Today's Notice (Clean Amber Container) */}
        {!dismissedNotice && !searchQuery && noticeText && (
          <motion.div 
            className={styles.noticeBanner}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ flex: 1 }}>
              <div className={styles.noticeHeader}>
                <AlertTriangle size={14} color="#D97706" />
                <span>Today's Notice</span>
              </div>
              <p className={styles.noticeContent}>
                {noticeText}
              </p>
              <div className={styles.noticeTime}>{noticeTimeStr}</div>
            </div>
            <button 
              onClick={() => setDismissedNotice(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400E', padding: '2px' }}
              aria-label="Dismiss notice"
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
                  <ClipboardCheck size={18} color="#0F5132" />
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

        {/* SEARCH RESULTS VIEW (IF USER IS SEARCHING) */}
        {searchResults ? (
          <section className={styles.primaryGridSection}>
            <div className={styles.sectionHeaderRow}>
              <h2 className={styles.sectionTitle} style={{ fontSize: '17px' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {searchResults.map((item) => (
                  <div 
                    key={item.id} 
                    className={styles.utilityDecisionCard}
                    onClick={() => handleCardClick(item.id)}
                  >
                    <div className={styles.utilityDecisionTop}>
                      <h4 className={styles.utilityDecisionName}>{item.name}</h4>
                      <span className={styles.utilityDecisionBadge}>{item.status}</span>
                    </div>
                    <p className={styles.utilityDecisionLoc}>{item.shortDescription}</p>
                    <div className={styles.utilityDecisionActionRow}>
                      <span className={styles.secondaryCardAction}>
                        View Details →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* WHAT DO YOU NEED RIGHT NOW? (1 PRIMARY FEATURED + COMPACT SECONDARY CARDS) */
          <section style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <h2 className={styles.sectionTitle} style={{ fontSize: '18px', margin: 0 }}>
                What do you need right now?
              </h2>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>
                Instant guidance before entering the temple
              </p>
            </div>

            {/* PRIMARY FEATURED CARD: SECURE BELONGINGS */}
            <div 
              className={styles.featuredServiceCard}
              onClick={() => handleCardClick('secure-belongings')}
            >
              <div 
                className={styles.featuredBanner}
                style={{ backgroundImage: `url('https://res.cloudinary.com/kniegqlj/image/upload/v1786968161/IMG_6992_cq6gls.jpg')` }}
              >
                <div className={styles.featuredBadge}>
                  <span className={styles.pulseDot} />
                  <span>6 Locations Open · 24/7</span>
                </div>
              </div>
              <div className={styles.featuredContent}>
                <div>
                  <h3 className={styles.featuredTitle}>Secure Belongings & Free Lockers</h3>
                  <p className={styles.featuredSub}>
                    Deposit mobile phones, backpacks & shoes safely before entering queue scanners. 100% free with exit pickup.
                  </p>
                </div>
                <button className={styles.featuredActionBtn}>
                  <Lock size={15} />
                  <span>Find a locker →</span>
                </button>
              </div>
            </div>

            {/* COMPACT 2x2 SECONDARY CARDS WITH IMAGES */}
            <div className={styles.secondaryCategoryGrid}>
              {/* 1. Food */}
              <div 
                className={styles.secondaryCategoryCard}
                onClick={() => handleCardClick('free-meals')}
              >
                <div 
                  className={styles.secondaryCardImage}
                  style={{ backgroundImage: `url('https://res.cloudinary.com/kniegqlj/image/upload/v1786968272/Annaprasadam-4-copy_lyo86v.jpg')` }}
                />
                <div className={styles.secondaryCardBody}>
                  <div>
                    <h4 className={styles.secondaryTitle}>Free Meals</h4>
                    <p className={styles.secondarySub}>Annaprasadam Complex</p>
                  </div>
                  <div className={styles.secondaryCardAction}>
                    <span>Find meal locations →</span>
                  </div>
                </div>
              </div>

              {/* 2. Hair Offering */}
              <div 
                className={styles.secondaryCategoryCard}
                onClick={() => handleCardClick('hair-offering')}
              >
                <div 
                  className={styles.secondaryCardImage}
                  style={{ backgroundImage: `url('https://res.cloudinary.com/kniegqlj/image/upload/v1786968353/painted-sign-board-of-kalyanakatta-balaji-temple-tirupati-andhra-pradesh-F5M0J1_p7hkr5.jpg')` }}
                />
                <div className={styles.secondaryCardBody}>
                  <div>
                    <h4 className={styles.secondaryTitle}>Hair Offering</h4>
                    <p className={styles.secondarySub}>Kalyana Katta 24/7</p>
                  </div>
                  <div className={styles.secondaryCardAction}>
                    <span>Find Kalyanakatta →</span>
                  </div>
                </div>
              </div>

              {/* 3. Accommodation */}
              <div 
                className={styles.secondaryCategoryCard}
                onClick={() => handleCardClick('accommodation')}
              >
                <div 
                  className={styles.secondaryCardImage}
                  style={{ backgroundImage: `url('https://res.cloudinary.com/kniegqlj/image/upload/v1786968555/maxresdefault_fwmwke.jpg')` }}
                />
                <div className={styles.secondaryCardBody}>
                  <div>
                    <h4 className={styles.secondaryTitle}>Accommodation</h4>
                    <p className={styles.secondarySub}>PAC Halls & Rooms</p>
                  </div>
                  <div className={styles.secondaryCardAction}>
                    <span>Find rooms & PAC →</span>
                  </div>
                </div>
              </div>

              {/* 4. Official Shopping */}
              <div 
                className={styles.secondaryCategoryCard}
                onClick={() => handleCardClick('shopping')}
              >
                <div 
                  className={styles.secondaryCardImage}
                  style={{ backgroundImage: `url('/assets/leisure/tirupati-market.png')` }}
                />
                <div className={styles.secondaryCardBody}>
                  <div>
                    <h4 className={styles.secondaryTitle}>Official Shopping</h4>
                    <p className={styles.secondarySub}>TTD Books & Laddus</p>
                  </div>
                  <div className={styles.secondaryCardAction}>
                    <span>View stores →</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SUPPORT & EMERGENCY SECTION (CLEAN CARDS, SUBTLE RED) */}
            <div style={{ marginTop: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
                Support & Emergency
              </h3>
              <div className={styles.supportEmergencyGrid}>
                {/* Official Shopping / Helpdesk */}
                <div 
                  className={styles.supportCard}
                  onClick={() => window.location.href = 'tel:155257'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HelpCircle size={18} color="#0F5132" />
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>TTD Helpdesk</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: '#64748B', margin: 0 }}>
                    Official 24/7 Pilgrim Enquiry
                  </p>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F5132' }}>
                    Call 155257 →
                  </span>
                </div>

                {/* Emergency Assistance */}
                <div 
                  className={styles.emergencySubtleCard}
                  onClick={() => window.location.href = 'tel:108'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={18} color="#DC2626" />
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#991B1B' }}>Emergency Help</span>
                  </div>
                  <p style={{ fontSize: '11.5px', color: '#991B1B', margin: 0 }}>
                    Police & Medical Services
                  </p>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#DC2626' }}>
                    Call 108 →
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FREQUENTLY ASKED QUESTIONS (CLEAN PROGRESSIVE DISCLOSURE) */}
        <section className={styles.faqSection} style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <HelpCircle size={17} color="#475569" />
            <h2 className={styles.sectionTitle} style={{ fontSize: '16px' }}>Frequently Asked Questions</h2>
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
                    <span style={{ fontSize: '13.5px' }}>{faq.question}</span>
                    {isExpanded ? <ChevronUp size={16} color="#0F5132" /> : <ChevronDown size={16} color="#64748B" />}
                  </div>
                  {isExpanded && (
                    <div className={styles.faqAnswer} style={{ fontSize: '12.5px', lineHeight: 1.45 }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
