'use client';

import { PLACES, getPlaceGuideData } from '@/data/places';
import { ArrowLeft, Heart, Share2, Star, MapPin, Clock, Compass, Coins, PlayCircle, Camera, Check, Copy, Volume2, VolumeX, ShieldAlert, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PlaceDetails.module.css';
import { useTrip } from '@/components/TripContext';
import MantraPlayer from '@/components/MantraPlayer/MantraPlayer';
import { useSpeechSynthesis } from '@/utils/useSpeechSynthesis';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';

export default function PlaceDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const { places, loading } = useRealtimePlaces(PLACES);

  const place = (places.length > 0 ? places : PLACES).find(t => t.id === id);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const { togglePlace, savedPlaces, addViewedPlace } = useTrip();
  const { isSpeaking, isSupported, toggleSpeak } = useSpeechSynthesis();

  useEffect(() => {
    if (place?.id) {
      addViewedPlace(place.id);
    }
  }, [place?.id]);

  if (loading) return <div className={styles.loadingContainer}>Loading details...</div>;
  if (!place) {
    return (
      <div className={styles.notFound}>
        <p>Place not found.</p>
        <Link href="/explore">Back to Explore</Link>
      </div>
    );
  }

  const guide = getPlaceGuideData(place);
  const isSaved = savedPlaces.includes(place.id);
  const isSpiritualPlace = place.placeType === 'spiritual' || place.category.toLowerCase().includes('temple');

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyMantra = () => {
    if (place.spiritualInfo) {
      navigator.clipboard.writeText(place.spiritualInfo.mantra);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper to extract youtube video ID for thumbnail
  const getYoutubeThumb = (url: string) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://img.youtube.com/vi/${match[2]}/0.jpg`;
      }
    } catch {}
    return '/assets/ai/hero_heritage.png'; // fallback
  };

  return (
    <main className={styles.main}>
      {/* Toast notifications */}
      <AnimatePresence>
        {copiedLink && (
          <motion.div 
            className={styles.toast}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Header */}
      <header className={styles.header}>
        <Link href="/explore" className={styles.backButton}>
          <ArrowLeft size={24} />
        </Link>
        <div className={styles.headerActions}>
          <button 
            className={styles.actionIcon}
            onClick={handleCopyLink}
            title="Share Place"
          >
            <Share2 size={20} />
          </button>
          <button 
            className={`${styles.actionIcon} ${isSaved ? styles.saved : ''}`}
            onClick={() => togglePlace(place.id)}
            title="Save Place"
          >
            <Heart size={20} fill={isSaved ? "var(--color-saffron-500)" : "none"} />
          </button>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <div 
          className={styles.heroImage}
          style={{ backgroundImage: `url(${guide.image})` }}
        />
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <div className={styles.heroMetaRow}>
            <span className={styles.categoryBadge}>{guide.category}</span>
            <div className={styles.ratingBadge}>
              <Star size={14} fill="#FFD700" color="#FFD700" />
              <span>{place.rating || 4.8}</span>
            </div>
          </div>
          <h1>{guide.name}</h1>
          <div className={styles.heroLocation}>
            <MapPin size={16} />
            <span>{guide.location} • {guide.distanceKms} km from Tirupati</span>
          </div>
          <p className={styles.heroReason}>{guide.whyVisit}</p>
        </div>
      </section>

      <div className={styles.scrollableContent}>
        {/* 2. BRIEF INTRODUCTION */}
        <section className={styles.section} id="intro">
          <h2 className={styles.sectionTitle}>Overview</h2>
          <div className={styles.introCard}>
            <p className={styles.introText}>{guide.shortIntro}</p>
            {isSupported && (
              <button 
                className={styles.speakBtn} 
                onClick={() => toggleSpeak(guide.shortIntro, 'en-IN')}
              >
                {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                <span>{isSpeaking ? "Stop Listening" : "Listen to Guide"}</span>
              </button>
            )}
          </div>
        </section>

        {/* 3. WHY THIS PLACE MATTERS */}
        <section className={styles.section} id="why-matters">
          <h2 className={styles.sectionTitle}>Why it Matters</h2>
          <div className={styles.mattersCard}>
            <div className={styles.mattersHeader}>
              <div className={styles.mattersIconWrapper}>
                <Compass size={24} color="var(--color-saffron-500)" />
              </div>
              <div>
                <h3>Historical & Spiritual Essence</h3>
                <p>Cultural context & significance</p>
              </div>
            </div>
            <p className={styles.mattersContent}>{guide.whyVisit}</p>
            
            {isSpiritualPlace && place.spiritualInfo && (
              <div className={styles.spiritualDetails}>
                <div className={styles.deityDetail}>
                  <span className={styles.detailLabel}>Presiding Deity</span>
                  <span className={styles.detailValue}>{place.spiritualInfo.god}</span>
                </div>
                {place.spiritualInfo.mantra && (
                  <div className={styles.mantraBox}>
                    <span className={styles.detailLabel}>Sacred Mantra</span>
                    <div className={styles.mantraContent}>
                      <span className={styles.mantraText}>&quot;{place.spiritualInfo.mantra}&quot;</span>
                      <button onClick={handleCopyMantra} className={styles.copyBtn} title="Copy Mantra">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                )}
                {place.spiritualInfo.mantra && (
                  <MantraPlayer 
                    mantra={place.spiritualInfo.mantra} 
                    deity={place.spiritualInfo.god} 
                  />
                )}
              </div>
            )}
          </div>
        </section>

        {/* 4. TIMINGS AND DURATION */}
        <section className={styles.section} id="timings">
          <h2 className={styles.sectionTitle}>Timings & Best Visit</h2>
          <div className={styles.timingsGrid}>
            <div className={styles.timingCard}>
              <Clock size={24} className="text-teal-600" />
              <h3>Opening Hours</h3>
              <p className={styles.timingValue}>
                {guide.openingTime} - {guide.closingTime}
              </p>
              <span className={styles.timingSub}>All days open</span>
            </div>
            <div className={styles.timingCard}>
              <Star size={24} className="text-amber-500" />
              <h3>Best Slot</h3>
              <p className={styles.timingValue}>{guide.bestTime}</p>
              <span className={styles.timingSub}>Recommended time</span>
            </div>
            <div className={styles.timingCard}>
              <Clock size={24} className="text-indigo-500" />
              <h3>Duration</h3>
              <p className={styles.timingValue}>{guide.duration}</p>
              <span className={styles.timingSub}>Average stay duration</span>
            </div>
          </div>
        </section>

        {/* 4b. BREAK TIMINGS */}
        {place.breakTimings && place.breakTimings.length > 0 && (
          <section className={styles.section} id="break-timings">
            <h2 className={styles.sectionTitle}>Break Timings</h2>
            <div style={{
              background: 'linear-gradient(135deg, #FFF8F0, #FFF3E0)',
              borderRadius: 14, padding: 16,
              border: '1px solid rgba(255,153,51,0.12)',
            }}>
              <p style={{ fontSize: 13, color: '#666', marginBottom: 10 }}>
                The temple closes for darshan during these hours. Plan your visit accordingly.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {place.breakTimings.map((b, i) => (
                  <div key={i} style={{
                    background: 'white', borderRadius: 10, padding: '10px 16px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <Clock size={16} color="#FF9933" />
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>
                      {b.from} — {b.to}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4c. RITUALS & SEVAS */}
        {place.rituals && (place.rituals.daily?.length || place.rituals.weekly?.length || place.rituals.sevas?.length) && (
          <section className={styles.section} id="rituals">
            <h2 className={styles.sectionTitle}>Rituals & Sevas</h2>
            <div style={{
              background: 'linear-gradient(135deg, #FFFBF5, #FFF8EE)',
              borderRadius: 14, padding: 16,
              border: '1px solid rgba(255,153,51,0.1)',
            }}>
              {place.rituals.daily && place.rituals.daily.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#B8860B', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    🕉️ Daily Rituals
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {place.rituals.daily.map((r, i) => (
                      <div key={i} style={{
                        background: 'white', borderRadius: 8, padding: '8px 12px',
                        fontSize: 13, color: '#333', border: '1px solid rgba(0,0,0,0.04)',
                      }}>
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {place.rituals.weekly && place.rituals.weekly.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#B8860B', marginBottom: 8 }}>
                    📿 Weekly Rituals
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {place.rituals.weekly.map((r, i) => (
                      <div key={i} style={{
                        background: 'white', borderRadius: 8, padding: '8px 12px',
                        fontSize: 13, color: '#333', border: '1px solid rgba(0,0,0,0.04)',
                      }}>
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {place.rituals.annual && place.rituals.annual.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#B8860B', marginBottom: 8 }}>
                    🎉 Annual Festivals
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {place.rituals.annual.map((r, i) => (
                      <span key={i} style={{
                        background: '#FFF3E0', borderRadius: 20, padding: '5px 12px',
                        fontSize: 12, color: '#C65D00', fontWeight: 600,
                        border: '1px solid rgba(198,93,0,0.12)',
                      }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {place.rituals.sevas && place.rituals.sevas.length > 0 && (
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#B8860B', marginBottom: 8 }}>
                    🙏 Sevas Available
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {place.rituals.sevas.map((s, i) => (
                      <span key={i} style={{
                        background: 'white', borderRadius: 20, padding: '5px 12px',
                        fontSize: 12, color: '#555', fontWeight: 500,
                        border: '1px solid rgba(0,0,0,0.08)',
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4d. ARCHITECTURE & DEITY INFO */}
        {(place.architecture || place.deity || place.importance) && (
          <section className={styles.section} id="architecture">
            <h2 className={styles.sectionTitle}>Architecture & Heritage</h2>
            <div style={{
              background: 'linear-gradient(135deg, #F8F6FF, #EDE7F6)',
              borderRadius: 14, padding: 16,
              border: '1px solid rgba(108,99,255,0.1)',
            }}>
              {place.deity && (
                <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'linear-gradient(135deg, #FF9933, #FF6B00)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: 18,
                  }}>
                    🙏
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>Presiding Deity</span>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>{place.deity}</div>
                    {place.deityType && <span style={{ fontSize: 12, color: '#6C63FF' }}>{place.deityType}</span>}
                  </div>
                </div>
              )}
              {place.architecture && (
                <div style={{ marginBottom: 12 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#555', marginBottom: 6 }}>Architecture</h4>
                  <p style={{ fontSize: 13, color: '#333', lineHeight: 1.6 }}>{place.architecture}</p>
                </div>
              )}
              {place.importance && (
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#555', marginBottom: 6 }}>Significance</h4>
                  <p style={{ fontSize: 13, color: '#333', lineHeight: 1.6 }}>{place.importance}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4e. FACILITIES */}
        {place.facilities && (
          <section className={styles.section} id="facilities">
            <h2 className={styles.sectionTitle}>Facilities</h2>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10,
            }}>
              {Object.entries(place.facilities)
                .filter(([, v]) => v && v !== 'N/A')
                .map(([key, value]) => {
                  const icons: Record<string, string> = {
                    locker: '🔐', toilets: '🚻', drinkingWater: '💧',
                    wheelchair: '♿', parking: '🅿️', food: '🍽️',
                  };
                  const labels: Record<string, string> = {
                    locker: 'Lockers', toilets: 'Toilets', drinkingWater: 'Drinking Water',
                    wheelchair: 'Wheelchair', parking: 'Parking', food: 'Food',
                  };
                  return (
                    <div key={key} style={{
                      background: 'white', borderRadius: 12, padding: '12px 14px',
                      border: '1px solid rgba(0,0,0,0.06)',
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                    }}>
                      <span style={{ fontSize: 20 }}>{icons[key] || '📌'}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{labels[key] || key}</div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{value}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* 4f. RELATED PLACES */}
        {place.relatedPlaces && place.relatedPlaces.length > 0 && (
          <section className={styles.section} id="related">
            <h2 className={styles.sectionTitle}>Related Places</h2>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
              {place.relatedPlaces.map(relId => {
                const rel = PLACES.find(p => p.id === relId);
                if (!rel) return null;
                return (
                  <Link href={`/place/${rel.id}`} key={rel.id} style={{ textDecoration: 'none', flexShrink: 0 }}>
                    <div style={{
                      width: 150, borderRadius: 14, overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.06)', background: 'white',
                    }}>
                      <div style={{
                        width: '100%', height: 90,
                        backgroundImage: `url(${rel.image})`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                      }} />
                      <div style={{ padding: '8px 10px' }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', margin: 0, lineHeight: 1.2 }}>{rel.name}</h4>
                        <div style={{ fontSize: 11, color: '#888', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Star size={10} fill="#FFD700" color="#FFD700" />
                          {rel.rating} • {rel.distanceKms}km
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. TRAVEL OPTIONS */}
        <section className={styles.section} id="travel">
          <h2 className={styles.sectionTitle}>How to Reach</h2>
          <div className={styles.travelCard}>
            <div className={styles.travelRouteSummary}>
              <div className={styles.routeStat}>
                <label>Distance</label>
                <span>{guide.distanceKms} km</span>
              </div>
              <div className={styles.routeDivider} />
              <div className={styles.routeStat}>
                <label>Est. Travel Time</label>
                <span>~{Math.round(guide.distanceKms * 2)} mins</span>
              </div>
            </div>

            <div className={styles.travelModes}>
              <div className={styles.modeItem}>
                <div className={styles.modeIconBg}><Compass size={20} /></div>
                <div className={styles.modeInfo}>
                  <h4>RTC / Public Bus</h4>
                  <p>{guide.travelByRTC}</p>
                </div>
              </div>
              <div className={styles.modeItem}>
                <div className={styles.modeIconBg}><Compass size={20} /></div>
                <div className={styles.modeInfo}>
                  <h4>Car / Cab</h4>
                  <p>{guide.travelByCar}</p>
                </div>
              </div>
              <div className={styles.modeItem}>
                <div className={styles.modeIconBg}><Compass size={20} /></div>
                <div className={styles.modeInfo}>
                  <h4>Bike / Two-Wheeler</h4>
                  <p>{guide.travelByBike}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. ESTIMATED COST */}
        <section className={styles.section} id="cost">
          <h2 className={styles.sectionTitle}>Travel Cost & Entry Fares</h2>
          <div className={styles.costCard}>
            <div className={styles.costHeader}>
              <Coins size={24} color="var(--color-saffron-500)" />
              <div>
                <h3>Estimated Expenses</h3>
                <p>Approximate budget ranges</p>
              </div>
            </div>
            
            <div className={styles.costList}>
              <div className={styles.costItem}>
                <span>Entry & Darshan Fee</span>
                <span className={styles.costPrice}>{guide.entryFee}</span>
              </div>
              <div className={styles.costItem}>
                <span>RTC Bus Fare (One-way)</span>
                <span className={styles.costPrice}>{guide.approxRTCFare}</span>
              </div>
              <div className={styles.costItem}>
                <span>Car Fuel / Cab Estimate</span>
                <span className={styles.costPrice}>{guide.approxCarCost}</span>
              </div>
              <div className={styles.costItem}>
                <span>Bike Fuel Estimate</span>
                <span className={styles.costPrice}>{guide.approxBikeCost}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. HISTORY VIDEO CARD */}
        {guide.youtubeLink && (
          <section className={styles.section} id="video">
            <h2 className={styles.sectionTitle}>Video Guide</h2>
            <a 
              href={guide.youtubeLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.videoCard}
            >
              <div 
                className={styles.videoThumbnail}
                style={{ backgroundImage: `url(${getYoutubeThumb(guide.youtubeLink)})` }}
              >
                <div className={styles.playOverlay}>
                  <PlayCircle size={60} color="#fff" />
                </div>
              </div>
              <div className={styles.videoText}>
                <h3>Watch Explainer & History</h3>
                <p>Understand the origins, mythology, and visitor experience in this documentary guide.</p>
                <span className={styles.videoLink}>Watch on YouTube →</span>
              </div>
            </a>
          </section>
        )}

        {/* 8. PHOTO GALLERY */}
        {guide.images && guide.images.length > 0 && (
          <section className={styles.section} id="photos">
            <h2 className={styles.sectionTitle}>
              <Camera size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Photo Gallery{' '}
              <span className={styles.galleryCount}>{guide.images.length} photos</span>
            </h2>
            <div className={styles.photoGrid}>
              {guide.images.map((imgUrl, idx) => (
                <motion.div
                  key={idx}
                  className={`${styles.gridItem} ${idx === 0 ? styles.gridItemLarge : ''}`}
                  style={{ background: `url(${imgUrl}) center/cover no-repeat` }}
                  title={`${guide.name} view ${idx + 1}`}
                  onClick={() => setLightboxIndex(idx)}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                >
                  <div className={styles.gridOverlay}>
                    <Camera size={16} />
                    <span>{idx + 1}/{guide.images.length}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* FULLSCREEN LIGHTBOX */}
        <AnimatePresence>
          {lightboxIndex !== null && guide.images && (
            <motion.div
              className={styles.lightbox}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setLightboxIndex(null)}
            >
              <motion.img
                key={lightboxIndex}
                src={guide.images[lightboxIndex]}
                alt={`${guide.name} photo ${lightboxIndex + 1}`}
                className={styles.lightboxImage}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
              />

              <button
                className={styles.lightboxClose}
                onClick={() => setLightboxIndex(null)}
              >
                <X size={24} />
              </button>

              <div className={styles.lightboxCounter}>
                {lightboxIndex + 1} / {guide.images.length}
              </div>

              {guide.images.length > 1 && (
                <>
                  <button
                    className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(lightboxIndex === 0 ? guide.images!.length - 1 : lightboxIndex - 1);
                    }}
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(lightboxIndex === guide.images!.length - 1 ? 0 : lightboxIndex + 1);
                    }}
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 9. IMPORTANT TIPS */}
        <section className={styles.section} id="tips">
          <h2 className={styles.sectionTitle}>Before You Visit</h2>
          <div className={styles.tipsCard}>
            <div className={styles.tipsHeader}>
              <ShieldAlert size={24} color="var(--color-warning)" />
              <div>
                <h3>Crucial Visitor Rules</h3>
                <p>Dress code, etiquette and warnings</p>
              </div>
            </div>
            
            <ul className={styles.tipsList}>
              <li>
                <strong>Dress Code:</strong> {guide.visitorTips.dressCode}
              </li>
              <li>
                <strong>Crowd Note:</strong> {guide.visitorTips.crowdNote}
              </li>
              <li>
                <strong>Footwear Rule:</strong> {guide.visitorTips.footwearRule}
              </li>
              <li>
                <strong>Photography:</strong> {guide.visitorTips.photoRule}
              </li>
              <li>
                <strong>Access & Entry:</strong> {guide.visitorTips.entryRule}
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* Sticky footer action bar */}
      <div className={styles.stickyFooter}>
        <div className={styles.footerActions}>
          <button 
            className={`${styles.saveBtn} ${isSaved ? styles.saveBtnActive : ''}`}
            onClick={() => togglePlace(place.id)}
          >
            <Heart size={24} fill={isSaved ? "var(--color-saffron-500)" : "none"} />
            <span>{isSaved ? "Saved" : "Save for Later"}</span>
          </button>
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates?.lat || 13.6288},${place.coordinates?.lng || 79.4192}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navBtn}
          >
            <Compass size={20} />
            <span>Get Directions</span>
          </a>
        </div>
      </div>
    </main>
  );
}
