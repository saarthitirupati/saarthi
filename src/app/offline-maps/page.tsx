'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Download, Check, Compass, MapPin, 
  Search, Sparkles, Shield, Eye, X, HardDrive, Smartphone, RefreshCw
} from 'lucide-react';
import styles from './OfflineMaps.module.css';
import { CURATED_LAYOUTS, getTempleLayout, TempleLayoutData } from '@/data/templeLayouts';
import { PLACES } from '@/data/places';
import { useLanguage } from '@/lib/useLanguage';
import OfflineTempleMap from '@/components/place/OfflineTempleMap';

export default function OfflineMapsDirectoryPage() {
  const lang = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'tirumala' | 'tirupati' | 'kshethram' | 'nature' | 'food'>('all');
  const [cachedMapIds, setCachedMapIds] = useState<Set<string>>(new Set());
  const [isBulkCaching, setIsBulkCaching] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [selectedPreviewId, setSelectedPreviewId] = useState<string | null>(null);

  // Convert all 73 places into complete layout objects
  const allLayouts = useMemo(() => {
    return PLACES.map((p) => getTempleLayout(p));
  }, []);

  // Category counts calculated dynamically from PLACES
  const categoryCounts = useMemo(() => {
    return {
      all: PLACES.length,
      tirumala: PLACES.filter(p => p.category === 'Tirumala Spot' || (p.location && p.location.toLowerCase().includes('tirumala')) || p.id.includes('tirumala')).length,
      tirupati: PLACES.filter(p => p.category === 'Core Temple' || p.category === 'Tirupati City' || p.category === 'Footsteps').length,
      kshethram: PLACES.filter(p => p.category === 'Day Trip' || p.category === 'Historical' || p.category === 'Temples' || p.category === 'Hidden Gem').length,
      nature: PLACES.filter(p => p.category === 'Nature' || p.category === 'Parks & Leisure').length,
      food: PLACES.filter(p => p.category === 'Food' || p.category === 'Essential Facility').length,
    };
  }, []);

  // Inspect localStorage for cached maps on mount
  const refreshCachedStatus = () => {
    if (typeof window === 'undefined') return;
    const cached = new Set<string>();
    allLayouts.forEach((layout) => {
      try {
        if (localStorage.getItem(`saarthi_offline_map_${layout.placeId}`)) {
          cached.add(layout.placeId);
        }
      } catch {
        // safe fallback
      }
    });
    setCachedMapIds(cached);
  };

  useEffect(() => {
    refreshCachedStatus();
  }, [allLayouts]);

  // Bulk cache all maps into device storage
  const handleCacheAllMaps = async () => {
    setIsBulkCaching(true);
    const total = allLayouts.length;
    setBulkProgress({ current: 0, total });

    for (let i = 0; i < total; i++) {
      const layout = allLayouts[i];
      try {
        localStorage.setItem(`saarthi_offline_map_${layout.placeId}`, JSON.stringify({
          placeId: layout.placeId,
          savedAt: new Date().toISOString(),
          layout
        }));
      } catch (e) {
        console.warn(`Failed caching map for ${layout.placeId}:`, e);
      }
      setBulkProgress({ current: i + 1, total });
      // Small tick delay for visual smoothness
      await new Promise(r => setTimeout(r, 20));
    }

    refreshCachedStatus();
    setIsBulkCaching(false);
  };

  // Filter layouts based on search query and category
  const filteredLayouts = useMemo(() => {
    return allLayouts.filter((layout) => {
      const place = PLACES.find(p => p.id === layout.placeId);
      if (!place) return false;

      // Category filter
      if (activeCategory === 'tirumala') {
        const isTirumala = place.category === 'Tirumala Spot' || (place.location && place.location.toLowerCase().includes('tirumala')) || place.id.includes('tirumala');
        if (!isTirumala) return false;
      } else if (activeCategory === 'tirupati') {
        const isTirupati = place.category === 'Core Temple' || place.category === 'Tirupati City' || place.category === 'Footsteps';
        if (!isTirupati) return false;
      } else if (activeCategory === 'kshethram') {
        const isKshethram = place.category === 'Day Trip' || place.category === 'Historical' || place.category === 'Temples' || place.category === 'Hidden Gem';
        if (!isKshethram) return false;
      } else if (activeCategory === 'nature') {
        const isNature = place.category === 'Nature' || place.category === 'Parks & Leisure';
        if (!isNature) return false;
      } else if (activeCategory === 'food') {
        const isFood = place.category === 'Food' || place.category === 'Essential Facility';
        if (!isFood) return false;
      }

      // Query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        layout.titleEn.toLowerCase().includes(q) ||
        layout.titleTe.toLowerCase().includes(q) ||
        layout.placeId.toLowerCase().includes(q) ||
        place.name.toLowerCase().includes(q) ||
        (place.location && place.location.toLowerCase().includes(q))
      );
    });
  }, [allLayouts, searchQuery, activeCategory]);

  const allCached = cachedMapIds.size === allLayouts.length && allLayouts.length > 0;

  return (
    <div className={styles.container}>
      {/* ── HEADER & STATS ── */}
      <header className={styles.heroHeader}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className={styles.topBar}>
            <Link href="/" className={styles.backBtn}>
              <ArrowLeft size={15} />
              <span>{lang === 'te' ? 'హోమ్' : 'Home'}</span>
            </Link>

            <div className={styles.storageBadge}>
              <Smartphone size={14} />
              <span>
                {cachedMapIds.size} / {allLayouts.length} {lang === 'te' ? 'ఆఫ్‌లైన్ సిద్ధం' : 'Saved Offline'}
              </span>
            </div>
          </div>

          <div className={styles.titleArea}>
            <div className={styles.badgePill}>
              <Compass size={13} />
              <span>{lang === 'te' ? 'సిగ్నల్ లేని జోన్లకు ప్రత్యేకం' : 'Works Without Cellular Signal'}</span>
            </div>
            <h1 className={styles.mainTitle}>
              {lang === 'te' ? 'ఆఫ్‌లైన్ ఆలయ ప్రాంగణ మ్యాప్‌లు' : 'Offline Temple Precinct Maps'}
            </h1>
            <p className={styles.subTitle}>
              {lang === 'te'
                ? 'తిరుమల మరియు తిరుపతి పరిసర క్షేత్రాల వెక్టర్ మ్యాప్‌లు మీ ఫోన్‌లో సేవ్ చేసుకోండి. ఫోన్ లాకర్లలో పెట్టే ముందు ప్రదక్షిణ మార్గం పరిశీలించండి.'
                : 'Interactive architectural vector blueprints and clockwise pradakshina routes. Pre-cache to your device for 100% offline access in mobile-free temple corridors.'}
            </p>
          </div>

          {/* Bulk Cache All Card */}
          <div className={styles.bulkActionCard}>
            <div className={styles.bulkInfo}>
              <div className={styles.bulkIcon}>
                <HardDrive size={22} />
              </div>
              <div>
                <h4 className={styles.bulkTitle}>
                  {allCached 
                    ? (lang === 'te' ? 'అన్ని మ్యాప్‌లు మీ పరికరంలో సేవ్ చేయబడ్డాయి' : 'All Precinct Maps Pre-Cached in Device')
                    : (lang === 'te' ? `ఒకే ట్యాప్‌తో మొత్తం ${allLayouts.length} మ్యాప్‌లు సేవ్ చేయండి` : `Pre-Cache All ${allLayouts.length} Places in 1-Tap`)}
                </h4>
                <p className={styles.bulkDesc}>
                  {lang === 'te'
                    ? 'మొత్తం వెక్టర్ మ్యాప్‌లు, క్యూ దారులు, లడ్డూ కౌంటర్లు మరియు అత్యవసర నంబర్లు మీ ఫోన్‌లో స్టోర్ అవుతాయి (~1.2 MB).'
                    : 'Download full vector geometry, sanctum coordinates, laddu counters & emergency helplines (~1.2 MB).'}
                </p>
              </div>
            </div>

            <button
              onClick={handleCacheAllMaps}
              disabled={isBulkCaching}
              className={`${styles.cacheAllBtn} ${allCached ? styles.cacheAllBtnSaved : ''}`}
            >
              {isBulkCaching ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>
                    {lang === 'te' 
                      ? `సేవ్ చేస్తోంది (${bulkProgress.current}/${bulkProgress.total})...`
                      : `Pre-Caching (${bulkProgress.current}/${bulkProgress.total})...`}
                  </span>
                </>
              ) : allCached ? (
                <>
                  <Check size={16} />
                  <span>{lang === 'te' ? 'పూర్తిగా సేవ్ అయ్యింది' : '100% Offline Ready'}</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>{lang === 'te' ? 'అన్ని మ్యాప్‌లు డౌన్‌లోడ్ చేయండి' : 'Download All Offline Maps'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <section className={styles.controlsSection}>
        {/* Search Bar */}
        <div className={styles.searchBox}>
          <Search size={18} color="#78716C" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={lang === 'te' ? 'ఆలయం లేదా క్షేత్రం పేరు శోధించండి...' : 'Search temple, shrine, waterfall, or fort name...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716C' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className={styles.filterTabs}>
          {[
            { id: 'all', labelEn: 'All Places', labelTe: 'అన్ని ప్రదేశాలు', count: categoryCounts.all },
            { id: 'tirumala', labelEn: 'Tirumala Hill', labelTe: 'తిరుమల కొండపై', count: categoryCounts.tirumala },
            { id: 'tirupati', labelEn: 'Tirupati Base', labelTe: 'తిరుపతి నగరం', count: categoryCounts.tirupati },
            { id: 'kshethram', labelEn: 'Chittoor Kshethrams', labelTe: 'పరిసర క్షేత్రాలు', count: categoryCounts.kshethram },
            { id: 'nature', labelEn: 'Nature & Parks', labelTe: 'జలపాతాలు & పార్కులు', count: categoryCounts.nature },
            { id: 'food', labelEn: 'Food & Annaprasadam', labelTe: 'భోజనం & అన్నప్రసాదం', count: categoryCounts.food },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`${styles.tabBtn} ${activeCategory === tab.id ? styles.tabBtnActive : ''}`}
            >
              <span>{lang === 'te' ? tab.labelTe : tab.labelEn}</span>
              <span style={{ opacity: 0.75, fontSize: '11px', marginLeft: '4px' }}>({tab.count})</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── MAPS GRID ── */}
      <main className={styles.gridContainer}>
        <div className={styles.mapsGrid}>
          {filteredLayouts.map((layout) => {
            const isSaved = cachedMapIds.has(layout.placeId);
            const matchingPlace = PLACES.find(p => p.id === layout.placeId);

            return (
              <div key={layout.placeId} className={styles.mapCard}>
                {/* SVG Blueprint Mini Preview */}
                <div className={styles.cardPreview}>
                  <span className={styles.categoryTag}>
                    {layout.layoutType.replace('-', ' ').toUpperCase()}
                  </span>

                  <span className={styles.offlineStatusTag}>
                    {isSaved ? (
                      <>
                        <Check size={11} />
                        <span>{lang === 'te' ? 'సేవ్ చేయబడింది' : 'Offline Ready'}</span>
                      </>
                    ) : (
                      <>
                        <Download size={11} />
                        <span>{lang === 'te' ? 'ఆన్‌లైన్' : 'Available'}</span>
                      </>
                    )}
                  </span>

                  {/* Stylized vector motif icon in preview */}
                  <div style={{ textAlign: 'center', opacity: 0.85 }}>
                    <Compass size={44} color="#B45309" strokeWidth={1.4} />
                    <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#78716C', fontWeight: 700 }}>
                      {layout.pins.length} Key Precinct Pins & Route
                    </p>
                  </div>
                </div>

                {/* Card Info */}
                <div className={styles.cardContent}>
                  <div>
                    <h3 className={styles.cardTitle}>
                      {lang === 'te' ? layout.titleTe : layout.titleEn}
                    </h3>
                    
                    <div className={styles.cardStats}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} color="#B45309" />
                        {matchingPlace?.category || 'Heritage / Temple'}
                      </span>
                      <span>•</span>
                      <span>{layout.routeSteps?.length || 5} Route Steps</span>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      onClick={() => setSelectedPreviewId(layout.placeId)}
                      className={styles.viewBtn}
                    >
                      <Eye size={14} />
                      <span>{lang === 'te' ? 'మ్యాప్ తెరవండి' : 'Open Vector Map'}</span>
                    </button>

                    <Link
                      href={`/place/${layout.placeId}`}
                      className={styles.saveIconBtn}
                      title="View Complete Place Guide"
                    >
                      <Sparkles size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLayouts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E7E5E4' }}>
            <Compass size={40} color="#78716C" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1C1917', margin: '0 0 6px 0' }}>
              {lang === 'te' ? 'మ్యాప్‌లు కనుగొనబడలేదు' : 'No Precinct Maps Match Your Query'}
            </h3>
            <p style={{ fontSize: '13px', color: '#78716C', margin: 0 }}>
              {lang === 'te' ? 'శోధన పదాన్ని మార్చి మళ్లీ ప్రయత్నించండి.' : 'Try changing your search keywords or switching category tabs.'}
            </p>
          </div>
        )}
      </main>

      {/* ── FULLSCREEN INTERACTIVE VECTOR MAP MODAL ── */}
      {selectedPreviewId && (
        <div 
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPreviewId(null);
          }}
        >
          <div className={styles.modalContent}>
            <button 
              onClick={() => setSelectedPreviewId(null)} 
              className={styles.closeModalBtn}
              aria-label="Close Map"
            >
              <X size={20} />
            </button>

            <div style={{ padding: '24px 20px 20px 20px' }}>
              <OfflineTempleMap
                placeId={selectedPreviewId}
                place={PLACES.find(p => p.id === selectedPreviewId)}
                lang={lang}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
