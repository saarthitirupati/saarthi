'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  MapPin, User, Users, Search, Heart, Landmark, Waves, Map as MapIcon,
  Calendar, Sparkles, Award, Check, Sunrise, Sun, Sunset, Moon, Camera, Leaf, Info, Footprints,
  Clock, Compass, ShieldCheck, ChevronRight, Bell, Ticket, Star, Zap, Calendar as CalendarDays, X, Car, Navigation, BookOpen,
  Menu, AlertTriangle
} from 'lucide-react';
import styles from './Home.module.css';
import { useTrip } from '@/components/TripContext';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';
import { PLACES as STATIC_PLACES } from '@/data/places';
import { calculateDrivingDistance, TIRUPATI_CENTER } from '@/utils/location';
import { urlForImage } from '@/sanity/lib/image';
import { useRealtimeStatus } from '@/lib/useRealtimeStatus';
import { getBestForToday } from '@/lib/contextEngine';
import Link from 'next/link';
import { CHECKLIST_ITEMS } from '@/data/knowledge';
import { useRealtimeAlerts } from '@/lib/useRealtimeAlerts';
import { Festival, FESTIVALS_2026 } from '@/data/festivals';
import { safeFetchJson } from '@/lib/safeFetch';
import { STORIES } from '@/data/stories';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { alerts } = useRealtimeAlerts();
  const [activePopupAlert, setActivePopupAlert] = useState<any>(null);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = JSON.parse(localStorage.getItem('saarthi_dismissed_alerts') || '[]');
      setDismissedAlertIds(dismissed);
    }
  }, []);

  const { userLocation, setLocationPermission, setUserLocation, togglePlace, savedPlaces, plannerInput, locationName = 'Tirupati', setLocationName } = useTrip();
  const [dailyContent, setDailyContent] = useState<any>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Explorer');
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState<boolean>(false);
  const [showFlashNotification, setShowFlashNotification] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>('');
  
  // Custom states for CPO experience
  const [startQuiz, setStartQuiz] = useState<boolean>(false);
  const [showCounters, setShowCounters] = useState<boolean>(false);
  const [showCompleteDarshan, setShowCompleteDarshan] = useState<boolean>(true);
  const [showPersonalizeBanner, setShowPersonalizeBanner] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<'Helpful' | 'Needs Work' | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  
  // Pilgrim Essentials home checklist state
  const [homeChecklist, setHomeChecklist] = useState<Record<string, boolean>>({});

  const handleToggleHomeCheck = (itemId: string, storageKey: string) => {
    const newState = !homeChecklist[itemId];
    setHomeChecklist(prev => ({ ...prev, [itemId]: newState }));
    localStorage.setItem(storageKey, String(newState));
  };

  const homeChecklistStats = useMemo(() => {
    const total = CHECKLIST_ITEMS.length;
    const checked = Object.values(homeChecklist).filter(Boolean).length;
    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
    return { total, checked, pct };
  }, [homeChecklist]);
  
  // Daily Progress Tracker checklist state
  const [completedSteps, setCompletedSteps] = useState<{
    story: boolean;
    quiz: boolean;
    visit: boolean;
  }>({ story: false, quiz: false, visit: false });


  // Smart search: keyword aliases route users to the right place
  const smartSearch = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const aliases: Record<string, string> = {
      phone: '/explore?q=Mobile+Deposit',
      mobile: '/explore?q=Mobile+Deposit',
      bags: '/explore?q=Lockers',
      locker: '/explore?q=Lockers',
      luggage: '/explore?q=Lockers',
      food: '/explore?q=Annaprasadam',
      annaprasadam: '/explore?q=Annaprasadam',
      meal: '/explore?q=Annaprasadam',
      queue: '/essentials',
      darshan: '/essentials',
      ssd: '/essentials',
      token: '/essentials',
      elderly: '/essentials',
      wheelchair: '/essentials',
      disabled: '/essentials',
      history: '/learn/story-of-the-day',
      story: '/learn/story-of-the-day',
      nature: '/explore?q=Nature',
      waterfall: '/explore?q=Nature',
      shopping: '/explore?q=Gandhi+Road',
      iskcon: '/place/iskcon',
      japali: '/place/japali-hanuman',
      zoo: '/place/tirupati-zoo',
    };
    const matched = Object.entries(aliases).find(([key]) => q.includes(key));
    router.push(matched ? matched[1] : `/explore?q=${encodeURIComponent(query.trim())}`);
  };

  const [cabRef, setCabRef] = useState<string | null>(null);

  // Popup Alert Trigger Logic
  useEffect(() => {
    if (!alerts || alerts.length === 0) return;
    
    const popupAlert = alerts.find(alert => {
      if (alert.popup_type !== 'Popup' && alert.popup_type !== 'Fullscreen' && alert.severity !== 'Critical') {
        return false;
      }
      
      if (dismissedAlertIds.includes(alert.id)) {
        return false;
      }
      
      if (alert.target_location !== 'All Users') {
        if (userLocation) {
          const lat = userLocation.lat;
          const lon = userLocation.lng;
          
          if (alert.target_location === 'Tirumala') {
            const isNearTirumala = Math.abs(lat - 13.6833) < 0.08 && Math.abs(lon - 79.3500) < 0.08;
            if (!isNearTirumala) return false;
          } else if (alert.target_location === 'Tirupati') {
            const isNearTirupati = Math.abs(lat - 13.6288) < 0.08 && Math.abs(lon - 79.4192) < 0.08;
            if (!isNearTirupati) return false;
          }
        } else {
          return false;
        }
      }
      
      return true;
    });

    if (popupAlert) {
      setActivePopupAlert(popupAlert);
    } else {
      setActivePopupAlert(null);
    }
  }, [alerts, userLocation, dismissedAlertIds]);

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

      // Load checklist state
      const savedChecklist: Record<string, boolean> = {};
      CHECKLIST_ITEMS.forEach(item => {
        savedChecklist[item.id] = localStorage.getItem(item.localStorageKey) === 'true';
      });
      setHomeChecklist(savedChecklist);
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
    fetch('/api/v1/weather')
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

  const formattedWaitTime = useMemo(() => {
    if (!liveStatus) return '2-3 hours';
    const val = liveStatus.waitTime;
    if (!val) return '2-3 hours';
    const clean = val.trim();
    if (/^\d+$/.test(clean)) {
      const num = parseInt(clean, 10);
      return `${num} ${num === 1 ? 'hour' : 'hours'}`;
    }
    return clean;
  }, [liveStatus]);

  const bestForToday = useMemo(() => {
    if (!places || !places.length) return null;
    const crowd = liveStatus?.crowdLevel || 'moderate';
    const weather = liveStatus?.weather || 'Pleasant, 24°C';
    return getBestForToday(places, crowd, weather, plannerInput);
  }, [places, liveStatus, plannerInput]);

  const tirumalaVerdict = useMemo(() => {
    if (!liveStatus) {
      return { 
        statusKey: 'low' as const,
        title: 'Best Time to Visit',
        bg: '#14532D',
        accent: '#22C55E',
        ctaText: 'Start Darshan',
        emotion: 'Great opportunity',
        recommendation: 'Perfect time for Darshan today.',
        bullets: [
          'Proceed to queue directly',
          'Fast SSD Token issue',
          'Perfect time for Darshan today.'
        ],
        currentWait: '30–45 mins'
      };
    }
    const level = liveStatus.crowdLevel;
    const weather = liveStatus.weather || '';
    const parking = liveStatus.accommodationStatus;
    const currentWait = formattedWaitTime;
    
    // Parse wait time hours
    let hours = 2; // Default fallback to low/green
    if (currentWait) {
      const matches = currentWait.match(/\d+/g);
      if (matches && matches.length > 0) {
        const numbers = matches.map(Number);
        hours = numbers.reduce((a: number, b: number) => a + b, 0) / numbers.length;
      } else {
        // Fallback to crowdLevel if no numbers are present
        if (level === 'very-high') hours = 12;
        else if (level === 'high') hours = 8;
        else if (level === 'moderate') hours = 4;
        else hours = 2;
      }
    }

    let statusKey: 'low' | 'moderate' | 'busy' | 'heavy' | 'extremely-heavy' = 'low';
    if (hours < 3) {
      statusKey = 'low';
    } else if (hours < 5) {
      statusKey = 'moderate';
    } else if (hours < 8) {
      statusKey = 'busy';
    } else if (hours < 12) {
      statusKey = 'heavy';
    } else {
      statusKey = 'extremely-heavy';
    }

    // Force extremely-heavy if parking is full
    if (parking === 'full') {
      statusKey = 'extremely-heavy';
    }

    let title = 'Best Time to Visit';
    let bg = '#14532D';
    let accent = '#22C55E';
    let ctaText = 'Start Darshan';
    let emotion = 'Great opportunity';
    let recommendation = 'Perfect time for Darshan today.';
    let bullets = [
      'Proceed to queue directly',
      'Fast SSD Token issue',
      'Perfect time for Darshan today.'
    ];

    if (statusKey === 'low') {
      title = 'Best Time to Visit';
      bg = '#14532D';
      accent = '#22C55E';
      ctaText = 'Start Darshan';
      emotion = 'Great opportunity';
      recommendation = 'Perfect time for Darshan today.';
      bullets = [
        'Proceed to queue directly',
        'Fast SSD Token issue',
        'Perfect time for Darshan today.'
      ];
    } else if (statusKey === 'moderate') {
      title = 'Good Time';
      bg = '#166534';
      accent = '#F59E0B';
      ctaText = 'View Details';
      emotion = 'Comfortable';
      recommendation = 'Recommended: Visit Sri Padmavathi Temple first.';
      bullets = [
        'Visit Sri Padmavathi Temple first',
        'Queue wait time is moderate',
        'Avoid peak temple slots'
      ];
    } else if (statusKey === 'busy') {
      title = 'Crowd Building';
      bg = '#B45309';
      accent = '#FBBF24';
      ctaText = 'Nearby Places';
      emotion = 'Plan';
      recommendation = 'Consider visiting nearby attractions first.';
      bullets = [
        'Consider visiting nearby attractions first',
        'Explore local parks / museums',
        'Re-check queue wait after 4 PM'
      ];
    } else if (statusKey === 'heavy') {
      title = 'Heavy Crowd';
      bg = '#C2410C';
      accent = '#FCA5A5';
      ctaText = 'Explore Nearby';
      emotion = 'Delay recommended';
      recommendation = 'Explore Tirupati and return after 5 PM.';
      bullets = [
        'Explore Tirupati and return after 5 PM',
        'Visit Kapila Theertham first',
        'Keep hydrated if joining queue'
      ];
    } else {
      title = 'Live Alert';
      bg = '#991B1B';
      accent = '#F87171';
      ctaText = 'See Alternatives';
      emotion = 'Avoid';
      recommendation = 'Avoid joining the queue now.';
      bullets = [
        'Avoid joining the queue now',
        'Visit Padmavathi Temple',
        'Visit ISKCON',
        'Visit Kapila Theertham',
        'Come back after 7 PM'
      ];
    }

    return { statusKey, title, bg, accent, ctaText, emotion, recommendation, bullets, currentWait };
  }, [liveStatus, formattedWaitTime]);

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

  async function logTelemetry(eventType: string, entityType?: string, entityId?: string, metadata?: any) {
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
      await fetch('/api/v1/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleFeedbackSubmit = () => {
    if (!selectedRating && !feedbackText.trim()) return;
    logTelemetry('passenger_feedback', 'cab', cabRef || 'general', { 
      rating: selectedRating || 'general',
      text: feedbackText.trim() 
    });
    setFeedbackSent(true);
    setFeedbackText('');
    setSelectedRating(null);
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

  const getGreetingPrefix = () => {
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 12) return 'Good Morning';
    if (hr >= 12 && hr < 17) return 'Good Afternoon';
    if (hr >= 17 && hr < 21) return 'Good Evening';
    return 'Good Night';
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    const name = userName || 'Traveler';
    if (hr >= 5 && hr < 12) return `Good Morning, ${name}`;
    if (hr >= 12 && hr < 17) return `Good Afternoon, ${name}`;
    if (hr >= 17 && hr < 21) return `Good Evening, ${name}`;
    return `Good Night, ${name}`;
  };

  const handleWelcomeSubmit = () => {
    const finalName = tempName.trim();
    if (!finalName) return;
    localStorage.setItem('saarthi_user_name', finalName);
    setUserName(finalName);
    setShowWelcomeOverlay(false);
  };

  useEffect(() => {
    setMounted(true);
    logTelemetry('home_view');

    const storedName = localStorage.getItem('saarthi_user_name');
    if (storedName) {
      setUserName(storedName);
    } else {
      setShowWelcomeOverlay(true);
    }

    const flashTimer = setTimeout(() => {
      setShowFlashNotification(true);
    }, 1500);

    const dismissTimer = setTimeout(() => {
      setShowFlashNotification(false);
    }, 8500);

    // Initialize progress tracker state from localStorage
    const storyRead = localStorage.getItem('story_read_today') === 'true';
    const quizDone = localStorage.getItem('quiz_answered_today') === 'true';
    const visitDone = localStorage.getItem('temple_visited_today') === 'true';
    setCompletedSteps({ story: storyRead, quiz: quizDone, visit: visitDone });

    fetch('/api/v1/content/daily')
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

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(dismissTimer);
    };
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

  const nearbyPlacesList = useMemo(() => {
    if (places.length === 0) return [];
    
    // exclude temple of the day so we don't repeat
    const excludeId = templeOfTheDay?.id;
    const effLoc = userLocation || TIRUPATI_CENTER;
    
    return places
      .filter(p => p.id !== excludeId && p.coordinates)
      .map(p => {
        const isTirumala = String(p.location || '').toLowerCase().includes('tirumala') || String(p.category || '').toLowerCase().includes('tirumala');
        const dist = calculateDrivingDistance(effLoc.lat, effLoc.lng, p.coordinates!.lat, p.coordinates!.lng, isTirumala);
        return { place: p, dist };
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 5); // top 5
  }, [places, userLocation, templeOfTheDay]);

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
    import('@/lib/location').then(({ detectCoordinates, getIPLocation, TIRUPATI_CENTER }) => {
      detectCoordinates(
        (coords, source) => {
          setUserLocation(coords);
          setLocationPermission('granted');
          if (source === 'ip') {
            getIPLocation().then(({ city }) => {
              if (city) setLocationName(city);
            }).catch(() => {});
          }
        },
        () => {
          setUserLocation(TIRUPATI_CENTER);
          setLocationPermission('denied');
          alert("Location access unavailable. Defaulting to Tirupati Center.");
        }
      );
    }).catch(() => {});
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
      items.push({ 
        icon: <Bell size={13} style={{ color: '#EF4444' }} />, 
        text: liveStatus.notice, 
        color: '#EF4444' 
      });
    }
    
    const crowdLabel = liveStatus.crowdLevel === 'low' ? 'Normal crowd' : liveStatus.crowdLevel === 'moderate' ? 'Moderate crowd' : liveStatus.crowdLevel === 'high' ? 'Heavy crowd' : 'Extremely heavy crowd';
    items.push({ 
      icon: <Users size={13} style={{ color: getCrowdStatus(liveStatus.crowdLevel).color }} />, 
      text: `${crowdLabel} today — about ${formattedWaitTime} wait`, 
      color: getCrowdStatus(liveStatus.crowdLevel).color 
    });
    
    const weatherShort = liveStatus.weather.replace(/,\s*/, ', ');
    items.push({ 
      icon: <Sun size={13} style={{ color: '#F59E0B' }} />, 
      text: `${weatherShort} on the hills`, 
      color: '#3B82F6' 
    });
    
    const ladduLabel = liveStatus.ladduAvailability === 'available' ? 'Laddu prasadam available' : liveStatus.ladduAvailability === 'limited' ? 'Laddu prasadam running low' : 'Laddu prasadam sold out';
    items.push({ 
      icon: <Sparkles size={13} style={{ color: getParkingStatus(liveStatus.ladduAvailability).color }} />, 
      text: ladduLabel, 
      color: getParkingStatus(liveStatus.ladduAvailability).color 
    });
    
    const parkingLabel = liveStatus.accommodationStatus === 'available' ? 'Parking available on Tirumala road' : liveStatus.accommodationStatus === 'limited' ? 'Parking filling up fast' : 'Parking full — consider early departure';
    items.push({ 
      icon: <Car size={13} style={{ color: getParkingStatus(liveStatus.accommodationStatus).color }} />, 
      text: parkingLabel, 
      color: getParkingStatus(liveStatus.accommodationStatus).color 
    });
    
    return items;
  };

  const fmtTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch { return ''; }
  };

  const formattedTodayStr = useMemo(() => {
    const dateObj = new Date();
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString('en-IN', { month: 'short' });
    return `Today • ${day} ${month}`;
  }, []);

  const [liveFestivals, setLiveFestivals] = useState<Festival[]>([]);

  useEffect(() => {
    safeFetchJson<any>('/api/v1/festivals?all=1').then((d: any) => {
      if (d && Array.isArray(d.data) && d.data.length > 0) {
        setLiveFestivals(d.data);
      }
    });
  }, []);

  const todayFestival = useMemo(() => {
    const rawList = liveFestivals.length > 0 ? liveFestivals : FESTIVALS_2026;
    const list = rawList.map((f: any) => ({
      ...f,
      name: f.name || f.title || 'Guru Purnima',
      date: (f.date || f.date_start || '').split('T')[0],
      location: f.location || f.place_name || 'Sri Kapileswara Swamy Temple',
      recommendedTime: f.recommendedTime || f.recommended_time || '5:30 PM - 9:00 PM',
      placeId: f.placeId || f.place_id,
      coverImage: f.coverImage || f.cover_image
    }));

    const todayStr = new Date().toISOString().split('T')[0];
    
    // 1. Exact match for today
    const exactMatch = list.find(f => f.date === todayStr);
    if (exactMatch) return { ...exactMatch, isToday: true };

    // 2. Next upcoming festival
    const upcoming = list.filter(f => f.date >= todayStr).sort((a: any, b: any) => a.date.localeCompare(b.date))[0];
    if (upcoming) return { ...upcoming, isToday: upcoming.date === todayStr };

    // 3. Fallback to Guru Purnima or first in list
    const fallback = list.find(f => f.id === 'guru-purnima') || list[0];
    return fallback ? { ...fallback, isToday: false } : null;
  }, [liveFestivals]);

  const formattedBadgeDate = useMemo(() => {
    if (!todayFestival) return 'UPCOMING';
    if ((todayFestival as any).isToday) return 'TODAY';
    if (!todayFestival.date) return 'UPCOMING';
    try {
      const parts = todayFestival.date.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }).toUpperCase();
      }
    } catch {}
    return todayFestival.date;
  }, [todayFestival]);

  const festivalImage = useMemo(() => {
    if (!todayFestival) return '/assets/temples/govindaraja.png';
    
    if (todayFestival.placeId) {
      const match = places.find((p: any) => p.id === todayFestival.placeId);
      if (match?.image) return match.image;
    }

    if (todayFestival.coverImage) return todayFestival.coverImage;
    
    const loc = (todayFestival.location || '').toLowerCase();
    const name = (todayFestival.name || '').toLowerCase();
    
    if (loc.includes('kapileswara') || loc.includes('kapila') || name.includes('kapila')) {
      return '/assets/temples/kapila-theertham.png';
    }
    if (loc.includes('padmavathi') || loc.includes('tiruchanur') || name.includes('padmavathi')) {
      return '/assets/temples/padmavathi.png';
    }
    if (loc.includes('govindaraja') || name.includes('govindaraja')) {
      return '/assets/temples/govindaraja.png';
    }
    if (loc === 'tirumala' || loc.includes('venkateswara') || name.includes('srivari') || name.includes('brahmotsavam')) {
      return '/assets/temples/venkateswara.png';
    }
    
    const matchedPlace = places.find((p: any) => 
      loc.includes(p.name.toLowerCase()) || 
      p.name.toLowerCase().includes(loc)
    );
    return matchedPlace?.image || '/assets/temples/govindaraja.png';
  }, [todayFestival, places]);

  const weatherTemp = useMemo(() => {
    if (!liveStatus?.weather) return '27°C';
    const match = liveStatus.weather.match(/(\d+°C|\d+)/);
    if (match) {
      return match[0].includes('°C') ? match[0] : `${match[0]}°C`;
    }
    return '27°C';
  }, [liveStatus]);

  const featuredPlace = useMemo(() => {
    const kapila = places.find(p => p.id === 'kapila-theertham' || p.id === 'kapila');
    return kapila || templeOfTheDay || places[0];
  }, [places, templeOfTheDay]);

  const featuredPlaceDistance = useMemo(() => {
    if (!featuredPlace?.coordinates) {
      return '12 mins away';
    }
    if (!userLocation) {
      return '12 mins away';
    }

    const isTirumalaSpot = featuredPlace.id === 'srivari-temple' || featuredPlace.location?.toLowerCase().includes('tirumala');
    const distKm = calculateDrivingDistance(
      userLocation.lat,
      userLocation.lng,
      featuredPlace.coordinates.lat,
      featuredPlace.coordinates.lng,
      isTirumalaSpot
    );

    if (distKm < 1.5) {
      const walkMins = Math.max(1, Math.round(distKm * 12));
      return `${walkMins} min walk (${distKm} km)`;
    } else {
      const driveMins = Math.max(1, Math.round(distKm * 1.8));
      return `${driveMins} mins away (${distKm} km)`;
    }
  }, [featuredPlace, userLocation]);

  const featuredPlaceStatusText = useMemo(() => {
    if (!liveStatus || !bestForToday) {
      return 'Pleasant weather and low crowd. Perfect time to visit.';
    }
    const crowd = liveStatus.crowdLevel === 'low' ? 'low crowd' : liveStatus.crowdLevel === 'moderate' ? 'moderate crowd' : 'heavy crowd';
    const weatherText = liveStatus.weather ? liveStatus.weather.split(',')[0].toLowerCase() : 'pleasant weather';
    const suggestion = bestForToday.shouldVisitNow 
      ? 'Perfect time to visit.' 
      : `Delay suggested: ${bestForToday.shouldVisitVerdict.toLowerCase()}.`;
    return `${weatherText.charAt(0).toUpperCase() + weatherText.slice(1)} weather and ${crowd}. ${suggestion}`;
  }, [liveStatus, bestForToday]);

  const activeAlertsCount = useMemo(() => {
    if (!alerts) return 0;
    return alerts.filter(a => !dismissedAlertIds.includes(a.id)).length;
  }, [alerts, dismissedAlertIds]);

  const todayStory = useMemo(() => {
    let storyData = dailyContent?.learn?.storyOfTheDay || dailyContent?.story;
    if (!storyData && STORIES.length > 0) {
      const day = typeof window !== 'undefined' ? new Date().getDate() : 1;
      storyData = STORIES[day % STORIES.length];
    }
    return storyData;
  }, [dailyContent]);

  if (!mounted) return null;

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: '#FAF8F4', position: 'relative', fontFamily: 'var(--font-heading), var(--font-body), sans-serif' }}>

      {/* ═══════════════════════════════════════════════════
          1. APP BAR
         ═══════════════════════════════════════════════════ */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 16px 14px 16px',
        background: '#FFFFFF',
        borderBottom: '1px solid #ECE9E3',
        gap: '12px'
      }}>
        {/* Top Row: Menu - Logo Stack - Bell */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={() => setIsLocationModalOpen(true)} 
            style={{ 
              background: 'rgba(51, 65, 85, 0.05)', 
              border: 'none', 
              color: '#334155', 
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer' 
            }}
          >
            <Menu size={20} />
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#14532D', letterSpacing: '-0.03em', lineHeight: 1.2 }}>Saarthi</span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Tirupati Guide</span>
          </div>

          <Link href="/alerts" style={{ 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            position: 'relative',
            background: 'rgba(51, 65, 85, 0.05)',
            width: '38px',
            height: '38px',
            borderRadius: '12px'
          }}>
            <Bell size={18} color="#334155" />
            {activeAlertsCount > 0 && (
              <span style={{
                position: 'absolute', top: '-2px', right: '-2px',
                background: '#EF4444', color: '#FFFFFF', fontSize: '9px', fontWeight: 900,
                borderRadius: '50%', width: '15px', height: '15px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 2px #FFFFFF'
              }}>
                {activeAlertsCount}
              </span>
            )}
          </Link>
        </div>

        {/* Bottom Row: Location Selector & Date / Weather Context */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <button 
            onClick={() => setIsLocationModalOpen(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: '#FFF6E8', 
              border: '1px solid rgba(196, 122, 0, 0.1)', 
              borderRadius: '16px',
              padding: '5px 11px',
              cursor: 'pointer' 
            }}
          >
            <MapPin size={13} color="#C47A00" />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#C47A00' }}>{locationName || 'Tirupati'}</span>
            <span style={{ fontSize: '9px', color: '#C47A00' }}>▼</span>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
            <span>{formattedTodayStr}</span>
            <span style={{ color: '#E2E8F0' }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sun size={13} color="#F59E0B" />
              <span>{weatherTemp}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          2. GREETING
         ═══════════════════════════════════════════════════ */}
      <div style={{ padding: '20px 16px 12px 16px' }}>
        <h2 style={{ 
          fontSize: '22px', 
          fontWeight: 900, 
          color: '#0F172A', 
          margin: 0, 
          letterSpacing: '-0.02em',
          lineHeight: 1.25
        }}>
          {getGreetingPrefix()}, {userName || 'Pilgrim'}
        </h2>
        <p style={{ fontSize: '13px', fontWeight: 500, color: '#64748B', margin: '4px 0 0 0' }}>
          {liveStatus?.crowdLevel === 'low' ? "Good time to be here — crowd is light today." : liveStatus?.crowdLevel === 'very-high' ? "It\'s very busy right now. Plan carefully." : "Here's what's happening on the hill right now."}
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════
          3. RIGHT NOW (HERO CARD) - SIGNATURE FEATURE
         ═══════════════════════════════════════════════════ */}
      <div style={{ margin: '4px 16px 18px 16px' }}>
        <div style={{
          background: tirumalaVerdict.bg,
          borderRadius: '24px',
          boxShadow: `0 12px 32px ${tirumalaVerdict.bg}22`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Top Gradient Content Block */}
          <div style={{ padding: '22px 20px 18px 20px', position: 'relative' }}>
            {/* Header Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: tirumalaVerdict.accent, boxShadow: `0 0 8px ${tirumalaVerdict.accent}` }} />
                <span style={{ 
                  fontSize: '9.5px', 
                  fontWeight: 900, 
                  color: '#FFFFFF', 
                  background: 'rgba(255, 255, 255, 0.16)',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  letterSpacing: '1.2px', 
                  textTransform: 'uppercase' 
                }}>
                  {tirumalaVerdict.title}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Live status</span>
            </div>

            {/* Live Crowd Title & Sub */}
            <div style={{ marginBottom: '20px' }}>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 900, 
                color: '#FFFFFF', 
                margin: 0,
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>{tirumalaVerdict.statusKey === 'extremely-heavy' ? 'Extremely Heavy Crowd' : tirumalaVerdict.statusKey === 'heavy' ? 'Heavy Crowd' : tirumalaVerdict.statusKey === 'busy' ? 'Busy Today' : tirumalaVerdict.statusKey === 'moderate' ? 'Moderate Crowd' : 'Low Crowd'}</span>
                <Users size={20} color={tirumalaVerdict.accent} />
              </h1>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '4px', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                {tirumalaVerdict.statusKey === 'extremely-heavy' ? 'Avoid joining the queue now. Explore alternatives.' : <>Current crowd conditions at <strong style={{ color: '#FFFFFF' }}>Tirumala hill temple</strong>.</>}
              </p>
              <p style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.4)', margin: '6px 0 0 0', fontStyle: 'italic' }}>
                ⚠ Estimates based on limited data — verify at TTD counters
              </p>
            </div>

            {/* 4-Column Metrics Horizontal Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '8px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: '14px'
            }}>
              {[
                { label: 'Darshan Wait', val: tirumalaVerdict.currentWait },
                { label: 'SSD Tokens', val: liveStatus.ssdTokenStatus === 'issuing' ? 'Available' : 'Closed' },
                { label: 'Parking', val: liveStatus.accommodationStatus === 'available' ? 'Available' : 'Limited' },
                { label: 'Alerts', val: activeAlertsCount > 0 ? `${activeAlertsCount} Active` : 'None' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 800 }}>
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Value Recommendation Block (White card) */}
          <div style={{
            background: '#FFFFFF',
            borderTop: '1px solid #ECE9E3',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  background: `${tirumalaVerdict.bg}12`, 
                  color: tirumalaVerdict.bg,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Star size={16} fill={tirumalaVerdict.bg} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: tirumalaVerdict.bg, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
                    Recommended Next Step
                  </span>
                  <span style={{ fontSize: '14.5px', fontWeight: 900, color: '#111827', display: 'block', marginTop: '2px' }}>
                    {tirumalaVerdict.recommendation}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => {
                  if (tirumalaVerdict.statusKey === 'extremely-heavy') {
                    router.push('/explore?q=Alternative');
                  } else if (tirumalaVerdict.statusKey === 'heavy') {
                    router.push('/explore?q=Tirupati');
                  } else {
                    router.push(bestForToday ? `/place/${bestForToday.place.id}` : '/explore');
                  }
                }}
                style={{
                  background: tirumalaVerdict.bg,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 14px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: `0 4px 12px ${tirumalaVerdict.bg}22`,
                  flexShrink: 0
                }}
              >
                <span>{tirumalaVerdict.ctaText}</span>
                <span>→</span>
              </button>
            </div>

            {/* Next Steps Checkboxes */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '6px',
              borderTop: '1px solid #ECE9E3',
              paddingTop: '10px'
            }}>
              {tirumalaVerdict.bullets.map((bullet, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: 600, color: '#64748B' }}>
                  <span style={{ color: tirumalaVerdict.statusKey === 'extremely-heavy' ? '#DC2626' : '#16A34A', fontSize: '14px', lineHeight: 1 }}>✓</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          4. LIVE UPDATES
         ═══════════════════════════════════════════════════ */}
      <div style={{ margin: '14px 0 16px 0' }}>
        <div style={{ padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Right now on the hill
          </h3>
          <Link href="/live" style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F5132', textDecoration: 'none' }}>
            View All &gt;
          </Link>
        </div>

        {/* Scrollable Container */}
        <div 
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            padding: '4px 16px 10px 16px',
            scrollbarWidth: 'none'
          }}
          className="no-scrollbar"
        >
          {[
            { 
              label: 'Darshan Wait', 
              val: tirumalaVerdict.currentWait, 
              icon: Clock, 
              iconColor: '#334155',
              badge: true,
              badgeBg: tirumalaVerdict.statusKey === 'low' ? '#DCFCE7' : tirumalaVerdict.statusKey === 'moderate' ? '#FEF3C7' : tirumalaVerdict.statusKey === 'busy' ? '#FFEDD5' : '#FEE2E2',
              badgeTextColor: tirumalaVerdict.statusKey === 'low' ? '#166534' : tirumalaVerdict.statusKey === 'moderate' ? '#B45309' : tirumalaVerdict.statusKey === 'busy' ? '#C2410C' : '#DC2626'
            },
            { 
              label: 'SSD Tokens', 
              val: liveStatus.ssdTokenStatus === 'issuing' ? 'Available' : 'Closed', 
              icon: Ticket, 
              iconColor: '#334155',
              badge: true,
              badgeBg: liveStatus.ssdTokenStatus === 'issuing' ? '#DCFCE7' : '#FEE2E2',
              badgeTextColor: liveStatus.ssdTokenStatus === 'issuing' ? '#166534' : '#DC2626'
            },
            { 
              label: 'Parking', 
              val: liveStatus.accommodationStatus === 'available' ? 'Available' : 'Limited', 
              icon: Car, 
              iconColor: '#16A34A',
              badge: false
            },
            { 
              label: 'Weather', 
              val: weatherTemp, 
              icon: Sun, 
              iconColor: '#EA580C',
              badge: false
            },
            { 
              label: 'Alerts', 
              val: activeAlertsCount > 0 ? `${activeAlertsCount} Active` : 'None', 
              icon: AlertTriangle, 
              iconColor: activeAlertsCount > 0 ? '#DC2626' : '#64748B', 
              badge: activeAlertsCount > 0,
              badgeBg: '#FEE2E2',
              badgeTextColor: '#DC2626'
            },
            { 
              label: 'Laddu', 
              val: liveStatus.ladduAvailability === 'available' ? 'Available' : liveStatus.ladduAvailability === 'limited' ? 'Limited' : 'Sold Out', 
              icon: Sparkles, 
              iconColor: '#D97706',
              badge: liveStatus.ladduAvailability !== 'available',
              badgeBg: liveStatus.ladduAvailability === 'limited' ? '#FEF3C7' : '#FEE2E2',
              badgeTextColor: liveStatus.ladduAvailability === 'limited' ? '#B45309' : '#DC2626'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                onClick={() => router.push('/live')}
                style={{
                  flex: '0 0 115px',
                  background: '#FFFFFF',
                  border: '1px solid #ECE9E3',
                  borderRadius: '16px',
                  padding: '14px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                  transition: 'all 0.2s'
                }}
              >
                {/* Circular Icon Wrapper */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#FAF8F4',
                  border: '1px solid #ECE9E3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.iconColor
                }}>
                  <Icon size={16} />
                </div>
                {/* Text Block */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                  {item.badge ? (
                    <span style={{ 
                      fontSize: '10.5px', 
                      fontWeight: 800, 
                      color: item.badgeTextColor,
                      background: item.badgeBg,
                      borderRadius: '8px',
                      padding: '2px 8px',
                      whiteSpace: 'nowrap',
                      display: 'inline-block'
                    }}>
                      {item.val}
                    </span>
                  ) : (
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: 900, 
                      color: '#111827',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '95px'
                    }}>
                      {item.val}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          SSD TOKEN CARD
          ═══════════════════════════════════════════════════ */}
      <div style={{ padding: '0 16px 4px 16px' }}>
        <div
          onClick={() => router.push('/live')}
          style={{
            background: '#FFFFFF',
            border: '1px solid #ECE9E3',
            borderRadius: '20px',
            padding: '16px 18px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Ticket size={16} color="#7c3aed" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>SSD Token</span>
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '20px',
              background: liveStatus.ssdTokenStatus === 'issuing' ? '#DCFCE7' : liveStatus.ssdTokenStatus === 'paused' ? '#FEF3C7' : '#FEE2E2',
              color: liveStatus.ssdTokenStatus === 'issuing' ? '#166534' : liveStatus.ssdTokenStatus === 'paused' ? '#B45309' : '#DC2626',
            }}>
              {liveStatus.ssdTokenStatus === 'issuing' ? 'Issuing Now' : liveStatus.ssdTokenStatus === 'paused' ? 'Paused' : 'Closed for Day'}
            </span>
          </div>

          {/* DYNAMIC ADMIN ISSUING TIME BOX */}
          <div style={{
            background: liveStatus.ssdTokenStatus === 'issuing' ? '#F0FDF4' : liveStatus.ssdTokenStatus === 'paused' ? '#FFFBEB' : '#FEF2F2',
            border: `1px solid ${liveStatus.ssdTokenStatus === 'issuing' ? '#BBF7D0' : liveStatus.ssdTokenStatus === 'paused' ? '#FDE68A' : '#FECACA'}`,
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={16} color={liveStatus.ssdTokenStatus === 'issuing' ? '#16A34A' : liveStatus.ssdTokenStatus === 'paused' ? '#D97706' : '#DC2626'} />
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#64748B', display: 'block' }}>
                  Next Release / Issuing Time
                </span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: liveStatus.ssdTokenStatus === 'issuing' ? '#166534' : liveStatus.ssdTokenStatus === 'paused' ? '#B45309' : '#991B1B' }}>
                  {liveStatus.ssdNextTokenTime ? liveStatus.ssdNextTokenTime : (liveStatus.ssdTokenStatus === 'issuing' ? 'Tokens Being Issued Now' : 'Closed for Today')}
                </span>
              </div>
            </div>
            {liveStatus.ssdNotice && (
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#1E293B',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '3px 8px',
                borderRadius: '6px',
                maxWidth: '130px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {liveStatus.ssdNotice}
              </span>
            )}
          </div>

          {/* Timing subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#57534e', fontWeight: 500 }}>
              {liveStatus.ssdTokenStatus === 'issuing'
                ? 'Tokens being issued — collect at counters below'
                : liveStatus.ssdNextTokenTime
                ? `Next batch: ${liveStatus.ssdNextTokenTime}`
                : 'No more tokens today — come back tomorrow at 3 AM'}
            </span>
          </div>

          {/* Counter locations */}
          {liveStatus.ssdCounters && liveStatus.ssdCounters.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #f5f5f4', paddingTop: '10px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Collection Centres
              </span>
              {liveStatus.ssdCounters.map((c: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <MapPin size={11} color="#7c3aed" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#1c1917', display: 'block' }}>{c.name}</span>
                    <span style={{ fontSize: '11px', color: '#78716c', lineHeight: 1.4 }}>{c.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Daily timing guide */}
          {liveStatus.ssdTimingsGuide && (
            <div style={{ borderTop: '1px solid #f5f5f4', paddingTop: '10px', marginTop: '10px', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
              <Clock size={11} color="#a8a29e" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: '#a8a29e', lineHeight: 1.5 }}>
                {liveStatus.ssdTimingsGuide}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          5. QUICK ACTIONS (2x2 GRID)
         ═══════════════════════════════════════════════════ */}
      <div style={{ margin: '14px 16px 20px 16px' }}>
        <div style={{ marginBottom: '10px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Where would you like to go?
          </h3>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '12px' 
        }}>
          {[
            { label: 'Live', sub: 'Real-time info', icon: Zap, bg: '#ECFDF5', color: '#16A34A', href: '/live' },
            { label: 'Explore', sub: 'Places to visit', icon: Compass, bg: '#EFF6FF', color: '#2563EB', href: '/explore' },
            { label: 'Essentials', sub: 'Before you go', icon: ShieldCheck, bg: '#FFF7ED', color: '#EA580C', href: '/essentials' },
            { label: 'Stories', sub: 'Spiritual & cultural', icon: BookOpen, bg: '#F5F3FF', color: '#7C3AED', href: '/learn/story-of-the-day' }
          ].map((item) => {
            const ActionIcon = item.icon;
            return (
              <Link 
                key={item.label} 
                href={item.href} 
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #ECE9E3',
                  borderRadius: '20px',
                  padding: '16px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                {/* Icon Circle */}
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color,
                  flexShrink: 0
                }}>
                  <ActionIcon size={18} />
                </div>
                {/* Labels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>{item.label}</span>
                  <span style={{ fontSize: '10px', fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>{item.sub}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          6. FEATURED PLACE
         ═══════════════════════════════════════════════════ */}
      {featuredPlace && (
        <div style={{ margin: '14px 16px 20px 16px' }}>
          <div style={{ marginBottom: '10px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Worth visiting today
            </h3>
          </div>

          <div style={{
            background: '#FFFFFF',
            border: '1px solid #ECE9E3',
            borderRadius: '24px',
            padding: '16px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.01)'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{
                width: '90px', 
                height: '90px', 
                borderRadius: '16px', 
                flexShrink: 0,
                backgroundImage: `url(${featuredPlace.image || '/assets/temples/kapila-theertham.png'})`,
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                backgroundColor: '#F1F5F9'
              }} />
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 900, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {featuredPlace.name}
                  </h4>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: '#16A34A',
                    color: '#FFFFFF',
                    fontSize: '8px',
                    fontWeight: 800,
                    marginLeft: '6px',
                    flexShrink: 0
                  }}>✓</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748B', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#F59E0B', fontWeight: 800 }}>★ {featuredPlace.rating} ({featuredPlace.reviewCount >= 1000 ? `${(featuredPlace.reviewCount / 1000).toFixed(1)}K` : featuredPlace.reviewCount || '1.2K'})</span>
                  <span style={{ color: '#E2E8F0' }}>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={12} color="#64748B" />
                    <span>{featuredPlaceDistance}</span>
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: '#64748B', margin: '6px 0 0 0', lineHeight: 1.4 }}>
                  {featuredPlaceStatusText}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button 
                    onClick={() => handlePlaceClick(featuredPlace.id)}
                    style={{
                      background: '#14532D',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '16px',
                      padding: '6px 14px',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 10px rgba(20, 83, 45, 0.1)'
                    }}
                  >
                    Explore Place &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          NEARBY PLACES
         ═══════════════════════════════════════════════════ */}
      {nearbyPlacesList.length > 0 && (
        <div style={{ margin: '24px 0' }}>
          <div style={{ marginBottom: '12px', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Places near you
            </h3>
            <span style={{ fontSize: '12px', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Navigation size={12} /> Auto-detected
            </span>
          </div>
          <div style={{ display: 'flex', overflowX: 'auto', padding: '0 16px 8px 16px', gap: '12px', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className={styles.hideScrollbar}>
            {nearbyPlacesList.map(({ place, dist }) => (
              <div 
                key={place.id}
                onClick={() => handlePlaceClick(place.id)}
                style={{
                  width: '140px',
                  flexShrink: 0,
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  border: '1px solid #F1F5F9',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '110px',
                  backgroundImage: `url(${place.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    background: 'rgba(255,255,255,0.95)',
                    padding: '3px 6px',
                    borderRadius: '8px',
                    color: '#0F5132',
                    fontSize: '10px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <MapPin size={10} /> {dist.toFixed(1)} km
                  </div>
                </div>
                <div style={{ padding: '10px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {place.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#64748B' }}>
                    <Star size={11} fill="#F59E0B" color="#F59E0B" />
                    <span style={{ fontWeight: 600 }}>{place.rating || 4.8}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          7. TODAY'S FESTIVAL
         ═══════════════════════════════════════════════════ */}
      {todayFestival && (
        <div style={{ margin: '14px 16px 20px 16px' }}>
          <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              {(todayFestival as any).isToday ? "Today's festival" : "Upcoming festival"}
            </h3>
            <Link href="/festivals" style={{ fontSize: '11px', fontWeight: 700, color: '#D97706', textDecoration: 'none' }}>
              View All Festivals &rarr;
            </Link>
          </div>

          <Link 
            href={todayFestival.placeId ? `/place/${todayFestival.placeId}` : `/festivals/${todayFestival.slug || todayFestival.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{
              background: '#FFF8E7',
              border: '1px solid #FBBF24',
              borderRadius: '24px',
              padding: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.01)',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                flexShrink: 0,
                backgroundImage: `url(${festivalImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#FDEBB5'
              }} />
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 900, color: '#78350F', margin: 0 }}>
                    {todayFestival.name}
                  </h4>
                  <span style={{ 
                    fontSize: '9px', 
                    fontWeight: 900, 
                    color: '#FFFFFF', 
                    background: (todayFestival as any).isToday ? '#D97706' : '#2563EB',
                    borderRadius: '6px',
                    padding: '2px 6px',
                    textTransform: 'uppercase'
                  }}>
                    {formattedBadgeDate}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', fontSize: '12px', color: '#78350F', opacity: 0.85 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} color="#78350F" />
                    <span>Starts at {(todayFestival.recommendedTime || (todayFestival as any).recommended_time || '5:30 PM').split(' - ')[0]}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="#78350F" />
                    <span>{todayFestival.location || 'Sri Kapileswara Swamy Temple'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#D97706', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    View Recommended Temple &gt;
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          8. STORY OF THE DAY
         ═══════════════════════════════════════════════════ */}
      <div style={{ margin: '14px 16px 20px 16px' }}>
        <div style={{ marginBottom: '10px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Today's story
          </h3>
        </div>

        <div style={{
          background: '#FFFCF2',
          border: '1px solid #E7D8B8',
          borderRadius: '24px',
          padding: '16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.01)',
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            flexShrink: 0,
            backgroundImage: `url(${todayStory?.image || '/assets/temples/swami-pushkarini.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#F1F5F9'
          }} />
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#14532D', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {todayStory?.subtitle || 'Did You Know?'}
            </span>
            <h4 style={{ fontSize: '14.5px', fontWeight: 900, color: '#111827', margin: '3px 0 4px 0', lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {todayStory?.title || 'Why is Tirumala called the Seven Hills?'}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748B' }}>
              <Clock size={12} color="#64748B" />
              <span>{todayStory?.readTime || '3 min read'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <Link href="/learn/story-of-the-day" style={{ fontSize: '11.5px', fontWeight: 800, color: '#14532D', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px' }}>
                Read Story &gt;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          9. NEARBY PLACES
         ═══════════════════════════════════════════════════ */}
      <div style={{ margin: '8px 0 24px 0' }}>
        <div style={{ padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: 0 }}>Places to explore</h3>
          <Link href="/explore" style={{ fontSize: '12px', fontWeight: 800, color: '#14532D', textDecoration: 'none' }}>
            View All
          </Link>
        </div>
        <div 
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            padding: '0 16px 8px 16px',
            scrollbarWidth: 'none'
          }}
          className="no-scrollbar"
        >
          {[
            { name: 'Kapila Theertham', img: '/assets/temples/kapila-theertham.png', dist: '1.2 km' },
            { name: 'Regional Science Center', img: '/assets/temples/science-center.png', dist: '2.5 km' },
            { name: 'Sri Venkateswara Museum', img: '/assets/temples/museum.png', dist: '3.1 km' },
            { name: 'Tirupati Zoo', img: '/assets/temples/zoo.png', dist: '4.8 km' },
            { name: 'ISKCON Temple', img: '/assets/temples/iskcon.png', dist: '1.5 km' }
          ].map((place, idx) => {
            const matched = places.find(p => p.name.toLowerCase().includes(place.name.split(' ')[0].toLowerCase()));
            const finalImg = matched?.image || place.img;
            const finalId = matched?.id || 'kapila-theertham';

            let displayDist = place.dist;
            if (matched && matched.coordinates) {
              const baseLoc = userLocation || TIRUPATI_CENTER;
              const isTirumala = finalId.includes('tirumala') || finalId === 'srivari-museum' || finalId === 'swami-pushkarini' || finalId === 'srivari-paadaalu' || finalId === 'papavinasam' || finalId === 'akasaganga' || finalId === 'silathoranam';
              const distNum = calculateDrivingDistance(baseLoc.lat, baseLoc.lng, matched.coordinates.lat, matched.coordinates.lng, isTirumala);
              displayDist = `${distNum.toFixed(1)} km`;
            }

            return (
              <div 
                key={idx}
                onClick={() => handlePlaceClick(finalId)}
                style={{
                  flex: '0 0 140px',
                  background: '#FFFFFF',
                  border: '1px solid #ECE9E3',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                }}
              >
                <div style={{
                  height: '90px',
                  backgroundImage: `url(${finalImg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#E2E8F0'
                }} />
                <div style={{ padding: '8px 10px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#111827', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {place.name}
                  </h4>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>
                    {displayDist} away
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          OVERLAYS
         ═══════════════════════════════════════════════════ */}

      {showWelcomeOverlay && (
        <div className={styles.onboardingOverlay}>
          <div className={styles.onboardingCard}>
            <div style={{ color: '#0F5132', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <Sparkles size={32} />
            </div>
            <h2 className={styles.onboardingTitle}>Welcome to Saarthi</h2>
            <p className={styles.onboardingSub}>
              Millions visit Tirumala every year. Let us help you do it well.
            </p>
            <p className={styles.onboardingPrompt}>What should we call you?</p>
            <input
              type="text"
              className={styles.onboardingInput}
              placeholder="Enter your name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && tempName.trim()) {
                  handleWelcomeSubmit();
                }
              }}
              autoFocus
            />
            <button
              className={styles.onboardingBtn}
              onClick={handleWelcomeSubmit}
              disabled={!tempName.trim()}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
      {/* ─── LIVE ALERTS SYSTEM POPUPS ─── */}
      <AnimatePresence>
        {activePopupAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
          >
            {activePopupAlert.popup_type === 'Fullscreen' ? (
              // Fullscreen Overlay (Emergency)
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '36px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  border: '2px solid #EF4444',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', marginBottom: '24px', fontSize: '32px' }}>
                  🚨
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#EF4444', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
                  CRITICAL EMERGENCY ALERT
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 12px 0', fontFamily: 'var(--font-hero), Georgia, serif', lineHeight: 1.3 }}>
                  {activePopupAlert.title}
                </h2>
                <p style={{ fontSize: '14px', color: '#94A3B8', margin: '0 0 32px 0', lineHeight: 1.6, maxWidth: '400px' }}>
                  {activePopupAlert.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '320px' }}>
                  {activePopupAlert.cta !== 'None' && (
                    <button
                      onClick={() => {
                        logTelemetry('alert_popup_cta_click', 'alert', activePopupAlert.id);
                        const dismissed = JSON.parse(localStorage.getItem('saarthi_dismissed_alerts') || '[]');
                        const updated = [...dismissed, activePopupAlert.id];
                        localStorage.setItem('saarthi_dismissed_alerts', JSON.stringify(updated));
                        setDismissedAlertIds(updated);
                        
                        if (activePopupAlert.cta === 'Open Queue') router.push('/essentials');
                        else if (activePopupAlert.cta === 'Open Essentials') router.push('/essentials');
                        else if (activePopupAlert.cta === 'Open Maps') router.push('/explore');
                        else if (activePopupAlert.cta === 'Open Parking') router.push('/explore?q=Parking');
                        
                        setActivePopupAlert(null);
                      }}
                      style={{
                        background: '#EF4444',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '14px',
                        fontSize: '14px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
                      }}
                    >
                      {activePopupAlert.cta}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logTelemetry('alert_popup_dismiss', 'alert', activePopupAlert.id);
                      const dismissed = JSON.parse(localStorage.getItem('saarthi_dismissed_alerts') || '[]');
                      const updated = [...dismissed, activePopupAlert.id];
                      localStorage.setItem('saarthi_dismissed_alerts', JSON.stringify(updated));
                      setDismissedAlertIds(updated);
                      setActivePopupAlert(null);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      border: '1.5px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '14px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Acknowledge &amp; Close
                  </button>
                </div>
              </motion.div>
            ) : (
              // Centered Popup (Advisory / High Priority)
              <motion.div
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  borderRadius: '24px',
                  padding: '24px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  border: activePopupAlert.category === 'High Priority' ? '2.5px solid #EA580C' : '2.5px solid #F59E0B',
                  boxSizing: 'border-box',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span>{activePopupAlert.category === 'High Priority' ? '🟠' : '🟡'}</span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: activePopupAlert.category === 'High Priority' ? '#EA580C' : '#D97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Live Pilgrim Alert
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', fontFamily: 'var(--font-hero), Georgia, serif' }}>
                  {activePopupAlert.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#4B5563', margin: '0 0 20px 0', lineHeight: 1.45 }}>
                  {activePopupAlert.description}
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {activePopupAlert.cta !== 'None' && (
                    <button
                      onClick={() => {
                        logTelemetry('alert_popup_cta_click', 'alert', activePopupAlert.id);
                        const dismissed = JSON.parse(localStorage.getItem('saarthi_dismissed_alerts') || '[]');
                        const updated = [...dismissed, activePopupAlert.id];
                        localStorage.setItem('saarthi_dismissed_alerts', JSON.stringify(updated));
                        setDismissedAlertIds(updated);
                        
                        if (activePopupAlert.cta === 'Open Queue') router.push('/essentials');
                        else if (activePopupAlert.cta === 'Open Essentials') router.push('/essentials');
                        else if (activePopupAlert.cta === 'Open Maps') router.push('/explore');
                        else if (activePopupAlert.cta === 'Open Parking') router.push('/explore?q=Parking');
                        
                        setActivePopupAlert(null);
                      }}
                      style={{
                        flex: 1,
                        background: '#E9801D',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '10px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {activePopupAlert.cta}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logTelemetry('alert_popup_dismiss', 'alert', activePopupAlert.id);
                      const dismissed = JSON.parse(localStorage.getItem('saarthi_dismissed_alerts') || '[]');
                      const updated = [...dismissed, activePopupAlert.id];
                      localStorage.setItem('saarthi_dismissed_alerts', JSON.stringify(updated));
                      setDismissedAlertIds(updated);
                      setActivePopupAlert(null);
                    }}
                    style={{
                      flex: 1,
                      background: '#F1F5F9',
                      color: '#475569',
                      border: '1px solid #CBD5E1',
                      borderRadius: '12px',
                      padding: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>



      {/* ─── LOCATION SELECTOR MODAL ─── */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center'
            }}
            onClick={() => setIsLocationModalOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: '#ffffff',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '24px 20px 32px 20px',
                boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Starting Point</h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>Get exact travel times & transport costs</p>
                </div>
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  style={{
                    border: 'none',
                    background: '#F1F5F9',
                    color: '#64748B',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Auto-detect button */}
              <button
                onClick={() => {
                  setIsLocationModalOpen(false);
                  requestLocation();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#FFF8F2',
                  border: '1.5px solid #FDBA74',
                  borderRadius: '14px',
                  padding: '14px',
                  color: '#E9801D',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.2s'
                }}
              >
                <Navigation size={16} />
                <span>Auto-Detect Current Location</span>
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Popular Starting Points
                </span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
                  {[
                    { name: 'Tirupati Railway Station', lat: 13.6288, lng: 79.4192, sub: 'Default local hub' },
                    { name: 'Alipiri Footpath Gate', lat: 13.6542, lng: 79.4025, sub: 'Starting point of pedestrian trek' },
                    { name: 'Renigunta Airport', lat: 13.6322, lng: 79.5432, sub: 'Tirupati International Airport' },
                    { name: 'Tirumala Hill Top', lat: 13.6833, lng: 79.3500, sub: 'Main Lord Venkateswara Temple area' },
                    { name: 'Chennai', lat: 13.0827, lng: 80.2707, sub: 'Distance: ~135 km' },
                    { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, sub: 'Distance: ~250 km' },
                    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, sub: 'Distance: ~550 km' }
                  ].map((loc) => (
                    <button
                      key={loc.name}
                      onClick={() => {
                        setUserLocation({ lat: loc.lat, lng: loc.lng });
                        setLocationPermission('granted');
                        setLocationName(loc.name);
                        setIsLocationModalOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: locationName === loc.name ? '1.5px solid #E9801D' : '1px solid #E2E8F0',
                        backgroundColor: locationName === loc.name ? '#FFFDFB' : '#FFFFFF',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1E293B' }}>{loc.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>{loc.sub}</div>
                      </div>
                      {locationName === loc.name && <Check size={16} color="#E9801D" />}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always-Visible Intent (View Day Plan Floating Button) */}
      {savedPlaces && savedPlaces.length > 0 && (
        <Link
          href="/saved"
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '16px',
            background: '#059669',
            color: '#FFFFFF',
            borderRadius: '30px',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(5,150,105,0.3)',
            zIndex: 100,
            fontSize: '12px',
            fontWeight: 800,
            transition: 'transform 0.2s'
          }}
        >
          <Compass size={14} />
          <span>View Day Plan ({savedPlaces.length})</span>
        </Link>
      )}
    </div>
  );
}
