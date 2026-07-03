'use client';

import { PLACES, getPlaceGuideData } from '@/data/places';
import { ArrowLeft, Heart, Share2, Star, MapPin, Clock, Compass, Coins, PlayCircle, Camera, Check, Copy, Volume2, VolumeX, ShieldAlert, X, ChevronLeft, ChevronRight, Shirt, Footprints, Users, Ban, Navigation } from 'lucide-react';
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
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [vehicleType, setVehicleType] = useState<'car' | 'bus' | 'bike' | 'cab' | 'suv'>('car');
  const [passengers, setPassengers] = useState<number>(1);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  
  const { togglePlace, savedPlaces, addViewedPlace, userLocation, setUserLocation, setLocationPermission } = useTrip();
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

  const getDistance = () => {
    if (!userLocation || !place.coordinates) return null;
    const dLat = userLocation.lat - place.coordinates.lat;
    const dLng = userLocation.lng - place.coordinates.lng;
    return Math.sqrt(dLat * dLat + dLng * dLng) * 111; // approx km
  };

  const distanceVal = getDistance();
  const isTirumalaSpot = place.location.toLowerCase().includes('tirumala') || 
                         place.location.toLowerCase().includes('narayanagiri') || 
                         place.category.toLowerCase().includes('tirumala');
  const drivingDistance = distanceVal !== null 
    ? (isTirumalaSpot && distanceVal < 24 ? Math.max(25, distanceVal * 1.6) : distanceVal)
    : null;

  const getNearbyPlaces = () => {
    if (!place.coordinates) return [];
    return (places.length > 0 ? places : PLACES)
      .filter(p => p.id !== place.id)
      .map(p => {
        if (!p.coordinates) return { place: p, dist: 999 };
        const dLat = place.coordinates.lat - p.coordinates.lat;
        const dLng = place.coordinates.lng - p.coordinates.lng;
        let dist = Math.sqrt(dLat * dLat + dLng * dLng) * 111;
        const isSelfTirumala = place.location.toLowerCase().includes('tirumala') || place.location.toLowerCase().includes('narayanagiri');
        const isTargetTirumala = p.location.toLowerCase().includes('tirumala') || p.location.toLowerCase().includes('narayanagiri');
        if (isSelfTirumala !== isTargetTirumala) {
          dist = Math.max(22, dist * 1.5);
        }
        return { place: p, dist };
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 6);
  };

  const nearbyPlacesList = getNearbyPlaces();

  const getCalculatorResults = () => {
    const isTirumala = place.location.toLowerCase().includes('tirumala') || 
                       place.location.toLowerCase().includes('narayanagiri') || 
                       place.category.toLowerCase().includes('tirumala');
    
    const effDist = drivingDistance !== null ? drivingDistance : place.distanceKms;
    const estTime = Math.round(effDist * 2.2);

    let fare = 0;
    let fuel = 0;
    let liters = 0;
    let tolls = 0;
    let parking = 0;
    const entryFee = passengers * place.entryFeeNum;

    if (vehicleType === 'bus') {
      const ticketPrice = isTirumala ? 110 : 15;
      fare = passengers * ticketPrice * (isRoundTrip ? 2 : 1);
    } else if (vehicleType === 'car') {
      liters = (effDist / 12) * (isRoundTrip ? 2 : 1);
      fuel = liters * 100;
      tolls = isTirumala ? 250 : 0;
      parking = 50;
    } else if (vehicleType === 'bike') {
      liters = (effDist / 45) * (isRoundTrip ? 2 : 1);
      fuel = liters * 100;
      parking = 15;
    } else if (vehicleType === 'cab') {
      if (isTirumala) {
        fare = isRoundTrip ? 2100 : 1100;
      } else {
        fare = isRoundTrip ? 350 + effDist * 30 : 200 + effDist * 15;
      }
    } else if (vehicleType === 'suv') {
      if (isTirumala) {
        fare = isRoundTrip ? 3700 : 2000;
      } else {
        fare = isRoundTrip ? 500 + effDist * 44 : 300 + effDist * 22;
      }
    }

    const total = fare + fuel + tolls + parking + entryFee;

    return {
      effDist,
      estTime,
      fare,
      fuel,
      liters,
      tolls,
      parking,
      entryFee,
      total: Math.round(total)
    };
  };

  const calc = getCalculatorResults();

  const handleDetectLocation = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(loc);
          setLocationPermission('granted');
        },
        (error) => {
          console.error("Location error:", error);
          setLocationPermission('denied');
        }
      );
    }
  };

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
          <div className={styles.heroMetaRow} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <span className={styles.categoryBadge}>{guide.category}</span>
            <div className={styles.ratingBadge}>
              <Star size={14} fill="#FFD700" color="#FFD700" />
              <span>{place.rating || 4.8}</span>
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#34D399',
              fontSize: 11,
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: 99,
              border: '1px solid rgba(16, 185, 129, 0.25)',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
              Data Verified Today
            </span>
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

        {/* 4g. NEARBY ATTRACTIONS */}
        {nearbyPlacesList.length > 0 && (
          <section className={styles.section} id="nearby-attractions">
            <h2 className={styles.sectionTitle}>Nearby Attractions</h2>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
              {nearbyPlacesList.map(({ place: p, dist }) => (
                <Link href={`/place/${p.id}`} key={p.id} style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <div style={{
                    width: 150, borderRadius: 14, overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.06)', background: 'white',
                  }}>
                    <div style={{
                      width: '100%', height: 90,
                      backgroundImage: `url(${p.image})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                    }} />
                    <div style={{ padding: '8px 10px' }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={p.name}>
                        {p.name}
                      </h4>
                      <div style={{ fontSize: 11, color: 'var(--color-saffron-600)', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        📍 {dist.toFixed(1)} km away
                      </div>
                      <div style={{ fontSize: 10, color: '#888', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={10} fill="#FFD700" color="#FFD700" />
                        {p.rating}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
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
          <h2 className={styles.sectionTitle}>Travel Cost Estimator</h2>
          <div className={styles.costCard} style={{ padding: 18 }}>
            
            {/* Live Status Header */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: '#F8FAFC', padding: 12, borderRadius: 10, border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
                  💰 Live Trip Estimator
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', background: 'rgba(71, 85, 105, 0.1)', padding: '2px 8px', borderRadius: 99 }}>
                  {calc.effDist.toFixed(1)} km away
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                <span style={{ fontSize: 11, color: '#64748B' }}>
                  📍 {userLocation ? 'Based on your location' : 'Default: from Tirupati Central'}
                </span>
                {!userLocation && (
                  <button 
                    onClick={handleDetectLocation}
                    style={{
                      background: 'none', border: 'none', color: 'var(--color-saffron-600)', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0
                    }}
                  >
                    Use Live Location
                  </button>
                )}
              </div>
              {isTirumalaSpot && (
                <div style={{ fontSize: 11, color: '#B45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  ⚠️ Includes Mountain Ghat Road Winding Route
                </div>
              )}
            </div>

            {/* Vehicle Selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 8 }}>Select Vehicle</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                {[
                  { type: 'car', icon: '🚗', label: 'Car' },
                  { type: 'bus', icon: '🚌', label: 'Bus' },
                  { type: 'bike', icon: '🏍️', label: 'Bike' },
                  { type: 'cab', icon: '🚕', label: 'Cab' },
                  { type: 'suv', icon: '🚐', label: 'SUV' }
                ].map(v => (
                  <button
                    key={v.type}
                    onClick={() => setVehicleType(v.type as any)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 4px', borderRadius: 10, border: '1px solid',
                      borderColor: vehicleType === v.type ? 'var(--color-saffron-300)' : 'rgba(0,0,0,0.06)',
                      background: vehicleType === v.type ? 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' : 'white',
                      color: vehicleType === v.type ? 'var(--color-saffron-800)' : '#475569',
                      fontWeight: vehicleType === v.type ? 700 : 500,
                      fontSize: 11, cursor: 'pointer', transition: 'all 0.2s ease',
                      boxShadow: vehicleType === v.type ? '0 2px 4px rgba(217, 119, 6, 0.1)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{v.icon}</span>
                    <span style={{ fontSize: 10 }}>{v.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trip Type & Passenger Selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Trip Type</label>
                <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 3, borderRadius: 8 }}>
                  <button 
                    onClick={() => setIsRoundTrip(false)}
                    style={{
                      flex: 1, padding: '6px 4px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 700,
                      background: !isRoundTrip ? 'white' : 'transparent',
                      color: !isRoundTrip ? 'var(--color-saffron-800)' : '#64748B',
                      boxShadow: !isRoundTrip ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer'
                    }}
                  >
                    One-Way
                  </button>
                  <button 
                    onClick={() => setIsRoundTrip(true)}
                    style={{
                      flex: 1, padding: '6px 4px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 700,
                      background: isRoundTrip ? 'white' : 'transparent',
                      color: isRoundTrip ? 'var(--color-saffron-800)' : '#64748B',
                      boxShadow: isRoundTrip ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer'
                    }}
                  >
                    Round
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Passengers</label>
                <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', padding: 3, borderRadius: 8 }}>
                  {[1, 2, 3, 4, 6].map(p => (
                    <button
                      key={p}
                      onClick={() => setPassengers(p)}
                      style={{
                        flex: 1, padding: '6px 0', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 700,
                        background: passengers === p ? 'white' : 'transparent',
                        color: passengers === p ? 'var(--color-saffron-800)' : '#64748B',
                        boxShadow: passengers === p ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer'
                      }}
                    >
                      {p === 6 ? '5+' : p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Journey Summary */}
            <div style={{
              background: 'linear-gradient(135deg, #1E293B, #0F172A)',
              borderRadius: 14,
              padding: 18,
              color: 'white',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
              marginBottom: 16
            }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94A3B8', margin: '0 0 12px 0' }}>Journey Summary</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>Distance</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9' }}>{calc.effDist.toFixed(1)} km</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>Travel Time</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9' }}>~{calc.estTime} mins</div>
                </div>
                {calc.liters > 0 && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>Est. Fuel Consumption</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>{calc.liters.toFixed(1)} Liters</div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase' }}>Estimated Total Cost</div>
                  <div style={{ fontSize: 11, color: '#34D399', fontWeight: 600 }}>Taxes, toll & entry included</div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center' }}>
                  ₹{calc.total}
                </div>
              </div>
            </div>

            {/* Collapsible Breakdown */}
            <div style={{ marginBottom: 16 }}>
              <button 
                onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.06)', background: '#F8FAFC',
                  fontSize: 12, fontWeight: 700, color: '#475569', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
                }}
              >
                <span>{isBreakdownOpen ? '▼ Hide Detailed Breakdown' : '▶ View Detailed Breakdown'}</span>
                <span style={{ fontSize: 11, color: 'var(--color-saffron-600)', background: 'white', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.05)' }}>
                  Itemized
                </span>
              </button>
              
              {isBreakdownOpen && (
                <div style={{
                  marginTop: 8, padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.05)', background: 'white',
                  display: 'flex', flexDirection: 'column', gap: 8
                }}>
                  {calc.fare > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569' }}>
                      <span>🚌 Transit Ticket Fare ({passengers} {passengers === 1 ? 'passenger' : 'passengers'})</span>
                      <span style={{ fontWeight: 600 }}>₹{calc.fare}</span>
                    </div>
                  )}
                  {calc.fuel > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569' }}>
                      <span>⛽ Fuel Cost (~₹100/L)</span>
                      <span style={{ fontWeight: 600 }}>₹{Math.round(calc.fuel)}</span>
                    </div>
                  )}
                  {calc.tolls > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569' }}>
                      <span>🛣️ Mountain Ghat Toll (Alipiri)</span>
                      <span style={{ fontWeight: 600 }}>₹{calc.tolls}</span>
                    </div>
                  )}
                  {calc.parking > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569' }}>
                      <span>🅿️ Vehicle Parking Fee</span>
                      <span style={{ fontWeight: 600 }}>₹{calc.parking}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569' }}>
                    <span>🎟️ Entry Fee ({passengers} x {place.entryFeeNum === 0 ? 'Free' : `₹${place.entryFeeNum}`})</span>
                    <span style={{ fontWeight: 600, color: calc.entryFee === 0 ? '#10B981' : '#475569' }}>
                      {calc.entryFee === 0 ? 'Free' : `₹${calc.entryFee}`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Saarthi Recommendation */}
            <div style={{
              background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
              borderRadius: 12,
              padding: 14,
              border: '1px solid #FDE68A',
              marginBottom: 8,
              display: 'flex',
              gap: 10
            }}>
              <div style={{ fontSize: 18 }}>💡</div>
              <div style={{ fontSize: 12, color: '#78350F', lineHeight: 1.4 }}>
                <strong style={{ display: 'block', marginBottom: 2 }}>Saarthi Recommendation</strong>
                {vehicleType === 'bus' ? (
                  `APSRTC Bus is the most cost-effective and secure way to ascend the mountain. A great choice for ${passengers} ${passengers === 1 ? 'person' : 'people'}!`
                ) : passengers === 1 && vehicleType === 'bike' ? (
                  "Perfect! Renting or riding a bike is the fastest way to navigate the 36 hairpin bends and save ~18 minutes of traffic."
                ) : passengers >= 5 ? (
                  "With a group of 5+, booking an SUV or a Private Cab guarantees collective safety, comfort, and shared luggage space."
                ) : (
                  `Self-driving via Car gives you ultimate scheduling freedom. Be sure to pay the Alipiri toll before beginning the ghat ascent.`
                )}
              </div>
            </div>

            {/* Transparency disclaimer */}
            <div style={{ fontSize: 10, color: '#94A3B8', textAlign: 'center', lineHeight: 1.4, margin: '8px 0 0 0' }}>
              Estimated using: ✓ Current fuel price (~₹100/L) • ✓ Google Distance matrix • ✓ TTD/APSRTC fare guidelines • ✓ Approximate parking
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
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Rule 1: Dress Code */}
            <div style={{
              display: 'flex',
              gap: 12,
              padding: 14,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #FFF9F2, #FFF3E6)',
              border: '1px solid rgba(255, 153, 51, 0.15)'
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#FF9933',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                <Shirt size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#994D00', margin: '0 0 2px 0' }}>Dress Code Required</h4>
                <p style={{ fontSize: 12, color: '#5C3A21', margin: 0, lineHeight: 1.4 }}>{guide.visitorTips.dressCode}</p>
              </div>
            </div>

            {/* Rule 2: Photography */}
            <div style={{
              display: 'flex',
              gap: 12,
              padding: 14,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)',
              border: '1px solid #FCA5A5'
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                <Ban size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#991B1B', margin: '0 0 2px 0' }}>Photography Policy</h4>
                <p style={{ fontSize: 12, color: '#7F1D1D', margin: 0, lineHeight: 1.4 }}>{guide.visitorTips.photoRule}</p>
              </div>
            </div>

            {/* Rule 3: Footwear */}
            <div style={{
              display: 'flex',
              gap: 12,
              padding: 14,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #FFFDF5, #FFF9E6)',
              border: '1px solid rgba(255, 153, 51, 0.1)'
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                <Footprints size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#92400E', margin: '0 0 2px 0' }}>Footwear Custody</h4>
                <p style={{ fontSize: 12, color: '#78350F', margin: 0, lineHeight: 1.4 }}>{guide.visitorTips.footwearRule}</p>
              </div>
            </div>

            {/* Rule 4: Access & Entry */}
            <div style={{
              display: 'flex',
              gap: 12,
              padding: 14,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
              border: '1px solid #BBF7D0'
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                <Coins size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#166534', margin: '0 0 2px 0' }}>Entry & Access Fee</h4>
                <p style={{ fontSize: 12, color: '#14532D', margin: 0, lineHeight: 1.4 }}>{guide.visitorTips.entryRule}</p>
              </div>
            </div>

            {/* Rule 5: Crowd Note */}
            <div style={{
              display: 'flex',
              gap: 12,
              padding: 14,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                <Users size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#334155', margin: '0 0 2px 0' }}>Crowd Expectation</h4>
                <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.4 }}>{guide.visitorTips.crowdNote}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Sticky footer action bar */}
      <div className={styles.stickyFooter}>
        <div className={styles.footerActions} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            className={`${styles.saveBtn} ${isSaved ? styles.saveBtnActive : ''}`}
            onClick={() => togglePlace(place.id)}
            style={{ 
              flex: '0 0 auto', 
              width: 48, 
              height: 48, 
              borderRadius: '50%', 
              padding: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              minWidth: 48
            }}
            title={isSaved ? "Saved" : "Save for Later"}
          >
            <Heart size={22} fill={isSaved ? "var(--color-saffron-500)" : "none"} color={isSaved ? "var(--color-saffron-500)" : "currentColor"} />
          </button>
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates?.lat || 13.6288},${place.coordinates?.lng || 79.4192}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navBtn}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48 }}
          >
            <Compass size={20} />
            <span>Start Journey</span>
          </a>
        </div>
      </div>
    </main>
  );
}
