'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  MapPin, User, Users, Search, Heart, Landmark, Waves, Map as MapIcon,
  Calendar, Sparkles, Award, Check, Sunrise, Sun, Sunset, Moon, Camera, Leaf, Info, Footprints,
  Clock, Compass, ShieldCheck, ChevronRight, Bell, Ticket, Star, Zap, Calendar as CalendarDays
} from 'lucide-react';
import styles from './Home.module.css';
import { useTrip } from '@/components/TripContext';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';
import { PLACES as STATIC_PLACES } from '@/data/places';
import { calculateDrivingDistance, TIRUPATI_CENTER } from '@/utils/location';
import { urlForImage } from '@/sanity/lib/image';
import { useRealtimeStatus } from '@/lib/useRealtimeStatus';
import { getBestForToday } from '@/lib/contextEngine';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { userLocation, setLocationPermission, setUserLocation, togglePlace, savedPlaces, plannerInput } = useTrip();
  const [locationName, setLocationName] = useState<string>('Tirupati');
  const [dailyContent, setDailyContent] = useState<any>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Explorer');
  
  // Custom states for CPO experience
  const [startQuiz, setStartQuiz] = useState<boolean>(false);
  const [showCounters, setShowCounters] = useState<boolean>(false);
  const [showCompleteDarshan, setShowCompleteDarshan] = useState<boolean>(false);
  const [showPersonalizeBanner, setShowPersonalizeBanner] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  
  // Daily Progress Tracker checklist state
  const [completedSteps, setCompletedSteps] = useState<{
    story: boolean;
    quiz: boolean;
    visit: boolean;
  }>({ story: false, quiz: false, visit: false });

  // Rotating Search Placeholders
  const searchHints = [
    'Search darshan timings, SSD tokens...',
    'Search temples, waterfalls, treks...',
    'Search laddu, prasadam, accommodation...',
    'Search festivals, VIP entry, parking...',
    'Search history, stories, hidden gems...',
  ];
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % searchHints.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const [cabRef, setCabRef] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        localStorage.setItem('saarthi_cab_ref', ref);
        setCabRef(ref);
        
        // Log QR scan event once per session
        const loggedKey = `saarthi_qr_logged_${ref}`;
        if (!sessionStorage.getItem(loggedKey)) {
          logTelemetry('qr_scan', 'cab', ref, { source: 'qr_code_scan' });
          sessionStorage.setItem(loggedKey, 'true');
        }
      } else {
        setCabRef(localStorage.getItem('saarthi_cab_ref'));
      }

      const hasSeen = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeen) {
        setShowPersonalizeBanner(true);
      }
    }
  }, []);

  // Realtime hook
  const { places, loading } = useRealtimePlaces(STATIC_PLACES);
  const { status: rawLiveStatus } = useRealtimeStatus();

  const FALLBACK_STATUS = useMemo(() => ({
    waitTime: '2-3 hours',
    crowdLevel: 'moderate' as const,
    sevaStatus: 'All sevas open',
    notice: '',
    lastUpdated: new Date().toISOString(),
    darshanSpeed: 'normal' as const,
    accommodationStatus: 'available' as const,
    ladduAvailability: 'available' as const,
    weather: 'Pleasant, 24°C',
    darshans: [
      { name: 'Sarva Darshan (Free)', waitTime: '12-15 hours', peakHours: 'Daily 10 AM - 6 PM' },
      { name: 'Special Entry (₹300)', waitTime: '3-4 hours', peakHours: 'Daily 9 AM - 3 PM' },
      { name: 'Divya Darshan (Footpath)', waitTime: '8-10 hours', peakHours: 'Daily 8 AM - 4 PM' },
      { name: 'VIP / Srivani Break', waitTime: '1.5 hours', peakHours: 'Daily 6 AM - 8 AM' }
    ],
    ssdTokenStatus: 'issuing' as const,
    ssdNextTokenTime: '2:00 PM',
    ssdTokenSlots: [
      { slotTime: '5:00 AM - 7:00 AM', status: 'closed' as const, tokensLeft: 'Full' },
      { slotTime: '7:00 AM - 9:00 AM', status: 'closed' as const, tokensLeft: 'Full' },
      { slotTime: '9:00 AM - 11:00 AM', status: 'filling' as const, tokensLeft: '~200 remaining' },
      { slotTime: '11:00 AM - 1:00 PM', status: 'available' as const, tokensLeft: 'Available' },
      { slotTime: '2:00 PM - 4:00 PM', status: 'available' as const, tokensLeft: 'Available' },
      { slotTime: '4:00 PM - 6:00 PM', status: 'available' as const, tokensLeft: 'Available' },
    ],
    ssdNotice: '',
    ssdTimingsGuide: 'Offline free SSD tokens are released daily starting at 3:00 AM / 4:00 AM. Batches are allocated hourly for that day\'s Darshan. Counters close as soon as the daily quota runs out (~15,000 - 20,000 tokens).',
    ssdCounters: [
      { name: 'Vishnu Nivasam Counter', description: 'Located opposite Tirupati Railway Station (Highly convenient for train travelers)' },
      { name: 'Srinivasam Complex Counter', description: 'Located opposite Tirupati RTC Central Bus Stand (Ideal for bus travelers)' },
      { name: 'Bhudevi Complex Counter', description: 'Located near Alipiri Footpath Link Road (Ideal for pedestrian pilgrims)' },
    ]
  }), []);

  const [realtimeWeather, setRealtimeWeather] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=13.6288&longitude=79.4192&current=temperature_2m,weather_code')
      .then(res => res.json())
      .then(data => {
        if (data?.current) {
          const temp = Math.round(data.current.temperature_2m);
          const code = data.current.weather_code;
          let cond = 'Clear Sky';
          if (code >= 1 && code <= 3) cond = 'Partly Cloudy';
          else if (code === 45 || code === 48) cond = 'Foggy';
          else if (code >= 51 && code <= 67) cond = 'Rainy';
          else if (code >= 80 && code <= 82) cond = 'Rain Showers';
          else if (code >= 95 && code <= 99) cond = 'Thunderstorm';
          
          setRealtimeWeather(`${cond}, ${temp}°C`);
        }
      })
      .catch(err => {
        console.error('Failed to fetch realtime weather:', err);
      });
  }, []);

  const liveStatus = useMemo(() => {
    const base = rawLiveStatus || FALLBACK_STATUS;
    if (realtimeWeather) {
      return { ...base, weather: realtimeWeather };
    }
    return base;
  }, [rawLiveStatus, FALLBACK_STATUS, realtimeWeather]);

  const bestForToday = useMemo(() => {
    if (!places || !places.length) return null;
    const crowd = liveStatus?.crowdLevel || 'moderate';
    const weather = liveStatus?.weather || 'Pleasant, 24°C';
    return getBestForToday(places, crowd, weather, plannerInput);
  }, [places, liveStatus, plannerInput]);

  const tirumalaVerdict = useMemo(() => {
    if (!liveStatus) return { visit: true, reason: 'Crowd is low, parking is available', label: '✅ Yes', currentWait: '2-3 hours', recommendedArrival: '5:00 AM' };
    const level = liveStatus.crowdLevel;
    const weather = liveStatus.weather;
    const parking = liveStatus.accommodationStatus;
    const currentWait = liveStatus.waitTime || '2-3 hours';
    
    let visit = true;
    let label = '✅ Yes';
    let reason = 'Conditions are great right now.';
    let recommendedArrival = '5:00 AM';
    
    if (level === 'very-high') {
      visit = false;
      label = '⚠️ Better after 6 PM';
      reason = 'Extremely heavy queue line crowd right now.';
      recommendedArrival = '6:00 PM';
    } else if (level === 'high') {
      visit = false;
      label = '⚠️ Better after 4 PM';
      reason = 'Heavy crowd, wait times exceed 12 hours.';
      recommendedArrival = '4:00 PM';
    } else if (parking === 'full') {
      visit = false;
      label = '⚠️ Delay Visit';
      reason = 'Accommodation & parking is completely full.';
      recommendedArrival = 'After 6 PM';
    } else if (/rain/i.test(weather)) {
      visit = true;
      label = '✅ Yes, carry umbrella';
      reason = 'Rain reported on hills, but queues are indoor.';
      recommendedArrival = '8:00 AM';
    } else {
      visit = true;
      label = '✅ Yes';
      reason = `Moderate crowd, pleasant weather (${weather.split(',')[1]?.trim() || weather}).`;
      recommendedArrival = '5:00 AM';
    }
    
    return { visit, label, reason, currentWait, recommendedArrival };
  }, [liveStatus]);

  const getMinutesAgo = (isoTime: string) => {
    if (!isoTime) return 'now';
    try {
      const diffMs = Date.now() - new Date(isoTime).getTime();
      const mins = Math.max(0, Math.floor(diffMs / 60000));
      if (mins === 0) return 'now';
      return `${mins}m ago`;
    } catch {
      return 'now';
    }
  };

  const logTelemetry = async (eventType: string, entityType?: string, entityId?: string, metadata?: any) => {
    try {
      let sessId = typeof window !== 'undefined' ? sessionStorage.getItem('saarthi_session_id') : null;
      if (!sessId && typeof window !== 'undefined') {
        sessId = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('saarthi_session_id', sessId);
      }
      const payload = {
        sessionId: sessId,
        eventType,
        entityType,
        entityId,
        metadata,
        timestamp: new Date().toISOString()
      };
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickFeedback = (rating: string) => {
    logTelemetry('passenger_feedback', 'cab', cabRef || 'general', { rating });
    setFeedbackSent(true);
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) return;
    logTelemetry('passenger_feedback', 'cab', cabRef || 'general', { text: feedbackText.trim() });
    setFeedbackSent(true);
    setFeedbackText('');
  };

  const handleQuizAnswer = (optionId: string, isCorrect: boolean) => {
    if (quizAnswered) return;
    setSelectedQuizOption(optionId);
    setQuizAnswered(true);
    setCompletedSteps(prev => ({ ...prev, quiz: true }));
    localStorage.setItem('quiz_answered_today', 'true');
    
    if (dailyContent?.quiz?.id) {
      localStorage.setItem(`quiz_answered_${dailyContent.quiz.id}`, optionId);
    }
    logTelemetry('quiz_attempt', 'quiz', dailyContent?.quiz?.id, {
      selectedOption: optionId,
      isCorrect
    });
  };

  const getGreetingIcon = () => {
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 12) return <Sunrise className={styles.greetingIcon} size={24} color="#E9801D" />;
    if (hr >= 12 && hr < 17) return <Sun className={styles.greetingIcon} size={24} color="#FF9933" />;
    if (hr >= 17 && hr < 21) return <Sunset className={styles.greetingIcon} size={24} color="#D97742" />;
    return <Moon className={styles.greetingIcon} size={24} color="#4F46E5" />;
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    const name = userName || 'Traveler';
    if (hr >= 5 && hr < 12) return `Good Morning, ${name}`;
    if (hr >= 12 && hr < 17) return `Good Afternoon, ${name}`;
    if (hr >= 17 && hr < 21) return `Good Evening, ${name}`;
    return `Good Night, ${name}`;
  };

  useEffect(() => {
    setMounted(true);
    logTelemetry('home_view');

    const storedName = localStorage.getItem('saarthi_user_name');
    if (storedName) {
      setUserName(storedName);
    }

    // Initialize progress tracker state from localStorage
    const storyRead = localStorage.getItem('story_read_today') === 'true';
    const quizDone = localStorage.getItem('quiz_answered_today') === 'true';
    const visitDone = localStorage.getItem('temple_visited_today') === 'true';
    setCompletedSteps({ story: storyRead, quiz: quizDone, visit: visitDone });

    fetch('/api/content/daily')
      .then(res => res.json())
      .then(data => {
        setDailyContent(data);
        if (data?.quiz?.id) {
          const savedAnswer = localStorage.getItem(`quiz_answered_${data.quiz.id}`);
          if (savedAnswer) {
            setSelectedQuizOption(savedAnswer);
            setQuizAnswered(true);
            setCompletedSteps(prev => ({ ...prev, quiz: true }));
          }
        }
      })
      .catch(console.error);
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

  const templeOfTheDay = useMemo(() => {
    if (dailyContent?.spotlight) {
      return dailyContent.spotlight;
    }
    return places.find(p => p.id === 'srivari-swamy-temple' || p.id === 'govindaraja') 
      || places.find(p => p.isMustVisit === true)
      || places[0];
  }, [dailyContent, places]);

  const hiddenGem = useMemo(() => {
    return places.find(p => p.id === 'japali-hanuman' || p.id === 'silathoranam') 
      || places.find(p => p.placeType === 'hidden' || p.isHiddenGem === true)
      || places[2];
  }, [places]);

  const getWhyReasons = (place: any, isGem = false) => {
    if (isGem) {
      return [
        'Tranquil nature setting',
        'Lesser-known local heritage',
        'Ideal for quiet meditation'
      ];
    }
    return [
      'TTD live status: Normal crowd',
      'Pleasant mountain weather',
      'Rich mythological history'
    ];
  };

  const progressPercent = useMemo(() => {
    const steps = [completedSteps.story, completedSteps.quiz, completedSteps.visit];
    const completed = steps.filter(Boolean).length;
    return Math.round((completed / steps.length) * 100);
  }, [completedSteps]);

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

  const handlePlaceClick = (placeId: string) => {
    localStorage.setItem('temple_visited_today', 'true');
    setCompletedSteps(prev => ({ ...prev, visit: true }));
    logTelemetry('place_click', 'place', placeId);
    router.push(`/place/${placeId}`);
  };

  const startJourneySequence = () => {
    // Begin Journey action button handler
    localStorage.setItem('temple_visited_today', 'true');
    setCompletedSteps(prev => ({ ...prev, visit: true }));
    
    // Auto-direct to the story of the day
    router.push('/learn/story-of-the-day');
  };

  const getCrowdStatus = (level: string) => {
    switch(level) {
      case 'low': return { label: '🟢 Normal', color: '#16A34A' };
      case 'moderate': return { label: '🟡 Busy', color: '#D97706' };
      case 'high': return { label: '🟠 Heavy', color: '#EA580C' };
      case 'very-high': return { label: '🔴 Extremely Heavy', color: '#DC2626' };
      default: return { label: '🟡 Busy', color: '#D97706' };
    }
  };

  const getParkingStatus = (status: string) => {
    switch(status) {
      case 'available': return { label: '🟢 Available', color: '#16A34A' };
      case 'limited': return { label: '🟡 Filling Fast', color: '#D97706' };
      case 'full': return { label: '🔴 Full', color: '#DC2626' };
      default: return { label: '🟢 Available', color: '#16A34A' };
    }
  };

  const getTrafficStatus = (speed: string) => {
    switch(speed) {
      case 'fast': return { label: '🟢 Normal', color: '#16A34A' };
      case 'normal': return { label: '🟡 Busy', color: '#D97706' };
      case 'slow': return { label: '🟠 Heavy', color: '#EA580C' };
      default: return { label: '🟢 Normal', color: '#16A34A' };
    }
  };

  const getDarshanIcon = (name: string) => {
    const lowercase = name.toLowerCase();
    if (lowercase.includes('300') || lowercase.includes('special')) {
      return <Ticket size={13} className={styles.iconCyan} />;
    }
    if (lowercase.includes('footpath') || lowercase.includes('divya')) {
      return <Zap size={13} className={styles.iconBlue} />;
    }
    if (lowercase.includes('vip') || lowercase.includes('srivani')) {
      return <Star size={13} className={styles.iconGold} />;
    }
    return <CalendarDays size={13} className={styles.iconOrange} />;
  };

  const getWaitTimeBadgeStyle = (timeStr: string) => {
    const clean = timeStr.toLowerCase();
    const matches = clean.match(/\d+/g);
    const hours = matches ? Math.max(...matches.map(Number)) : 0;
    
    if (clean.includes('15') || clean.includes('12') || clean.includes('10') || hours >= 8) {
      return { color: '#B91C1C', background: '#FEE2E2' };
    }
    if (clean.includes('3') || clean.includes('4') || clean.includes('5') || hours >= 3) {
      return { color: '#B45309', background: '#FEF3C7' };
    }
    return { color: '#047857', background: '#D1FAE5' };
  };

  const getCongestionPercent = (level: string) => {
    switch(level) {
      case 'low': return 15;
      case 'moderate': return 45;
      case 'high': return 75;
      case 'very-high': return 95;
      default: return 45;
    }
  };

  const getSituationFeedItems = () => {
    if (!liveStatus) return [];
    const items = [];
    if (liveStatus.notice) {
      items.push({ text: `🔔 Alert: ${liveStatus.notice}`, time: 'Live', color: '#EF4444' });
    }
    items.push({ text: `👥 Crowd status is currently ${getCrowdStatus(liveStatus.crowdLevel).label} (${liveStatus.waitTime} wait time)`, time: 'Updated', color: getCrowdStatus(liveStatus.crowdLevel).color });
    items.push({ text: `⛅ Weather is currently ${liveStatus.weather}`, time: 'Updated', color: '#3B82F6' });
    items.push({ text: `🍬 Laddu prasadam availability is ${getParkingStatus(liveStatus.ladduAvailability).label}`, time: 'Updated', color: getParkingStatus(liveStatus.ladduAvailability).color });
    return items;
  };

  const fmtTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch { return ''; }
  };

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
        <div className={styles.greetingRow}>
          {getGreetingIcon()}
          <p className={styles.greeting}>{getGreeting()}</p>
        </div>
        <h1 className={styles.mainHeadline}>
          Plan Better. <span className={styles.soulText}>Explore Fully.</span>
        </h1>
      </section>

      {showPersonalizeBanner && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            margin: '16px 16px 8px 16px',
            padding: '12px 14px',
            background: 'linear-gradient(135deg, #FFF1E6, #FFFAF5)',
            border: '1px dashed #E9801D',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            cursor: 'pointer'
          }}
          onClick={() => router.push('/onboarding')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>✨</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#1F2937' }}>Personalize Your Itinerary</span>
              <span style={{ fontSize: '10px', color: '#6B7280' }}>Optimize walk times & accessibility.</span>
            </div>
          </div>
          <button style={{
            background: '#E9801D',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            padding: '5px 10px',
            fontSize: '10px',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            Set Profile
          </button>
        </motion.div>
      )}

      {/* ─── SEARCH / DISCOVERY BAR ─── */}
      <section className={styles.searchSection}>
        <div className={styles.searchBar}>
          <Search 
            size={20} 
            color="var(--color-text-secondary)" 
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              const input = e.currentTarget.nextElementSibling as HTMLInputElement;
              if (input && input.value.trim()) {
                router.push(`/explore?q=${input.value.trim()}`);
              }
            }}
          />
          <input 
            type="text" 
            placeholder={searchHints[hintIndex]} 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                router.push(`/explore?q=${e.currentTarget.value.trim()}`);
              }
            }}
          />
        </div>
      </section>

      {/* ─── DAILY EXPLORER TRACKER (GIVES MEANING FOR DAILY OPEN) ─── */}
      <section style={{ margin: '12px 16px', background: 'linear-gradient(135deg, #FFF5EC 0%, #FFFDFB 100%)', border: '1px solid #FFE4CC', borderRadius: '16px', padding: '14px 16px', boxShadow: '0 4px 10px rgba(233, 128, 29, 0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#E9801D', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
              🗺️ Daily Explorer Tracker
            </span>
            <strong style={{ fontSize: '13px', color: '#1E293B' }}>
              {progressPercent === 100 ? "🎉 Completed Today's Journey!" : "Journey Progress"}
            </strong>
          </div>
          <div style={{ position: 'relative', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ transform: 'rotate(-90deg)', width: '38px', height: '38px' }}>
              <circle cx="19" cy="19" r="16" stroke="#FFE4CC" strokeWidth="3" fill="transparent" />
              <circle 
                cx="19" 
                cy="19" 
                r="16" 
                stroke="#E9801D" 
                strokeWidth="3" 
                fill="transparent" 
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - progressPercent / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            <span style={{ position: 'absolute', fontSize: '10px', fontWeight: 800, color: '#E9801D' }}>
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <div 
            onClick={() => {
              localStorage.setItem('story_read_today', 'true');
              setCompletedSteps(prev => ({ ...prev, story: true }));
              router.push('/learn/story-of-the-day');
            }}
            style={{
              flex: 1,
              background: '#FFFFFF',
              border: `1px solid ${completedSteps.story ? '#A7F3D0' : '#E2E8F0'}`,
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              alignItems: 'center',
              textAlign: 'center',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '16px' }}>📖</span>
            <span style={{ fontSize: '9px', fontWeight: 800, color: completedSteps.story ? '#15803D' : '#64748B' }}>
              {completedSteps.story ? 'Read ✓' : '1. Read Story'}
            </span>
          </div>

          <div 
            onClick={() => {
              if (dailyContent?.quiz?.id) {
                const quizSection = document.getElementById('quiz-section');
                if (quizSection) quizSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            style={{
              flex: 1,
              background: '#FFFFFF',
              border: `1px solid ${completedSteps.quiz ? '#A7F3D0' : '#E2E8F0'}`,
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              alignItems: 'center',
              textAlign: 'center',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '16px' }}>✏️</span>
            <span style={{ fontSize: '9px', fontWeight: 800, color: completedSteps.quiz ? '#15803D' : '#64748B' }}>
              {completedSteps.quiz ? 'Quiz ✓' : '2. Take Quiz'}
            </span>
          </div>

          <div 
            onClick={() => {
              localStorage.setItem('temple_visited_today', 'true');
              setCompletedSteps(prev => ({ ...prev, visit: true }));
              const bestSection = document.getElementById('best-for-today-section');
              if (bestSection) bestSection.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              flex: 1,
              background: '#FFFFFF',
              border: `1px solid ${completedSteps.visit ? '#A7F3D0' : '#E2E8F0'}`,
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              alignItems: 'center',
              textAlign: 'center',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '16px' }}>🗺️</span>
            <span style={{ fontSize: '9px', fontWeight: 800, color: completedSteps.visit ? '#15803D' : '#64748B' }}>
              {completedSteps.visit ? 'Discovered ✓' : '3. Discover Pick'}
            </span>
          </div>
        </div>
      </section>

      {/* ─── LIVE SITUATION HERO ─── */}
      {liveStatus && (
        <section className={styles.liveSituationHero}>
          <div className={styles.liveSituationHeader}>
            <div className={styles.liveSituationTitle}>
              <span className={styles.liveSituationDot} style={{ backgroundColor: getCrowdStatus(liveStatus.crowdLevel).color }} />
              <span>LIVE SITUATION</span>
            </div>
            <span className={styles.liveSituationUpdated}>
              Last synced: {getMinutesAgo(liveStatus.lastUpdated)}
            </span>
          </div>

          <div className={styles.liveSituationGrid}>
            <div className={styles.liveStatCard}>
              <div className={styles.liveStatIcon} style={{ backgroundColor: '#F3F4F6' }}>
                <Users size={18} color="#4B5563" />
              </div>
              <div className={styles.liveStatInfo}>
                <span className={styles.liveStatLabel}>Crowd</span>
                <span className={styles.liveStatValue}>{getCrowdStatus(liveStatus.crowdLevel).label}</span>
              </div>
            </div>

            <div className={styles.liveStatCard}>
              <div className={styles.liveStatIcon} style={{ backgroundColor: '#F3F4F6' }}>
                <Clock size={18} color="#4B5563" />
              </div>
              <div className={styles.liveStatInfo}>
                <span className={styles.liveStatLabel}>Wait Time</span>
                <span className={styles.liveStatValue}>{liveStatus.waitTime}</span>
              </div>
            </div>

            <div className={styles.liveStatCard}>
              <div className={styles.liveStatIcon} style={{ backgroundColor: '#F3F4F6' }}>
                <Sun size={18} color="#4B5563" />
              </div>
              <div className={styles.liveStatInfo}>
                <span className={styles.liveStatLabel}>Weather</span>
                <span className={styles.liveStatValue}>{liveStatus.weather}</span>
              </div>
            </div>

            <div className={styles.liveStatCard}>
              <div className={styles.liveStatIcon} style={{ backgroundColor: '#F3F4F6' }}>
                <MapIcon size={18} color="#4B5563" />
              </div>
              <div className={styles.liveStatInfo}>
                <span className={styles.liveStatLabel}>Parking</span>
                <span className={styles.liveStatValue}>{getParkingStatus(liveStatus.accommodationStatus).label}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── LATEST UPDATES (SITUATION FEED) ─── */}
      {liveStatus && (
        <section className={styles.situationFeedSection}>
          <div className={styles.situationFeedCard}>
            <div className={styles.situationFeedHeader}>
              <Bell size={16} color="#E9801D" />
              <span className={styles.situationFeedTitle}>🔔 LATEST UPDATES</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {getSituationFeedItems().map((item, idx) => (
                <div key={idx} className={styles.feedItem}>
                  <span className={styles.feedDot} style={{ backgroundColor: item.color }} />
                  <span className={styles.feedText}>{item.text}</span>
                  <span className={styles.feedTime}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* ─── 🛕 DARSHAN CENTER (FLAGSHIP COMMAND STATION) ─── */}
      {liveStatus && (
        <section className={styles.darshanCenterSection}>
          <div className={styles.darshanCenterCard}>
            
            {/* Header */}
            <div className={styles.darshanCenterHeader}>
              <Landmark size={18} color="#FFFFFF" />
              <h2 className={styles.darshanCenterTitle}>Darshan Center</h2>
              <span className={styles.liveBadge}>LIVE DATA</span>
            </div>

            <p className={styles.darshanCenterSubtitle}>
              Real-time Tirupati intelligence. Plan your queue timing & ticket status instantly.
            </p>

            {/* Quick Summary Grid */}
            <div className={styles.darshanQuickGrid}>
              <div className={styles.darshanQuickItem}>
                <span className={styles.darshanQuickLabel}>👥 Crowd</span>
                <span className={styles.darshanQuickValue} style={{ color: getCrowdStatus(liveStatus.crowdLevel).color }}>
                  {getCrowdStatus(liveStatus.crowdLevel).label}
                </span>
              </div>
              <div className={styles.darshanQuickItem}>
                <span className={styles.darshanQuickLabel}>⏳ Wait Time</span>
                <span className={styles.darshanQuickValue} style={{ color: '#E9801D' }}>
                  {liveStatus.waitTime}
                </span>
              </div>
              <div className={styles.darshanQuickItem}>
                <span className={styles.darshanQuickLabel}>🎟️ SSD Tokens</span>
                <span className={styles.darshanQuickValue} style={{
                  color: liveStatus.ssdTokenStatus === 'issuing' ? '#16A34A' : liveStatus.ssdTokenStatus === 'paused' ? '#D97706' : '#DC2626'
                }}>
                  {liveStatus.ssdTokenStatus === 'issuing' ? '🟢 Issuing' : liveStatus.ssdTokenStatus === 'paused' ? '🟡 Paused' : '🔴 Closed'}
                </span>
                {liveStatus.ssdTokenStatus !== 'issuing' && (
                  <span style={{ fontSize: '9px', color: '#64748B', marginTop: '2px' }}>Next: Tomorrow 3:00 AM</span>
                )}
              </div>
              <div className={styles.darshanQuickItem}>
                <span className={styles.darshanQuickLabel}>🚗 Parking</span>
                <span className={styles.darshanQuickValue} style={{ color: getParkingStatus(liveStatus.accommodationStatus).color }}>
                  {getParkingStatus(liveStatus.accommodationStatus).label}
                </span>
              </div>
            </div>

            {/* Decision Support: Should You Join the Queue Now? */}
            <div className={styles.decisionSupportBox} style={{
              backgroundColor: tirumalaVerdict.visit ? '#ECFDF5' : '#FFF5F5',
              border: `1px solid ${tirumalaVerdict.visit ? '#A7F3D0' : '#FECACA'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '15px' }}>{tirumalaVerdict.visit ? '✅' : '⚠️'}</span>
                <strong style={{ fontSize: '12px', color: tirumalaVerdict.visit ? '#065F46' : '#991B1B', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  Should You Join the Queue?
                </strong>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: tirumalaVerdict.visit ? '#047857' : '#B91C1C', marginBottom: '4px' }}>
                {tirumalaVerdict.label}
              </div>
              <p style={{ fontSize: '11.5px', color: tirumalaVerdict.visit ? '#065F46' : '#991B1B', margin: '0 0 8px', lineHeight: 1.4 }}>
                {tirumalaVerdict.reason}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: tirumalaVerdict.visit ? '#D1FAE5' : '#FEE2E2', color: tirumalaVerdict.visit ? '#065F46' : '#991B1B' }}>
                  ⏳ Current wait: {tirumalaVerdict.currentWait}
                </span>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: tirumalaVerdict.visit ? '#D1FAE5' : '#FEE2E2', color: tirumalaVerdict.visit ? '#065F46' : '#991B1B' }}>
                  🕐 Best arrival: {tirumalaVerdict.recommendedArrival}
                </span>
              </div>
            </div>

            {/* Collapsible Details Trigger */}
            <button 
              className={styles.expandDarshanBtn}
              onClick={() => setShowCompleteDarshan(!showCompleteDarshan)}
            >
              <span>{showCompleteDarshan ? 'Hide Complete Darshan Details ▲' : 'View Complete Darshan Details ▼'}</span>
            </button>

            {/* Collapsible Content */}
            <AnimatePresence>
              {showCompleteDarshan && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '16px', borderTop: '1px solid #F1F5F9' }}>
                    
                    {/* Wait Times Table */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h3 style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                        📋 Queue Wait Times
                      </h3>
                      <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600 }}>Updated: {getMinutesAgo(liveStatus.lastUpdated)}</span>
                    </div>
                    
                    {liveStatus.darshans && liveStatus.darshans.length > 0 && (
                      <div className={styles.darshanList} style={{ margin: '0 0 20px' }}>
                        <div className={styles.darshanHeader}>
                          <span>Darshan Type</span>
                          <span style={{ textAlign: 'center' }}>Wait</span>
                          <span style={{ textAlign: 'right' }}>Peak Hours</span>
                        </div>
                        {liveStatus.darshans.map((d, i) => (
                          <div key={i} className={styles.darshanRow}>
                            <div className={styles.darshanNameCol}>
                              {getDarshanIcon(d.name)}
                              <span className={styles.darshanName}>{d.name}</span>
                            </div>
                            <div className={styles.darshanTimeCol}>
                              <span 
                                className={styles.darshanTimeBadge} 
                                style={getWaitTimeBadgeStyle(d.waitTime)}
                              >
                                {d.waitTime}
                              </span>
                            </div>
                            <div className={styles.darshanPeakCol}>
                              <Clock size={11} className={styles.clockIcon} />
                              <span className={styles.darshanPeak}>{d.peakHours}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* SSD Section */}
                    <div style={{ background: 'linear-gradient(135deg, #1E293B, #334155)', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        🎫 SSD Token Slots & Availability
                      </span>
                    </div>

                    {liveStatus.ssdTokenStatus !== 'closed-for-day' && liveStatus.ssdNextTokenTime && (
                      <div className={styles.ssdNextToken} style={{ margin: '0 0 10px' }}>
                        <span className={styles.ssdNextTokenLabel}>Next Available Slot:</span>
                        <span className={styles.ssdNextTokenTime}>{liveStatus.ssdNextTokenTime}</span>
                      </div>
                    )}

                    {liveStatus.ssdNotice && (
                      <div className={styles.ssdNotice} style={{ margin: '0 0 10px' }}>
                        <Info size={14} style={{ marginTop: 1, flexShrink: 0 }} />
                        <span>{liveStatus.ssdNotice}</span>
                      </div>
                    )}

                    {liveStatus.ssdTokenSlots && liveStatus.ssdTokenSlots.length > 0 && (
                      <div className={styles.ssdSlotGrid} style={{ margin: '0 0 20px' }}>
                        {liveStatus.ssdTokenSlots.map((slot, idx) => (
                          <div key={idx} className={styles.ssdSlotRow}>
                            <span className={styles.ssdSlotTime}>{slot.slotTime}</span>
                            <div style={{ textAlign: 'center' }}>
                              <span className={styles.ssdSlotStatus} style={{
                                backgroundColor: slot.status === 'available' ? '#E8F5E9' : slot.status === 'filling' ? '#FFF3E0' : '#FFEBEE',
                                color: slot.status === 'available' ? '#2E7D32' : slot.status === 'filling' ? '#E65100' : '#C62828'
                              }}>
                                {slot.status === 'available' ? '● Available' : slot.status === 'filling' ? '● Filling Fast' : '● Closed'}
                              </span>
                            </div>
                            <span className={styles.ssdSlotTokens}>{slot.tokensLeft || 'Full'}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TTD Token Info */}
                    <div style={{ marginBottom: '16px', padding: '12px 14px', background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <span style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#E9801D', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>?</span>
                        When does TTD issue tokens?
                      </span>
                      {liveStatus.ssdTimingsGuide && liveStatus.ssdTimingsGuide !== "Offline free SSD tokens are released daily starting at 3:00 AM / 4:00 AM. Batches are allocated hourly for that day's Darshan. Counters close as soon as the daily quota runs out (~15,000 - 20,000 tokens)." ? (
                        <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                          {liveStatus.ssdTimingsGuide}
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px' }}>🕒</span>
                            <div><strong>Daily Opens:</strong> 3:00 AM / 4:00 AM</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px' }}>🎫</span>
                            <div><strong>Tickets Limit:</strong> 15,000 - 20,000 per day</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px' }}>⚠️</span>
                            <div><strong>Counters Close:</strong> As soon as quota runs out</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Floating Cab / Beta Feedback Card */}
                    <div style={{ 
                      marginBottom: '16px', 
                      padding: '14px', 
                      background: 'linear-gradient(135deg, #FFFDF9, #FDF6EC)', 
                      borderRadius: '12px', 
                      border: '1px solid #FADFBF',
                      boxShadow: '0 4px 12px rgba(233, 128, 29, 0.05)'
                    }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#E9801D', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px' }}>💬</span>
                        {cabRef ? `Riding in Cab ${cabRef}` : 'Tell us your thoughts!'}
                      </span>
                      
                      {feedbackSent ? (
                        <div style={{ fontSize: '12px', color: '#15803D', fontWeight: 600, padding: '4px 0' }}>
                          ✅ Thank you! Your feedback has been logged in our system. Safe travels uphill!
                        </div>
                      ) : (
                        <>
                          <p style={{ fontSize: '12px', color: '#6B4C25', margin: '0 0 10px 0', lineHeight: '1.5', fontWeight: 500 }}>
                            {cabRef 
                              ? `Help us improve! Tell us about your journey uphill or report any live queues you encounter.`
                              : `Saarthi is in Beta. Help us improve by submitting your feedback or reporting live queue status.`}
                          </p>
                          
                          {/* Quick Yes/No Options */}
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                            <button
                              onClick={() => handleQuickFeedback('Helpful')}
                              style={{
                                flex: 1,
                                padding: '8px 10px',
                                background: '#FFFFFF',
                                border: '1px solid #16A34A',
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#16A34A',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                              }}
                            >
                              👍 Yes, Helpful
                            </button>
                            <button
                              onClick={() => handleQuickFeedback('Needs Work')}
                              style={{
                                flex: 1,
                                padding: '8px 10px',
                                background: '#FFFFFF',
                                border: '1px solid #DC2626',
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#DC2626',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                              }}
                            >
                              👎 Needs Work
                            </button>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '12px 0 8px 0', justifyContent: 'center' }}>
                            <span style={{ height: '1px', background: '#F0E5D8', flex: 1 }}></span>
                            <span style={{ fontSize: '9px', color: '#B49B7F', fontWeight: 800, letterSpacing: '0.5px' }}>OR SHARE LIVE UPDATE</span>
                            <span style={{ height: '1px', background: '#F0E5D8', flex: 1 }}></span>
                          </div>

                          <textarea
                            style={{
                              width: '100%',
                              height: '54px',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: '1px solid #E2E8F0',
                              fontSize: '12px',
                              marginBottom: '10px',
                              resize: 'none',
                              outline: 'none',
                              fontFamily: 'inherit',
                              color: '#1F2937'
                            }}
                            placeholder="Type your feedback or live queue report..."
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button
                              onClick={handleFeedbackSubmit}
                              disabled={!feedbackText.trim()}
                              style={{
                                width: '100%',
                                padding: '10px 14px',
                                background: feedbackText.trim() ? '#E9801D' : '#E2E8F0',
                                color: feedbackText.trim() ? '#FFFFFF' : '#94A3B8',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: feedbackText.trim() ? 'pointer' : 'not-allowed',
                              }}
                            >
                              Submit Live Report
                            </button>
                            <a 
                              href={`https://wa.me/918123456789?text=${encodeURIComponent(
                                cabRef 
                                  ? `Hi Saarthi, I scanned the QR code in cab ${cabRef}. Here is my feedback/live report: `
                                  : "Hi Saarthi team, I am using the app and have some feedback: "
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#16A34A',
                                textDecoration: 'none',
                                textAlign: 'center',
                                padding: '4px'
                              }}
                            >
                              Or Chat Directly on WhatsApp ➔
                            </a>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Counter Locations */}
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        <span style={{ width: '20px', height: '20px', borderRadius: '6px', background: '#3B82F6', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>📍</span>
                        Where to get tokens?
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(liveStatus.ssdCounters && liveStatus.ssdCounters.length > 0 ? liveStatus.ssdCounters : [
                          { name: 'Vishnu Nivasam Counter', description: 'Located opposite Tirupati Railway Station (Highly convenient for train travelers)' },
                          { name: 'Srinivasam Complex Counter', description: 'Located opposite Tirupati RTC Central Bus Stand (Ideal for bus travelers)' },
                          { name: 'Bhudevi Complex Counter', description: 'Located near Alipiri Footpath Link Road (Ideal for pedestrian pilgrims)' },
                        ]).map((counter: any, index: number) => (
                          <div key={index} style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '10px', border: '1px solid #F1F5F9', borderLeft: '3px solid #3B82F6', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#EFF6FF', color: '#3B82F6', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, flexShrink: 0, marginTop: '1px' }}>{index + 1}</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>{counter.name}</span>
                              <span style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.4 }}>{counter.description}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      )}



      {/* ─── BEST FOR TODAY'S CONDITIONS ─── */}
      {bestForToday && (
        <section className={styles.bestForTodaySection} id="best-for-today-section">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🌤 Best for Today's Conditions</h2>
          </div>
          <div 
            className={styles.bestForTodayCard}
            onClick={() => handlePlaceClick(bestForToday.place.id)}
          >
            <div 
              className={styles.bestForTodayImg} 
              style={{ backgroundImage: `url(${bestForToday.place.image})` }}
            >
              <span className={styles.bestForTodayBadge}>
                {bestForToday.place.category}
              </span>
            </div>
            <div className={styles.bestForTodayBody}>
              <span className={styles.bestForTodayLabel}>Suggested Choice Right Now</span>
              <h3>{bestForToday.place.name}</h3>
              <p>{bestForToday.place.description}</p>
              
              <div className={styles.reasonsBox}>
                <div className={styles.reasonsTitle}>Why should I visit?</div>
                {bestForToday.reasons.map((reason, idx) => (
                  <div key={idx} className={styles.reasonLine}>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              <div className={styles.bestForTodayFooter}>
                <span className={styles.bestForTodayRating}>⭐ {bestForToday.place.rating} Rating</span>
                <button className={styles.bestForTodayBtn}>Explore Pick →</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── DAILY SPOTLIGHT (WITH ESTIMATED INFO CHIPS) ─── */}
      {templeOfTheDay && (
        <section className={styles.cardHighlightSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>⭐ Daily Spotlight</h2>
          </div>
          <motion.div
            className={styles.curatedSpotlightCard}
            onClick={() => handlePlaceClick(templeOfTheDay.id)}
            whileHover={{ y: -4 }}
            style={{ border: '2px solid rgba(233, 128, 29, 0.15)' }}
          >
            <div className={styles.spotlightCardImg} style={{ backgroundImage: `url(${templeOfTheDay.image})` }} />
            <div className={styles.spotlightCardBody}>
              <span className={styles.spotlightCardTag}>MUST VISIT SPOT</span>
              <h3>{templeOfTheDay.name}</h3>
              <p className={styles.spotlightCardDesc}>{templeOfTheDay.description}</p>
              
              <div className={styles.templeChipsRow}>
                <span className={styles.templeChip}>⏱️ ~{templeOfTheDay.durationMins || 45} mins visit</span>
                <span className={styles.templeChip}>🕒 Closes at {templeOfTheDay.openTo > 12 ? (templeOfTheDay.openTo - 12) + ' PM' : templeOfTheDay.openTo + ' AM'}</span>
                <span className={styles.templeChip}>🎟️ {templeOfTheDay.entryFee || 'Free Entry'}</span>
              </div>

              <div className={styles.whyRecommendedBox} style={{ marginTop: 10 }}>
                <h4>Why should I visit?</h4>
                <div className={styles.whyBulletGrid}>
                  {getWhyReasons(templeOfTheDay).map((reason, idx) => (
                    <div key={idx} className={styles.whyBulletLine}>
                      <Check size={12} color="#10B981" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.spotlightFooter}>
                <span>⭐ {templeOfTheDay.rating || 4.8} Rating</span>
                <span className={styles.spotlightBtn}>Explore Temple →</span>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ─── STORY OF THE DAY CARD (RE-DESIGNED, NO OVERLAYS) ─── */}
      {dailyContent?.story && (
        <section className={styles.cardHighlightSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>📖 Story of the Day</h2>
          </div>
          <motion.div
            className={styles.cleanStoryCard}
            onClick={() => {
              localStorage.setItem('story_read_today', 'true');
              setCompletedSteps(prev => ({ ...prev, story: true }));
              logTelemetry('story_click', 'story', dailyContent.story.id);
              router.push('/learn/story-of-the-day');
            }}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.995 }}
          >
            <div className={styles.cleanStoryImg} style={{ backgroundImage: dailyContent.story.coverImage ? `url(${urlForImage(dailyContent.story.coverImage).url()})` : 'url(/assets/ai/hero_heritage.png)' }} />
            <div className={styles.cleanStoryBody}>
              <span className={styles.cleanStoryTag}>STORY OF THE DAY • 3 min read</span>
              <h3>{dailyContent.story.title}</h3>
              <p>{dailyContent.story.excerpt}</p>
              <div className={styles.cleanStoryFooter}>
                <span>Read Story →</span>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ─── DAILY QUIZ CARD (STATE-BASED, POSITIVE FEEDBACK) ─── */}
      {dailyContent?.quiz && (
        <section className={styles.cardHighlightSection} id="quiz-section">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>❓ Daily Quiz Challenge</h2>
          </div>
          <motion.div
            className={`${styles.cleanQuizCard} ${quizAnswered ? styles.cleanQuizCardCompleted : ''}`}
            whileHover={{ y: -4 }}
          >
            {!startQuiz && !quizAnswered ? (
              // Quiz Initial State
              <div className={styles.quizStateBox}>
                <span className={styles.quizTag}>TODAY'S TRIVIA</span>
                <h3>Test your knowledge of sacred temples and local heritage.</h3>
                <div className={styles.quizMetadataRow}>
                  <span>📋 5 Questions</span>
                  <span>⭐ 20 XP Reward</span>
                </div>
                <button className={styles.quizActionBtn} onClick={() => setStartQuiz(true)}>
                  Start Quiz →
                </button>
              </div>
            ) : !quizAnswered ? (
              // Quiz Active Options State
              <div className={styles.quizStateBox}>
                <span className={styles.quizTagActive}>QUESTION OF THE DAY</span>
                <h4 className={styles.quizQuestionTitle}>{dailyContent.quiz.question}</h4>
                <div className={styles.quizOptionsGrid}>
                  {dailyContent.quiz.options.map((opt: any) => (
                    <button
                      key={opt.id}
                      className={styles.quizOptionBtn}
                      onClick={() => {
                        handleQuizAnswer(opt.id, opt.id === dailyContent.quiz.correctAnswer);
                      }}
                    >
                      <strong style={{ marginRight: 6 }}>{opt.id}.</strong> {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Quiz Completed State
              <div className={styles.quizStateBox}>
                <div className={styles.quizCompletedHeader}>
                  <ShieldCheck size={20} color="#10B981" />
                  <span className={styles.quizCompletedTag}>DAILY QUIZ COMPLETED</span>
                </div>
                <h3>You Learned Something New Today ✨</h3>
                <p className={styles.quizCompletedFeedback}>
                  {selectedQuizOption === dailyContent.quiz.correctAnswer 
                    ? '🎉 Excellent work! You earned 20 XP.' 
                    : 'Good try! Review the historical details below to expand your knowledge.'}
                </p>
                <div className={styles.quizExplanationBox}>
                  <strong>Explanation:</strong> {dailyContent.quiz.explanation}
                </div>
                <button className={styles.quizActionBtnSecondary} onClick={() => setStartQuiz(true)}>
                  Review Today's Learning
                </button>
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* ─── FESTIVAL HIGHLIGHT ─── */}
      {dailyContent?.festival && (
        <section className={styles.cardHighlightSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🎉 Festival Highlight</h2>
          </div>
          <motion.div
            className={styles.cleanFestivalCard}
            onClick={() => router.push('/festivals')}
            whileHover={{ y: -4 }}
          >
            <div className={styles.festivalCardBody}>
              <span className={styles.festivalCardTag}>UPCOMING CELEBRATION</span>
              <h3>{dailyContent.festival.name}</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '6px 0 10px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: '#FFF3E0', color: '#E65100' }}>
                  👥 Expected: {dailyContent.festival.crowd_level}
                </span>
                {(() => {
                  const festDate = dailyContent.festival.date ? new Date(dailyContent.festival.date) : null;
                  if (!festDate) return null;
                  const daysLeft = Math.max(0, Math.ceil((festDate.getTime() - Date.now()) / 86400000));
                  return (
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: daysLeft === 0 ? '#E8F5E9' : '#EDE7F6', color: daysLeft === 0 ? '#2E7D32' : '#5E35B1' }}>
                      {daysLeft === 0 ? '🎊 Today!' : `⏳ ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                    </span>
                  );
                })()}
              </div>
              
              <div className={styles.whyRecommendedBox} style={{ background: '#FFF9F5' }}>
                <h4>Why should I visit?</h4>
                <div className={styles.whyBulletGrid}>
                  <div className={styles.whyBulletLine}>
                    <Check size={12} color="#10B981" />
                    <span>Witness ancient cultural heritage rituals</span>
                  </div>
                  <div className={styles.whyBulletLine}>
                    <Check size={12} color="#10B981" />
                    <span>Special prasadam distributions</span>
                  </div>
                </div>
              </div>

              <div className={styles.festivalFooter}>
                <span><Calendar size={12} /> {dailyContent.festival.date ? dailyContent.festival.date.split('T')[0] : 'Today'}</span>
                <span className={styles.festivalBtn}>View Ritual Schedule →</span>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ─── HIDDEN GEM OF THE DAY ─── */}
      {hiddenGem && (
        <section className={styles.cardHighlightSection} style={{ marginBottom: 40 }}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🌿 Hidden Gem</h2>
          </div>
          <motion.div
            className={styles.curatedSpotlightCard}
            onClick={() => handlePlaceClick(hiddenGem.id)}
            whileHover={{ y: -4 }}
          >
            <div className={styles.spotlightCardImg} style={{ backgroundImage: `url(${hiddenGem.image})` }} />
            <div className={styles.spotlightCardBody}>
              <span className={styles.spotlightCardTag} style={{ background: '#E5F3EB', color: '#2F6144' }}>OFF THE BEATEN PATH</span>
              <h3>{hiddenGem.name}</h3>
              <p className={styles.spotlightCardDesc}>{hiddenGem.description}</p>

              <div className={styles.templeChipsRow} style={{ marginBottom: '8px' }}>
                <span className={styles.templeChip}>🚶 ~{hiddenGem.durationMins || 20} mins</span>
                <span className={styles.templeChip}>🕒 Best: Morning</span>
                <span className={styles.templeChip}>🏷️ {hiddenGem.entryFee || 'Free Entry'}</span>
              </div>
              
              <div className={styles.whyRecommendedBox}>
                <h4>Why should I visit?</h4>
                <div className={styles.whyBulletGrid}>
                  {getWhyReasons(hiddenGem, true).map((reason, idx) => (
                    <div key={idx} className={styles.whyBulletLine}>
                      <Check size={12} color="#10B981" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.spotlightFooter}>
                <span>⭐ {hiddenGem.rating || 4.7} Rating</span>
                <span className={styles.spotlightBtn}>Explore →</span>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* ─── EXPLORE BEYOND TEMPLES SECTION ─── */}
      <section className={styles.interestsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🗺️ Explore Beyond Temples</h2>
        </div>
        <p className={styles.interestsSubtitle}>
          Discover Tirupati's hidden waterfalls, wildlife sanctuaries, historical forts, and local food.
        </p>
        <div className={styles.interestsGrid}>
          {[
            { name: 'Spiritual', icon: '🛕', desc: 'Ancient temples & shrines', color: '#FFF5F5', textColor: '#C53030' },
            { name: 'Nature', icon: '🌳', desc: 'Forests, wildlife & view points', color: '#F0FDF4', textColor: '#15803D' },
            { name: 'Water', icon: '🌊', desc: 'Sacred pools & waterfalls', color: '#EFF6FF', textColor: '#1D4ED8' },
            { name: 'Historical', icon: '🏛️', desc: 'Forts, palaces & museums', color: '#FEF3C7', textColor: '#B45309' },
            { name: 'Hidden', icon: '🌿', desc: 'Offbeat paths & quiet trails', color: '#F5F3FF', textColor: '#6D28D9' },
            { name: 'Food', icon: '🍽️', desc: 'Authentic local dining & prasadam', color: '#FFF7ED', textColor: '#C2410C' },
          ].map((cat, idx) => (
            <div 
              key={idx} 
              className={styles.interestCard}
              style={{ backgroundColor: cat.color }}
              onClick={() => router.push(`/explore?q=${cat.name}`)}
            >
              <div className={styles.interestIcon}>{cat.icon}</div>
              <div className={styles.interestInfo}>
                <h3 style={{ color: cat.textColor }}>{cat.name}</h3>
                <p>{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
