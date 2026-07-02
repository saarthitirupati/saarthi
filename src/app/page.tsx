'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  MapPin, User, Search, Heart, Landmark, Waves, UtensilsCrossed, Map as MapIcon,
  BookOpen, HelpCircle, Calendar, Sparkles, Award
} from 'lucide-react';
import styles from './Home.module.css';
import { useTrip } from '@/components/TripContext';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';
import { PLACES as STATIC_PLACES } from '@/data/places';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { calculateDistance, TIRUPATI_CENTER } from '@/utils/location';
import LiveStatus from '@/components/LiveStatus/LiveStatus';

const CATEGORIES = [
  { id: 'spiritual', label: 'Spiritual', icon: '🛕', color: '#FDF1E6', accent: '#D0A73D' },
  { id: 'food',      label: 'Food',      icon: '🍽️', color: '#FBE9E2', accent: '#D95F31' },
  { id: 'nature',    label: 'Nature',    icon: '🌿', color: '#E5F3EB', accent: '#2F6144' },
  { id: 'history',   label: 'Heritage',  icon: '🏰', color: '#EFE8E1', accent: '#8C7355' },
];

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [foodPlaces, setFoodPlaces] = useState<any[]>([]);
  const { userLocation, setLocationPermission, setUserLocation, togglePlace, savedPlaces } = useTrip();
  const [locationName, setLocationName] = useState<string>('Tirupati');
  const [dailyContent, setDailyContent] = useState<any>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // Realtime hook
  const { places, loading } = useRealtimePlaces(STATIC_PLACES);

  const logTelemetry = async (eventType: string, entityType?: string, entityId?: string, metadata?: any) => {
    try {
      let sessId = typeof window !== 'undefined' ? sessionStorage.getItem('saarthi_session_id') : null;
      if (!sessId && typeof window !== 'undefined') {
        sessId = 'sess_' + Math.random().toString(36).substring(2) + '_' + Date.now();
        sessionStorage.setItem('saarthi_session_id', sessId);
      }
      if (sessId) {
        await fetch('/api/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessId,
            eventType,
            entityType,
            entityId,
            metadata
          })
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuizAnswer = (optionId: string, isCorrect: boolean) => {
    if (quizAnswered) return;
    setSelectedQuizOption(optionId);
    setQuizAnswered(true);
    logTelemetry('quiz_attempt', 'quiz', dailyContent?.quiz?.id, {
      selectedOption: optionId,
      isCorrect
    });
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 12) return 'Good Morning, Sunil 🌅';
    if (hr >= 12 && hr < 17) return 'Good Afternoon, Sunil ☀️';
    if (hr >= 17 && hr < 21) return 'Good Evening, Sunil 🌇';
    return 'Good Night, Sunil 🌌';
  };

  useEffect(() => {
    setMounted(true);
    logTelemetry('home_view');

    fetch('/api/content/daily')
      .then(res => res.json())
      .then(setDailyContent)
      .catch(console.error);

    const fetchFood = async () => {
      try {
        if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
          const query = '*[_type == "place" && category == "Food"][0...5]';
          const sanityPlaces = await client.fetch(query);
          if (sanityPlaces && sanityPlaces.length > 0) {
            setFoodPlaces(sanityPlaces);
          }
        }
      } catch (e) {
        console.error("Sanity fetch error:", e);
      }
    };
    fetchFood();
  }, []);

  useEffect(() => {
    if (!userLocation) {
      setLocationName('Tirupati');
      return;
    }

    if (userLocation.lat === TIRUPATI_CENTER.lat && userLocation.lng === TIRUPATI_CENTER.lng) {
      setLocationName('Tirupati Center');
      return;
    }

    const fetchLocationName = async () => {
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${userLocation.lat}&longitude=${userLocation.lng}&localityLanguage=en`
        );
        if (res.ok) {
          const data = await res.json();
          const name = data.city || data.locality || data.localityName;
          if (name) {
            setLocationName(name);
          } else {
            setLocationName('Near You');
          }
        } else {
          setLocationName('Near You');
        }
      } catch (err) {
        console.error('Error fetching reverse geocode:', err);
        setLocationName('Near You');
      }
    };

    fetchLocationName();
  }, [userLocation]);

  const getPlaces = (ids: string[]) => places.filter(p => ids.includes(p.id));

  const natureSpots = getPlaces(['talakona-falls', 'anjanadri-jungle-book', 'silathoranam', 'deer-park-tirupati']);
  const staticFoodSpots = places.filter(p => p.placeType === 'food');
  const historySpots = getPlaces(['chandragiri-fort', 'govindaraja']);
  const sacredSpots = getPlaces(['japali-hanuman', 'akasaganga-theertham']);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationPermission('granted');
        },
        (error) => {
          alert("Location access denied or unavailable. Defaulting to Tirupati Center.");
          setUserLocation(TIRUPATI_CENTER);
          setLocationPermission('denied');
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setUserLocation(TIRUPATI_CENTER);
      setLocationPermission('denied');
    }
  };

  const nearbySpots = useMemo(() => {
    if (!userLocation || typeof userLocation.lat !== 'number' || typeof userLocation.lng !== 'number') return [];
    return places.map(place => {
      const lat = place.coordinates?.lat || TIRUPATI_CENTER.lat;
      const lng = place.coordinates?.lng || TIRUPATI_CENTER.lng;
      const dist = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
      return { ...place, computedDistance: dist };
    })
    .sort((a, b) => a.computedDistance - b.computedDistance)
    .slice(0, 6);
  }, [userLocation, places]);

  if (!mounted) return null;

  return (
    <div className={styles.page}>
      {/* ─── HEADER ─── */}
      <header className={styles.header}>

        <div 
          className={styles.locationBadge} 
          style={{ cursor: 'pointer' }} 
          onClick={requestLocation}
          title="Detect / Refresh Location"
        >
          <MapPin size={14} />
          <span>{locationName}</span>
        </div>
        <div className={styles.profileCircle} onClick={() => router.push('/saved')}>
          <User size={20} />
        </div>
      </header>

      {/* ─── HERO / GREETING ─── */}
      <section className={styles.heroSection}>
        <p className={styles.greeting}>{getGreeting()}</p>
        <h1 className={styles.mainHeadline}>
          Where will your <span className={styles.soulText}>soul</span> wander today?
        </h1>
        <p style={{ color: '#666', fontSize: 13, marginTop: 8 }}>
          Ready for today&apos;s journey? Perfect weather for temple visits today.
        </p>
      </section>

      {/* ─── SEARCH / DISCOVERY BAR ─── */}
      <section className={styles.searchSection}>
        <div className={styles.searchBar}>
          <Search size={20} color="var(--color-text-secondary)" />
          <input 
            type="text" 
            placeholder="Search temples, waterfalls, heritage..." 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                router.push(`/explore?q=${e.currentTarget.value}`);
              }
            }}
          />
        </div>
      </section>

      {/* ─── LIVE TIRUMALA STATUS ─── */}
      <LiveStatus />

      {/* ─── DAILY HIGHLIGHTS ─── */}
      {dailyContent && (
        <section className={styles.dailyHighlightsSection}>
          <div className={styles.sectionHeader} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Daily Highlights</h2>
            <Sparkles size={16} style={{ color: '#E9801D' }} />
          </div>
          <div className={styles.dailyCarousel}>
            
            {/* 1. Story of the Day Card */}
            {dailyContent.story && (
              <motion.div 
                className={styles.dailyCard} 
                onClick={() => {
                  logTelemetry('story_click', 'story', dailyContent.story.id);
                  router.push('/learn/story-of-the-day');
                }}
                whileHover={{ y: -4 }}
              >
                <div>
                  <span className={styles.dailyCardTag}>Story of the Day</span>
                  <h3 className={styles.dailyCardTitle}>{dailyContent.story.title}</h3>
                  <p className={styles.dailyCardSubtitle}>{dailyContent.story.snippet || dailyContent.story.subtitle}</p>
                </div>
                <div className={styles.dailyCardFooter}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <BookOpen size={12} /> Read Story
                  </span>
                  <span>{dailyContent.story.readTime || '3 min read'}</span>
                </div>
              </motion.div>
            )}

            {/* 2. Interactive Daily Quiz Card */}
            {dailyContent.quiz && (
              <div className={`${styles.dailyCard} ${styles.quizCard}`} style={{ cursor: 'default' }}>
                <div>
                  <span className={styles.dailyCardTag} style={{ background: '#E6F4EA', color: '#137333' }}>Daily Quiz Challenge</span>
                  <p className={styles.quizQuestion}>{dailyContent.quiz.question}</p>
                  
                  <div className={styles.quizOptionsList}>
                    {(dailyContent.quiz.options || []).map((opt: any) => {
                      const isSelected = selectedQuizOption === opt.id;
                      const isCorrectOpt = opt.id === dailyContent.quiz.correctAnswer;
                      
                      let btnClass = styles.quizOptionBtn;
                      if (quizAnswered) {
                        if (isCorrectOpt) btnClass = `${styles.quizOptionBtn} ${styles.quizOptionCorrect}`;
                        else if (isSelected) btnClass = `${styles.quizOptionBtn} ${styles.quizOptionIncorrect}`;
                      } else if (isSelected) {
                        btnClass = `${styles.quizOptionBtn} ${styles.quizOptionSelected}`;
                      }

                      return (
                        <button 
                          key={opt.id}
                          className={btnClass}
                          onClick={() => handleQuizAnswer(opt.id, isCorrectOpt)}
                          disabled={quizAnswered}
                        >
                          <strong style={{ marginRight: 6 }}>{opt.id}.</strong> {opt.text}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {quizAnswered && (
                  <div className={styles.quizResultPanel}>
                    <p className={styles.quizResultTitle} style={{ color: selectedQuizOption === dailyContent.quiz.correctAnswer ? '#137333' : '#C5221F', margin: '4px 0' }}>
                      {selectedQuizOption === dailyContent.quiz.correctAnswer ? '✓ Correct! (+10 XP)' : '✗ Incorrect'}
                    </p>
                    <p className={styles.quizExplanation} style={{ margin: 0 }}>{dailyContent.quiz.explanation}</p>
                  </div>
                )}
                
                <div className={styles.dailyCardFooter}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Award size={12} /> Test your knowledge
                  </span>
                  <span>{dailyContent.quiz.xpReward || 10} XP</span>
                </div>
              </div>
            )}

            {/* 3. Spotlight Temple Card */}
            {dailyContent.spotlight && (
              <motion.div 
                className={styles.dailyCard} 
                onClick={() => {
                  logTelemetry('spotlight_click', 'place', dailyContent.spotlight.id);
                  router.push(`/place/${dailyContent.spotlight.id}`);
                }}
                whileHover={{ y: -4 }}
              >
                <div>
                  <span className={styles.dailyCardTag} style={{ background: '#FBE9E2', color: '#D95F31' }}>Spotlight Temple</span>
                  <h3 className={styles.dailyCardTitle}>{dailyContent.spotlight.name}</h3>
                  <p className={styles.dailyCardSubtitle}>{dailyContent.spotlight.description}</p>
                </div>
                <div className={styles.dailyCardFooter}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Sparkles size={12} /> Explore Guide
                  </span>
                  <span>⭐ {dailyContent.spotlight.rating || 4.5}</span>
                </div>
              </motion.div>
            )}

            {/* 4. Upcoming Festival Card */}
            {dailyContent.festival && (
              <motion.div 
                className={styles.dailyCard} 
                onClick={() => {
                  logTelemetry('festival_click', 'festival', dailyContent.festival.id);
                  router.push('/festivals');
                }}
                whileHover={{ y: -4 }}
              >
                <div>
                  <span className={styles.dailyCardTag} style={{ background: '#E5F3EB', color: '#2F6144' }}>Upcoming Event</span>
                  <h3 className={styles.dailyCardTitle}>{dailyContent.festival.name}</h3>
                  <p className={styles.dailyCardSubtitle}>
                    Expected Crowd: {dailyContent.festival.crowd_level}
                  </p>
                </div>
                <div className={styles.dailyCardFooter}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={12} /> Date: {dailyContent.festival.date ? dailyContent.festival.date.split('T')[0] : ''}
                  </span>
                  <span>G: {dailyContent.festival.gravity_score}</span>
                </div>
              </motion.div>
            )}

          </div>
        </section>
      )}

      {/* ─── BROWSE BY INTEREST ─── */}
      <section className={styles.interestsSection}>
        <h2 className={styles.sectionTitle}>Browse by interest</h2>
        <div className={styles.interestGrid}>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className={styles.interestCard} onClick={() => router.push(`/explore?q=${cat.label}`)}>
              <div className={styles.iconCircle} style={{ background: cat.color }}>
                {cat.icon}
              </div>
              <span className={styles.interestLabel}>{cat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── POPULAR NEARBY ─── */}
      <section className={styles.placesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Popular Nearby</h2>
          <MapPin size={18} color="#E9801D" />
        </div>
        
        {userLocation && typeof userLocation.lat === 'number' && typeof userLocation.lng === 'number' ? (
          <div className={styles.horizontalScroll}>
            {nearbySpots.map(place => {
              const distKm = typeof place.computedDistance === 'number' && !isNaN(place.computedDistance)
                ? Number(place.computedDistance.toFixed(1))
                : 0;
              const travelMins = Math.max(3, Math.round((distKm / 40) * 60));
              const isSaved = savedPlaces.includes(place.id);
              return (
                <motion.div 
                  key={place.id} 
                  className={styles.scrollCard} 
                  onClick={() => router.push(`/place/${place.id}`)}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className={styles.cardImg} style={{ backgroundImage: `url(${place.image})` }}>
                    <button 
                      className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlace(place.id);
                      }}
                      title={isSaved ? "Saved" : "Save Place"}
                    >
                      <Heart size={14} fill={isSaved ? '#E9801D' : 'none'} color={isSaved ? '#E9801D' : '#fff'} strokeWidth={isSaved.toString() === 'true' ? 0 : 2} />
                    </button>
                  </div>
                  <div className={styles.cardInfo}>
                    <h3>{place.name}</h3>
                    <p style={{ color: '#2F6144', fontWeight: 700, fontSize: '10px', marginTop: '2px' }}>
                      {distKm} km · ~{travelMins} min
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className={styles.locationFallbackCard}>
            <div className={styles.fallbackIconCircle}>📍</div>
            <div className={styles.fallbackText}>
              <h3>Show Places Near You</h3>
              <p>Enable location to see temples, nature spots, and scenic views closest to your current position.</p>
            </div>
            <button className={styles.fallbackBtn} onClick={requestLocation}>
              Enable Location
            </button>
          </div>
        )}
      </section>

      {/* ─── SACRED SITES & THEERTHAMS ─── */}
      <section className={styles.placesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Sacred Sites & Theerthams</h2>
          <Waves size={18} color="#888" />
        </div>
        <div className={styles.horizontalScroll}>
          {sacredSpots.map(place => {
            const isSaved = savedPlaces.includes(place.id);
            return (
              <motion.div 
                key={place.id} 
                className={styles.scrollCard} 
                onClick={() => router.push(`/place/${place.id}`)}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className={styles.cardImg} style={{ backgroundImage: `url(${place.image})` }}>
                  <button 
                    className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlace(place.id);
                    }}
                    title={isSaved ? "Saved" : "Save Place"}
                  >
                    <Heart size={14} fill={isSaved ? '#E9801D' : 'none'} color={isSaved ? '#E9801D' : '#fff'} strokeWidth={isSaved ? 0 : 2} />
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3>{place.name}</h3>
                  <p>{place.location}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── NATURE & SCENIC SPOTS ─── */}
      <section className={styles.placesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Nature & Scenic Spots</h2>
          <MapIcon size={18} color="#888" />
        </div>
        <div className={styles.horizontalScroll}>
          {natureSpots.map(place => {
            const isSaved = savedPlaces.includes(place.id);
            return (
              <motion.div 
                key={place.id} 
                className={styles.scrollCard} 
                onClick={() => router.push(`/place/${place.id}`)}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className={styles.cardImg} style={{ backgroundImage: `url(${place.image})` }}>
                  <button 
                    className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlace(place.id);
                    }}
                    title={isSaved ? "Saved" : "Save Place"}
                  >
                    <Heart size={14} fill={isSaved ? '#E9801D' : 'none'} color={isSaved ? '#E9801D' : '#fff'} strokeWidth={isSaved ? 0 : 2} />
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3>{place.name}</h3>
                  <p>{place.location}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── HISTORY & HERITAGE ─── */}
      <section className={styles.placesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>History & Heritage</h2>
          <Landmark size={18} color="#888" />
        </div>
        <div className={styles.horizontalScroll}>
          {historySpots.map(place => {
            const isSaved = savedPlaces.includes(place.id);
            return (
              <motion.div 
                key={place.id} 
                className={styles.scrollCard} 
                onClick={() => router.push(`/place/${place.id}`)}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className={styles.cardImg} style={{ backgroundImage: `url(${place.image})` }}>
                  <button 
                    className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlace(place.id);
                    }}
                    title={isSaved ? "Saved" : "Save Place"}
                  >
                    <Heart size={14} fill={isSaved ? '#E9801D' : 'none'} color={isSaved ? '#E9801D' : '#fff'} strokeWidth={isSaved ? 0 : 2} />
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3>{place.name}</h3>
                  <p>{place.location}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── FOOD & DINING ─── */}
      <section className={styles.placesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Food & Dining</h2>
          <UtensilsCrossed size={18} color="#888" />
        </div>
        <div className={styles.horizontalScroll}>
          {(foodPlaces.length > 0 ? foodPlaces.filter(Boolean) : staticFoodSpots).map((place: any) => {
            const placeId = place.id || place._id;
            const isSaved = savedPlaces.includes(placeId);
            return (
              <motion.div 
                key={placeId} 
                className={styles.scrollCard} 
                onClick={() => router.push(`/place/${place.slug?.current || placeId}`)}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className={styles.cardImg} style={{ backgroundImage: `url(${place.image?.asset ? urlForImage(place.image).width(400).url() : (place.image || '/assets/ai/hero_nature.png')})` }}>
                  <button 
                    className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlace(placeId);
                    }}
                    title={isSaved ? "Saved" : "Save Place"}
                  >
                    <Heart size={14} fill={isSaved ? '#E9801D' : 'none'} color={isSaved ? '#E9801D' : '#fff'} strokeWidth={isSaved ? 0 : 2} />
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3>{place.name}</h3>
                  <p>{place.location}</p>
                  {place.rating && <span className={styles.ratingBadge}>⭐ {place.rating}</span>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
