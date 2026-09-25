'use client';

import React, { useState } from 'react';
import { Menu, Bell, MapPin, Sun, Sparkles, Ticket, TicketX, ShieldAlert, Car, Gift, CloudRain, Bus, Clock, Route, Users, Zap, Check, ChevronDown, Navigation, Flame, Moon, Languages, RotateCcw, Share2, X, Volume2, VolumeX, ChevronRight, Pause, Play, Building2, Calendar } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo/Logo';
import { useLanguage, setAppLanguage } from '@/lib/useLanguage';
import { useTrip } from '@/components/TripContext';
import { detectCoordinates, isCoordinateOnTirumalaHill, resolveLocationName } from '@/lib/location';
import { 
  playBeadComplete, 
  playReflectionEnd, 
  playQuarterMilestone, 
  playJapa108Complete, 
  transitionToJapa, 
  returnFromJapa, 
  startJapaAmbient, 
  stopAllAudio, 
  setAudioGloballyEnabled, 
  triggerBeadHaptic 
} from '@/lib/audioBell';
import { getDayTempleGuidance } from '@/lib/dailyGuidance';
import { getGovindaNamaForBead } from '@/data/govindaNamas';
import { LocationPickerModal, LocationPill } from '@/components/common/LocationPickerModal';
import { 
  generateTodayInTirumalaCard, 
  generateJapaCard, 
  shareOrDownloadCard 
} from '@/lib/shareCardGenerator';
import { JapaMalaModal } from './JapaMalaModal';
import { getISTDate } from '@/utils/location';

const TEXTS: Record<string, any> = {
  en: {
    greetings: {
      morning: 'Good Morning',
      afternoon: 'Good Afternoon',
      evening: 'Good Evening',
      night: 'Good Night'
    },
    header: {
      companion: 'Your Tirumala Companion'
    },
    tagline: "Based on your current situation, here's the best thing to do next — and why.",
    labels: {
      today: 'Today',
      currentWait: 'Current Wait',
      bestTime: 'Best Time',
      updated: 'Updated',
      justNow: 'Just now',
      minAgo: 'min ago',
      live: 'Live',
      saarthiRecommends: 'SAARTHI RECOMMENDS',
      recommendedBecause: 'RECOMMENDED BECAUSE',
      rightNowOnHill: 'Right now on the hill',
      viewAll: 'view All >'
    },
    badges: {
      lowCrowd: 'LOW CROWD',
      moderateCrowd: 'MODERATE CROWD',
      heavyCrowd: 'HEAVY CROWD',
      weatherAlert: 'WEATHER ALERT',
      festivalRush: 'FESTIVAL RUSH',
      ssdOpen: 'SSD OPEN',
      nightUpdate: 'NIGHT UPDATE',
      importantAdvisory: 'IMPORTANT ADVISORY'
    },
    subtitles: {
      green: 'Tirumala Crowd: Normal & Clear',
      yellow: 'Tirumala Crowd: Moderate Rush',
      red: 'Tirumala Crowd Status: Peak Capacity',
      blue: 'Tirumala Crowd: Rain Disruption',
      purple: 'Tirumala Crowd: Festival Rush',
      orange: 'Tirumala Crowd: Limited Tokens',
      night: 'Tirumala Crowd Status: Night Update',
      alert: 'Tirumala Crowd: Route Advisory'
    },
    recommendations: {
      green: 'A serene darshan window is open. Start your journey now.',
      yellow: 'Visit Kapila Theertham first. Return for darshan after lunch.',
      red: 'Rest tonight. A quieter darshan awaits tomorrow morning at 6:00 AM.',
      blue: 'Alipiri steps are slippery from rain. Take the APSRTC Electric Bus.',
      orange: 'Head to Alipiri now. SSD token slots are filling fast.',
      purple: 'Stay in Tirupati tonight. Start fresh at 6:00 AM tomorrow.',
      night: 'Rest well tonight. Start your darshan around 6:00 AM.',
      alert: 'Use RTC Bus route. Alternative scenic route is ready.'
    },
    why: {
      green: "You'll comfortably bypass today's peak afternoon rush.",
      yellow: 'Queue wait times clear significantly during the afternoon slot.',
      red: 'Joining right now means an 11-hour bottleneck in holding compartments.',
      blue: 'Footpaths are slippery during heavy rain. Buses run safely.',
      purple: 'Overnight queue compartments are currently near full capacity.',
      orange: 'SSD tokens bypass the main 10+ hour general queue.',
      night: 'Morning 6:00 AM queue entry is over 70% faster and cooler.',
      alert: 'Maintenance work active on primary entrance route.'
    },
    benefits: {
      green: 'Save approx. 3 hours of wait time by leaving now',
      yellow: 'Save approx. 2 hours by visiting in the afternoon slot',
      red: 'Save approx. 4 hours by starting at 6:00 AM',
      blue: 'Avoid 2 hours of weather delay and wet footpaths',
      purple: 'Save over 6 hours of queue waiting by starting fresh',
      orange: 'Save 8+ hours by securing an SSD slot right now',
      night: 'Save approx. 4 hours by starting at 6:00 AM',
      alert: 'Bypass traffic delay seamlessly'
    },
    ctas: {
      green: 'Start Journey →',
      yellow: 'View Suggested Plan →',
      red: 'Start My Plan →',
      blue: 'View Safe Route →',
      purple: "Tomorrow's Plan →",
      orange: 'Go to SSD Counter →',
      night: 'Set Reminder →',
      alert: 'View Alternative Route →'
    }
  },
  te: {
    greetings: {
      morning: 'శుభోదయం',
      afternoon: 'శుభ మధ్యాహ్నం',
      evening: 'శుభ సాయంత్రం',
      night: 'శుభ రాత్రి'
    },
    header: {
      companion: 'మీ తిరుమల సహచరి'
    },
    tagline: 'మీ ప్రస్తుత పరిస్థితి ఆధారంగా, తదుపరి ఏమి చేయాలో — మరియు ఎందుకు.',
    labels: {
      today: 'ఈ రోజు',
      currentWait: 'ప్రస్తుత వేచి ఉండు సమయం',
      bestTime: 'ఉత్తమ సమయం',
      updated: 'అప్‌డేట్',
      justNow: 'ఇప్పుడే',
      minAgo: 'నిమిషాల క్రితం',
      live: 'లైవ్',
      saarthiRecommends: 'సారథి సూచన',
      recommendedBecause: 'సూచన కారణం',
      rightNowOnHill: 'కొండపై ప్రస్తుతం',
      viewAll: 'అన్నీ చూడండి >'
    },
    badges: {
      lowCrowd: 'తక్కువ రద్దీ',
      moderateCrowd: 'మోస్తరు రద్దీ',
      heavyCrowd: 'అధిక రద్దీ',
      weatherAlert: 'వాతావరణ హెచ్చరిక',
      festivalRush: 'పండుగ రద్దీ',
      ssdOpen: 'SSD ఓపెన్',
      nightUpdate: 'రాత్రి అప్‌డేట్',
      importantAdvisory: 'ముఖ్యమైన సూచన'
    },
    subtitles: {
      green: 'తిరుమల రద్దీ: సామాన్య రద్దీ',
      yellow: 'తిరుమల రద్దీ: మోస్తరు రద్దీ',
      red: 'తిరుమల రద్దీ స్థితి: గరిష్ట స్థాయిలో ఉంది',
      blue: 'తిరుమల రద్దీ: వర్షం అంతరాయం',
      purple: 'తిరుమల రద్దీ: పండుగ రద్దీ',
      orange: 'తిరుమల రద్దీ: పరిమిత టోకెన్లు',
      night: 'తిరుమల రద్దీ స్థితి: రాత్రి అప్‌డేట్',
      alert: 'తిరుమల రద్దీ: మార్గం సూచన'
    },
    recommendations: {
      green: 'ప్రశాంతమైన దర్శన సమయం ప్రారంభమైంది. ఇప్పుడే యాత్ర ప్రారంభించండి.',
      yellow: 'ముందు కపిల తీర్థం దర్శించుకోండి. మధ్యాహ్నం దర్శనానికి వెళ్ళండి.',
      red: 'ఈ రాత్రి విశ్రాంతి తీసుకోండి. రేపు ఉదయం 6:00 గంటలకు ప్రశాంతమైన దర్శనం లభిస్తుంది.',
      blue: 'వర్షం వల్ల అలిపిరి మెట్ల మార్గం జారుడుగా ఉంది. APSRTC ఎలక్ట్రిక్ బస్ వాడండి.',
      orange: 'ఇప్పుడే అలిపిరికి వెళ్ళండి. SSD టోకెన్ స్లాట్లు వేగంగా భర్తీ అవుతున్నాయి.',
      purple: 'ఈ రాత్రి తిరుపతిలోనే ఉండండి. రేపు ఉదయం 6:00కి తాజాగా ప్రారంభించండి.',
      night: 'ఈ రాత్రి హాయిగా విశ్రాంతి తీసుకోండి. ఉదయం 6:00కి దర్శనం ప్రారంభించండి.',
      alert: 'RTC బస్ మార్గం వాడండి. సురక్షిత ప్రయాణ మార్గం సిద్ధంగా ఉంది.'
    },
    why: {
      green: 'ఈ రోజు మధ్యాహ్నం రద్దీని సులభంగా అధిగమించవచ్చు.',
      yellow: 'మధ్యాహ్నం సమయంలో క్యూ వేచి సమయం గణనీయంగా తగ్గుతుంది.',
      red: 'ఇప్పుడు చేరితే కంపార్ట్‌మెంట్లలో 11 గంటల రద్దీలో నిలబడాల్సి వస్తుంది.',
      blue: 'వర్షంలో కాలిబాటలు జారుతాయి. బస్సులు సురక్షితంగా తిరుగుతున్నాయి.',
      purple: 'రాత్రి కంపార్ట్‌మెంట్లు పూర్తి సామర్థ్యానికి చేరుకున్నాయి.',
      orange: 'SSD టోకెన్లతో 10+ గంటల సాధారణ క్యూను నివారించవచ్చు.',
      night: 'ఉదయం 6:00 గంటలకు ప్రవేశం 70% వేగంగా, చల్లగా ఉంటుంది.',
      alert: 'ప్రధాన మార్గంలో నిర్వహణ పనులు జరుగుతున్నాయి.'
    },
    benefits: {
      green: 'ఇప్పుడే బయలుదేరి సుమారు 3 గంటల సమయం ఆదా చేయండి',
      yellow: 'మధ్యాహ్న స్లాట్‌లో సుమారు 2 గంటల సమయం ఆదా',
      red: 'ఉదయం 6:00కి ప్రారంభించి సుమారు 4 గంటల సమయం ఆదా',
      blue: 'వర్షం ఆలస్యం లేకుండా సురక్షిత ప్రయాణం',
      purple: 'రాత్రి వేచి ఉండకుండా 6+ గంటల సమయం ఆదా',
      orange: 'ఇప్పుడే స్లాట్ తీసుకుని 8+ గంటల క్యూ నివారించండి',
      night: 'ఉదయం 6:00కి ప్రారంభించి సుమారు 4 గంటల సమయం ఆదా',
      alert: 'ట్రాఫిక్ ఇబ్బంది లేకుండా ప్రయాణం'
    },
    ctas: {
      green: 'యాత్ర ప్రారంభించండి →',
      yellow: 'సూచించిన ప్లాన్ చూడండి →',
      red: 'నా ప్లాన్ ప్రారంభించండి →',
      blue: 'సురక్షిత మార్గం చూడండి →',
      purple: 'రేపటి ప్లాన్ →',
      orange: 'SSD కౌంటర్కు వెళ్ళండి →',
      night: 'రిమైండర్ సెట్ చేయండి →',
      alert: 'ప్రత్యామ్నాయ మార్గం చూడండి →'
    }
  }
};

// ── Darshan wait time cards ───────────────────────────────────────────────────
const DARSHAN_CARDS = [
  { 
    key: 'sarva',    
    label: 'Sarva Darshan', 
    icon: <Users size={12} />,
    accent: '#FFEDD5',
    iconBg: 'rgba(249, 115, 22, 0.25)',
    iconColor: '#FB923C',
    border: 'rgba(251, 146, 60, 0.35)',
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.08) 100%)'
  },
  { 
    key: 'ssd',     
    label: 'SSD / DD',       
    icon: <Ticket size={12} />,
    accent: '#E0F2FE',
    iconBg: 'rgba(14, 165, 233, 0.25)',
    iconColor: '#38BDF8',
    border: 'rgba(56, 189, 248, 0.35)',
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.08) 100%)'
  },
  { 
    key: 'special', 
    label: '₹300 Special',   
    icon: <Zap size={12} />,
    accent: '#FEF3C7',
    iconBg: 'rgba(234, 179, 8, 0.25)',
    iconColor: '#FACC15',
    border: 'rgba(250, 204, 21, 0.35)',
    bg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.08) 100%)'
  },
];

const METRIC_ICON: Record<string, React.ReactNode> = {
  SSD:      <Ticket size={11} opacity={0.85} />,
  Traffic:  <Car size={11} opacity={0.85} />,
  Laddu:    <Gift size={11} opacity={0.85} />,
  Weather:  <Sun size={11} opacity={0.85} />,
  Rain:     <CloudRain size={11} opacity={0.85} />,
  Bus:      <Bus size={11} opacity={0.85} />,
  Delay:    <Clock size={11} opacity={0.85} />,
  Alipiri:  <Route size={11} opacity={0.85} />,
  'Ghat Rd':<MapPin size={11} opacity={0.85} />,
  Tokens:   <Ticket size={11} opacity={0.85} />,
  Crowd:    <Users size={11} opacity={0.85} />,
};

// ── Deterministic static raindrops for live temple card (Zero re-render lag) ──
const RAIN_DROPS = [
  { left: 3,  width: 1.5, height: 18, duration: 0.75, delay: 0.1 },
  { left: 8,  width: 1.2, height: 14, duration: 0.85, delay: 0.4 },
  { left: 14, width: 1.5, height: 22, duration: 0.70, delay: 0.2 },
  { left: 19, width: 1.0, height: 16, duration: 0.90, delay: 0.6 },
  { left: 25, width: 1.5, height: 20, duration: 0.72, delay: 0.05 },
  { left: 31, width: 1.2, height: 15, duration: 0.82, delay: 0.35 },
  { left: 37, width: 1.5, height: 24, duration: 0.68, delay: 0.15 },
  { left: 43, width: 1.0, height: 17, duration: 0.88, delay: 0.5 },
  { left: 49, width: 1.5, height: 21, duration: 0.74, delay: 0.25 },
  { left: 55, width: 1.2, height: 16, duration: 0.80, delay: 0.45 },
  { left: 61, width: 1.5, height: 23, duration: 0.69, delay: 0.1 },
  { left: 67, width: 1.0, height: 15, duration: 0.92, delay: 0.55 },
  { left: 73, width: 1.5, height: 19, duration: 0.76, delay: 0.3 },
  { left: 79, width: 1.2, height: 22, duration: 0.71, delay: 0.18 },
  { left: 85, width: 1.5, height: 17, duration: 0.84, delay: 0.42 },
  { left: 91, width: 1.0, height: 20, duration: 0.78, delay: 0.08 },
  { left: 96, width: 1.4, height: 16, duration: 0.86, delay: 0.38 },
];

const RAIN_SPLASHES = [
  { left: 6,  bottom: 8,  duration: 0.75, delay: 0.2 },
  { left: 22, bottom: 6,  duration: 0.80, delay: 0.4 },
  { left: 39, bottom: 10, duration: 0.70, delay: 0.15 },
  { left: 58, bottom: 7,  duration: 0.85, delay: 0.5 },
  { left: 75, bottom: 9,  duration: 0.72, delay: 0.3 },
  { left: 92, bottom: 6,  duration: 0.78, delay: 0.1 },
];

export function HomeHero({ userName, locationName, weatherTemp, liveStatus, activeAlertsCount, hideHeader = false }: any) {
  const lang = useLanguage();
  const t = TEXTS[lang];
  const { setUserLocation, locationPermission } = useTrip();
  const [overrideScenario, setOverrideScenario] = useState<string>('auto');
  const [selectedLocation, setSelectedLocation] = useState<string>(locationName || 'Tirupati');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [apiWeatherCode, setApiWeatherCode] = useState<number | null>(null);
  const [testRainMode, setTestRainMode] = useState<boolean | null>(null);
  const bannerVideoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    // Check real-time weather API for Tirumala rain status
    fetch('/api/v1/weather')
      .then(res => res.json())
      .then(data => {
        if (data?.current?.weather_code !== undefined) {
          setApiWeatherCode(data.current.weather_code);
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    if (locationName) {
      setSelectedLocation(locationName);
    }
  }, [locationName]);

  React.useEffect(() => {
    const playVideo = () => {
      const v = bannerVideoRef.current;
      if (v) {
        v.setAttribute('muted', '');
        v.setAttribute('playsinline', 'true');
        v.setAttribute('webkit-playsinline', 'true');
        v.setAttribute('x5-playsinline', 'true');
        v.defaultMuted = true;
        v.muted = true;
        if (!v.paused && v.currentTime > 0) {
          setIsVideoPlaying(true);
        } else {
          v.play().then(() => setIsVideoPlaying(true)).catch(() => {});
        }
      }
    };

    playVideo();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        playVideo();
      }
    };

    const handleGesture = () => {
      playVideo();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleGesture);
    window.addEventListener('touchstart', handleGesture, { passive: true });
    window.addEventListener('click', handleGesture, { passive: true });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('click', handleGesture);
    };
  }, []);

  const handleAutoDetectLocation = () => {
    setIsLocating(true);
    detectCoordinates(
      (coords, source) => {
        setIsLocating(false);
        setUserLocation(coords, source || 'gps');
        const region = resolveLocationName(coords.lat, coords.lng);
        setSelectedLocation(region);
        if (typeof window !== 'undefined') localStorage.setItem('saarthi_user_region', region);
        setIsLocationModalOpen(false);
      },
      () => {
        setIsLocating(false);
      }
    );
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isManual = localStorage.getItem('saarthi_location_manual') === 'true';
      if (!isManual && (!locationName || locationName === 'Tirupati')) {
        handleAutoDetectLocation();
      }
    }
  }, [locationName]);

  // Real wait time from admin — fallback to crowd-level estimates
  const liveWaitTime: string = (() => {
    if (liveStatus?.waitTime) return liveStatus.waitTime;
    const lvl = (liveStatus?.crowdLevel || 'moderate').toLowerCase();
    if (lvl === 'low') return '45 Mins';
    if (lvl === 'high') return '8-10 Hours';
    if (lvl === 'very-high') return '14+ Hours';
    return '2-3 Hours';
  })();

  // "Updated X min ago" from lastUpdated timestamp
  const updatedLabel: string = (() => {
    if (!liveStatus?.lastUpdated) return t.labels.live;
    const diff = Math.floor((Date.now() - new Date(liveStatus.lastUpdated).getTime()) / 60000);
    if (diff < 1) return t.labels.justNow;
    if (diff < 60) return `${diff} ${t.labels.minAgo}`;
    const hrs = Math.floor(diff / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return t.labels.today;
  })();

  const getGreetingPrefix = () => {
    const hr = getISTDate().getHours();
    if (hr >= 5 && hr < 12) return t.greetings.morning;
    if (hr >= 12 && hr < 17) return t.greetings.afternoon;
    if (hr >= 17 && hr < 21) return t.greetings.evening;
    return t.greetings.night;
  };

  const crowdLevel = (liveStatus?.crowdLevel || 'high').toLowerCase();
  const weatherStr = (liveStatus?.weather || '').toLowerCase();
  // WMO weather codes for rain: 51-67 (drizzle/rain), 80-82 (showers), 95-99 (thunderstorm)
  const isApiRain = apiWeatherCode !== null && (
    (apiWeatherCode >= 51 && apiWeatherCode <= 67) ||
    (apiWeatherCode >= 80 && apiWeatherCode <= 82) ||
    (apiWeatherCode >= 95 && apiWeatherCode <= 99)
  );
  const detectedRain = isApiRain || weatherStr.includes('rain') || weatherStr.includes('shower') || weatherStr.includes('storm') || weatherStr.includes('thunder') || weatherStr.includes('drizzle');
  const isRainy = testRainMode !== null ? testRainMode : detectedRain;
  const ssdTokenStatus = (liveStatus?.ssdTokenStatus || '').toLowerCase(); // fixed: was reading wrong field
  const istHr = getISTDate().getHours();
  const isNight = istHr >= 21 || istHr < 5;

  // ── Live metric values from admin ──────────────────────────────────
  const liveSSD: string = (() => {
    if (ssdTokenStatus === 'issuing') return 'Issuing';
    if (ssdTokenStatus === 'paused') return 'Paused';
    if (ssdTokenStatus === 'closed-for-day' || ssdTokenStatus === 'closed') {
      const next = liveStatus?.ssdNextTokenTime;
      if (!next) return 'Closed';
      const clean = next.trim();
      if (clean.toLowerCase().startsWith('open') || clean.toLowerCase().startsWith('tomorrow') || clean.toLowerCase().startsWith('at ') || clean.toLowerCase().startsWith('no ')) {
        return clean;
      }
      return `Opens ${clean}`;
    }
    return 'Check Counter';
  })();

  const liveTraffic: string = (() => {
    if (crowdLevel === 'low') return 'Low';
    if (crowdLevel === 'moderate') return 'Moderate';
    if (crowdLevel === 'high') return 'Heavy';
    if (crowdLevel === 'very-high') return 'Very Heavy';
    return 'Normal';
  })();

  const liveLaddu: string = (() => {
    const s = liveStatus?.ladduAvailability || 'available';
    if (s === 'available') return 'Available';
    if (s === 'limited') return 'Limited';
    if (s === 'no-stock') return 'Out of Stock';
    return 'Available';
  })();

  const liveWeather: string = (() => {
    if (!liveStatus?.weather) return 'Pleasant';
    // Strip temperature, keep condition word
    const cond = liveStatus.weather.replace(/,?\s*\d+°C/i, '').trim();
    return cond || 'Pleasant';
  })();

  // ── Darshan wait times from live data ─────────────────────────────────────
  const getDarshanWait = (key: 'sarva' | 'ssd' | 'special'): string => {
    const list = liveStatus?.darshans || [];
    if (key === 'sarva') {
      const d = list.find((d: any) => d.name?.toLowerCase().includes('sarva') || d.name?.toLowerCase().includes('free'));
      return d?.waitTime || '10–12 h';
    }
    if (key === 'ssd') {
      const d = list.find((d: any) => d.name?.toLowerCase().includes('ssd') || d.name?.toLowerCase().includes('divya') || d.name?.toLowerCase().includes('footpath') || d.name?.toLowerCase().includes('token'));
      return d?.waitTime || '2–4 hrs';
    }
    if (key === 'special') {
      const d = list.find((d: any) => d.name?.includes('300') || d.name?.toLowerCase().includes('special'));
      return d?.waitTime || '3–5 hrs';
    }
    return '—';
  };

  const getMaxWaitHours = (text: string): number => {
    if (!text) return 0;
    const matches = text.match(/\d+/g);
    return matches ? Math.max(...matches.map(Number)) : 0;
  };

  // Best time: admin value wins; scenarios provide a sensible fallback
  const adminBestTime = liveStatus?.bestTime?.trim() || '';

  // ── Explainable "Why That Now" reason for Today in Tirumala ────────────────
  const whyThatNowText: string = (() => {
    if (liveStatus?.notice && liveStatus.notice.trim()) {
      return liveStatus.notice.trim();
    }

    const day = new Date().getDay();
    const sarvaWait = getDarshanWait('sarva');
    const maxHours = getMaxWaitHours(sarvaWait);
    const isExtreme = maxHours >= 12 || crowdLevel === 'very-high' || sarvaWait.includes('24') || sarvaWait.includes('28');
    const isHigh = maxHours >= 6 || crowdLevel === 'high';
    const isLow = maxHours > 0 && maxHours < 4 && crowdLevel === 'low';
    const isSsdIssuing = ssdTokenStatus === 'issuing';

    if (lang === 'te') {
      if (day === 6) { // Saturday
        return isExtreme || isHigh 
          ? 'శనివారం · వారాంతపు గరిష్ట రద్దీ' 
          : 'శనివారం · స్థిరమైన భక్తుల ప్రవాహం';
      }
      if (day === 0) { // Sunday
        return isExtreme || isHigh 
          ? 'ఆదివారం · అధిక రద్దీ' 
          : 'ఆదివారం · సాధారణ దర్శన ప్రవాహం';
      }
      if (day === 5) { // Friday
        return 'శుక్రవారం · అభిషేక భక్తుల రద్దీ';
      }
      if (isSsdIssuing) {
        return 'ఉచిత SSD టోకెన్లు జారీ అవుతున్నాయి';
      }
      if (isExtreme) {
        return 'గరిష్ట రద్దీ · అధిక నిరీక్షణ సమయం';
      }
      if (isHigh) {
        return 'భక్తుల రద్దీ అధికం · నిరంతర ప్రవాహం';
      }
      if (isLow) {
        return 'ప్రశాంత దర్శనం · వేగంగా కదులుతున్న క్యూ';
      }
      return 'సాధారణ దర్శనం · స్థిరమైన ప్రవాహం';
    }

    // English
    if (day === 6) { // Saturday
      return isExtreme || isHigh 
        ? 'Saturday Rush · Weekend Devotee Surge' 
        : 'Saturday Srivari Day · Steady Flow';
    }
    if (day === 0) { // Sunday
      return isExtreme || isHigh 
        ? 'Sunday · Heavy Crowd' 
        : 'Sunday Flow · Regular Queue Movement';
    }
    if (day === 5) { // Friday
      return 'Friday Abhishekam · High Temple Rush';
    }
    if (isSsdIssuing) {
      return 'Free SSD Tokens Active · Slotted Inflow';
    }
    if (isExtreme) {
      return 'Peak Rush · Extended Queue Wait';
    }
    if (isHigh) {
      return 'Heavy Footfall · Continuous Flow';
    }
    if (isLow) {
      return 'Favorable Window · Fast Queues';
    }
    return 'Normal Movement · Steady Flow';
  })();

  const [isSharingPulse, setIsSharingPulse] = useState(false);
  const [isSharingJapa, setIsSharingJapa] = useState(false);

  const handleShareTodayPulse = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSharingPulse) return;
    setIsSharingPulse(true);

    try {
      const sarvaWait = getDarshanWait('sarva');
      const specialWait = getDarshanWait('special');
      const ssdWait = getDarshanWait('ssd');
      const dayName = new Date().toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-US', { weekday: 'long' });
      const todayDateStr = new Date().toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.saarthiguide.in';

      // Status style helpers matching UI
      const getMaxHours = (text: string): number => {
        const matches = text.match(/\d+/g);
        if (!matches || matches.length === 0) return 0;
        return Math.max(...matches.map(Number));
      };
      const sarvaHours = getMaxHours(sarvaWait);
      const isSarvaExtreme = sarvaHours >= 12 || sarvaWait.includes('24') || sarvaWait.includes('30');
      const sarvaLabel = isSarvaExtreme ? (lang === 'te' ? 'తీవ్రమైన రద్దీ' : 'EXTREME') : sarvaHours > 6 ? (lang === 'te' ? 'రద్దీ ఎక్కువ' : 'HIGH') : (lang === 'te' ? 'మితమైన రద్దీ' : 'MODERATE');
      const sarvaColor = isSarvaExtreme ? '#E11D48' : sarvaHours > 6 ? '#D97706' : '#CA8A04';
      const sarvaMeter = isSarvaExtreme ? 5 : sarvaHours > 6 ? 4 : 3;

      const specialHours = getMaxHours(specialWait);
      const specialLabel = specialHours > 7 ? (lang === 'te' ? 'తీవ్రమైన రద్దీ' : 'EXTREME') : specialHours > 4 ? (lang === 'te' ? 'రద్దీ ఎక్కువ' : 'HIGH') : (lang === 'te' ? 'మితమైన రద్దీ' : 'MODERATE');
      const specialColor = specialHours > 7 ? '#E11D48' : specialHours > 4 ? '#D97706' : '#CA8A04';
      const specialMeter = specialHours > 7 ? 5 : specialHours > 4 ? 4 : 3;

      const ssdHours = getMaxHours(ssdWait);
      const isSsdExtreme = /cancel|full|heavy|rush|crowd|closed|stop/i.test(ssdWait) || ssdTokenStatus === 'closed-for-day' || ssdTokenStatus === 'closed';
      const ssdLabel = (ssdHours > 7 || isSsdExtreme) ? (lang === 'te' ? 'తీవ్రమైన రద్దీ' : 'EXTREME') : ssdHours > 4 ? (lang === 'te' ? 'రద్దీ ఎక్కువ' : 'HIGH') : (lang === 'te' ? 'మితమైన రద్దీ' : 'MODERATE');
      const ssdColor = (ssdHours > 7 || isSsdExtreme) ? '#E11D48' : ssdHours > 4 ? '#D97706' : '#CA8A04';
      const ssdMeter = (ssdHours > 7 || isSsdExtreme) ? 5 : ssdHours > 4 ? 4 : 3;

      const queues = [
        {
          name: lang === 'te' ? 'సర్వదర్శనం' : 'Sarva Darshan',
          subtitle: lang === 'te' ? 'ఉచిత సాధారణ క్యూ' : 'Free General Queue',
          wait: sarvaWait,
          label: sarvaLabel,
          meter: sarvaMeter,
          color: sarvaColor,
          bg: '#FFE4E6'
        },
        {
          name: lang === 'te' ? '₹300 ప్రత్యేక ప్రవేశ దర్శనం' : '₹300 Special Entry Darshan',
          subtitle: lang === 'te' ? 'ఆన్‌లైన్ బుకింగ్ స్లాట్' : 'Online Booked Slot',
          category: lang === 'te' ? '₹300 టికెట్ ఉన్నవారికి' : 'For ₹300 ticket holders',
          wait: specialWait,
          label: specialLabel,
          meter: specialMeter,
          color: specialColor,
          bg: '#FEF3C7'
        },
        {
          name: lang === 'te' ? 'ఉచిత సమయ స్లాట్ దర్శనం' : 'Free Time-Slotted Darshan',
          subtitle: lang === 'te' ? 'టోకెన్ ఆధారిత ప్రవేశం' : 'Token-based Entry',
          wait: ssdWait,
          label: ssdLabel,
          meter: ssdMeter,
          color: ssdColor,
          bg: '#FFE4E6'
        }
      ];

      const shareText = lang === 'te'
        ? `🛕 *నేటి తిరుమల దర్శనం & రద్దీ సమాచారం (${dayName})*\n\n` +
          `• సర్వదర్శనం (ఉచితం): *${sarvaWait}* [${sarvaLabel}]\n` +
          `• ₹300 ప్రత్యేక ప్రవేశ దర్శనం: *${specialWait}* [${specialLabel}]\n` +
          `• ఉచిత సమయ స్లాట్ దర్శనం: *${ssdWait}* [${ssdLabel}]\n` +
          `• రద్దీ స్థితి: *${whyThatNowText}*\n` +
          `• ఘాట్ రోడ్లు: *ప్రస్తుతం తెరిచి ఉన్నాయి*\n\n` +
          `సారథి గైడ్‌లో లైవ్ అప్‌డేట్స్ చూడండి 👇\n${siteUrl}`
        : `🛕 *Live Tirumala Darshan & Crowd Update (${dayName})*\n\n` +
          `• Sarva Darshan (Free): *${sarvaWait}* [${sarvaLabel}]\n` +
          `• ₹300 Special Entry Darshan: *${specialWait}* [${specialLabel}]\n` +
          `• Free Time-Slotted Darshan: *${ssdWait}* [${ssdLabel}]\n` +
          `• Crowd Status: *${whyThatNowText}*\n` +
          `• Ghat Roads: *Open & Operational*\n\n` +
          `Check live updates on Saarthi Guide 👇\n${siteUrl}`;

      // Generate visual shareable card
      const cardBlob = await generateTodayInTirumalaCard({
        dateStr: todayDateStr,
        dayName,
        statusHeadline: whyThatNowText,
        queues,
        weatherTemp: weatherTemp || '26°C',
        crowdSummary: whyThatNowText,
        lang
      });

      if (cardBlob) {
        await shareOrDownloadCard(
          cardBlob,
          `Saarthi-Today-In-Tirumala-${new Date().toISOString().slice(0,10)}.png`,
          lang === 'te' ? 'నేటి తిరుమల దర్శనం అప్‌డేట్' : 'Today in Tirumala Live Update',
          shareText,
          siteUrl
        );
      } else {
        // Fallback to text if canvas fails
        if (typeof navigator !== 'undefined' && navigator.share) {
          try {
            await navigator.share({
              title: lang === 'te' ? 'నేటి తిరుమల దర్శనం అప్‌డేట్' : 'Today in Tirumala Live Update',
              text: `${shareText}\n\n${siteUrl}`,
              url: siteUrl
            });
          } catch (e: any) {
            if (e?.name !== 'AbortError') {
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n\n' + siteUrl)}`, '_blank');
            }
          }
        } else {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n\n' + siteUrl)}`, '_blank');
        }
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        const fallbackUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.saarthiguide.in';
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fallbackUrl)}`, '_blank');
      }
    } finally {
      setIsSharingPulse(false);
    }
  };

  const getSaarthiDecisionScenario = () => {
    let key = overrideScenario;

    const sarvaWaitStr = getDarshanWait('sarva');
    const overallWaitStr = liveWaitTime || sarvaWaitStr;
    const maxWaitHrs = Math.max(getMaxWaitHours(sarvaWaitStr), getMaxWaitHours(overallWaitStr));

    const isHeavyWait = maxWaitHrs >= 8 || crowdLevel === 'high' || crowdLevel === 'very-high';
    const isModerateWait = (maxWaitHrs >= 4 && maxWaitHrs < 8) || crowdLevel === 'moderate';
    const isTrulyLowWait = maxWaitHrs > 0 && maxWaitHrs < 4 && crowdLevel === 'low';

    if (key === 'auto') {
      if (isNight) key = 'night';
      else if (isRainy) key = 'blue';
      else if (ssdTokenStatus === 'issuing') key = 'orange';
      else if (isHeavyWait) key = 'red';
      else if (isModerateWait) key = 'yellow';
      else if (isTrulyLowWait) key = 'green';
      else key = 'yellow';
    }

    switch (key) {
      case 'green':
        return {
          key: 'green',
          badge: t.badges.lowCrowd,
          badgeDot: '#34D399',
          subtitle: t.subtitles.green,
          bgGradient: 'linear-gradient(135deg, #0F6A4B 0%, #064E3B 100%)',
          btnBg: '#059669',
          accentColor: '#059669',
          boxShadow: '0 14px 32px rgba(15, 106, 75, 0.25)',
          currentWait: liveWaitTime,
          bestTime: adminBestTime || 'Now',
          metrics: [],
          darshanWaits: {
            sarva: getDarshanWait('sarva'),
            ssd:   getDarshanWait('ssd'),
            special: getDarshanWait('special'),
          },
          recommendation: t.recommendations.green,
          why: t.why.green,
          benefit: t.benefits.green,
          cta: t.ctas.green
        };

      case 'yellow':
        return {
          key: 'yellow',
          badge: t.badges.moderateCrowd,
          badgeDot: '#FDE047',
          subtitle: t.subtitles.yellow,
          bgGradient: 'linear-gradient(135deg, #78350F 0%, #451A03 100%)',
          btnBg: '#D97706',
          accentColor: '#D97706',
          boxShadow: '0 14px 32px rgba(120, 53, 15, 0.28)',
          currentWait: liveWaitTime,
          bestTime: adminBestTime || '2:00 PM',
          metrics: [],
          darshanWaits: {
            sarva: getDarshanWait('sarva'),
            ssd:   getDarshanWait('ssd'),
            special: getDarshanWait('special'),
          },
          recommendation: t.recommendations.yellow,
          why: t.why.yellow,
          benefit: t.benefits.yellow,
          cta: t.ctas.yellow
        };

      case 'blue':
        return {
          key: 'blue',
          badge: t.badges.weatherAlert,
          badgeDot: '#60A5FA',
          subtitle: t.subtitles.blue,
          bgGradient: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)',
          btnBg: '#2563EB',
          accentColor: '#2563EB',
          boxShadow: '0 14px 32px rgba(30, 58, 138, 0.3)',
          currentWait: liveWaitTime,
          bestTime: adminBestTime || 'After 4 PM',
          metrics: [],
          darshanWaits: {
            sarva: getDarshanWait('sarva'),
            ssd:   getDarshanWait('ssd'),
            special: getDarshanWait('special'),
          },
          recommendation: t.recommendations.blue,
          why: t.why.blue,
          benefit: t.benefits.blue,
          cta: t.ctas.blue
        };

      case 'purple':
        return {
          key: 'purple',
          badge: t.badges.festivalRush,
          badgeDot: '#C084FC',
          subtitle: t.subtitles.purple,
          bgGradient: 'linear-gradient(135deg, #581C87 0%, #3B0764 100%)',
          btnBg: '#9333EA',
          accentColor: '#9333EA',
          boxShadow: '0 14px 32px rgba(88, 28, 135, 0.3)',
          currentWait: liveWaitTime,
          bestTime: adminBestTime || 'Tomorrow 6 AM',
          metrics: [],
          darshanWaits: {
            sarva: getDarshanWait('sarva'),
            ssd:   getDarshanWait('ssd'),
            special: getDarshanWait('special'),
          },
          recommendation: t.recommendations.purple,
          why: t.why.purple,
          benefit: t.benefits.purple,
          cta: t.ctas.purple
        };

      case 'orange':
        return {
          key: 'orange',
          badge: t.badges.ssdOpen,
          badgeDot: '#FB923C',
          subtitle: t.subtitles.orange,
          bgGradient: 'linear-gradient(135deg, #9A3412 0%, #7C2D12 100%)',
          btnBg: '#EA580C',
          accentColor: '#EA580C',
          boxShadow: '0 14px 32px rgba(154, 52, 18, 0.3)',
          currentWait: liveWaitTime,
          bestTime: adminBestTime || 'Right Now',
          metrics: [],
          darshanWaits: {
            sarva: getDarshanWait('sarva'),
            ssd:   getDarshanWait('ssd'),
            special: getDarshanWait('special'),
          },
          recommendation: t.recommendations.orange,
          why: t.why.orange,
          benefit: t.benefits.orange,
          cta: t.ctas.orange
        };

      case 'night':
        return {
          key: 'night',
          badge: t.badges.nightUpdate,
          badgeDot: '#818CF8',
          subtitle: t.subtitles.night,
          bgGradient: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
          btnBg: '#4F46E5',
          accentColor: '#4F46E5',
          boxShadow: '0 14px 32px rgba(30, 27, 75, 0.3)',
          currentWait: liveWaitTime,
          bestTime: adminBestTime || '7:30 AM',
          metrics: [],
          darshanWaits: {
            sarva: getDarshanWait('sarva'),
            ssd:   getDarshanWait('ssd'),
            special: getDarshanWait('special'),
          },
          recommendation: t.recommendations.night,
          why: t.why.night,
          benefit: t.benefits.night,
          cta: t.ctas.night
        };

      case 'alert':
        return {
          key: 'alert',
          badge: t.badges.importantAdvisory,
          badgeDot: '#F87171',
          subtitle: t.subtitles.alert,
          bgGradient: 'linear-gradient(135deg, #881337 0%, #4C0519 100%)',
          btnBg: '#E11D48',
          accentColor: '#E11D48',
          boxShadow: '0 14px 32px rgba(136, 19, 55, 0.3)',
          currentWait: '45m Delay',
          bestTime: 'Ghat Bus Route',
          metrics: [
            { label: 'Alipiri', value: 'Closed' },
            { label: 'Ghat Rd', value: 'Open' },
            { label: 'Traffic', value: 'Diverted' },
            { label: 'Delay', value: '+45 mins' }
          ],
          darshanWaits: null,
          recommendation: t.recommendations.alert,
          why: t.why.alert,
          benefit: t.benefits.alert,
          cta: t.ctas.alert
        };

      case 'red':
      default:
        return {
          key: 'red',
          badge: t.badges.heavyCrowd,
          badgeDot: '#EF4444',
          subtitle: t.subtitles.red,
          bgGradient: 'linear-gradient(135deg, #7F1D1D 0%, #450A0A 100%)',
          btnBg: '#C2410C',
          accentColor: '#C2410C',
          boxShadow: '0 14px 32px rgba(127, 29, 29, 0.28)',
          currentWait: liveWaitTime,
          bestTime: adminBestTime || '5:15 PM',
          metrics: [],
          darshanWaits: {
            sarva: getDarshanWait('sarva'),
            ssd:   getDarshanWait('ssd'),
            special: getDarshanWait('special'),
          },
          recommendation: t.recommendations.red,
          why: t.why.red,
          benefit: t.benefits.red,
          cta: t.ctas.red
        };
    }
  };

  const [showBlessing, setShowBlessing] = useState(false);
  const [isChanting, setIsChanting] = useState(false);
  const [justCompletedMala, setJustCompletedMala] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [previewBead, setPreviewBead] = useState<number | null>(null);
  const cooldownTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Sound toggle (persisted in localStorage)
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('srivari_japa_sound') !== 'muted';
    }
    return true;
  });

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSoundEnabled((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('srivari_japa_sound', next ? 'enabled' : 'muted');
      }
      setAudioGloballyEnabled(next);
      if (!next) {
        stopAllAudio();
      } else if (showBlessing) {
        startJapaAmbient(0.35);
      }
      return next;
    });
    triggerBeadHaptic(false);
  };

  const handleOpenBlessing = () => {
    setShowBlessing(true);
    if (isSoundEnabled) {
      transitionToJapa();
    }
    triggerBeadHaptic(false);
  };

  const handleCloseBlessing = () => {
    setShowBlessing(false);
    returnFromJapa(false);
  };

  // Bead counter within current Mala: 1 to 108
  const [chantCount, setChantCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const stored = parseInt(localStorage.getItem('srivari_chant_count') || '1', 10);
      return stored >= 1 && stored <= 108 ? stored : 1;
    }
    return 1;
  });

  // Total completed Malas (each Mala = 108 chants)
  const [completedMalas, setCompletedMalas] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('srivari_completed_malas') || '0', 10);
    }
    return 0;
  });

  // 10-second meditative cadence countdown effect
  React.useEffect(() => {
    if (cooldownSeconds > 0) {
      cooldownTimerRef.current = setTimeout(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            // 10s cooldown expired! Play harmonic reflection resolution cue & advance
            if (isSoundEnabled) {
              playReflectionEnd();
            }
            setChantCount((curr) => {
              if (curr < 108) {
                const next = curr + 1;
                if (typeof window !== 'undefined') {
                  localStorage.setItem('srivari_chant_count', next.toString());
                }
                return next;
              }
              return curr;
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    };
  }, [cooldownSeconds, isSoundEnabled]);

  const handleChantTap = () => {
    if (cooldownSeconds > 0) {
      triggerBeadHaptic(false);
      return;
    }

    const is108Reach = chantCount >= 108;
    const isQuarterMilestone = chantCount === 27 || chantCount === 54 || chantCount === 81;

    if (isSoundEnabled) {
      if (is108Reach) {
        playJapa108Complete();
      } else if (isQuarterMilestone) {
        playQuarterMilestone();
      } else {
        playBeadComplete();
      }
    }
    triggerBeadHaptic(is108Reach);

    setIsChanting(true);
    setShowBlessing(true);
    setPreviewBead(null); // Reset preview back to active chant bead
    setTimeout(() => setIsChanting(false), 300);

    if (is108Reach) {
      // 🪔 Milestone reached! 108 chants completed.
      const nextMalas = completedMalas + 1;
      setCompletedMalas(nextMalas);
      setJustCompletedMala(true);
      setCooldownSeconds(0);
      if (typeof window !== 'undefined') {
        localStorage.setItem('srivari_completed_malas', nextMalas.toString());
      }
    } else {
      // Start the 10-second meditative reflection cadence on this bead
      setCooldownSeconds(10);
    }
  };

  const handleStartNextMala = () => {
    setChantCount(1);
    setJustCompletedMala(false);
    setCooldownSeconds(0);
    setPreviewBead(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('srivari_chant_count', '1');
    }
    if (isSoundEnabled) {
      playBeadComplete();
      startJapaAmbient(0.35);
    }
    triggerBeadHaptic(false);
  };

  const handleResetMala = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setChantCount(1);
    setJustCompletedMala(false);
    setCooldownSeconds(0);
    setPreviewBead(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('srivari_chant_count', '1');
    }
    triggerBeadHaptic(false);
  };

  const handleShareBlessing = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isSharingJapa) return;
    setIsSharingJapa(true);

    let shareMessage = '';
    try {
      const activeBead = previewBead !== null ? previewBead : chantCount;
      const currentNama = getGovindaNamaForBead(activeBead);
      const isMilestone = activeBead === 27 || activeBead === 54 || activeBead === 81;
      const cardType: 'bead' | 'milestone' = isMilestone ? 'milestone' : 'bead';
      const siteUrl = 'https://saarthiguide.in';

      const text = lang === 'te'
        ? `✨ 📿 *శ్రీ వేంకటేశ్వర 108 దివ్య నామ జప మాల* 📿 ✨
━━━━━━━━━━━━━━━━━━━━━━━━
🌸 *నామం #${activeBead}/108:*
*${currentNama.namaTe}*
_(${currentNama.namaEn})_

🌿 *దివ్య ఆశీర్వచనం:*
"${currentNama.blessingTe}"

🕊️ _${currentNama.blessingEn}_
━━━━━━━━━━━━━━━━━━━━━━━━
🪔 *మాల ప్రగతి:* ${activeBead}/108 నామ జపం పూర్తయింది${completedMalas > 0 ? ` | సంపూర్ణ మాలలు: ${completedMalas}` : ''}
🙏 మీరూ శ్రీవారి 108 నామ జప సాధన చేయండి:
👉 ${siteUrl}
━━━━━━━━━━━━━━━━━━━━━━━━
_ఓం నమో వేంకటేశాయ • సర్వే జనాః సుఖినో భవంతు_`
        : `✨ 📿 *Srivari 108 Sacred Japa Mala* 📿 ✨
━━━━━━━━━━━━━━━━━━━━━━━━
🌸 *Bead #${activeBead} of 108:*
*${currentNama.namaTe}*
_(${currentNama.namaEn})_

🌿 *Divine Blessing & Grace:*
"${currentNama.blessingEn}"

🕊️ _"${currentNama.blessingTe}"_
━━━━━━━━━━━━━━━━━━━━━━━━
🪔 *Mala Progress:* ${activeBead}/108 Beads Chanted${completedMalas > 0 ? ` | Completed Malas: ${completedMalas}` : ''}
🙏 Chant Srivari 108 Japa Mala on Saarthi:
👉 ${siteUrl}
━━━━━━━━━━━━━━━━━━━━━━━━
_Om Namo Venkatesaya • Peace & Auspicious Blessings to All_`;

      shareMessage = text;

      const blob = await generateJapaCard({
        type: cardType,
        beadNumber: activeBead,
        namaTe: currentNama.namaTe,
        namaEn: currentNama.namaEn,
        blessingTe: currentNama.blessingTe,
        blessingEn: currentNama.blessingEn,
        completedMalas,
        lang
      });

      if (blob) {
        await shareOrDownloadCard(
          blob,
          `Saarthi-Japa-Bead-${activeBead}.png`,
          lang === 'te' ? `శ్రీ వేంకటేశ్వర నామ జపం #${activeBead}` : `Srivari Japa Mala Bead #${activeBead}`,
          text,
          siteUrl
        );
      } else {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage || 'https://saarthiguide.in')}`, '_blank');
      }
    } finally {
      setIsSharingJapa(false);
    }
  };

  const handleShareMalaPoorthi = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isSharingJapa) return;
    setIsSharingJapa(true);

    let shareMessage = '';
    try {
      const siteUrl = 'https://saarthiguide.in';
      const text = lang === 'te'
        ? `🎉 📿 *శ్రీ వేంకటేశ్వర 108 జప మాల సంపూర్ణం!* 📿 🎉
━━━━━━━━━━━━━━━━━━━━━━━━
స్వామివారి దివ్య కృపతో ఈరోజు *108 దివ్య నామాల సంపూర్ణ జప మాల* విజయవంతంగా పూర్తి చేయడమైనది! 🪔

✨ *శ్రీ వేంకటాచలాధీశ్వర పరబ్రహ్మణే నమః* ✨

🌸 *దివ్య ఫలశ్రుతి:*
"శ్రీ వేంకటేశ్వర పవిత్ర నామ సంకీర్తనం సకల పాపహరం, మనశ్శాంతి ప్రదాయకం, సర్వ శుభప్రదం."
_("Chanting the 108 divine names of Lord Srinivasa brings peace, protection, and boundless auspicious blessings.")_

🏆 *పూర్తయిన మాలలు:* ${completedMalas} (${completedMalas * 108} దివ్య జపాలు)
━━━━━━━━━━━━━━━━━━━━━━━━
🙏 మీరూ శ్రీవారి 108 జప మాల సాధన చేయండి:
👉 ${siteUrl}
━━━━━━━━━━━━━━━━━━━━━━━━
_ఓం నమో వేంకటేశాయ • శ్రీ పద్మావతీ సమేత శ్రీనివాసాయ నమః_`
        : `🎉 📿 *Srivari 108 Japa Mala Completed!* 📿 🎉
━━━━━━━━━━━━━━━━━━━━━━━━
By the divine grace of Lord Srinivasa, completed the sacred *108 Divine Names Japa Mala*! 🪔

✨ *Om Namo Venkatesaya* ✨

🌸 *Sacred Phalasruthi:*
"Chanting the holy 108 names of Sri Venkateswara removes obstacles, brings tranquil peace of mind, and boundless auspicious fulfillment."

🏆 *Completed Malas:* ${completedMalas} (${completedMalas * 108} divine chants)
━━━━━━━━━━━━━━━━━━━━━━━━
🙏 Chant Srivari 108 Japa Mala on Saarthi:
👉 ${siteUrl}
━━━━━━━━━━━━━━━━━━━━━━━━
_Om Namo Venkatesaya • Sri Padmavathi Sametha Srinivasaya Namaha_`;

      shareMessage = text;

      const lastNama = getGovindaNamaForBead(108);
      const blob = await generateJapaCard({
        type: 'poorthi',
        beadNumber: 108,
        namaTe: lastNama.namaTe,
        namaEn: lastNama.namaEn,
        blessingTe: 'స్వామివారి సంపూర్ణ ఆశీస్సులు, సకల పాప నివారణ, కుటుంబంలో నిరంతర ఆనందం వర్ధిల్లుగాక!',
        blessingEn: 'May Lord Venkateswara shower eternal grace, supreme fulfillment, vibrant health, and boundless peace upon your family!',
        completedMalas,
        lang
      });

      if (blob) {
        await shareOrDownloadCard(
          blob,
          `Saarthi-108-Mala-Poorthi.png`,
          lang === 'te' ? 'శ్రీ వేంకటేశ్వర 108 జప మాల సంపూర్ణం!' : 'Srivari 108 Japa Mala Completed!',
          text,
          siteUrl
        );
      } else {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage || 'https://saarthiguide.in')}`, '_blank');
      }
    } finally {
      setIsSharingJapa(false);
    }
  };

  const scenario = getSaarthiDecisionScenario();
  const todayDateStr = new Date().toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-GB', { day: 'numeric', month: 'short' });
  const dayShort = new Date().toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-US', { weekday: 'short' });

  const handleCycleScenario = () => {
    const list = ['auto', 'green', 'yellow', 'red', 'blue', 'purple', 'orange', 'night', 'alert'];
    const nextIdx = (list.indexOf(overrideScenario) + 1) % list.length;
    setOverrideScenario(list[nextIdx]);
  };
  return (
    <div style={{ fontFamily: 'var(--font-body)', background: '#FAF8F4', width: '100%', maxWidth: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>

      {/* ══════════ MODERN CLASSIC HEADER ══════════ */}
      {!hideHeader && (
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: '#FFFFFF',
          boxShadow: '0 1px 0 rgba(212,175,55,0.15), 0 2px 12px rgba(0,0,0,0.04)',
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'hidden',
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: '100%',
            padding: '0 clamp(8px, 2.5vw, 14px)',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            boxSizing: 'border-box'
          }}>

            {/* Left — Official Saarthi Brand Lockup */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', flexShrink: 0 }}>
              <Logo size={28} />
              <span className="notranslate" style={{
                fontSize: 'clamp(17px, 4.2vw, 20px)',
                fontWeight: 900,
                color: '#0F5132',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                fontFamily: 'Georgia, "Times New Roman", serif',
                whiteSpace: 'nowrap',
              }}>
                Saarthi
              </span>
            </Link>

            {/* Right — Location Badge, Language Toggle & Notification Bell */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0, flexShrink: 1, justifyContent: 'flex-end' }}>
              <LocationPill 
                locationName={selectedLocation} 
                isGpsActive={locationPermission === 'granted'}
                onClick={() => setIsLocationModalOpen(true)} 
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '11px', 
                  gap: '3px', 
                  maxWidth: 'clamp(94px, 30vw, 140px)' 
                }}
              />

              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => setAppLanguage(lang === 'en' ? 'te' : 'en')}
                aria-label={lang === 'en' ? 'Switch to Telugu (తెలుగు)' : 'Switch to English'}
                title={lang === 'en' ? 'తెలుగులోకి మార్చండి' : 'Switch to English'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '4px 7px',
                  borderRadius: '9999px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  color: '#0F5132',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  userSelect: 'none',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  transition: 'all 0.15s ease',
                  WebkitTapHighlightColor: 'transparent',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <Languages size={13} color="#0F5132" strokeWidth={2.2} />
                <span>{lang === 'en' ? 'తెలుగు' : 'EN'}</span>
              </button>

              <Link href="/alerts" aria-label="Notifications" style={{
                width: '32px', height: '32px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textDecoration: 'none', position: 'relative'
              }}>
                <Bell size={18} color="#0F5132" strokeWidth={1.9} />
                {(activeAlertsCount ?? 0) > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '1px', right: '1px',
                    minWidth: '15px', height: '15px',
                    borderRadius: '8px',
                    background: '#DC2626',
                    border: '1.5px solid #FFFFFF',
                    color: '#FFFFFF',
                    fontSize: '9px', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    letterSpacing: '-0.02em',
                  }}>
                    {activeAlertsCount > 99 ? '99+' : activeAlertsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* DYNAMIC REGION / STARTING LOCATION SELECTOR MODAL */}
          <LocationPickerModal
            isOpen={isLocationModalOpen}
            onClose={() => setIsLocationModalOpen(false)}
            selectedLocationName={selectedLocation}
            onSelectLocation={(name) => setSelectedLocation(name)}
          />

          {/* Refined golden accent line */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, #E2E8F0 25%, #CBD5E1 50%, #E2E8F0 75%, transparent 100%)',
            opacity: 0.6
          }} />
        </header>
      )}

      {/* ══════════ SCROLLABLE CONTENT ══════════ */}
      <div style={{ padding: hideHeader ? '0' : '10px clamp(8px, 3vw, 12px) 16px', background: hideHeader ? 'transparent' : 'var(--bg-canvas, #FAF8F5)', width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>

        {!hideHeader && (
          <>
            {/* ══════════ DEVOTIONAL INVOCATION & 108 JAPA MALA BAR ══════════ */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              flexWrap: 'nowrap', 
              gap: 'clamp(4px, 1.5vw, 8px)', 
              marginBottom: '10px', 
              position: 'relative', 
              width: '100%', 
              maxWidth: '100%', 
              boxSizing: 'border-box' 
            }}>
              {/* Left: Today's Day, Date & Live Weather */}
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 'clamp(2.5px, 0.8vw, 4px)', 
                fontSize: 'clamp(9.5px, 2.5vw, 11px)', 
                fontWeight: 600, 
                color: '#475569', 
                whiteSpace: 'nowrap', 
                flexShrink: 1,
                minWidth: 0,
                padding: '4px clamp(6px, 1.8vw, 10px)',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                boxSizing: 'border-box'
              }}>
                <span style={{ fontWeight: 800, color: '#B45309', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {dayShort}, {todayDateStr}
                </span>
                <span style={{ opacity: 0.35 }}>•</span>
                <Sun size={12} color="#D97706" style={{ flexShrink: 0 }} />
                <span style={{ fontWeight: 700, color: '#334155', flexShrink: 0 }}>{weatherTemp || '26°C'}</span>
              </div>

              {/* Right: Dedicated Srivari 108 Japa Mala Button (Gestalt Focal Point & Affordance) */}
              <button
                type="button"
                onClick={handleOpenBlessing}
                aria-label={lang === 'te' ? 'ఓం నమో వేంకటేశాయ 108 జప మాల' : 'Om Namo Venkatesaya 108 Japa Mala'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'clamp(3px, 1vw, 5px)',
                  padding: '3.5px clamp(6px, 1.8vw, 9px)',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #FFFDF7 0%, #FEF3C7 55%, #FDE68A 100%)',
                  border: '1.5px solid #D97706',
                  boxShadow: '0 2px 6px rgba(217, 119, 6, 0.16)',
                  fontSize: 'clamp(9.5px, 2.6vw, 11.5px)',
                  fontWeight: 800,
                  color: '#78350F',
                  cursor: 'pointer',
                  transform: isChanting ? 'scale(0.96)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  boxSizing: 'border-box'
                }}
              >
                <Sparkles size={11} color="#D97706" style={{ animation: isChanting ? 'spin 0.4s ease' : 'none', flexShrink: 0 }} />
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0px', flexShrink: 0 }}>
                  <span style={{ whiteSpace: 'nowrap', lineHeight: 1.2 }}>
                    {lang === 'te' ? 'ఓం నమో వేంకటేశాయ' : 'Om Namo Venkatesaya'}
                  </span>
                  <span style={{ fontSize: 'clamp(7px, 1.8vw, 7.5px)', fontWeight: 600, color: '#92400E', opacity: 0.75, lineHeight: 1, letterSpacing: '0.02em' }}>
                    {lang === 'te' ? 'జప మాల • నొక్కండి' : 'Japa Mala • Tap to Chant'}
                  </span>
                </span>
                <span style={{
                  fontSize: 'clamp(8.5px, 2.2vw, 9.5px)',
                  fontWeight: 900,
                  color: '#FEF3C7',
                  background: '#78350F',
                  padding: '1.5px clamp(4px, 1.2vw, 6px)',
                  borderRadius: '10px',
                  border: '1px solid rgba(253, 224, 71, 0.4)',
                  lineHeight: 1.2,
                  letterSpacing: '0.02em',
                  flexShrink: 0
                }}>
                  {chantCount}/108
                </span>
              </button>
            </div>

            {/* ══════════ 📿 HIGH-FIDELITY JAPA MALA MODAL ══════════ */}
            <JapaMalaModal 
              isOpen={showBlessing} 
              onClose={handleCloseBlessing} 
              lang={lang} 
            />
          </>
        )}

      {/* 🎬 HIGH-FIDELITY SAARTHI HERO ANIMATED BANNER (OFFLINE WEBP POSTER + MP4 HYBRID) */}
      <div style={{
        position: 'relative',
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '14px',
        boxShadow: '0 6px 20px rgba(15, 23, 42, 0.08)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        background: '#FAF8F4 url(/banner/banner_poster.webp) center center / cover no-repeat',
        aspectRatio: '16 / 9'
      }}>
        <video
          ref={bannerVideoRef}
          src="/banner/homescreen-banner.mp4"
          autoPlay
          loop
          muted
          playsInline
          {...{
            'webkit-playsinline': 'true',
            'x5-playsinline': 'true',
            'x5-video-player-type': 'h5',
            'x5-video-player-fullscreen': 'false'
          } as any}
          disablePictureInPicture
          disableRemotePlayback
          controls={false}
          controlsList="nodownload nofallback noremoteplayback noplaybackrate"
          poster="/banner/banner_poster.webp"
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={(e) => {
            e.currentTarget.defaultMuted = true;
            e.currentTarget.muted = true;
            if (e.currentTarget.textTracks) {
              for (let i = 0; i < e.currentTarget.textTracks.length; i++) {
                e.currentTarget.textTracks[i].mode = 'disabled';
              }
            }
            e.currentTarget.play().then(() => setIsVideoPlaying(true)).catch(() => {});
          }}
          onLoadedData={(e) => {
            e.currentTarget.defaultMuted = true;
            e.currentTarget.muted = true;
            if (e.currentTarget.textTracks) {
              for (let i = 0; i < e.currentTarget.textTracks.length; i++) {
                e.currentTarget.textTracks[i].mode = 'disabled';
              }
            }
            e.currentTarget.play().then(() => setIsVideoPlaying(true)).catch(() => {});
          }}
          onPlaying={() => setIsVideoPlaying(true)}
          onTimeUpdate={(e) => {
            if (e.currentTarget.currentTime > 0 && !isVideoPlaying) {
              setIsVideoPlaying(true);
            }
          }}
          onError={() => setIsVideoPlaying(false)}
          onPause={(e) => {
            e.currentTarget.defaultMuted = true;
            e.currentTarget.muted = true;
            e.currentTarget.play().then(() => setIsVideoPlaying(true)).catch(() => {});
          }}
          onEnded={(e) => {
            e.currentTarget.currentTime = 0;
            e.currentTarget.play().then(() => setIsVideoPlaying(true)).catch(() => {});
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            display: 'block',
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            opacity: isVideoPlaying ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out'
          }}
        />


        {/* Right Side Transparent Touch Hotspots (Matching Video's Built-in Buttons) */}
        <div style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 5
        }}>
          <Link
            href="/darshan/sarva-darshan"
            aria-label={lang === 'te' ? 'దర్శనం' : 'Darshan'}
            title={lang === 'te' ? 'దర్శనం' : 'Darshan'}
            style={{
              width: '105px',
              height: '32px',
              borderRadius: '20px',
              background: 'transparent',
              display: 'block',
              textDecoration: 'none',
              WebkitTapHighlightColor: 'transparent',
              cursor: 'pointer'
            }}
          />
          <Link
            href="/darshan/ssd-token"
            aria-label={lang === 'te' ? 'టోకెన్లు' : 'Tokens'}
            title={lang === 'te' ? 'టోకెన్లు' : 'Tokens'}
            style={{
              width: '105px',
              height: '32px',
              borderRadius: '20px',
              background: 'transparent',
              display: 'block',
              textDecoration: 'none',
              WebkitTapHighlightColor: 'transparent',
              cursor: 'pointer'
            }}
          />
          <Link
            href="/explore"
            aria-label={lang === 'te' ? 'సమీపంలోనివి' : 'Nearby'}
            title={lang === 'te' ? 'సమీపంలోనివి' : 'Nearby'}
            style={{
              width: '105px',
              height: '32px',
              borderRadius: '20px',
              background: 'transparent',
              display: 'block',
              textDecoration: 'none',
              WebkitTapHighlightColor: 'transparent',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

      {/* 🛕 SIGNATURE LIVE TEMPLE PULSE (BLACK OUTLINE INSIDE WHITE GLASS) */}
      <div style={{
        background: isRainy
          ? 'linear-gradient(165deg, rgba(240, 249, 255, 0.96) 0%, rgba(224, 242, 254, 0.90) 50%, rgba(241, 245, 249, 0.93) 100%)'
          : 'linear-gradient(165deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.88) 100%)',
        borderRadius: '20px',
        padding: '14px 12px',
        color: '#0F172A',
        boxShadow: isRainy
          ? '0 16px 40px rgba(14, 116, 144, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05)'
          : '0 16px 40px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
        border: isRainy ? '1.5px solid #38BDF8' : '1.5px solid #0F172A',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Top Accent Beam */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '2px',
          background: isRainy
            ? 'linear-gradient(90deg, transparent 0%, #0284C7 30%, #38BDF8 50%, #0284C7 70%, transparent 100%)'
            : 'linear-gradient(90deg, transparent 0%, #D97706 30%, #F59E0B 50%, #D97706 70%, transparent 100%)',
          opacity: 0.85
        }} />

        {/* 🌧️ REAL-TIME TIRUMALA RAIN EFFECT (ONLY ACTIVE WHEN RAINING IN TIRUMALA VIA WEATHER API) */}
        {isRainy && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 1,
              overflow: 'hidden',
              borderRadius: '20px',
            }}
          >
            <style>{`
              @keyframes raindrop-fall {
                0% {
                  transform: translateY(-24px) translateX(0);
                  opacity: 0;
                }
                20% {
                  opacity: 0.7;
                }
                80% {
                  opacity: 0.7;
                }
                100% {
                  transform: translateY(220px) translateX(-20px);
                  opacity: 0;
                }
              }
              @keyframes raindrop-splash {
                0% {
                  transform: scale(0.2);
                  opacity: 0.8;
                }
                80% {
                  opacity: 0.3;
                }
                100% {
                  transform: scale(1.6);
                  opacity: 0;
                }
              }
            `}</style>
            {/* Falling Rain Streaks */}
            {RAIN_DROPS.map((drop, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: `${drop.left}%`,
                  width: `${drop.width}px`,
                  height: `${drop.height}px`,
                  background: 'linear-gradient(180deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0.55) 60%, rgba(14, 165, 233, 0.9) 100%)',
                  borderRadius: '2px',
                  transform: 'rotate(12deg)',
                  animation: `raindrop-fall ${drop.duration}s linear infinite`,
                  animationDelay: `${drop.delay}s`,
                  willChange: 'transform',
                }}
              />
            ))}
            {/* Splash ripples at bottom */}
            {RAIN_SPLASHES.map((splash, i) => (
              <div
                key={`splash-${i}`}
                style={{
                  position: 'absolute',
                  bottom: `${splash.bottom}px`,
                  left: `${splash.left}%`,
                  width: '10px',
                  height: '3.5px',
                  borderRadius: '50%',
                  border: '1px solid rgba(56, 189, 248, 0.65)',
                  animation: `raindrop-splash ${splash.duration}s ease-out infinite`,
                  animationDelay: `${splash.delay}s`,
                  willChange: 'transform',
                }}
              />
            ))}
          </div>
        )}

        {/* 🌟 HEADER: LIVE STATUS BEACON & TITLE */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isRainy ? '#0284C7' : '#EF4444',
              boxShadow: isRainy ? '0 0 8px rgba(2, 132, 199, 0.8)' : '0 0 8px rgba(239, 68, 68, 0.8)',
              display: 'inline-block'
            }} />
            <h2 style={{
              fontSize: '15px',
              fontWeight: 900,
              letterSpacing: '-0.01em',
              color: '#0F172A',
              margin: 0,
              lineHeight: 1.2
            }}>
              {lang === 'te' ? 'తిరుమల లైవ్ స్టేటస్' : 'Tirumala Live Status'}
            </h2>
            {isRainy && (
              <span 
                onClick={() => setTestRainMode(prev => prev === false ? true : (prev === true ? null : false))}
                title="Live Weather API: Rain in Tirumala (Click to test toggle)"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3.5px',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#0369A1',
                  background: 'rgba(224, 242, 254, 0.9)',
                  border: '1px solid rgba(186, 230, 253, 0.95)',
                  padding: '2px 7px',
                  borderRadius: '12px',
                  lineHeight: 1.2,
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <CloudRain size={11} color="#0284C7" />
                <span>{lang === 'te' ? 'వర్షం' : 'Rain in Tirumala'}</span>
              </span>
            )}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#64748B'
          }}>
            <span>{updatedLabel}</span>
            <RotateCcw size={13} color="#64748B" style={{ cursor: 'pointer' }} onClick={() => window.location.reload()} />
          </div>
        </div>

        {/* 1️⃣ THREE SIDE-BY-SIDE DARSHAN CARDS (100% DYNAMIC FROM ADMIN DB) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px', position: 'relative', zIndex: 2 }}>
          {(() => {
            const sarvaWait = getDarshanWait('sarva');
            const specialWait = getDarshanWait('special');
            const ssdWait = getDarshanWait('ssd');

            const getMaxHours = (text: string): number => {
              const matches = text.match(/\d+/g);
              if (!matches || matches.length === 0) return 0;
              return Math.max(...matches.map(Number));
            };

            // 1. Dynamic Sarva Card Styling
            const sarvaHrs = getMaxHours(sarvaWait);
            const sarvaTheme = sarvaHrs >= 8 || sarvaWait.includes('24') || sarvaWait.includes('30')
              ? { bg: '#FEF2F2', border: '#FECDD3', badgeBg: '#FEE2E2', badgeText: '#991B1B', iconColor: '#DC2626' }
              : sarvaHrs >= 4
              ? { bg: '#FFFDF0', border: '#FDE68A', badgeBg: '#FEF3C7', badgeText: '#92400E', iconColor: '#D97706' }
              : { bg: '#F0FDF4', border: '#BBF7D0', badgeBg: '#DCFCE7', badgeText: '#166534', iconColor: '#059669' };

            // 2. Dynamic Special Entry Card Styling
            const specialHrs = getMaxHours(specialWait);
            const specialTheme = specialHrs > 6
              ? { bg: '#FEF2F2', border: '#FECDD3', badgeBg: '#FEE2E2', badgeText: '#991B1B', iconColor: '#DC2626' }
              : specialHrs >= 3
              ? { bg: '#FFFDF0', border: '#FDE68A', badgeBg: '#FEF3C7', badgeText: '#92400E', iconColor: '#D97706' }
              : { bg: '#F0FDF4', border: '#BBF7D0', badgeBg: '#DCFCE7', badgeText: '#166534', iconColor: '#059669' };

            // 3. Dynamic SSD Tokens Card State & Styling (Admin liveStatus.ssdTokenStatus)
            const isSsdClosed = /cancel|full|heavy|rush|crowd|closed|stop/i.test(ssdWait) || ssdTokenStatus === 'closed-for-day' || ssdTokenStatus === 'closed';
            const isSsdPaused = ssdTokenStatus === 'paused';
            const isSsdIssuing = ssdTokenStatus === 'issuing' || liveSSD.toLowerCase().includes('issuing') || liveSSD.toLowerCase().includes('open');

            let ssdTheme = { bg: '#FEF2F2', border: '#FECDD3', badgeBg: '#FEE2E2', badgeText: '#991B1B', iconColor: '#DC2626', iconComp: <TicketX size={24} color="#DC2626" />, waitText: lang === 'te' ? 'నేడు ముగిసింది' : 'Closed Today' };
            if (isSsdIssuing) {
              ssdTheme = { bg: '#F0FDF4', border: '#BBF7D0', badgeBg: '#DCFCE7', badgeText: '#166534', iconColor: '#059669', iconComp: <Ticket size={24} color="#059669" />, waitText: ssdWait !== '2–4 hrs' ? ssdWait : (lang === 'te' ? 'జారీ అవుతున్నాయి' : 'Issuing Now') };
            } else if (isSsdPaused) {
              ssdTheme = { bg: '#FFFDF0', border: '#FDE68A', badgeBg: '#FEF3C7', badgeText: '#92400E', iconColor: '#D97706', iconComp: <Ticket size={24} color="#D97706" />, waitText: lang === 'te' ? 'తాత్కాలికంగా ఆపబడింది' : 'Paused' };
            } else if (liveSSD !== 'Closed' && liveSSD !== 'Check Counter') {
              ssdTheme.waitText = liveSSD;
            }

            const queueCards = [
              {
                id: 'sarva',
                href: '/darshan/sarva-darshan',
                icon: <Building2 size={24} color={sarvaTheme.iconColor} />,
                title: lang === 'te' ? 'సర్వదర్శనం' : 'Sarva Darshan',
                wait: sarvaWait,
                bg: sarvaTheme.bg,
                border: sarvaTheme.border,
                badgeBg: sarvaTheme.badgeBg,
                badgeText: sarvaTheme.badgeText
              },
              {
                id: 'special',
                href: '/darshan/special-entry',
                icon: <Ticket size={24} color={specialTheme.iconColor} />,
                title: lang === 'te' ? '₹300 ప్రవేశం' : '₹300 Entry',
                wait: specialWait,
                bg: specialTheme.bg,
                border: specialTheme.border,
                badgeBg: specialTheme.badgeBg,
                badgeText: specialTheme.badgeText
              },
              {
                id: 'ssd',
                href: '/darshan/ssd-token',
                icon: ssdTheme.iconComp,
                title: lang === 'te' ? 'SSD టోకెన్లు' : 'SSD Tokens',
                wait: ssdTheme.waitText,
                bg: ssdTheme.bg,
                border: ssdTheme.border,
                badgeBg: ssdTheme.badgeBg,
                badgeText: ssdTheme.badgeText
              }
            ];

            return queueCards.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                style={{
                  textDecoration: 'none',
                  backgroundColor: card.bg,
                  border: `1.5px solid ${card.border}`,
                  borderRadius: '16px',
                  padding: '12px 6px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  justifyContent: 'space-between',
                  minHeight: '118px',
                  boxSizing: 'border-box',
                  transition: 'transform 0.15s ease',
                  cursor: 'pointer'
                }}
                className="darshan-home-card"
              >
                {/* Top Vector Icon */}
                <div style={{
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px'
                }}>
                  {card.icon}
                </div>

                {/* Title */}
                <div style={{
                  fontSize: lang === 'te' ? '12px' : '11.5px',
                  fontWeight: 800,
                  color: '#0F172A',
                  marginBottom: '6px',
                  lineHeight: 1.2
                }}>
                  {card.title}
                </div>

                {/* Status Badge Pill */}
                <div style={{
                  backgroundColor: card.badgeBg,
                  color: card.badgeText,
                  fontSize: '10.5px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  marginBottom: '6px',
                  width: '100%',
                  maxWidth: '92%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {card.wait}
                </div>

                {/* Bottom Chevron Arrow */}
                <ChevronRight size={13} color="#64748B" />
              </Link>
            ));
          })()}
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ height: '1px', backgroundColor: 'rgba(15, 23, 42, 0.12)', marginBottom: '12px' }} />

        {/* 2️⃣ TRAVEL & WEATHER CONDITIONS CAPSULES */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {isNight && (
              <span suppressHydrationWarning style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(30, 58, 138, 0.12)',
                border: '1.5px solid #0F172A',
                padding: '4px 10px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#1E3A8A'
              }}>
                <Moon size={13} color="#1E3A8A" />
                <span>Night</span>
              </span>
            )}
            {isRainy ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(14, 116, 144, 0.12)',
                border: '1.5px solid #0F172A',
                padding: '4px 10px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#0E7490'
              }}>
                <CloudRain size={13} color="#0E7490" />
                <span>Rain</span>
              </span>
            ) : (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(217, 119, 6, 0.12)',
                border: '1.5px solid #0F172A',
                padding: '4px 10px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#B45309'
              }}>
                <Sun size={13} color="#B45309" />
                <span>{weatherTemp || '26°C'}</span>
              </span>
            )}
          </div>

          {/* 1-Tap Share to Family button */}
          <button
            onClick={handleShareTodayPulse}
            disabled={isSharingPulse}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: isSharingPulse ? '#DCFCE7' : '#F0FDF4',
              border: '1.5px solid #16A34A',
              padding: '4px 10px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#166534',
              cursor: isSharingPulse ? 'wait' : 'pointer',
              boxShadow: '0 1px 3px rgba(22, 163, 74, 0.12)',
              transition: 'all 0.15s ease',
              opacity: isSharingPulse ? 0.75 : 1
            }}
            aria-label="Share live updates on WhatsApp"
          >
            <Share2 size={12} color="#166534" />
            <span>{isSharingPulse ? (lang === 'te' ? 'కార్డ్ తయారవుతోంది...' : 'Generating Card...') : (lang === 'te' ? 'కుటుంబానికి షేర్ చేయండి' : 'Share to Family')}</span>
          </button>
        </div>

        {/* 3️⃣ ⭐ DYNAMIC SAARTHI GUIDANCE (WARM IVORY PREMIUM CARD) */}
        {(() => {
          const sarvaWait = getDarshanWait('sarva');
          const sarvaHours = getMaxWaitHours(sarvaWait);
          const isSsdClosed = ssdTokenStatus === 'closed-for-day' || ssdTokenStatus === 'closed';
          const isSsdOpen = ssdTokenStatus === 'issuing';
          const isHeavyRush = sarvaHours >= 8 || crowdLevel === 'high' || crowdLevel === 'very-high';
          const isTrulyLow = sarvaHours > 0 && sarvaHours < 4 && crowdLevel === 'low';

          // Day-of-week auspicious temple mapping (e.g. Monday: Shiva/Kapila, Tuesday: Hanuman/Japali, etc.)
          const dayGuide = getDayTempleGuidance(new Date());

          // Contextual Dynamic Headline & Rationales
          let guidanceHeadline = scenario.recommendation;
          let highlightedBenefit = scenario.benefit || 'Save approx. 4 hours by starting at 6:00 AM';
          let customReasons: string[] = [];

          if (isSsdOpen) {
            guidanceHeadline = lang === 'te' ? 'ఇప్పుడే SSD కౌంటర్‌కు వెళ్లండి. ఉచిత టోకెన్లు జారీ అవుతున్నాయి.' : 'Head to SSD Counter now. Free token slots are issuing.';
            highlightedBenefit = lang === 'te' ? 'సాధారణ క్యూతో పోలిస్తే 10+ గంటలు ఆదా' : 'SAVE OVER 10 HOURS VS GENERAL QUEUE';
            customReasons = [
              lang === 'te' ? 'SSD టోకెన్లు 15+ గంటల సాధారణ క్యూను నివారిస్తాయి' : 'SSD tokens bypass the 15+ hour general queue bottleneck',
              lang === 'te' ? 'అలిపిరి, శ్రీనివాసం కేంద్రాలలో కౌంటర్లు తెరిచి ఉన్నాయి' : 'Alipiri & Srinivasam counters are currently active',
              lang === 'te' ? 'ఈ రోజు దర్శనం కోసం వెంటనే పొందండి' : 'Secure your slotted darshan for today'
            ];
          } else if (isHeavyRush || isSsdClosed) {
            // Dynamic Day-of-Week Temple Recommendation
            guidanceHeadline = lang === 'te' ? dayGuide.headlineTe : dayGuide.headlineEn;
            highlightedBenefit = isSsdClosed 
              ? (lang === 'te' ? 'SSD బంద్ • ముందుగా పుణ్యక్షేత్రాలు దర్శించండి' : 'SSD CLOSED TODAY — VISIT SACRED SHRINES')
              : (lang === 'te' ? dayGuide.benefitTe : dayGuide.benefitEn);
            
            const firstReason = isSsdClosed
              ? (lang === 'te' ? 'అన్ని కౌంటర్లలో నేటి ఉచిత SSD టోకెన్లు పూర్తి' : "Today's free SSD token quota is exhausted across all counters")
              : (lang === 'te' ? `సర్వదర్శనం క్యూ అధిక రద్దీతో ఉంది (${sarvaWait})` : `Sarva Darshan queue has heavy rush (${sarvaWait})`);

            customReasons = lang === 'te' ? [
              firstReason,
              dayGuide.reasonsTe[0],
              isRainy ? 'వర్షం కారణంగా విద్యుత్ బస్సులను ఎంచుకోండి' : dayGuide.reasonsTe[1]
            ] : [
              firstReason,
              dayGuide.reasonsEn[0],
              isRainy ? 'Take APSRTC Electric Bus due to rain on steps' : dayGuide.reasonsEn[1]
            ];
          } else if (isTrulyLow) {
            guidanceHeadline = lang === 'te' ? 'దర్శనానికి అనుకూల సమయం! నేరుగా శ్రీవారి క్యూలో ప్రవేశించండి.' : 'Optimal Darshan window! Enter Srivari queue directly now.';
            highlightedBenefit = lang === 'te' ? 'అత్యంత వేగవంతమైన దర్శనం — నిరీక్షణ స్వల్పం' : 'MINIMAL WAIT TIME — FASTEST ENTRY';
            customReasons = [
              lang === 'te' ? `ప్రస్తుత క్యూ సమయం అనుకూలంగా ఉంది (${sarvaWait})` : `Live queue wait is minimal (${sarvaWait})`,
              lang === 'te' ? 'కంపార్ట్‌మెంట్లు వేగంగా కదులుతున్నాయి' : 'Queue compartments are moving smoothly without delays',
              lang === 'te' ? 'శ్రీవారి ప్రశాంత దర్శనం చేసుకోవడానికి ఉత్తమ సమయం' : 'Ideal time for a peaceful and unhurried Darshan'
            ];
          } else {
            customReasons = [
              scenario.why,
              isRainy 
                ? `Live weather: ${liveWeather || 'Rain Showers'}` 
                : `Weather: ${liveWeather || 'Clear Sky, Pleasant'}`,
              isSsdClosed
                ? 'SSD quota closed today'
                : `Recommended darshan window: ${scenario.bestTime || adminBestTime || 'After 2:00 PM'}`
            ];
          }

          return (
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '16px',
              padding: '14px 16px',
              color: '#0F172A',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
              marginTop: '12px'
            }}>
              {/* Header with Devotional Cue */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '8px'
              }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  color: '#0F5132',
                  textTransform: lang === 'te' ? 'none' : 'uppercase',
                  letterSpacing: lang === 'te' ? 'normal' : '0.6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  flexShrink: 0
                }}>
                  <Sparkles size={14} color="#0F5132" />
                  <span>{lang === 'te' ? 'సారథి మార్గదర్శనం' : 'SAARTHI GUIDANCE'}</span>
                </div>
                <span style={{
                  fontSize: '11px',
                  color: '#92400E',
                  fontWeight: 700,
                  fontStyle: lang === 'te' ? 'normal' : 'italic',
                  textAlign: 'right'
                }}>
                  {lang === 'te' ? '“శాంతితో శ్రీవారిని దర్శించండి”' : '“In calm faith, seek Srivari”'}
                </span>
              </div>
              
              {/* Clean Recommendation Headline */}
              <div style={{
                fontSize: lang === 'te' ? '14px' : '14.5px',
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.35,
                marginBottom: '12px',
                letterSpacing: '-0.01em'
              }}>
                {guidanceHeadline}
              </div>

              {/* VISUAL MICRO-CARDS GRID (Non-redundant, High Contrast) */}
              {(() => {
                const getShortShrine = (en: string, te: string) => {
                  if (en.includes('Papavinasam')) return { en: 'Papavinasam', te: 'పాపవినాశనం' };
                  if (en.includes('Kapila')) return { en: 'Kapila Theertham', te: 'కపిలతీర్థం' };
                  if (en.includes('Japali') || en.includes('Bedi')) return { en: 'Japali Theertham', te: 'జాపాలి తీర్థం' };
                  if (en.includes('Mangapuram')) return { en: 'Mangapuram', te: 'మంగాపురం' };
                  if (en.includes('Appalayagunta')) return { en: 'Appalayagunta', te: 'అప్పలాయగుంట' };
                  if (en.includes('Padmavathi')) return { en: 'Tiruchanur', te: 'తిరుచానూరు' };
                  if (en.includes('Govindaraja')) return { en: 'Govindaraja', te: 'గోవిందరాజ' };
                  return {
                    en: en.replace(/Temple|Theertham|Sri|\(.*\)/gi, '').trim() || 'Sacred Shrine',
                    te: te.replace(/ఆలయం|తీర్థం|శ్రీ|\(.*\)/gi, '').trim() || 'పుణ్యక్షేత్రం'
                  };
                };

                const shortShrine = getShortShrine(dayGuide.placeName || '', dayGuide.placeNameTe || '');

                const visualCards = isSsdClosed ? [
                  {
                    icon: <Flame size={13} color="#D97706" />,
                    bg: '#FFFDF0',
                    border: '1px solid #FDE68A',
                    title: lang === 'te' ? 'నేటి విశేషం' : 'Sacred Shrine',
                    value: lang === 'te' ? shortShrine.te : shortShrine.en,
                    color: '#92400E'
                  },
                  {
                    icon: <Navigation size={13} color="#2563EB" />,
                    bg: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    title: lang === 'te' ? 'ఉత్తమ మార్గం' : 'Best Route',
                    value: lang === 'te' ? 'స్థానిక క్షేత్రాలు' : 'Local Shrines',
                    color: '#1E40AF'
                  },
                  {
                    icon: <Clock size={13} color="#059669" />,
                    bg: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    title: lang === 'te' ? 'అనుకూల సమయం' : 'Optimal Time',
                    value: lang === 'te' ? 'ఉదయం వేళలు' : 'Early Morning',
                    color: '#065F46'
                  }
                ] : (isSsdOpen ? [
                  {
                    icon: <Ticket size={13} color="#16A34A" />,
                    bg: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    title: lang === 'te' ? 'కౌంటర్లు' : 'SSD Status',
                    value: lang === 'te' ? 'జారీ అవుతున్నాయి' : 'Issuing Now',
                    color: '#166534'
                  },
                  {
                    icon: <Clock size={13} color="#2563EB" />,
                    bg: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    title: lang === 'te' ? 'సమయం ఆదా' : 'Time Saved',
                    value: lang === 'te' ? '10+ గంటలు' : 'Save 10+ Hrs',
                    color: '#1E40AF'
                  },
                  {
                    icon: <MapPin size={13} color="#D97706" />,
                    bg: '#FFFDF0',
                    border: '1px solid #FDE68A',
                    title: lang === 'te' ? 'కేంద్రాలు' : 'Counters',
                    value: lang === 'te' ? 'అలిపిరి & శ్రీనివాసం' : 'Alipiri & Srinivasam',
                    color: '#92400E'
                  }
                ] : [
                  {
                    icon: <Users size={13} color="#D97706" />,
                    bg: '#FFFDF0',
                    border: '1px solid #FDE68A',
                    title: lang === 'te' ? 'క్యూ సమయం' : 'Queue Flow',
                    value: sarvaWait || (lang === 'te' ? 'సాధారణం' : 'Moderate'),
                    color: '#92400E'
                  },
                  {
                    icon: <Flame size={13} color="#D97706" />,
                    bg: '#FFFDF0',
                    border: '1px solid #FDE68A',
                    title: lang === 'te' ? 'విశేష క్షేత్రం' : 'Sacred Shrine',
                    value: lang === 'te' ? shortShrine.te : shortShrine.en,
                    color: '#92400E'
                  },
                  {
                    icon: <Clock size={13} color="#0F5132" />,
                    bg: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    title: lang === 'te' ? 'ఉత్తమ సమయం' : 'Best Time',
                    value: lang === 'te' ? 'ఉదయం వేళలు' : 'Early Morning',
                    color: '#166534'
                  }
                ]);

                return (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: '6px',
                    marginBottom: '10px',
                    width: '100%'
                  }}>
                    {visualCards.map((card, idx) => (
                      <div key={idx} style={{
                        backgroundColor: card.bg,
                        border: card.border,
                        borderRadius: '12px',
                        padding: '7px 4px',
                        minHeight: '54px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        minWidth: 0,
                        boxSizing: 'border-box'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '3px',
                          marginBottom: '2px',
                          minWidth: 0,
                          maxWidth: '100%'
                        }}>
                          {card.icon}
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: 800,
                            color: '#64748B',
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.01em'
                          }}>
                            {card.title}
                          </span>
                        </div>
                        <div style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: card.color,
                          lineHeight: 1.2,
                          textAlign: 'center',
                          wordBreak: 'break-word',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          width: '100%'
                        }}>
                          {card.value}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Subtle Trust & Confidence Footer (No duplicate yellow banner!) */}
              <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <Sparkles size={12} color="#0F5132" />
                <span>{lang === 'te' ? 'లైవ్ క్యూ ఆధారంగా • ఇటీవల ధృవీకరించబడింది' : 'Based on live queue data • Verified recently'}</span>
              </div>
            </div>
          );
        })()}
      </div>
      </div>
    </div>
  );
}

