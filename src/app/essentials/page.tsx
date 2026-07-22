'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, ClipboardCheck, Sparkles, Check, 
  MapPin, Clock, ChevronRight, HelpCircle, ChevronDown, ChevronUp, X, Navigation, Info,
  Lock, Utensils, Scissors, Bed, ShoppingBag, ShieldAlert, Phone, AlertTriangle, FileText, Footprints
} from 'lucide-react';
import styles from './Essentials.module.css';

import { KNOWLEDGE_ITEMS, FAQ_ITEMS, CHECKLIST_ITEMS, KnowledgeItem } from '@/content/knowledge';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [dismissedNotice, setDismissedNotice] = useState(false);

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
        
        {/* Search Bar (56px Height) */}
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <Search size={20} color="#64748B" />
            <input 
              type="text"
              className={styles.searchInput}
              placeholder="Need something? Phone • Locker • Food • Room • Hair"
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
          
          {/* Natural Language Alias Hint Chips (Lucide Icons, No Emojis) */}
          {!searchQuery && (
            <div className={styles.searchHints}>
              <span className={styles.searchHintChip} onClick={() => setSearchQuery('Phone')}>
                <Smartphone size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Phone
              </span>
              <span className={styles.searchHintChip} onClick={() => setSearchQuery('Locker')}>
                <Lock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Lockers
              </span>
              <span className={styles.searchHintChip} onClick={() => setSearchQuery('Food')}>
                <Utensils size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Free Meals
              </span>
              <span className={styles.searchHintChip} onClick={() => setSearchQuery('Room')}>
                <Bed size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Room / CRO
              </span>
              <span className={styles.searchHintChip} onClick={() => setSearchQuery('Hair')}>
                <Scissors size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Kalyana Katta
              </span>
              <span className={styles.searchHintChip} onClick={() => setSearchQuery('Aadhaar')}>
                <FileText size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Aadhaar
              </span>
            </div>
          )}
        </div>

        {/* Today's Notice Card (Conditional) */}
        {!dismissedNotice && !searchQuery && (
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
                Free Luggage Locker Counters open 24/7 at PAC-1, PAC-2 & PAC-5. Mobile deposit counters operating at VQC entrance.
              </p>
              <div className={styles.noticeTime}>Updated 6 mins ago</div>
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
          /* PRIMARY 2-COLUMN INTENT CARDS GRID */
          <section className={styles.primaryGridSection}>
            <div className={styles.sectionHeaderRow}>
              <h2 className={styles.sectionTitle}>Need Something?</h2>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Select intent</span>
            </div>

            <div className={styles.primaryGrid}>
              {primaryIntents.map((intent) => {
                const IconComp = intent.icon;
                return (
                  <div 
                    key={intent.id}
                    className={styles.primaryCard}
                    onClick={() => handleCardClick(intent.id)}
                  >
                    <div className={styles.primaryCardIconBox}>
                      <IconComp size={24} />
                    </div>
                    <div>
                      <h3 className={styles.primaryCardTitle}>{intent.title}</h3>
                      <p className={styles.primaryCardSub}>{intent.subtitle}</p>
                    </div>
                    <div className={styles.primaryCardFooter}>
                      <span className={
                        intent.statusType === 'green' ? styles.statusGreen :
                        intent.statusType === 'amber' ? styles.statusAmber : styles.statusRed
                      }>
                        {intent.status}
                      </span>
                      <ChevronRight size={16} color="#64748B" />
                    </div>
                  </div>
                );
              })}
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
