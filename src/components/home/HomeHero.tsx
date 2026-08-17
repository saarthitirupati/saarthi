'use client';

import React, { useState } from 'react';
import { Menu, Bell, MapPin, Sun, Sparkles, Ticket, Car, Gift, CloudRain, Bus, Clock, Route, Users, Zap, Check, ChevronDown, Navigation, Flame, Moon } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo/Logo';
import { useLanguage } from '@/lib/useLanguage';
import { detectCoordinates } from '@/lib/location';

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
  const [overrideScenario, setOverrideScenario] = useState<string>('auto');
  const [selectedLocation, setSelectedLocation] = useState<string>(locationName || 'Tirupati');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  const handleAutoDetectLocation = () => {
    setIsLocating(true);
    detectCoordinates(
      (coords) => {
        setIsLocating(false);
        const isTirumala = coords.lat > 13.66;
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
    if (ssdTokenStatus === 'closed-for-day') {
      const next = liveStatus?.ssdNextTokenTime;
      return next ? `Opens ${next}` : 'Closed';
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
      const d = list.find((d: any) => d.name?.toLowerCase().includes('divya') || d.name?.toLowerCase().includes('footpath') || d.name?.toLowerCase().includes('ssd'));
      return d?.waitTime || '4–6 h';
    }
    if (key === 'special') {
      const d = list.find((d: any) => d.name?.includes('300') || d.name?.toLowerCase().includes('special'));
      return d?.waitTime || '3–5 h';
    }
    return '—';
  };

  // Best time: admin value wins; scenarios provide a sensible fallback
  const adminBestTime = liveStatus?.bestTime?.trim() || '';

  const getSaarthiDecisionScenario = () => {
    let key = overrideScenario;

    if (key === 'auto') {
      if (isNight) key = 'night';
      else if (isRainy) key = 'blue';
      else if (ssdTokenStatus === 'issuing') key = 'orange';
      else if (crowdLevel === 'low') key = 'green';
      else if (crowdLevel === 'moderate') key = 'yellow';
      else key = 'red';
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

            {/* Right — Location Badge & Notification Bell */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div 
                onClick={() => setIsLocationModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  color: '#B45309',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <MapPin size={12} color="#B45309" />
                <span>{selectedLocation}</span>
                <ChevronDown size={11} style={{ opacity: 0.7 }} />
              </div>

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

          {/* DYNAMIC REGION SELECTOR MODAL */}
          {isLocationModalOpen && (
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(6px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '380px',
                padding: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                animation: 'fadeIn 0.2s ease-out'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={18} color="#0F5132" />
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Select Active Region</h3>
                  </div>
                  <button 
                    onClick={() => setIsLocationModalOpen(false)}
                    style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ✕
                  </button>
                </div>

                <button
                  onClick={handleAutoDetectLocation}
                  disabled={isLocating}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '16px',
                    background: '#ECFDF5',
                    border: '1.5px solid #A7F3D0',
                    color: '#047857',
                    fontWeight: 800,
                    fontSize: '13.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    marginBottom: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Navigation size={16} className={isLocating ? 'animate-spin' : ''} />
                  <span>{isLocating ? 'Acquiring GPS...' : 'Auto-Detect Live GPS Location'}</span>
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'Tirupati', label: 'Tirupati City & Foothills', sub: 'Alipiri, Railway Station, Bus Stand' },
                    { id: 'Tirumala', label: 'Tirumala Hill', sub: 'Sanctum, Mada Streets, Ghat Top' },
                    { id: 'Renigunta', label: 'Renigunta & Suburbs', sub: 'Airport, Railway Junction' }
                  ].map((reg) => (
                    <div
                      key={reg.id}
                      onClick={() => {
                        setSelectedLocation(reg.id);
                        if (typeof window !== 'undefined') localStorage.setItem('saarthi_user_region', reg.id);
                        setIsLocationModalOpen(false);
                      }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '14px',
                        border: selectedLocation === reg.id ? '2px solid #0F5132' : '1px solid #E2E8F0',
                        background: selectedLocation === reg.id ? '#F0FDF4' : '#FAFAFA',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <p style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>{reg.label}</p>
                        <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0', fontWeight: 500 }}>{reg.sub}</p>
                      </div>
                      {selectedLocation === reg.id && (
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#0F5132', color: '#FFFFFF', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Refined golden accent line */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, #E2E8F0 25%, #CBD5E1 50%, #E2E8F0 75%, transparent 100%)',
            opacity: 0.6
          }} />
        </header>
      )}

      {/* ══════════ SCROLLABLE CONTENT ══════════ */}
      <div style={{ padding: hideHeader ? '0' : '16px 16px 20px 16px', background: hideHeader ? 'transparent' : 'var(--bg-canvas, #FAF8F5)' }}>

        {!hideHeader && (
          <>
            {/* Devotional Invocation & Weather Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '16px',
                background: '#FEF9C3',
                border: '1px solid #FDE047',
                fontSize: '11px',
                fontWeight: 800,
                color: '#854D0E',
                letterSpacing: '0.2px'
              }}>
                <Sparkles size={12} color="#CA8A04" />
                <span>{lang === 'te' ? 'ఓం నమో వేంకటేశాయ' : 'Om Namo Venkatesaya'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
                <span>{todayDateStr}</span>
                <span style={{ opacity: 0.3 }}>•</span>
                <Sun size={13} color="#D97706" />
                <span>{weatherTemp || '26°C'}</span>
              </div>
            </div>

            {/* Personalized Greeting */}
            <div style={{ marginBottom: '16px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                <span>{getGreetingPrefix()}</span>, <span className="notranslate">{userName || 'Pilgrim'}</span>
              </h1>
              <p style={{ fontSize: '13px', color: '#0F5132', margin: '3px 0 0 0', fontWeight: 700, lineHeight: '1.4' }}>
                {t.tagline}
              </p>
            </div>
          </>
        )}

      {/* 🛕 SIGNATURE LIVE TEMPLE PULSE CARD */}
      <div style={{
        background: '#0F172A',
        borderRadius: '22px',
        padding: '18px 16px',
        color: '#FFFFFF',
        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* HEADER ROW */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'rgba(200, 155, 60, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={14} color="#F59E0B" />
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#F8FAFC' }}>
              {lang === 'te' ? 'లైవ్ ఆలయ స్థితి' : 'LIVE TEMPLE PULSE'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
            <span>{t.labels.live} · {updatedLabel}</span>
          </div>
        </div>

        {/* 1️⃣ CROWD FIRST: 3 PRIMARY DARSHAN QUEUES (LINKED TO LIVE ADMIN STATUS) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          {/* Sarva Darshan */}
          <Link
            href="/darshan/general"
            style={{
              textDecoration: 'none',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '52px',
              transition: 'background 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: crowdLevel === 'low' ? '#10B981' : crowdLevel === 'moderate' ? '#F59E0B' : '#EF4444',
                boxShadow: crowdLevel === 'low' ? '0 0 8px #10B981' : crowdLevel === 'moderate' ? '0 0 8px #F59E0B' : '0 0 8px #EF4444',
                flexShrink: 0
              }} />
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.01em' }}>
                  {lang === 'te' ? 'సర్వదర్శనం (ఉచితం)' : 'Sarva Darshan'}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                  {lang === 'te' ? 'ఉచిత సాధారణ దర్శనం' : 'Free General Queue'}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
              <div style={{ fontSize: '17px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                {getDarshanWait('sarva')}
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                color: crowdLevel === 'low' ? '#A7F3D0' : crowdLevel === 'moderate' ? '#FDE68A' : '#FECACA',
                backgroundColor: crowdLevel === 'low' ? 'rgba(16, 185, 129, 0.2)' : crowdLevel === 'moderate' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                padding: '2px 8px',
                borderRadius: '6px',
                border: crowdLevel === 'low' ? '1px solid rgba(16, 185, 129, 0.35)' : crowdLevel === 'moderate' ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)'
              }}>
                ● {crowdLevel === 'low' ? (lang === 'te' ? 'తక్కువ రద్దీ' : 'Low Crowd') : crowdLevel === 'moderate' ? (lang === 'te' ? 'సాధారణ రద్దీ' : 'Moderate Crowd') : (lang === 'te' ? 'అధిక రద్దీ' : 'Heavy Rush')}
              </span>
            </div>
          </Link>

          {/* ₹300 Special Entry */}
          <Link
            href="/darshan/special"
            style={{
              textDecoration: 'none',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '52px',
              transition: 'background 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B', boxShadow: '0 0 8px rgba(245, 158, 11, 0.7)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.01em' }}>
                  {lang === 'te' ? '₹300 ప్రత్యేక ప్రవేశం' : '₹300 Special Entry'}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                  {lang === 'te' ? 'ఆన్‌లైన్ సీగ్రా దర్శనం' : 'Online Booked Slot'}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
              <div style={{ fontSize: '17px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                {getDarshanWait('special')}
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#FDE68A',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(245, 158, 11, 0.35)'
              }}>
                ● {lang === 'te' ? 'స్లాట్ ఆధారితం' : 'Slot Bound'}
              </span>
            </div>
          </Link>

          {/* SSD Token Darshan */}
          <Link
            href="/darshan/ssd"
            style={{
              textDecoration: 'none',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '52px',
              transition: 'background 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: ssdTokenStatus === 'closed-for-day' ? '#EF4444' : ssdTokenStatus === 'paused' ? '#F59E0B' : '#10B981',
                boxShadow: ssdTokenStatus === 'closed-for-day' ? '0 0 8px #EF4444' : ssdTokenStatus === 'paused' ? '0 0 8px #F59E0B' : '0 0 8px #10B981',
                flexShrink: 0
              }} />
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.01em' }}>
                  {lang === 'te' ? 'SSD టోకెన్ దర్శనం' : 'SSD Token Darshan'}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                  {lang === 'te' ? 'ఉచిత సమయ స్లాట్ టోకెన్లు' : 'Time-Slotted Free Darshan'}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
              <div style={{ fontSize: '17px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                {getDarshanWait('ssd')}
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                color: ssdTokenStatus === 'closed-for-day' ? '#FECACA' : ssdTokenStatus === 'paused' ? '#FDE68A' : '#A7F3D0',
                backgroundColor: ssdTokenStatus === 'closed-for-day' ? 'rgba(239, 68, 68, 0.2)' : ssdTokenStatus === 'paused' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                padding: '2px 8px',
                borderRadius: '6px',
                border: ssdTokenStatus === 'closed-for-day' ? '1px solid rgba(239, 68, 68, 0.35)' : ssdTokenStatus === 'paused' ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)'
              }}>
                ● {ssdTokenStatus === 'closed-for-day' ? (lang === 'te' ? 'ఈ రోజు పూర్తయింది' : 'Closed for Today') : ssdTokenStatus === 'paused' ? (lang === 'te' ? 'తాత్కాలికంగా ఆపబడింది' : 'Paused') : (lang === 'te' ? 'టోకెన్లు అందుబాటులో ఉన్నాయి' : 'Tokens Available')}
              </span>
            </div>
          </Link>
        </div>

        {/* ── DIVIDER ── */}
        <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', marginBottom: '12px' }} />

        {/* 2️⃣ TRAVEL & WEATHER CONDITIONS (LUCIDE ICONS, CLEAN GROUPING) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: 'rgba(16, 185, 129, 0.18)',
              border: '1px solid rgba(52, 211, 153, 0.25)',
              padding: '4px 9px',
              borderRadius: '16px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#6EE7B7'
            }}>
              <Car size={13} color="#6EE7B7" />
              <span>Ghats Open</span>
            </span>
            {isNight && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(30, 58, 138, 0.45)',
                border: '1px solid rgba(96, 165, 250, 0.25)',
                padding: '4px 9px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#93C5FD'
              }}>
                <Moon size={13} color="#93C5FD" />
                <span>Night</span>
              </span>
            )}
            {isRainy ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(14, 116, 144, 0.45)',
                border: '1px solid rgba(34, 211, 238, 0.25)',
                padding: '4px 9px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#67E8F9'
              }}>
                <CloudRain size={13} color="#67E8F9" />
                <span>Rain</span>
              </span>
            ) : (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(217, 119, 6, 0.2)',
                border: '1px solid rgba(251, 191, 36, 0.25)',
                padding: '4px 9px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#FDE68A'
              }}>
                <Sun size={13} color="#FDE68A" />
                <span>{weatherTemp || '26°C'}</span>
              </span>
            )}
          </div>

          <Link href="/live" style={{ fontSize: '11.5px', fontWeight: 800, color: '#38BDF8', textDecoration: 'none' }}>
            {lang === 'te' ? 'లైవ్ స్టేటస్ →' : '→ Full Live Status'}
          </Link>
        </div>

        {/* 3️⃣ ⭐ SAARTHI SUGGESTS (HERO COMPANION GUIDANCE) */}
        {(() => {
          const recommendationReasons = [
            scenario.why,
            isRainy 
              ? `Live weather: ${liveWeather || 'Rain Showers'}` 
              : `Weather: ${liveWeather || 'Clear Sky, Pleasant'}`,
            ssdTokenStatus === 'issuing'
              ? 'SSD token counters currently issuing'
              : ssdTokenStatus === 'paused'
              ? 'SSD token issuance currently paused'
              : ssdTokenStatus === 'closed-for-day'
              ? 'SSD quota closed for today'
              : liveStatus?.ssdNextTokenTime
              ? `SSD tokens resume at ${liveStatus.ssdNextTokenTime}`
              : `Recommended best slot: ${scenario.bestTime || 'Morning 6:00 AM'}`
          ];

          return (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '16px 18px',
              color: '#0F172A',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
            }}>
              {/* Header with Devotional Cue */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#0F5132" />
                  <span>{lang === 'te' ? 'సారథి సలహా' : 'SAARTHI SUGGESTS'}</span>
                </div>
                <span style={{ fontSize: '10.5px', color: '#854D0E', fontWeight: 700, fontStyle: 'italic' }}>
                  “Patience brings peaceful darshan”
                </span>
              </div>
              
              {/* Warm Companion Recommendation */}
              <div style={{ fontSize: '15.5px', fontWeight: 900, color: '#0F172A', lineHeight: '1.35', marginBottom: '10px', letterSpacing: '-0.01em' }}>
                {scenario.recommendation}
              </div>

              {/* Rationale Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
                {recommendationReasons.map((point, i) => (
                  <div key={i} style={{ fontSize: '12px', color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={13} color="#10B981" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* HIGHLIGHTED BENEFIT PILL */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#FEF3C7',
                border: '1px solid #FDE68A',
                color: '#92400E',
                padding: '7px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 800,
                marginBottom: '8px'
              }}>
                <Zap size={14} color="#D97706" fill="#D97706" style={{ flexShrink: 0 }} />
                <span>{scenario.benefit || 'Save approx. 4 hours by starting at 6:00 AM'}</span>
              </div>

              {/* Subtle Trust & Confidence Indicator */}
              <div style={{ fontSize: '10.5px', color: '#94A3B8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>⚡</span>
                <span>Based on live queue trends • Verified recently</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Section Header Below Card */}
      {!hideHeader && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {t.labels.rightNowOnHill}
          </h3>
          <Link href="/live" style={{ fontSize: '12.5px', fontWeight: 700, color: '#0E6B72', textDecoration: 'none' }}>
            {t.labels.viewAll}
          </Link>
        </div>
      )}
      </div>
    </div>
  );
}

