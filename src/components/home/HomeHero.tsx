'use client';

import React, { useState } from 'react';
import { Menu, Bell, MapPin, Sun, Sparkles, Ticket, Car, Gift, CloudRain, Bus, Clock, Route, Users, Zap, Check, ChevronDown, Navigation, Flame, Moon, Languages } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo/Logo';
import { useLanguage, setAppLanguage } from '@/lib/useLanguage';
import { useTrip } from '@/components/TripContext';
import { detectCoordinates, isCoordinateOnTirumalaHill } from '@/lib/location';
import { playTempleBellChime } from '@/lib/audioBell';
import { getPanchangamData } from '@/lib/panchangam';
import { getDayTempleGuidance } from '@/lib/dailyGuidance';
import { LocationPickerModal, LocationPill } from '@/components/common/LocationPickerModal';

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

export function HomeHero({ userName, locationName, weatherTemp, liveStatus, activeAlertsCount, hideHeader = false }: any) {
  const lang = useLanguage();
  const t = TEXTS[lang];
  const { setUserLocation } = useTrip();
  const [overrideScenario, setOverrideScenario] = useState<string>('auto');
  const [selectedLocation, setSelectedLocation] = useState<string>(locationName || 'Tirupati');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  const handleAutoDetectLocation = () => {
    setIsLocating(true);
    detectCoordinates(
      (coords) => {
        setIsLocating(false);
        setUserLocation(coords);
        const isTirumala = isCoordinateOnTirumalaHill(coords.lat, coords.lng);
        const region = isTirumala ? 'Tirumala' : 'Tirupati';
        setSelectedLocation(region);
        if (typeof window !== 'undefined') localStorage.setItem('saarthi_user_region', region);
        setIsLocationModalOpen(false);
      },
      () => {
        setIsLocating(false);
      }
    );
  };

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
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 12) return t.greetings.morning;
    if (hr >= 12 && hr < 17) return t.greetings.afternoon;
    if (hr >= 17 && hr < 21) return t.greetings.evening;
    return t.greetings.night;
  };

  const crowdLevel = (liveStatus?.crowdLevel || 'high').toLowerCase();
  const weatherStr = (liveStatus?.weather || '').toLowerCase();
  const isRainy = weatherStr.includes('rain') || weatherStr.includes('shower') || weatherStr.includes('storm') || weatherStr.includes('thunder');
  const ssdTokenStatus = (liveStatus?.ssdTokenStatus || '').toLowerCase(); // fixed: was reading wrong field
  const isNight = new Date().getHours() >= 21 || new Date().getHours() < 5;

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
  const blessingTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [chantCount, setChantCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('srivari_chant_count') || '1', 10);
    }
    return 1;
  });

  const handleChantTap = () => {
    playTempleBellChime();
    setIsChanting(true);
    const nextCount = chantCount + 1;
    setChantCount(nextCount);
    if (typeof window !== 'undefined') {
      localStorage.setItem('srivari_chant_count', nextCount.toString());
    }
    setShowBlessing(true);
    setTimeout(() => setIsChanting(false), 300);

    if (blessingTimerRef.current) {
      clearTimeout(blessingTimerRef.current);
    }
    blessingTimerRef.current = setTimeout(() => {
      setShowBlessing(false);
    }, 2000);
  };

  React.useEffect(() => {
    return () => {
      if (blessingTimerRef.current) {
        clearTimeout(blessingTimerRef.current);
      }
    };
  }, []);

  const scenario = getSaarthiDecisionScenario();
  const todayDateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  const handleCycleScenario = () => {
    const list = ['auto', 'green', 'yellow', 'red', 'blue', 'purple', 'orange', 'night', 'alert'];
    const nextIdx = (list.indexOf(overrideScenario) + 1) % list.length;
    setOverrideScenario(list[nextIdx]);
  };
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#FAF8F4' }}>

      {/* ══════════ MODERN CLASSIC HEADER ══════════ */}
      {!hideHeader && (
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: '#FFFFFF',
          boxShadow: '0 1px 0 rgba(212,175,55,0.15), 0 2px 12px rgba(0,0,0,0.04)'
        }}>
          <div style={{
            maxWidth: '100%',
            padding: '0 16px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>

            {/* Left — Official Saarthi Brand Lockup */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <Logo size={34} />
              <span className="notranslate" style={{
                fontSize: '22px',
                fontWeight: 900,
                color: '#0F5132',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                fontFamily: 'Georgia, "Times New Roman", serif'
              }}>
                Saarthi
              </span>
            </Link>

            {/* Right — Location Badge, Language Toggle & Notification Bell */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LocationPill 
                locationName={selectedLocation} 
                onClick={() => setIsLocationModalOpen(true)} 
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
                  gap: '4px',
                  padding: '5px 9px',
                  borderRadius: '9999px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  color: '#0F5132',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  userSelect: 'none',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  transition: 'all 0.15s ease',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <Languages size={13} color="#0F5132" strokeWidth={2.2} />
                <span>{lang === 'en' ? 'తెలుగు' : 'English'}</span>
              </button>

              <Link href="/alerts" aria-label="Notifications" style={{
                width: '36px', height: '36px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textDecoration: 'none', position: 'relative'
              }}>
                <Bell size={20} color="#0F5132" strokeWidth={1.8} />
                {(activeAlertsCount ?? 0) > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '3px', right: '3px',
                    minWidth: '15px', height: '15px',
                    borderRadius: '8px',
                    background: '#DC2626',
                    border: '1.5px solid #FFFFFF',
                    color: '#FFFFFF',
                    fontSize: '8px', fontWeight: 800,
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
      <div style={{ padding: hideHeader ? '0' : '12px 14px 16px 14px', background: hideHeader ? 'transparent' : 'var(--bg-canvas, #FAF8F5)' }}>

        {!hideHeader && (
          <>
            {/* Devotional Invocation & Weather Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', position: 'relative' }}>
              <button
                type="button"
                onClick={handleChantTap}
                aria-label={lang === 'te' ? 'ఓం నమో వేంకటేశాయ జపించండి మరియు ఆశీస్సులు పొందండి' : 'Chant Om Namo Venkatesaya & receive divine blessings'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.45)',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.18)',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#78350F',
                  letterSpacing: '0.1px',
                  cursor: 'pointer',
                  transform: isChanting ? 'scale(0.95)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  userSelect: 'none'
                }}
              >
                <Sparkles size={12} color="#D97706" style={{ animation: isChanting ? 'spin 0.4s ease' : 'none' }} />
                <span>{lang === 'te' ? 'ఓం నమో వేంకటేశాయ' : 'Om Namo Venkatesaya'}</span>
                <span style={{ opacity: 0.35 }}>•</span>
                <span style={{ fontWeight: 700, color: '#92400E' }}>
                  {lang === 'te' ? getPanchangamData().tithiTe : getPanchangamData().tithiEn}
                </span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', fontWeight: 600, color: '#64748B' }}>
                <span>{todayDateStr}</span>
                <span style={{ opacity: 0.3 }}>•</span>
                <Sun size={12} color="#D97706" />
                <span>{weatherTemp || '26°C'}</span>
              </div>

              {/* 🪔 Floating Sacred Blessing Toast */}
              {showBlessing && (
                <div style={{
                  position: 'absolute',
                  top: '32px',
                  left: '0',
                  zIndex: 40,
                  background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
                  color: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(245, 158, 11, 0.3)',
                  maxWidth: '280px',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Sparkles size={12} color="#FDE047" />
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#FDE047', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {lang === 'te' ? 'శ్రీవారి దివ్య ఆశీర్వచనం' : 'Srivari Divine Blessing'}
                      </span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>
                      {lang === 'te' ? `జపం #${chantCount}` : `Chant #${chantCount}`}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.35, color: '#F1F5F9', fontWeight: 500 }}>
                    {lang === 'te' 
                      ? 'గోవిందా! శ్రీ వేంకటేశ్వర స్వామివారి దివ్య కృపాకటాక్షాలు మీకు మరియు మీ కుటుంబానికి ఎల్లప్పుడూ ఉండుగాక.'
                      : 'Govinda! May Lord Venkateswara shower peace, health, and auspicious blessings upon your pilgrimage.'}
                  </p>
                </div>
              )}
            </div>

            {/* Personalized Greeting */}
            <div style={{ marginBottom: '12px' }}>
              <h1 style={{ 
                fontSize: lang === 'te' ? '21px' : '20px', 
                fontWeight: lang === 'te' ? 700 : 800, 
                color: '#0F172A', 
                margin: 0, 
                letterSpacing: lang === 'te' ? 'normal' : '-0.02em',
                lineHeight: lang === 'te' ? 1.4 : 1.2
              }}>
                <span>{getGreetingPrefix()}</span>, <span className="notranslate">{userName || 'Pilgrim'}</span>
              </h1>
              <p style={{ 
                fontSize: lang === 'te' ? '12.5px' : '12px', 
                color: '#0F5132', 
                margin: '3px 0 0 0', 
                fontWeight: lang === 'te' ? 600 : 700, 
                lineHeight: lang === 'te' ? 1.5 : 1.3,
                letterSpacing: 'normal'
              }}>
                {t.tagline}
              </p>
            </div>
          </>
        )}

      {/* 🛕 SIGNATURE LIVE TEMPLE PULSE (BLACK OUTLINE INSIDE WHITE GLASS) */}
      <div style={{
        background: 'linear-gradient(165deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.88) 100%)',
        borderRadius: '24px',
        padding: '18px 16px',
        color: '#0F172A',
        boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1.5px solid #0F172A',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Top Gold Beam Accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, #D97706 30%, #F59E0B 50%, #D97706 70%, transparent 100%)',
          opacity: 0.85
        }} />

        {/* 🌟 HEADER: LIVE BEACON & TITLE */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'rgba(217, 119, 6, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid #0F172A',
              boxShadow: '0 2px 6px rgba(217, 119, 6, 0.15)'
            }}>
              <Flame size={16} color="#D97706" />
            </div>
            <div>
              <div style={{
                fontSize: lang === 'te' ? '13.5px' : '13px',
                fontWeight: lang === 'te' ? 700 : 900,
                letterSpacing: lang === 'te' ? 'normal' : '0.8px',
                textTransform: lang === 'te' ? 'none' : 'uppercase',
                color: '#0F172A',
                lineHeight: lang === 'te' ? 1.4 : '1.2'
              }}>
                {lang === 'te' ? 'శ్రీవారి ప్రత్యక్ష దర్శన స్థితి' : 'LIVE TEMPLE PULSE'}
              </div>
              <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                <span>TTD Sanctum Feed · {updatedLabel}</span>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1.5px solid #0F172A',
            padding: '3px 9px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 800,
            color: '#065F46',
            letterSpacing: '0.5px'
          }}>
            <span>● LIVE</span>
          </div>
        </div>

        {/* 1️⃣ THREE EXPRESSIVE SACRED QUEUE TILES (HIGHLIGHTED AS PER CROWD STATUS) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px', position: 'relative', zIndex: 2 }}>
          {(() => {
            const sarvaWait = getDarshanWait('sarva');
            const specialWait = getDarshanWait('special');
            const ssdWait = getDarshanWait('ssd');

            const getMaxHours = (text: string): number => {
              const matches = text.match(/\d+/g);
              if (!matches || matches.length === 0) return 0;
              return Math.max(...matches.map(Number));
            };

            // Helper to get luminous sacred status styling
            const getStatusStyle = (type: 'extreme' | 'high' | 'moderate' | 'normal') => {
              if (type === 'extreme') {
                return {
                  color: '#E11D48',
                  waitColor: '#BE123C',
                  bg: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F5 100%)',
                  border: '#FECDD3',
                  badgeBg: '#E11D48',
                  badgeText: '#FFFFFF',
                  iconBg: '#FFE4E6',
                  iconBorder: '#F43F5E',
                  shadow: '0 4px 14px rgba(225, 29, 72, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
                  label: lang === 'te' ? 'తీవ్రమైన రద్దీ' : 'EXTREME',
                  meter: 5
                };
              }
              if (type === 'high') {
                return {
                  color: '#D97706',
                  waitColor: '#B45309',
                  bg: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDF5 50%, #FEF9C3 100%)',
                  border: '#FDE68A',
                  badgeBg: '#D97706',
                  badgeText: '#FFFFFF',
                  iconBg: '#FEF3C7',
                  iconBorder: '#FACC15',
                  shadow: '0 4px 14px rgba(217, 119, 6, 0.09), 0 1px 3px rgba(0, 0, 0, 0.03)',
                  label: lang === 'te' ? 'రద్దీ ఎక్కువ' : 'HIGH',
                  meter: 4
                };
              }
              if (type === 'moderate') {
                return {
                  color: '#D97706',
                  waitColor: '#92400E',
                  bg: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDF8 50%, #FEF9C3 100%)',
                  border: '#FEF08A',
                  badgeBg: '#CA8A04',
                  badgeText: '#FFFFFF',
                  iconBg: '#FEF9C3',
                  iconBorder: '#FDE047',
                  shadow: '0 4px 14px rgba(202, 138, 4, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
                  label: lang === 'te' ? 'మితమైన రద్దీ' : 'MODERATE',
                  meter: 3
                };
              }
              return {
                color: '#059669',
                waitColor: '#047857',
                bg: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%)',
                border: '#A7F3D0',
                badgeBg: '#059669',
                badgeText: '#FFFFFF',
                iconBg: '#D1FAE5',
                iconBorder: '#34D399',
                shadow: '0 4px 14px rgba(5, 150, 105, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
                label: lang === 'te' ? 'సాధారణం' : 'NORMAL',
                meter: 1
              };
            };

            // 1. Sarva State (Normal, Moderate, High, Extreme)
            const sarvaHours = getMaxHours(sarvaWait);
            const isSarvaExtreme = sarvaHours >= 12 || sarvaWait.includes('24') || sarvaWait.includes('30');
            const sarvaStatus = getStatusStyle(
              isSarvaExtreme ? 'extreme' : sarvaHours > 6 ? 'high' : sarvaHours > 2 ? 'moderate' : 'normal'
            );

            // 2. Special Entry State (Normal, Moderate, High, Extreme)
            const specialHours = getMaxHours(specialWait);
            const specialStatus = getStatusStyle(
              specialHours > 7 ? 'extreme' : specialHours > 4 ? 'high' : specialHours >= 2 ? 'moderate' : 'normal'
            );

            // 3. SSD Token State (Dynamic Admin Text & Unified Crowd Pill)
            const ssdHours = getMaxHours(ssdWait);
            const isSsdExtreme = /cancel|full|heavy|rush|crowd|closed|stop/i.test(ssdWait) || ssdTokenStatus === 'closed-for-day' || ssdTokenStatus === 'closed';
            const resolvedSsdStatus = getStatusStyle(
              (ssdHours > 7 || isSsdExtreme) ? 'extreme' : ssdHours > 4 ? 'high' : (ssdHours >= 2 || ssdTokenStatus === 'paused') ? 'moderate' : 'normal'
            );

            const queueCards = [
              {
                id: 'sarva',
                href: '/darshan/sarva-darshan',
                icon: <Users size={16} color={sarvaStatus.color} />,
                title: lang === 'te' ? 'సర్వదర్శనం' : 'Sarva Darshan',
                subtitle: lang === 'te' ? 'ఉచిత సాధారణ దర్శనం' : 'Free General Queue',
                wait: sarvaWait,
                ...sarvaStatus,
                isClosed: false
              },
              {
                id: 'special',
                href: '/darshan/special-entry',
                icon: <Zap size={16} color={specialStatus.color} />,
                title: lang === 'te' ? '₹300 ప్రత్యేక ప్రవేశం' : '₹300 Special Entry',
                subtitle: lang === 'te' ? 'ఆన్‌లైన్ బుకింగ్ స్లాట్' : 'Online Booked Slot',
                wait: specialWait,
                ...specialStatus,
                isClosed: false
              },
              {
                id: 'ssd',
                href: '/darshan/ssd-token',
                icon: <Ticket size={16} color={resolvedSsdStatus.color} />,
                title: lang === 'te' ? 'SSD టోకెన్ దర్శనం' : 'SSD Token Darshan',
                subtitle: lang === 'te' ? 'ఉచిత సమయ స్లాట్ టోకెన్లు' : 'Time-Slotted Free Darshan',
                wait: ssdWait,
                ...resolvedSsdStatus,
                isClosed: false
              }
            ];

            return queueCards.map((card) => (
              <Link
                key={card.id}
                href={card.href}
                style={{
                  background: card.bg,
                  border: `1.5px solid ${card.border}`,
                  borderRadius: '14px',
                  padding: '12px 14px 12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '54px',
                  boxShadow: card.shadow,
                  position: 'relative',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease'
                }}
                className="darshan-home-card"
              >
                {/* Clean Vertical Indicator Strip (Eliminating corner glitches) */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '5px',
                  backgroundColor: card.color
                }} />

                {/* Left Info with Icon Accent */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: card.iconBg,
                    border: `1.5px solid ${card.iconBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                    flexShrink: 0
                  }}>
                    {card.icon}
                  </div>
                  <div>
                    <div style={{
                      fontSize: lang === 'te' ? '15px' : '14.5px',
                      fontWeight: lang === 'te' ? 700 : 800,
                      color: '#0F172A',
                      letterSpacing: lang === 'te' ? 'normal' : '-0.01em',
                      lineHeight: lang === 'te' ? 1.4 : '1.2'
                    }}>
                      {card.title}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: card.isClosed ? '#92400E' : '#475569',
                      fontWeight: 600,
                      marginTop: '2px',
                      lineHeight: lang === 'te' ? 1.4 : '1.2',
                      letterSpacing: 'normal'
                    }}>
                      {card.subtitle}
                    </div>
                  </div>
                </div>

                {/* Right Wait Time & Status Meter */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', position: 'relative', zIndex: 2 }}>
                  <div style={{
                    fontSize: '17px',
                    fontWeight: 900,
                    color: card.waitColor,
                    letterSpacing: '-0.02em',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {card.wait}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {/* 5-Step Consistent Visual Crowd Meter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginRight: '2px' }}>
                      {[1, 2, 3, 4, 5].map((seg) => (
                        <span
                          key={seg}
                          style={{
                            width: '4px',
                            height: '7px',
                            borderRadius: '1px',
                            backgroundColor: seg <= card.meter ? card.color : 'rgba(15, 23, 42, 0.18)',
                            boxShadow: seg <= card.meter ? `0 0 4px ${card.color}` : 'none'
                          }}
                        />
                      ))}
                    </div>

                    {/* Status Pill */}
                    <span style={{
                      fontSize: '9.5px',
                      fontWeight: lang === 'te' ? 700 : 800,
                      color: card.badgeText,
                      background: card.badgeBg,
                      border: `1px solid ${card.border}`,
                      padding: '2.5px 8px',
                      borderRadius: '6px',
                      letterSpacing: lang === 'te' ? 'normal' : '0.04em',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
                    }}>
                      {card.label}
                    </span>
                  </div>
                </div>
              </Link>
            ));

          })()}
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ height: '1px', backgroundColor: 'rgba(15, 23, 42, 0.12)', marginBottom: '12px' }} />

        {/* 2️⃣ TRAVEL & WEATHER CONDITIONS CAPSULES */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1.5px solid #0F172A',
              padding: '4px 10px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#065F46'
            }}>
              <Car size={13} color="#065F46" />
              <span>Ghats Open</span>
            </span>
            {isNight && (
              <span style={{
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
            highlightedBenefit = lang === 'te' ? '⚡ సాధారణ క్యూతో పోలిస్తే 10+ గంటలు ఆదా' : '⚡ SAVE OVER 10 HOURS VS GENERAL QUEUE';
            customReasons = [
              lang === 'te' ? 'SSD టోకెన్లు 15+ గంటల సాధారణ క్యూను నివారిస్తాయి' : 'SSD tokens bypass the 15+ hour general queue bottleneck',
              lang === 'te' ? 'అలిపిరి, శ్రీనివాసం కేంద్రాలలో కౌంటర్లు తెరిచి ఉన్నాయి' : 'Alipiri & Srinivasam counters are currently active',
              lang === 'te' ? 'ఈ రోజు దర్శనం కోసం వెంటనే పొందండి' : 'Secure your slotted darshan for today'
            ];
          } else if (isHeavyRush || isSsdClosed) {
            // Dynamic Day-of-Week Temple Recommendation
            guidanceHeadline = lang === 'te' ? dayGuide.headlineTe : dayGuide.headlineEn;
            highlightedBenefit = isSsdClosed 
              ? (lang === 'te' ? '⚡ నేటి SSD కోటా ముగిసింది — సమీప పుణ్యక్షేత్రాలను దర్శించండి' : '⚡ SSD CLOSED TODAY — VISIT SACRED SHRINES FIRST')
              : (lang === 'te' ? dayGuide.benefitTe : dayGuide.benefitEn);
            
            const firstReason = isSsdClosed && liveStatus?.ssdTimingsGuide 
              ? (liveStatus.ssdTimingsGuide.length > 110 ? `${liveStatus.ssdTimingsGuide.slice(0, 107)}...` : liveStatus.ssdTimingsGuide)
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
            highlightedBenefit = lang === 'te' ? '⚡ అత్యంత వేగవంతమైన దర్శనం — నిరీక్షణ స్వల్పం' : '⚡ MINIMAL WAIT TIME — FASTEST ENTRY';
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
              background: 'linear-gradient(135deg, #FFFDF7 0%, #FFF8E8 100%)',
              border: '1px solid rgba(214, 157, 45, 0.35)',
              borderRadius: '16px',
              padding: '13px 15px',
              color: '#0F172A',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
            }}>
              {/* Header with Devotional Cue */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{
                  fontSize: '10.5px',
                  fontWeight: lang === 'te' ? 700 : 900,
                  color: '#0F5132',
                  textTransform: lang === 'te' ? 'none' : 'uppercase',
                  letterSpacing: lang === 'te' ? 'normal' : '0.6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <Sparkles size={13} color="#0F5132" />
                  <span>{lang === 'te' ? 'సారథి సూచన' : 'SAARTHI GUIDANCE'}</span>
                </div>
                <span style={{
                  fontSize: '10.5px',
                  color: '#92400E',
                  fontWeight: 700,
                  fontStyle: lang === 'te' ? 'normal' : 'italic',
                  letterSpacing: 'normal'
                }}>
                  {lang === 'te' ? '“శాంతితో శ్రీవారిని దర్శించండి”' : '“In calm faith, seek Srivari”'}
                </span>
              </div>
              
              {/* Warm Companion Recommendation */}
              <div style={{
                fontSize: lang === 'te' ? '14px' : '14.5px',
                fontWeight: lang === 'te' ? 700 : 900,
                color: '#0F172A',
                lineHeight: lang === 'te' ? 1.45 : '1.35',
                marginBottom: '9px',
                letterSpacing: lang === 'te' ? 'normal' : '-0.01em'
              }}>
                {guidanceHeadline}
              </div>

              {/* Rationale Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
                {customReasons.map((point, i) => (
                  <div key={i} style={{
                    fontSize: '11.5px',
                    color: '#334155',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    lineHeight: lang === 'te' ? 1.4 : 1.2,
                    letterSpacing: 'normal'
                  }}>
                    <Check size={12} color="#10B981" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* HIGHLIGHTED GOLD BENEFIT CALLOUT */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(90deg, rgba(255, 190, 70, 0.22) 0%, rgba(255, 230, 150, 0.4) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#92400E',
                padding: '6px 11px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: lang === 'te' ? 700 : 900,
                letterSpacing: lang === 'te' ? 'normal' : '0.02em',
                lineHeight: lang === 'te' ? 1.4 : 1.2,
                marginBottom: '7px'
              }}>
                <Zap size={13} color="#D97706" fill="#D97706" style={{ flexShrink: 0 }} />
                <span>{highlightedBenefit}</span>
              </div>

              {/* Subtle Trust & Confidence Indicator */}
              <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Zap size={11} color="#94A3B8" />
                <span>Based on live queue trends • Verified recently</span>
              </div>
            </div>
          );
        })()}
      </div>
      </div>
    </div>
  );
}

