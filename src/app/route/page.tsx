'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Navigation, Sparkles, MapPin, Clock, 
  ShieldCheck, Car, Ticket, Mountain, Key, Landmark, 
  UtensilsCrossed, PhoneCall, Share2, ExternalLink,
  ChevronRight, AlertCircle, CheckCircle2, RefreshCw
} from 'lucide-react';
import styles from './Route.module.css';
import { useLanguage } from '@/lib/useLanguage';
import { useLiveStatus } from '@/hooks/useLiveStatus';

export default function LiveRoutePage() {
  const lang = useLanguage();
  const { liveStatus, weatherTemp } = useLiveStatus();
  const [copied, setCopied] = useState(false);

  const sarvaWait = liveStatus?.darshans?.find(d => d.name.toLowerCase().includes('sarva'))?.waitTime ?? '12-15 hours';
  const ssdWait = liveStatus?.ssdTokenStatus === 'issuing' ? '2 hrs' : 'Filling';
  const tollStatus = 'Normal';

  const shareRoute = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Saarthi Tirupati Live Pilgrimage Route',
        text: `Live Tirumala Darshan Route: Alipiri (${tollStatus}) → SSD Counters (${ssdWait} wait) → Tirumala Sanctum (${sarvaWait} wait).`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const steps = [
    {
      id: 'origin',
      title: lang === 'te' ? 'మీ ప్రస్తుత ప్రదేశం' : 'Your Current Location',
      location: lang === 'te' ? 'తిరుపతి నగరం & కొండ దిగువన' : 'Tirupati City / Foothills',
      status: 'Current GPS',
      statusColor: '#3B82F6',
      statusBg: '#EFF6FF',
      timeEstimate: '0 min',
      icon: MapPin,
      desc: lang === 'te'
        ? 'మీరు ప్రస్తుతం తిరుపతిలో ఉన్నారు. ఉదయం 5:30 - 6:00 గంటల మధ్య ప్రారంభించడం అత్యుత్తమం.'
        : 'Active pilgrim origin. Starting between 5:30 AM – 6:00 AM ensures fastest clearance.',
      actionText: lang === 'te' ? 'మ్యాప్‌లో చూడండి' : 'Check GPS Origin',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tirupati+Railway+Station',
      reason: lang === 'te' ? 'ప్రయాణ ప్రారంభ కేంద్రం' : 'Optimal hub for local transport and electric buses',
    },
    {
      id: 'alipiri',
      title: lang === 'te' ? 'అలిపిరి టోల్ గేట్ & చెక్‌పోస్ట్' : 'Alipiri Toll Gate & Security Check',
      location: 'Alipiri Base, Tirupati',
      status: tollStatus === 'Normal' ? '🟢 Clear · 10m drive' : '🟡 Moderate Transit',
      statusColor: '#10B981',
      statusBg: '#ECFDF5',
      timeEstimate: '10 min drive',
      icon: Car,
      desc: lang === 'te'
        ? 'వాహన తనిఖీ మరియు FASTag లేన్లు ఇక్కడ ఉంటాయి. అలిపిరి మెట్ల మార్గం నడక యాత్రికులకు ఇక్కడే ప్రారంభమవుతుంది.'
        : 'Vehicle security screening and FASTag checkpoint. Alipiri Mettu footpath begins here.',
      actionText: lang === 'te' ? 'అలిపిరి కి GPS దారి' : 'Navigate to Alipiri',
      mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=13.647051,79.405856',
      isRecommended: true,
      reason: lang === 'te' ? 'కొండపైకి వెళ్లే ఏకైక ఘాట్ రోడ్డు ప్రవేశ ద్వారం' : 'Direct mandatory gateway for 1st Ghat Road to Tirumala',
    },
    {
      id: 'ssd',
      title: lang === 'te' ? 'SSD ఉచిత టైమ్-స్లాట్ టోకెన్ కేంద్రం' : 'SSD Free Time-Slot Token Counters',
      location: 'Bhudevi Complex / Srinivasam / Vishnu Nivasam',
      status: `🟡 ${ssdWait} hrs queue · Issuing`,
      statusColor: '#F59E0B',
      statusBg: '#FEF3C7',
      timeEstimate: '2 hr queue window',
      icon: Ticket,
      desc: lang === 'te'
        ? 'రూ. 300 టికెట్ లేని వారికి ఉచిత సర్వదర్శనం టోకెన్లు ఇస్తారు. కుటుంబ సభ్యులందరి ఒరిజినల్ ఆధార్ కార్డు తప్పనిసరి.'
        : 'Free Slotted Sarva Darshan tokens. Original Aadhaar card required for every person for biometric scan.',
      actionText: lang === 'te' ? 'భూదేవి కాంప్లెక్స్ కి GPS' : 'Navigate to Bhudevi Counters',
      mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=13.6465,79.4068',
      reason: lang === 'te' ? 'క్యూలో గంటల తరబడి నిలబడకుండా నిర్ణీత సమయానికి దర్శనం' : 'Avoids standing 18+ hrs in unregulated queues with scheduled darshan slot',
    },
    {
      id: 'ghat',
      title: lang === 'te' ? 'శేషాచలం ఘాట్ రోడ్డు ప్రయాణం' : 'Seshachalam 1st Ghat Road Ascent',
      location: 'Alipiri to Tirumala (Upward Ghat Road)',
      status: '🟢 Clear · 45 min mountain drive',
      statusColor: '#10B981',
      statusBg: '#ECFDF5',
      timeEstimate: '45 min climb',
      icon: Mountain,
      desc: lang === 'te'
        ? 'రమణీయమైన కొండల మధ్య 18 కి.మీ ప్రయాణం. కనీస ప్రయాణ సమయం 28 నిమిషాలు (వేగ పరిమితి అమలులో ఉంది).'
        : 'Scenic 18 km mountain highway. Minimum transit time 28 mins enforced at toll exit for safety.',
      actionText: lang === 'te' ? 'ఘాట్ రోడ్డు మార్గం' : 'View Ghat Route',
      mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=13.6788,79.3512',
      reason: lang === 'te' ? 'కొండపైకి వెళ్లే సురక్షితమైన మార్గం' : 'Continuous 24/7 electric buses and well-lit mountain security',
    },
    {
      id: 'pac',
      title: lang === 'te' ? 'తిరుమల PAC విశ్రాంతి భవనాలు & లాకర్లు' : 'Tirumala PAC Rest Halls & Free Lockers',
      location: 'PAC 1, 2, 3 & 4, Tirumala Peak',
      status: '🟢 Free Lockers Available',
      statusColor: '#10B981',
      statusBg: '#ECFDF5',
      timeEstimate: '15 min deposit',
      icon: Key,
      desc: lang === 'te'
        ? 'ఆలయంలోకి మొబైల్స్ మరియు ఎలక్ట్రానిక్స్ నిషేధం. PAC 1/4 వద్ద ఉచిత లాకర్లలో భద్రపరచుకోండి.'
        : 'Cell phones, cameras & electronics are prohibited inside the sanctum. Store safely in free PAC lockers.',
      actionText: lang === 'te' ? 'PAC-1 కి దారి' : 'Navigate to PAC-1',
      mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=13.6820,79.3490',
      reason: lang === 'te' ? 'ఆలయ ప్రవేశానికి ముందు లగేజీ భద్రత' : 'Mandatory free electronic deposit before queue complex entry',
    },
    {
      id: 'sanctum',
      title: lang === 'te' ? 'శ్రీవారి వైకుంఠం క్యూ కాంప్లెక్స్ & దర్శనం' : 'Sri Venkateswara Sanctum & Vaikuntam Queue',
      location: 'Vaikuntam Queue Complex-2, Tirumala',
      status: `🔴 ${sarvaWait}+ hrs wait · Heavy Rush`,
      statusColor: '#EF4444',
      statusBg: '#FEE2E2',
      timeEstimate: `${sarvaWait} hrs wait`,
      icon: Landmark,
      desc: lang === 'te'
        ? 'క్యూ కంపార్ట్‌మెంట్లలో ఉచిత వేడి పాలు, తాగునీరు, అన్నప్రసాదం నిరంతరం అందుబాటులో ఉంటాయి.'
        : 'Continuous free hot milk, drinking water, and Annaprasadam meals served inside all holding compartments.',
      actionText: lang === 'te' ? 'వైకుంఠం క్యూ-2 కి దారి' : 'Navigate to Vaikuntam Queue-2',
      mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=13.6833,79.3475',
      reason: lang === 'te' ? 'శ్రీవారి మూలవిరాట్ దర్శనం' : 'Sacred core sanctum of Lord Venkateswara Swamy',
    },
    {
      id: 'prasadam',
      title: lang === 'te' ? 'లడ్డూ ప్రసాదం & తరిగొండ వెంగమాంబ అన్నప్రసాదం' : 'Sacred Laddu & Free Tarigonda Annaprasadam',
      location: 'Laddu Counters 1-48 & Annaprasadam Complex',
      status: '🟢 Open · Free Unlimited Meals',
      statusColor: '#10B981',
      statusBg: '#ECFDF5',
      timeEstimate: '20 min collect',
      icon: UtensilsCrossed,
      desc: lang === 'te'
        ? 'ప్రతి టోకెన్‌పై 1 ఉచిత లడ్డూ లభిస్తుంది. అదనపు లడ్డూలు ఒక్కొక్కటి రూ. 50. అన్నప్రసాదం రాత్రి 11 గంటల వరకు నిరంతరం అందుబాటులో ఉంటుంది.'
        : '1 free sacred Laddu per token. Additional laddus ₹50 each at counters 1–48. Free meals until 11:00 PM.',
      actionText: lang === 'te' ? 'లడ్డూ కాంప్లెక్స్ కి దారి' : 'Navigate to Laddu Complex',
      mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=13.6840,79.3480',
      reason: lang === 'te' ? 'పవిత్ర తీర్థ ప్రసాద స్వీకరణ' : 'Sacred culmination of the Tirumala pilgrimage',
    }
  ];

  return (
    <main className={styles.pageWrapper}>
      {/* ── STICKY TOP HEADER ── */}
      <header className={styles.topHeader}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.backBtn} aria-label="Back to home">
            <ArrowLeft size={20} />
          </Link>
          <div className={styles.headerTitles}>
            <h1 className={styles.pageTitle}>
              {lang === 'te' ? 'సారథి ప్రత్యక్ష యాత్రా మార్గం' : 'Saarthi Live Pilgrimage Guide'}
            </h1>
            <span className={styles.headerSub}>
              {lang === 'te' ? 'టర్న్-బై-టర్న్ GPS & ప్రత్యక్ష క్యూ అంచనాలు' : 'Turn-by-turn GPS & live pilgrimage timeline'}
            </span>
          </div>
          <button onClick={shareRoute} className={styles.shareBtn} aria-label="Share route">
            <Share2 size={18} />
          </button>
        </div>
      </header>

      <div className={styles.contentContainer}>
        {/* ── LIVE TELEMETRY RADAR SUMMARY ── */}
        <div className={styles.telemetryCard}>
          <div className={styles.telemetryHeader}>
            <div className={styles.radarPulse}>
              <span className={styles.pulseDot} />
              <span className={styles.pulseText}>LIVE RADAR CONNECTED</span>
            </div>
            <span className={styles.weatherTag}>
              {weatherTemp || '24°C · Pleasant'}
            </span>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>{lang === 'te' ? 'మొత్తం యాత్రా సమయం' : 'Estimated Journey'}</span>
              <strong className={styles.statValue}>~5h 30m</strong>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>{lang === 'te' ? 'సర్వదర్శనం సమయం' : 'Sanctum Darshan Wait'}</span>
              <strong className={styles.statValue} style={{ color: '#DC2626' }}>{sarvaWait}</strong>
            </div>
          </div>

          {copied && (
            <div className={styles.copiedToast}>
              <CheckCircle2 size={14} /> Link copied to clipboard!
            </div>
          )}
        </div>

        {/* ── SAARTHI STRATEGY BANNER ── */}
        <div className={styles.strategyBanner}>
          <div className={styles.strategyIcon}>
            <Sparkles size={18} color="#CA8A04" />
          </div>
          <div className={styles.strategyText}>
            <strong>{lang === 'te' ? 'సారథి వ్యూహాత్మక సలహా:' : 'Saarthi Master Strategy:'}</strong>
            <p>
              {lang === 'te'
                ? 'ఉదయం 5:45 గంటలకే అలిపిరి భూదేవి కాంప్లెక్స్ చేరుకోండి. టోకెన్ పొందిన వెంటనే ఉచిత ఎలక్ట్రిక్ బస్సు ద్వారా కొండపైకి చేరుకోండి.'
                : 'Arrive at Bhudevi Complex by 5:45 AM to secure morning slots. Board the free electric bus immediately after token allotment.'}
            </p>
          </div>
        </div>

        {/* ── STEP-BY-STEP PILGRIMAGE TIMELINE ── */}
        <div className={styles.timelineSection}>
          <h2 className={styles.sectionTitle}>
            {lang === 'te' ? 'యాత్రా మార్గ క్రమం & GPS నావిగేషన్' : 'Step-by-Step Pilgrimage Timeline'}
          </h2>

          <div className={styles.timelineList}>
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className={styles.timelineItem}>
                  {/* Step Connector Line & Badge */}
                  <div className={styles.connectorCol}>
                    <div className={styles.stepNumberBadge}>
                      {idx === 0 ? '📍' : idx}
                    </div>
                    {idx < steps.length - 1 && <div className={styles.connectorLine} />}
                  </div>

                  {/* Step Card Content */}
                  <div className={`${styles.stepCard} ${step.isRecommended ? styles.highlightedCard : ''}`}>
                    <div className={styles.stepCardHeader}>
                      <div className={styles.stepIconWrap}>
                        <Icon size={18} color="#0F5132" />
                      </div>
                      <div className={styles.stepTitleWrap}>
                        <h3 className={styles.stepTitle}>{step.title}</h3>
                        <span className={styles.stepLocation}>{step.location}</span>
                      </div>
                      <span 
                        className={styles.statusPill}
                        style={{ color: step.statusColor, background: step.statusBg }}
                      >
                        {step.status}
                      </span>
                    </div>

                    <p className={styles.stepDesc}>{step.desc}</p>

                    {/* Explainable Recommendation Reason */}
                    <div className={styles.reasonRow}>
                      <span className={styles.reasonLabel}>WHY THIS STEP:</span>
                      <span className={styles.reasonText}>{step.reason}</span>
                    </div>

                    {/* Turn-by-Turn GPS Button */}
                    <a 
                      href={step.mapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.stepGpsBtn}
                    >
                      <Navigation size={14} />
                      <span>{step.actionText}</span>
                      <ExternalLink size={12} style={{ opacity: 0.7 }} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── EMERGENCY & PILGRIM HELPLINES ── */}
        <div className={styles.helplineCard}>
          <div className={styles.helplineHeader}>
            <PhoneCall size={18} color="#0F5132" />
            <h3 className={styles.helplineTitle}>
              {lang === 'te' ? 'తితిదే 24/7 యాత్రికుల హెల్ప్‌లైన్' : 'TTD 24/7 Pilgrim Emergency Helplines'}
            </h3>
          </div>
          <div className={styles.helplineGrid}>
            <a href="tel:18004254141" className={styles.helpItem}>
              <span className={styles.helpName}>TTD Toll-Free</span>
              <strong className={styles.helpNumber}>1800-425-4141</strong>
            </a>
            <a href="tel:155257" className={styles.helpItem}>
              <span className={styles.helpName}>Pilgrim Helpline</span>
              <strong className={styles.helpNumber}>155257</strong>
            </a>
            <a href="tel:108" className={styles.helpItem}>
              <span className={styles.helpName}>SVIMS Ambulance</span>
              <strong className={styles.helpNumber}>108</strong>
            </a>
            <a href="tel:100" className={styles.helpItem}>
              <span className={styles.helpName}>Police Assistance</span>
              <strong className={styles.helpNumber}>100</strong>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
