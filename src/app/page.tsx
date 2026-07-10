'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  MapPin, User, Users, Search, Heart, Landmark, Waves, Map as MapIcon,
  Calendar, Sparkles, Award, Check, Sunrise, Sun, Sunset, Moon, Camera, Leaf, Info, Footprints,
  Clock, Compass, ShieldCheck, ChevronRight, Bell, Ticket, Star, Zap, Calendar as CalendarDays, X, Car
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

  const { userLocation, setLocationPermission, setUserLocation, togglePlace, savedPlaces, plannerInput } = useTrip();
  const [locationName, setLocationName] = useState<string>('Tirupati');
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
  const [showCompleteDarshan, setShowCompleteDarshan] = useState<boolean>(false);
  const [showPersonalizeBanner, setShowPersonalizeBanner] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);
  
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
        visit: true, 
        reason: 'Crowd is low, parking is available', 
        label: '✅ Yes', 
        currentWait: '2-3 hours', 
        recommendedArrival: '5:00 AM',
        theme: 'green' as const
      };
    }
    const level = liveStatus.crowdLevel;
    const weather = liveStatus.weather;
    const parking = liveStatus.accommodationStatus;
    const currentWait = formattedWaitTime;
    
    // Parse wait time hours
    let hours = 2; // Default fallback to low/green
    if (currentWait) {
      const matches = currentWait.match(/\d+/g);
      if (matches && matches.length > 0) {
        const numbers = matches.map(Number);
        hours = numbers.reduce((a, b) => a + b, 0) / numbers.length;
      } else {
        // Fallback to crowdLevel if no numbers are present
        if (level === 'very-high') hours = 12;
        else if (level === 'high') hours = 8;
        else if (level === 'moderate') hours = 4;
        else hours = 2;
      }
    }

    let theme: 'green' | 'yellow' | 'red' = 'green';
    let visit = true;
    let label = '✅ Yes';
    let reason = 'Conditions are great right now.';
    let recommendedArrival = '5:00 AM';

    if (hours < 5) {
      theme = 'green';
      visit = true;
      label = '✅ Yes';
      reason = `Low crowd, pleasant weather (${weather.split(',')[1]?.trim() || weather}).`;
      recommendedArrival = '5:00 AM';
    } else if (hours < 10) {
      theme = 'yellow';
      visit = true;
      label = '⚠️ Moderate Wait';
      reason = `Moderate crowd, pleasant weather (${weather.split(',')[1]?.trim() || weather}).`;
      recommendedArrival = '8:00 AM';
    } else {
      theme = 'red';
      visit = false;
      label = '⚠️ Delay Visit';
      reason = 'Extremely heavy queue line crowd right now.';
      recommendedArrival = '6:00 PM';
    }

    // Special cases / overrides
    if (parking === 'full') {
      visit = false;
      label = '⚠️ Delay Visit';
      reason = 'Accommodation & parking is completely full.';
      recommendedArrival = 'After 6 PM';
      theme = 'red';
    } else if (/rain/i.test(weather) && theme === 'green') {
      label = '✅ Yes, carry umbrella';
      reason = 'Rain reported on hills, but queues are indoor.';
      recommendedArrival = '8:00 AM';
    }

    return { visit, label, reason, currentWait, recommendedArrival, theme };
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
          console.warn("Browser Geolocation failed, trying IP-based fallback...", error);
          fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(ipData => {
              if (ipData && typeof ipData.latitude === 'number' && typeof ipData.longitude === 'number') {
                setUserLocation({
                  lat: ipData.latitude,
                  lng: ipData.longitude
                });
                setLocationPermission('granted');
                if (ipData.city) {
                  setLocationName(ipData.city);
                }
              } else {
                throw new Error("Invalid IP geocoding response");
              }
            })
            .catch(err => {
              console.error("IP-based geolocation fallback failed:", err);
              alert("Location access denied or unavailable. Defaulting to Tirupati Center.");
              setUserLocation(TIRUPATI_CENTER);
              setLocationPermission('denied');
            });
        }
      );
    } else {
      console.warn("Browser Geolocation unsupported, trying IP-based fallback...");
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(ipData => {
          if (ipData && typeof ipData.latitude === 'number' && typeof ipData.longitude === 'number') {
            setUserLocation({
              lat: ipData.latitude,
              lng: ipData.longitude
            });
            setLocationPermission('granted');
            if (ipData.city) {
              setLocationName(ipData.city);
            }
          } else {
            throw new Error("Invalid IP geocoding response");
          }
        })
        .catch(err => {
          console.error("IP-based geolocation fallback failed:", err);
          alert("Geolocation is not supported by your browser.");
          setUserLocation(TIRUPATI_CENTER);
          setLocationPermission('denied');
        });
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
            margin: '8px 16px',
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
              <span style={{ fontSize: '10px', color: '#6B7280' }}>Optimize walk times &amp; accessibility.</span>
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

      {/* ─── LIVE ALERTS SYSTEM BANNER ─── */}
      {alerts && alerts.filter(a => a.popup_type === 'Banner' && !dismissedAlertIds.includes(a.id)).length > 0 && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
          {alerts.filter(a => a.popup_type === 'Banner' && !dismissedAlertIds.includes(a.id)).map((alert) => {
            const timeDiffMins = Math.max(1, Math.round((Date.now() - new Date(alert.created_at).getTime()) / 60000));
            const timeText = timeDiffMins < 60 ? `${timeDiffMins} mins ago` : `${Math.round(timeDiffMins / 60)} hrs ago`;
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: alert.category === 'Emergency' ? '#FEE2E2' : alert.category === 'High Priority' ? '#FFEDD5' : alert.category === 'Advisory' ? '#FEF9C3' : '#D1FAE5',
                  border: alert.category === 'Emergency' ? '1.5px solid #DC2626' : alert.category === 'High Priority' ? '1.5px solid #EA580C' : alert.category === 'Advisory' ? '1.5px solid #F59E0B' : '1.5px solid #10B981',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  position: 'relative'
                }}
              >
                {/* Dismiss Close Icon */}
                <button
                  onClick={() => {
                    logTelemetry('alert_banner_dismiss', 'alert', alert.id);
                    const nextDismissed = [...dismissedAlertIds, alert.id];
                    setDismissedAlertIds(nextDismissed);
                    localStorage.setItem('saarthi_dismissed_alerts', JSON.stringify(nextDismissed));
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'background-color 0.2s'
                  }}
                  title="Dismiss alert"
                >
                  <X size={14} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', paddingRight: '20px' }}>
                  <span style={{ fontSize: '12px' }}>
                    {alert.category === 'Emergency' ? '🔴' : alert.category === 'High Priority' ? '🟠' : alert.category === 'Advisory' ? '🟡' : '🟢'}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#0F172A', letterSpacing: '0.5px' }}>
                    LIVE ALERT — {alert.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0', paddingRight: '20px' }}>{alert.title}</h3>
                <p style={{ fontSize: '12px', color: '#334155', margin: '0 0 10px 0', lineHeight: 1.45, paddingRight: '20px' }}>{alert.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>Updated {timeText}</span>
                  {alert.cta !== 'None' && (
                    <button 
                      onClick={() => {
                        logTelemetry('alert_cta_click', 'alert', alert.id);
                        if (alert.cta === 'Open Queue') router.push('/essentials');
                        else if (alert.cta === 'Open Essentials') router.push('/essentials');
                        else if (alert.cta === 'Open Maps') router.push('/explore');
                        else if (alert.cta === 'Open Parking') router.push('/explore?q=Parking');
                      }}
                      style={{
                        background: '#0F172A',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {alert.cta}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ─── NEXT BEST ACTION HERO ─── */}
      {liveStatus && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            margin: '12px 16px 8px 16px',
            borderRadius: '18px',
            overflow: 'hidden',
            background: tirumalaVerdict.theme === 'green'
              ? 'linear-gradient(135deg, #052e16 0%, #14532d 100%)'
              : tirumalaVerdict.theme === 'yellow'
              ? 'linear-gradient(135deg, #78350f 0%, #92400e 100%)'
              : 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
            boxShadow: tirumalaVerdict.theme === 'green'
              ? '0 8px 24px rgba(16, 185, 129, 0.18)'
              : tirumalaVerdict.theme === 'yellow'
              ? '0 8px 24px rgba(217, 119, 6, 0.18)'
              : '0 8px 24px rgba(220, 38, 38, 0.18)',
            padding: '18px 18px 16px',
          }}
        >
          {/* Status row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: tirumalaVerdict.theme === 'green' ? '#34d399' : tirumalaVerdict.theme === 'yellow' ? '#fbbf24' : '#f87171',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '10px', fontWeight: 800, color: tirumalaVerdict.theme === 'green' ? '#86efac' : tirumalaVerdict.theme === 'yellow' ? '#fde047' : '#fca5a5', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              {tirumalaVerdict.theme === 'green' ? 'Good Conditions Now' : tirumalaVerdict.theme === 'yellow' ? 'Moderate Wait Alert' : 'Heavy Crowd Alert'}
            </span>
          </div>

          {/* Main recommendation */}
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px', lineHeight: 1.35 }}>
            {tirumalaVerdict.theme === 'green'
              ? `Queue is ${tirumalaVerdict.currentWait}. Now is a good time to go.`
              : tirumalaVerdict.theme === 'yellow'
              ? `Queue is ${tirumalaVerdict.currentWait}. Expect moderate crowd.`
              : `Very heavy crowd. ${tirumalaVerdict.reason}`}
          </p>

          {/* Sub-recommendation */}
          <p style={{ fontSize: '12px', color: tirumalaVerdict.theme === 'green' ? '#86efac' : tirumalaVerdict.theme === 'yellow' ? '#fde047' : '#fca5a5', margin: '0 0 14px', lineHeight: 1.4 }}>
            {tirumalaVerdict.theme === 'green'
              ? `Recommended: Proceed to Darshan. Best arrival — ${tirumalaVerdict.recommendedArrival}.`
              : tirumalaVerdict.theme === 'yellow'
              ? `Recommended: Visit ISKCON or Kapila Teertham first. Return after ${tirumalaVerdict.recommendedArrival}.`
              : `Recommended: Postpone darshan. Best arrival — ${tirumalaVerdict.recommendedArrival}.`}
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: '0.4px', marginBottom: '2px' }}>WAIT TIME</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{formattedWaitTime}</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: '0.4px', marginBottom: '2px' }}>WEATHER</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>{liveStatus.weather.split(',')[1]?.trim() || liveStatus.weather}</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: '0.4px', marginBottom: '2px' }}>BEST TIME</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>{tirumalaVerdict.recommendedArrival}</div>
            </div>
          </div>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => router.push('/essentials')}
            style={{
              width: '100%',
              padding: '12px',
              background: tirumalaVerdict.theme === 'green'
                ? '#10b981'
                : tirumalaVerdict.theme === 'yellow'
                ? '#d97706'
                : '#ef4444',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              letterSpacing: '0.2px',
            }}
          >
            🛕 Start Journey →
          </motion.button>
        </motion.section>
      )}

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
                <span className={styles.liveStatValue}>{formattedWaitTime}</span>
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

      {/* ─── SEARCH BAR (compact, smart) ─── */}
      <section style={{ margin: '4px 16px 8px 16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '0 14px',
          height: '48px',
          boxShadow: '0 2px 8px rgba(30,27,24,0.04)',
        }}>
          <Search size={17} color="#94A3B8" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search temples, facilities, stories..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '13px',
              color: '#1E293B',
              background: 'transparent',
              fontFamily: 'inherit',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') smartSearch(e.currentTarget.value);
            }}
          />
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
            onClick={(e) => {
              const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
              if (input) smartSearch(input.value);
            }}
          >
            <ChevronRight size={18} color="#E9801D" />
          </button>
        </div>
      </section>

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
                  {formattedWaitTime}
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

      {/* ─── BEFORE DARSHAN CHECKLIST ─── */}
      <section style={{ 
        margin: '12px 16px 8px 16px', 
        padding: '16px 18px', 
        background: '#FFFFFF', 
        border: '1px solid rgba(233, 128, 29, 0.08)', 
        borderRadius: '16px', 
        boxShadow: '0 4px 14px rgba(30, 27, 24, 0.03)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📋</span>
            <strong style={{ fontSize: '13px', color: '#0F172A' }}>Before Darshan Checklist</strong>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#F59E0B' }}>
            {homeChecklistStats.checked} / {homeChecklistStats.total} Done
          </span>
        </div>

        <div style={{ width: '100%', height: '5px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
          <div style={{ width: `${homeChecklistStats.pct}%`, height: '100%', backgroundColor: '#10B981', borderRadius: '3px', transition: 'width 0.3s' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {CHECKLIST_ITEMS.slice(0, 5).map((item) => {
            const isChecked = !!homeChecklist[item.id];
            return (
              <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', flex: 1 }}
                  onClick={() => handleToggleHomeCheck(item.id, item.localStorageKey)}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: `2px solid ${isChecked ? '#10B981' : '#CBD5E1'}`, backgroundColor: isChecked ? '#10B981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    {isChecked && <Check size={10} color="#FFF" strokeWidth={3} />}
                  </div>
                  <span style={{ fontSize: '12px', color: isChecked ? '#94A3B8' : '#475569', textDecoration: isChecked ? 'line-through' : 'none', lineHeight: 1.4 }}>
                    {item.text}
                  </span>
                </div>
                <Link href={`/essentials/${item.id.replace('check-', '')}`} style={{ fontSize: '11px', color: '#D97706', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', marginLeft: '8px', display: 'flex', alignItems: 'center', gap: '1px' }}>
                  <span>Guide</span><ChevronRight size={12} />
                </Link>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '14px', borderTop: '1px solid rgba(233,128,29,0.04)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {homeChecklistStats.pct === 100 ? (
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981' }}>🎉 100% Ready for Darshan</span>
          ) : (
            <span style={{ fontSize: '10px', color: '#64748B' }}>Finish these tasks for a smooth darshan.</span>
          )}
          <Link href="/essentials" style={{ fontSize: '11px', color: '#D97706', fontWeight: 800, textDecoration: 'none' }}>All Essentials →</Link>
        </div>
      </section>


      {/* ─── BEST FOR TODAY'S CONDITIONS ─── */}
      {bestForToday && (
        <section className={styles.bestForTodaySection} id="best-for-today-section">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>🌤 Best for Today&apos;s Conditions</h2>
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

      {/* ─── LATEST UPDATES (SITUATION FEED) ─── */}
      {liveStatus && (
        <section className={styles.situationFeedSection}>
          <div className={styles.situationFeedCard}>
            <div className={styles.situationFeedHeader}>
              <Bell size={16} color="#E9801D" />
              <span className={styles.situationFeedTitle}>Today&apos;s Situation</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {getSituationFeedItems().map((item, idx) => (
                <div key={idx} className={styles.feedItem}>
                  <div className={styles.feedIconWrapper} style={{ backgroundColor: `${item.color}18` }}>
                    {item.icon}
                  </div>
                  <span className={styles.feedText}>{item.text}</span>
                </div>
              ))}
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
                <span className={styles.quizTag}>TODAY&apos;S TRIVIA</span>
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
                  Review Today&apos;s Learning
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
          Discover Tirupati&apos;s hidden waterfalls, wildlife sanctuaries, historical forts, and local food.
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

      {showWelcomeOverlay && (
        <div className={styles.onboardingOverlay}>
          <div className={styles.onboardingCard}>
            <span className={styles.onboardingEmoji}>✨</span>
            <h2 className={styles.onboardingTitle}>Welcome to Saarthi</h2>
            <p className={styles.onboardingSub}>
              Your intelligent Tirupati travel guide &amp; itinerary planner.
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
                <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 12px 0', fontFamily: 'Georgia, serif', lineHeight: 1.3 }}>
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
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', fontFamily: 'Georgia, serif' }}>
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

      {/* Flipkart-style Flash Notification toast */}
      <AnimatePresence>
        {showFlashNotification && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            onClick={() => router.push('/live')}
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '24px',
              right: '24px',
              maxWidth: '420px',
              margin: '0 auto',
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '16px 20px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
          >
            {/* Top border colored bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #E9801D 0%, #F59E0B 100%)'
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(233, 128, 29, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E9801D',
                  flexShrink: 0
                }}>
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 3 }}
                  >
                    <Bell size={18} />
                  </motion.div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#E9801D', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Saarthi Flash ⚡
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
                    Welcome back, {userName}!
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFlashNotification(false);
                }}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#94A3B8',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <X size={14} />
              </button>
            </div>

            <p style={{ fontSize: '12.5px', color: '#E2E8F0', lineHeight: '1.5', margin: 0, fontWeight: 500 }}>
              Today&apos;s temple crowd is <strong style={{ color: '#F59E0B' }}>Moderate</strong>. SSD token wait time is <strong style={{ color: '#F59E0B' }}>~45 mins</strong>. Weather is clear at <strong style={{ color: '#F59E0B' }}>31°C</strong>.
            </p>

            {/* Tap to View CTA indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600 }}>Tap to view live dashboard</span>
              <ChevronRight size={12} color="#E9801D" />
            </div>

            {/* Auto-dismiss progress bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 7, ease: 'linear' }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                background: '#E9801D',
                opacity: 0.8
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
