'use client';

import React, { useState } from 'react';
import { Menu, Bell, MapPin, Sun, Sparkles, Ticket, Car, Gift, CloudRain, Bus, Clock, Route, Users, Zap, Check } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/useLanguage';

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
      green: 'Perfect Time for Darshan',
      yellow: 'Plan Before You Go',
      red: 'Queue at Peak Capacity',
      blue: 'Heavy Rain Disruption',
      purple: 'Special Festival Advisory',
      orange: 'Limited Token Slots Active',
      night: 'Tomorrow Looks Better',
      alert: 'Alipiri Route Closure'
    },
    recommendations: {
      green: 'Leave your hotel now.',
      yellow: 'Visit Kapila Theertham first. Return after lunch.',
      red: "Don't join the queue now. Explore Tirupati.",
      blue: 'Avoid Alipiri Steps. Take RTC Bus.',
      orange: 'Head to Alipiri now. Slots may finish soon.',
      purple: 'Stay in Tirupati tonight. Start tomorrow morning.',
      night: 'Rest well. Leave hotel at 6:30 AM.',
      alert: 'Use RTC Bus. Alternative route ready.'
    },
    why: {
      green: "You'll avoid today's afternoon rush.",
      yellow: 'Queue clears significantly during afternoon slot.',
      red: 'Joining now puts you in the peak 11-hour queue bottleneck.',
      blue: 'Footpaths are slippery during heavy rain.',
      purple: 'Overnight queue wait times are at maximum capacity.',
      orange: 'SSD token holders bypass main 10+ hour queue.',
      night: 'Early morning queue entry is 80% faster.',
      alert: 'Maintenance work active on primary Alipiri entrance.'
    },
    benefits: {
      green: 'Save 3 hours by acting now',
      yellow: 'Save 1 Hour wait time',
      red: 'You save 8h 45m',
      blue: 'Avoid 2 Hours weather delay',
      purple: 'Save 12 Hours total wait',
      orange: 'Lock in short queue before quota ends',
      night: 'Save 4 hours by sleeping in Tirupati',
      alert: 'Bypass Alipiri closure without hassle'
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
      updated: 'అప్డేట్',
      justNow: 'ఇప్పుడే',
      minAgo: 'నిమిషాల క్రితం',
      live: 'లైవ్',
      saarthiRecommends: 'సారథి సిఫార్సు',
      recommendedBecause: 'సిఫార్సు కారణం',
      rightNowOnHill: 'కొండపై ప్రస్తుతం',
      viewAll: 'అన్నీ చూడండి >'
    },
    badges: {
      lowCrowd: 'తక్కువ రద్దీ',
      moderateCrowd: 'మధ్యస్థ రద్దీ',
      heavyCrowd: 'అధిక రద్దీ',
      weatherAlert: 'వాతావరణ హెచ్చరిక',
      festivalRush: 'పండుగ రద్దీ',
      ssdOpen: 'SSD ఓపెన్',
      nightUpdate: 'రాత్రి అప్డేట్',
      importantAdvisory: 'ముఖ్యమైన సూచన'
    },
    subtitles: {
      green: 'దర్శనానికి అనువైన సమయం',
      yellow: 'వెళ్ళే ముందు ప్లాన్ చేయండి',
      red: 'క్యూ గరిష్ట స్థాయిలో ఉంది',
      blue: 'భారీ వర్షం అంతరాయం',
      purple: 'ప్రత్యేక పండుగ సూచన',
      orange: 'పరిమిత టోకెన్ స్లాట్లు అందుబాటులో',
      night: 'రేపు మెరుగ్గా ఉంటుంది',
      alert: 'అలిపిరి మార్గం మూసివేత'
    },
    recommendations: {
      green: 'ఇప్పుడే హోటల్ నుండి బయలుదేరండి.',
      yellow: 'ముందు కపిల తీర్థం సందర్శించండి. భోజనం తర్వాత తిరిగి రండి.',
      red: 'ఇప్పుడు క్యూలో చేరవద్దు. తిరుపతి అన్వేషించండి.',
      blue: 'అలిపిరి మెట్లు అవాయిడ్ చేయండి. RTC బస్ తీసుకోండి.',
      orange: 'ఇప్పుడే అలిపిరికి వెళ్ళండి. స్లాట్లు త్వరలో అయిపోవచ్చు.',
      purple: 'ఈ రాత్రి తిరుపతిలో ఉండండి. రేపు ఉదయం బయలుదేరండి.',
      night: 'బాగా విశ్రాంతి తీసుకోండి. ఉదయం 6:30కి హోటల్ నుండి బయలుదేరండి.',
      alert: 'RTC బస్ వాడండి. ప్రత్యామ్నాయ మార్గం సిద్ధంగా ఉంది.'
    },
    why: {
      green: 'ఈ రోజు మధ్యాహ్నం రద్దీ నుండి తప్పించుకుంటారు.',
      yellow: 'మధ్యాహ్నం సమయంలో క్యూ గణనీయంగా తగ్గుతుంది.',
      red: 'ఇప్పుడు చేరితే 11 గంటల క్యూలో ఇరుక్కుంటారు.',
      blue: 'భారీ వర్షంలో కాలిబాటలు జారుతాయి.',
      purple: 'రాత్రి క్యూ వేచి సమయాలు గరిష్ట స్థాయిలో ఉన్నాయి.',
      orange: 'SSD టోకెన్ హోల్డర్లు 10+ గంటల క్యూను దాటవేస్తారు.',
      night: 'ఉదయం క్యూ ప్రవేశం 80% వేగంగా ఉంటుంది.',
      alert: 'ప్రధాన అలిపిరి ప్రవేశ ద్వారంలో నిర్వహణ పనులు జరుగుతున్నాయి.'
    },
    benefits: {
      green: 'ఇప్పుడు చర్య తీసుకుని 3 గంటలు ఆదా చేయండి',
      yellow: '1 గంట వేచి సమయం ఆదా',
      red: '8 గం. 45 ని. ఆదా',
      blue: '2 గంటల వాతావరణ ఆలస్యం నివారించండి',
      purple: 'మొత్తం 12 గంటల వేచి ఆదా',
      orange: 'కోటా అయిపోకముందే చిన్న క్యూలో చేరండి',
      night: 'తిరుపతిలో నిద్రించి 4 గంటలు ఆదా',
      alert: 'అలిపిరి మూసివేతను ఇబ్బంది లేకుండా దాటండి'
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

export function HomeHero({ userName, locationName, weatherTemp, liveStatus, activeAlertsCount }: any) {
  const lang = useLanguage();
  const t = TEXTS[lang];
  const [overrideScenario, setOverrideScenario] = useState<string>('auto');

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
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#FFFFFF',
        boxShadow: '0 1px 0 rgba(212,175,55,0.15), 0 2px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '0 20px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          {/* Left — bare menu icon */}
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-side-menu'))}
            aria-label="Toggle navigation menu"
            style={{
              width: '36px', height: '36px', flexShrink: 0,
              background: 'none', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 0
            }}
          >
            <Menu size={20} color="#2D4A3E" strokeWidth={1.8} />
          </button>

          {/* Center — Brand lockup */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Diya SVG — refined, smaller */}
              <svg width="18" height="20" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 1 C16 1 12.5 7 12.5 11.5 C12.5 13.8 14 15.5 16 15.5 C18 15.5 19.5 13.8 19.5 11.5 C19.5 7 16 1 16 1Z" fill="#F59E0B"/>
                <path d="M16 5 C16 5 14 9.5 14 12 C14 13.3 14.8 14.5 16 14.5 C17.2 14.5 18 13.3 18 12 C18 9.5 16 5 16 5Z" fill="#FDE68A"/>
                <path d="M7 22 Q7 17 16 17 Q25 17 25 22 L23 30 Q23 32 16 32 Q9 32 9 30 Z" fill="#B45309"/>
                <path d="M7 22 Q7 19.5 16 19.5 Q25 19.5 25 22" fill="#D97706"/>
                <line x1="16" y1="17" x2="16" y2="15.5" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>

              <span style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#1A3C2E',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                fontFamily: 'Georgia, "Times New Roman", serif'
              }}>
                Saarthi
              </span>
            </div>

            <div style={{
              fontSize: '7.5px',
              fontWeight: 600,
              color: '#C2922A',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              lineHeight: 1
            }}>
              {t.header.companion}
            </div>
          </div>

          {/* Right — bare bell icon */}
          <Link href="/alerts" style={{
            width: '36px', height: '36px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            textDecoration: 'none', position: 'relative'
          }}>
            <Bell size={20} color="#2D4A3E" strokeWidth={1.8} />
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

        {/* Refined golden accent line */}
        <div style={{
          height: '1.5px',
          background: 'linear-gradient(90deg, transparent 0%, #C2922A 25%, #F0BC4E 50%, #C2922A 75%, transparent 100%)',
          opacity: 0.45
        }} />
      </header>

      {/* ══════════ SCROLLABLE CONTENT ══════════ */}
      <div style={{ padding: '16px 16px 20px 16px' }}>


      {/* Location & Weather Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#FEF3C7',
          border: '1px solid #FDE68A',
          color: '#B45309',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer'
        }}>
          <MapPin size={14} color="#B45309" />
          <span>{locationName || 'Tirupati'}</span>
          <span style={{ fontSize: '10px', marginLeft: '2px' }}>▼</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>
          <span>{t.labels.today} • {todayDateStr}</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <Sun size={15} color="#D97706" />
          <span>{weatherTemp || '26°C'}</span>
        </div>
      </div>

      {/* Personalized Greeting */}
      <div style={{ marginBottom: '18px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
          {getGreetingPrefix()}, {userName || 'Sunil'}
        </h1>
        <p style={{ fontSize: '13.5px', color: '#059669', margin: '4px 0 0 0', fontWeight: 700, lineHeight: '1.4' }}>
          {t.tagline}
        </p>
      </div>

      {/* STANDARDIZED SAARTHI DECISION ENGINE CARD */}
      <div style={{
        background: scenario.bgGradient,
        borderRadius: '24px',
        padding: '20px 18px',
        color: '#FFFFFF',
        boxShadow: scenario.boxShadow,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.5s ease'
      }}>
        
        {/* 1️⃣ SITUATION BADGE ROW */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <button 
            onClick={handleCycleScenario}
            title="Click to test all 8 Saarthi Decision Engine Scenarios"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              border: 'none',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              color: '#FFF',
              backdropFilter: 'blur(8px)'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: scenario.badgeDot, boxShadow: `0 0 8px ${scenario.badgeDot}` }} />
            <span>{scenario.badge}</span>
            {overrideScenario !== 'auto' && <span style={{ opacity: 0.75, fontSize: '9px', marginLeft: '4px' }}>({overrideScenario.toUpperCase()})</span>}
          </button>

          <span style={{ fontSize: '11px', opacity: 0.85, fontWeight: 600 }}>
            {t.labels.updated} {updatedLabel}
          </span>
        </div>

        <div style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '14px' }}>
          {scenario.subtitle}
        </div>

        <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.18)', marginBottom: '14px' }} />

        {/* 2️⃣ 3-COLUMN HERO STAT (CURRENT WAIT vs BEST TIME vs YOU SAVE) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '14px' }}>
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.18)', borderRadius: '12px', padding: '8px 6px', textAlign: 'center' }}>
            <div style={{ fontSize: '9.5px', fontWeight: 800, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              {t.labels.currentWait}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 900, marginTop: '2px', color: '#FFF' }}>
              {scenario.currentWait}
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)', borderRadius: '12px', padding: '8px 6px', textAlign: 'center' }}>
            <div style={{ fontSize: '9.5px', fontWeight: 800, opacity: 0.95, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              {t.labels.bestTime}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 900, marginTop: '2px', color: '#FFF' }}>
              {scenario.bestTime}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.18)', marginBottom: '14px' }} />


        {/* 3️⃣ DARSHAN WAIT TIME CARDS (CREATIVE HIGH-CONTRAST STYLE) */}
        {scenario.darshanWaits ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            marginBottom: '14px',
          }}>
            {DARSHAN_CARDS.map(card => {
              const waitValue = scenario.darshanWaits[card.key as keyof typeof scenario.darshanWaits];
              return (
                <div 
                  key={card.key} 
                  style={{
                    background: card.bg,
                    border: `1px solid ${card.border}`,
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '9px 6px',
                    textAlign: 'center',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.22)',
                    padding: '3px 8px',
                    borderRadius: '20px',
                    border: `1px solid ${card.border}`,
                  }}>
                    <span style={{ 
                      color: card.iconColor, 
                      display: 'flex', 
                      alignItems: 'center' 
                    }}>
                      {card.icon}
                    </span>
                    <span style={{ 
                      fontSize: '9.5px', 
                      fontWeight: 700, 
                      color: card.accent,
                      letterSpacing: '0.2px',
                      whiteSpace: 'nowrap'
                    }}>
                      {card.label}
                    </span>
                  </div>

                  <div style={{ 
                    fontWeight: 900, 
                    color: '#FFFFFF', 
                    fontSize: '13.5px', 
                    letterSpacing: '-0.2px',
                    lineHeight: 1.2,
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
                  }}>
                    {waitValue}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Alert scenario: keep original metric chips */
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            marginBottom: '14px',
            fontSize: '11px',
            fontWeight: 600
          }}>
            {scenario.metrics.map((m: any, idx: number) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '7px 10px'
              }}>
                <span style={{ opacity: 0.9, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {METRIC_ICON[m.label] ?? null}
                  {m.label}
                </span>
                <span style={{ fontWeight: 800, color: '#FFF' }}>{m.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* 4️⃣ & 5️⃣ ⭐ SAARTHI RECOMMENDS & WHY RATIONALE */}
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
              : `Recommended best slot: ${scenario.bestTime || 'Afternoon'}`
          ];

          return (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '14px 14px',
              color: '#0F172A',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
            }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: scenario.accentColor, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={13} color={scenario.accentColor} />
                <span>{t.labels.saarthiRecommends}</span>
              </div>
              
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', lineHeight: '1.3', marginBottom: '8px' }}>
                {scenario.recommendation}
              </div>

              <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>
                {t.labels.recommendedBecause}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                {recommendationReasons.map((point, i) => (
                  <div key={i} style={{ fontSize: '12px', color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={13} color="#10B981" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* 5️⃣ BENEFIT / TIME SAVED PILL */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#FEF3C7',
                border: '1px solid #FDE68A',
                color: '#92400E',
                padding: '5px 10px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 800,
                marginBottom: '0px'
              }}>
                <Zap size={12} color="#D97706" fill="#D97706" />
                <span>{scenario.benefit}</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Section Header Below Card */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          {t.labels.rightNowOnHill}
        </h3>
        <Link href="/live" style={{ fontSize: '13px', fontWeight: 700, color: '#0E6B72', textDecoration: 'none' }}>
          {t.labels.viewAll}
        </Link>
      </div>
      </div>
    </div>
  );
}

