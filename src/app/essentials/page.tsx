'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Bell, ClipboardCheck, Sparkles, Check, CheckSquare, 
  MapPin, Clock, ChevronRight, HelpCircle, ChevronDown, ChevronUp, X, Navigation, Info
} from 'lucide-react';
import styles from './Essentials.module.css';

import { KNOWLEDGE_ITEMS, FAQ_ITEMS, CHECKLIST_ITEMS, KnowledgeItem } from '@/data/knowledge';

// Map iconName strings to Lucide React components
import { 
  Briefcase, Smartphone, Footprints, Utensils, 
  Droplets, Users, Hospital, Bus, Shirt, Camera
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  briefcase: Briefcase,
  smartphone: Smartphone,
  footprints: Footprints,
  utensils: Utensils,
  droplets: Droplets,
  users: Users,
  hospital: Hospital,
  bus: Bus,
  shirt: Shirt,
  camera: Camera
};

export default function PilgrimEssentialsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [cabRef, setCabRef] = useState<string | null>(null);
  const [dismissedTip, setDismissedTip] = useState(false);

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

    // Check for cab referral code
    const ref = localStorage.getItem('saarthi_cab_ref');
    if (ref) setCabRef(ref);

    // Read query params natively to avoid Next.js Suspense requirements
    const params = new URLSearchParams(window.location.search);
    if (params.get('showChecklist') === 'true') {
      setShowChecklist(true);
    }
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

  // Quick Action triggers
  const handleQuickAction = (id: string) => {
    setActiveCategory('All');
    setSearchQuery('');
    
    // Navigate directly to the detail page
    router.push(`/essentials/${id}`);
  };

  // Search filter + aliases logic
  const filteredItems = useMemo(() => {
    let source = KNOWLEDGE_ITEMS;

    // 1. Filter by category
    if (activeCategory !== 'All') {
      source = source.filter(item => item.category === activeCategory);
    }

    // 2. Filter by search query (including natural language aliases)
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase().trim();
      source = source.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);
        const aliasMatch = item.searchAliases.some(alias => alias.includes(query) || query.includes(alias));
        return nameMatch || descMatch || aliasMatch;
      });
    }

    // Sort by importance (must-know -> highly-recommended -> good-to-know)
    const importanceOrder = { 'must-know': 0, 'highly-recommended': 1, 'good-to-know': 2 };
    return [...source].sort((a, b) => importanceOrder[a.importance] - importanceOrder[b.importance]);
  }, [activeCategory, searchQuery]);

  // Filter FAQs based on search
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_ITEMS.slice(0, 3);
    const query = searchQuery.toLowerCase().trim();
    return FAQ_ITEMS.filter(faq => {
      const qMatch = faq.question.toLowerCase().includes(query);
      const aMatch = faq.answer.toLowerCase().includes(query);
      const aliasMatch = faq.searchAliases.some(alias => alias.includes(query));
      return qMatch || aMatch || aliasMatch;
    });
  }, [searchQuery]);

  // Sticky bottom context tip recommendation
  const contextTip = useMemo(() => {
    if (dismissedTip) return null;

    // Context A: Scanned cab QR code
    if (cabRef) {
      return {
        id: 'free-lockers',
        title: '💡 Pilgrim Tip (Cab Passenger)',
        desc: `Carrying heavy bags in Cab ${cabRef}? Store your luggage at the FREE lockers near Tirumala Bus Stand before walking to the queue.`,
        cta: 'View Lockers Nearby'
      };
    }

    // Context B: Time/Darshan check defaults
    return {
      id: 'mobile-deposit',
      title: '📱 Mobile Reminder',
      desc: 'Mobile phones are strictly banned inside the temple. Remember to deposit them at the free counter before joining the queue line.',
      cta: 'View Mobile Counters'
    };
  }, [cabRef, dismissedTip]);

  if (!isMounted) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          width: '36px', height: '36px', border: '3px solid #F59E0B',
          borderTopColor: 'transparent', borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const categories = ['All', 'Free Facilities', 'Temple Rules', 'Emergency', 'Accessibility', 'Transport'] as const;

  return (
    <div className={styles.container}>
      {/* Sticky Header */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/')} aria-label="Back">
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 className={styles.headerTitle}>Pilgrim Essentials</h1>
          <p className={styles.headerSubtitle}>Everything you need before darshan</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.iconButton} onClick={() => setShowChecklist(p => !p)} aria-label="Checklist">
            <ClipboardCheck size={20} color={showChecklist ? '#D97706' : '#0F172A'} />
          </button>
          <button className={styles.iconButton} aria-label="Notifications">
            <Bell size={20} />
          </button>
        </div>
      </header>

      {/* Main Scroll Content */}
      <div className={styles.scrollArea}>
        {/* Welcome & First-Time Pilgrim Banner */}
        <AnimatePresence>
          {!showChecklist && (
            <motion.section 
              className={styles.welcomeBanner}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h3 className={styles.welcomeTitle}>🙏 Welcome to Tirumala</h3>
              <p className={styles.welcomeText}>
                First time visiting? We will guide you through the most important things every pilgrim should do and know before darshan.
              </p>
              <button className={styles.bannerBtn} onClick={() => setShowChecklist(true)}>
                Start Checklist
              </button>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Stateful Darshan Checklist */}
        <AnimatePresence>
          {showChecklist && (
            <motion.section 
              className={styles.checklistCard}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.checklistHeader}>
                <h3 className={styles.checklistTitle}>📋 Before Darshan Checklist</h3>
                <span className={styles.checklistProgress}>
                  {checklistStats.checked} / {checklistStats.total} Done
                </span>
              </div>
              <div className={styles.progressBarBg}>
                <div 
                  className={styles.progressBarFill} 
                  style={{ width: `${checklistStats.pct}%` }}
                />
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
                        {isChecked && <Check size={12} color="#FFF" />}
                      </div>
                      <span className={`${styles.checkItemText} ${isChecked ? styles.checkItemChecked : ''}`}>
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {checklistStats.pct === 100 && (
                <div className={styles.readyBadge}>
                  🎉 100% Ready for Darshan!
                </div>
              )}
              
              <button 
                className={styles.bannerBtn} 
                style={{ marginTop: '16px', backgroundColor: '#F1F5F9', color: '#475569', width: '100%' }}
                onClick={() => setShowChecklist(false)}
              >
                Minimize Checklist
              </button>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Quick Actions Grid */}
        <section className={styles.quickActionsSection}>
          <h2 className={styles.sectionTitle}>⚡ Quick Actions</h2>
          <div className={styles.quickActionsGrid}>
            <button className={styles.actionButton} onClick={() => handleQuickAction('free-lockers')}>
              <div className={styles.actionIconWrapper}><Briefcase size={18} /></div>
              <span className={styles.actionLabel}>Lockers</span>
            </button>
            <button className={styles.actionButton} onClick={() => handleQuickAction('mobile-deposit')}>
              <div className={styles.actionIconWrapper}><Smartphone size={18} /></div>
              <span className={styles.actionLabel}>Mobile</span>
            </button>
            <button className={styles.actionButton} onClick={() => handleQuickAction('footwear-counters')}>
              <div className={styles.actionIconWrapper}><Footprints size={18} /></div>
              <span className={styles.actionLabel}>Footwear</span>
            </button>
            <button className={styles.actionButton} onClick={() => handleQuickAction('toilets')}>
              <div className={styles.actionIconWrapper}><Users size={18} /></div>
              <span className={styles.actionLabel}>Toilets</span>
            </button>
            <button className={styles.actionButton} onClick={() => handleQuickAction('annaprasadam')}>
              <div className={styles.actionIconWrapper}><Utensils size={18} /></div>
              <span className={styles.actionLabel}>Meals</span>
            </button>
            <button className={styles.actionButton} onClick={() => handleQuickAction('medical-center')}>
              <div className={styles.actionIconWrapper}><Hospital size={18} /></div>
              <span className={styles.actionLabel}>Medical</span>
            </button>
            <button className={styles.actionButton} onClick={() => handleQuickAction('free-bus')}>
              <div className={styles.actionIconWrapper}><Bus size={18} /></div>
              <span className={styles.actionLabel}>Free Bus</span>
            </button>
            <button className={styles.actionButton} onClick={() => handleQuickAction('dress-code')}>
              <div className={styles.actionIconWrapper}><Shirt size={18} /></div>
              <span className={styles.actionLabel}>Rules</span>
            </button>
          </div>
        </section>

        {/* Search & Category Pills */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className={styles.searchBar}>
            <Search size={18} color="#94A3B8" />
            <input 
              type="text"
              placeholder="Search lockers, dress code, tickets..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className={styles.pillsContainer}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`${styles.pill} ${activeCategory === cat ? styles.activePill : ''}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery('');
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Main List of Cards */}
        <section className={styles.cardsList}>
          <div className={styles.sectionTitle} style={{ marginBottom: '-4px' }}>
            {searchQuery ? `Search Results (${filteredItems.length})` : activeCategory === 'All' ? 'All Essentials' : activeCategory}
          </div>

          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const IconComp = ICON_MAP[item.iconName] || Info;
              const isImportant = item.importance === 'must-know';
              const isRecommended = item.importance === 'highly-recommended';
              
              return (
                <Link key={item.id} href={`/essentials/${item.id}`} className={styles.itemCard} style={{ textDecoration: 'none' }}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitleSection}>
                      <div className={styles.cardIconBox}>
                        <IconComp size={20} />
                      </div>
                      <div className={styles.cardMeta}>
                        <h4 className={styles.cardTitle}>{item.name}</h4>
                        <span className={styles.cardSub}>{item.location}</span>
                      </div>
                    </div>
                    <div className={styles.cardBadges}>
                      <span className={`${styles.badge} ${
                        isImportant ? styles.badgeAlert : isRecommended ? styles.badgeRule : styles.badgeFree
                      }`}>
                        {item.importance.replace('-', ' ')}
                      </span>
                      <span className={`${styles.badge} ${styles.badgeVerified}`}>
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  <p className={styles.cardDescription}>{item.shortDescription}</p>

                  <div className={styles.whyItMattersBox}>
                    <h5 className={styles.whyTitle}>Why it Matters</h5>
                    <p className={styles.whyContent}>{item.whyItMatters}</p>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.footerMetrics}>
                      <span>📍 {item.distance}</span>
                      <span>•</span>
                      <span>⏱️ {item.walkingTime}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#D97706', fontWeight: 700 }}>
                      <span>Details</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#FFF', borderRadius: '16px', border: '1px solid rgba(233,128,29,0.05)', color: '#64748B', fontSize: '13px' }}>
              No essentials match your filter. Try changing category or search terms.
            </div>
          )}
        </section>

        {/* FAQs Section */}
        <section className={styles.faqSection}>
          <div className={styles.faqTitleRow}>
            <HelpCircle size={18} color="#D97706" />
            <h3 className={styles.sectionTitle}>Frequently Asked Questions</h3>
          </div>
          <div className={styles.faqList}>
            {filteredFAQs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div key={faq.id} className={styles.faqItem}>
                  <h4 
                    className={styles.faqQuestion}
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  >
                    <span>{faq.question}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </h4>
                  {isExpanded && (
                    <motion.p 
                      className={styles.faqAnswer}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Sticky Bottom Context Card */}
      {contextTip && (
        <div className={styles.stickyBottomWrapper}>
          <motion.div 
            className={styles.bottomContextCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <div className={styles.contextIconBox}>
              <Info size={16} />
            </div>
            <div className={styles.contextInfo}>
              <div className={styles.contextTitle}>{contextTip.title}</div>
              <p className={styles.contextDescription}>{contextTip.desc}</p>
              <button 
                className={styles.contextCta}
                onClick={() => router.push(`/essentials/${contextTip.id}`)}
              >
                {contextTip.cta} <ChevronRight size={12} />
              </button>
            </div>
            <button 
              className={styles.closeContextBtn}
              onClick={() => setDismissedTip(true)}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
