import React from 'react';
import Link from 'next/link';
import { Sparkles, Navigation, Users, Info } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

const TEXTS = {
  en: {
    recommended: 'RECOMMENDED',
    whyRecommended: 'Why Recommended:',
    viewDetails: 'View Details',
    quietNight: 'Quiet · Night Hours',
    lowCrowd: 'Low Crowd · Quick Entry',
    modCrowd: 'Moderate · ~30 Min Wait',
    highCrowd: 'High Crowd · Plan Ahead',
    peakCrowd: 'Peak Crowd · Long Wait',
    checkLive: 'Check Live Status',
    coveredIndoor: 'Covered & Indoor',
  },
  te: {
    recommended: 'సారథి సూచన',
    whyRecommended: 'సారథి సూచన:',
    viewDetails: 'వివరాలు చూడండి',
    quietNight: 'ప్రశాంతం · రాత్రి సమయం',
    lowCrowd: 'తక్కువ రద్దీ · వేగ ప్రవేశం',
    modCrowd: 'మోస్తరు రద్దీ · ~30 ని. వేచి',
    highCrowd: 'అధిక రద్దీ · ముందుగా ప్లాన్ చేయండి',
    peakCrowd: 'గరిష్ట రద్దీ · ఎక్కువ వేచి',
    checkLive: 'లైవ్ స్థితి చూడండి',
    coveredIndoor: 'వాతావరణం అనుకూలంగా ఉంది · ఇండోర్',
  }
};

export function RecommendationCard({ liveStatus, todayFestival }: { liveStatus: any; todayFestival?: any }) {
  const lang = useLanguage();
  const t = TEXTS[lang];

  if (!liveStatus) return null;

  const date = new Date();
  const dayOfWeek = date.getDay();
  const hr = date.getHours();
  const isNight = hr >= 21 || hr < 5;
  const crowd = (liveStatus.crowdLevel || 'moderate').toLowerCase();
  const weatherStr = (liveStatus.weather || '').toLowerCase();
  const isRainy = weatherStr.includes('rain') || weatherStr.includes('shower') || weatherStr.includes('storm');

  // Dynamic crowd status derived from live data
  const getDynamicCrowdStatus = (): string => {
    if (isNight) return t.quietNight;
    if (crowd === 'low')       return t.lowCrowd;
    if (crowd === 'moderate')  return t.modCrowd;
    if (crowd === 'high')      return t.highCrowd;
    if (crowd === 'very-high') return t.peakCrowd;
    return t.checkLive;
  };

  const dynamicCrowd = getDynamicCrowdStatus();

  // Default (Sunday fallback)
  let rec = {
    title: lang === 'te' ? 'కపిల తీర్థం' : 'Kapila Theertham',
    distance: lang === 'te' ? '12 ని. ప్రయాణం' : '12 min drive',
    crowdStatus: dynamicCrowd,
    link: '/place/kapila-theertham',
    image: '/assets/temples/kapila-theertham.png',
    priorityTag: lang === 'te' ? 'ప్రాధాన్యత 3: వారపు థీమ్' : 'Priority 3: Weekday Theme',
    reason: lang === 'te' ? 'శివుని సోమవారం · ఏడు కొండల వద్ద పవిత్ర జలపాతం గుహాలయం' : 'Lord Shiva Monday · Sacred waterfall cave shrine at the foot of Seven Hills'
  };

  // PRIORITY 1: Festival Calendar Override
  if (todayFestival && (todayFestival.isToday || todayFestival.isLive)) {
    rec = {
      title: todayFestival.location || (lang === 'te' ? 'శ్రీ వేంకటేశ్వర స్వామి వారి ఆలయం' : 'Sri Venkateswara Swamy Temple'),
      distance: lang === 'te' ? '20 ని. · ఘాట్ రోడ్' : '20 min · Ghat Road',
      crowdStatus: `${lang === 'te' ? 'పండుగ' : 'Festive'} · ${dynamicCrowd}`,
      link: todayFestival.placeId ? `/place/${todayFestival.placeId}` : '/festivals',
      image: todayFestival.coverImage || '/assets/temples/venkateswara.png',
      priorityTag: lang === 'te' ? 'ప్రాధాన్యత 1: పండుగ క్యాలెండర్' : 'Priority 1: Festival Calendar',
      reason: `${lang === 'te' ? 'అధికారిక వేదిక:' : 'Official venue for'} ${todayFestival.name || todayFestival.title}`
    };
  }
  // PRIORITY 2: Important Temple Day
  else if (dayOfWeek === 6) { // Saturday — Venkateswara (Tirumala)
    rec = {
      title: lang === 'te' ? 'శ్రీ వేంకటేశ్వర స్వామి వారి ఆలయం' : 'Sri Venkateswara Swamy Temple',
      distance: lang === 'te' ? '20 ని. · ఘాట్ రోడ్' : '20 min · Ghat Road',
      crowdStatus: dynamicCrowd,
      link: '/place/venkateswara',
      image: '/assets/temples/venkateswara.png',
      priorityTag: lang === 'te' ? 'ప్రాధాన్యత 2: ముఖ్యమైన ఆలయ దినం' : 'Priority 2: Important Temple Day',
      reason: lang === 'te' ? 'పవిత్ర శనివారం · ప్రధాన తిరుమల ఏడు కొండల ఆలయం' : 'Holy Saturday · Primary Tirumala Seven Hills sanctum'
    };
  } else if (dayOfWeek === 5) { // Friday — Padmavathi (Tiruchanoor, 5 km)
    rec = {
      title: lang === 'te' ? 'శ్రీ పద్మావతి అమ్మవారి ఆలయం' : 'Sri Padmavathi Ammavari Temple',
      distance: lang === 'te' ? '10 ని. ప్రయాణం' : '10 min drive',
      crowdStatus: dynamicCrowd,
      link: '/place/padmavathi',
      image: '/assets/temples/padmavathi.png',
      priorityTag: lang === 'te' ? 'ప్రాధాన్యత 2: ముఖ్యమైన ఆలయ దినం' : 'Priority 2: Important Temple Day',
      reason: lang === 'te' ? 'లక్ష్మీదేవి శుక్రవారం · అధికారిక తిరుచానూరు అమ్మవారి ఆలయం' : 'Goddess Lakshmi Friday · Official Tiruchanoor divine consort shrine'
    };
  }
  // PRIORITY 3: Weekday Spiritual Calendar
  else if (dayOfWeek === 1) { // Monday — Kapila Theertham (6 km from town)
    rec = {
      title: lang === 'te' ? 'కపిల తీర్థం' : 'Kapila Theertham',
      distance: lang === 'te' ? '12 ని. ప్రయాణం' : '12 min drive',
      crowdStatus: dynamicCrowd,
      link: '/place/kapila-theertham',
      image: '/assets/temples/kapila-theertham.png',
      priorityTag: lang === 'te' ? 'ప్రాధాన్యత 3: శివుని సోమవారం' : 'Priority 3: Lord Shiva Monday',
      reason: lang === 'te' ? 'శివుని సోమవారం · ఏడు కొండల వద్ద పవిత్ర జలపాతం గుహాలయం' : 'Lord Shiva Monday · Sacred waterfall cave shrine at the foot of Seven Hills'
    };
  } else if (dayOfWeek === 2) { // Tuesday — Japali Hanuman (Tirumala, 20 km)
    rec = {
      title: lang === 'te' ? 'జపాలి హనుమాన్ ఆలయం' : 'Japali Hanuman Temple',
      distance: lang === 'te' ? '20 ని. · ఘాట్ రోడ్' : '20 min · Ghat Road',
      crowdStatus: dynamicCrowd,
      link: '/place/japali-hanuman',
      image: '/assets/temples/bedi-anjaneya.png',
      priorityTag: lang === 'te' ? 'ప్రాధాన్యత 3: హనుమాన్ మంగళవారం' : 'Priority 3: Hanuman Tuesday',
      reason: lang === 'te' ? 'హనుమాన్ మంగళవారం · ఏడు కొండలపై పవిత్ర హనుమాన్ ఆలయం' : 'Hanuman Tuesday · Sacred Hanuman shrine on the Seven Hills'
    };
  } else if (dayOfWeek === 3) { // Wednesday — Kodandarama (1.5 km, town center)
    rec = {
      title: lang === 'te' ? 'శ్రీ కోదండరామ స్వామి ఆలయం' : 'Sri Kodandarama Swamy Temple',
      distance: lang === 'te' ? '1.5 కి.మీ · 5 ని. ప్రయాణం' : '1.5 km · 5 min drive',
      crowdStatus: dynamicCrowd,
      link: '/place/kodandarama-temple',
      image: '/assets/temples/padmavathi.png',
      priorityTag: lang === 'te' ? 'ప్రాధాన్యత 3: శ్రీరామ బుధవారం' : 'Priority 3: Lord Rama Wednesday',
      reason: lang === 'te' ? 'శ్రీరామ బుధవారం · 1,000 సంవత్సరాల చారిత్రక విజయనగర ఆలయం' : 'Lord Rama Wednesday · 1,000-year historic Vijayanagara shrine'
    };
  } else if (dayOfWeek === 4) { // Thursday — Govindaraja (3 km, town center)
    rec = {
      title: lang === 'te' ? 'శ్రీ గోవిందరాజ స్వామి ఆలయం' : 'Sri Govindaraja Swamy Temple',
      distance: lang === 'te' ? '6 ని. ప్రయాణం' : '6 min drive',
      crowdStatus: dynamicCrowd,
      link: '/place/govindaraja',
      image: '/assets/temples/govindaraja.png',
      priorityTag: lang === 'te' ? 'ప్రాధాన్యత 3: గురు గురువారం' : 'Priority 3: Guru Thursday',
      reason: lang === 'te' ? 'గురు & అన్నమయ్య గురువారం · తిరుపతి పట్టణంలోని ప్రాచీన ఆలయం' : 'Guru & Annamayya Thursday · Ancient heritage shrine in Tirupati town'
    };
  } else if (dayOfWeek === 0) { // Sunday — Bhu Varaha (Tirumala)
    rec = {
      title: lang === 'te' ? 'శ్రీ భూ వరాహ స్వామి ఆలయం' : 'Sri Bhu Varaha Swamy Temple',
      distance: lang === 'te' ? '20 ని. · ఘాట్ రోడ్' : '20 min · Ghat Road',
      crowdStatus: dynamicCrowd,
      link: '/place/bhu-varaha',
      image: '/assets/temples/venkateswara.png',
      priorityTag: lang === 'te' ? 'ప్రాధాన్యత 3: సూర్యనారాయణ ఆదివారం' : 'Priority 3: Surya Narayana Sunday',
      reason: lang === 'te' ? 'సూర్యనారాయణ ఆదివారం · ప్రధాన దర్శనానికి ముందు సందర్శించాల్సిన ప్రాచీన ఆలయం' : 'Surya Narayana Sunday · Ancient shrine to be visited before main darshan'
    };
  }

  // PRIORITY 4: Live condition override
  if (isRainy) {
    rec = {
      title: lang === 'te' ? 'ఇస్కాన్ తిరుపతి' : 'ISKCON Tirupati',
      distance: lang === 'te' ? '4 ని. ప్రయాణం' : '4 min drive',
      crowdStatus: lang === 'te' ? 'కవర్డ్ & ఇండోర్' : 'Covered & Indoor',
      link: '/place/iskcon-tirupati',
      image: '/assets/temples/iskcon.png',
      priorityTag: lang === 'te' ? 'వాతావరణం: వర్షం అనుకూలం' : 'Weather Context: Rain Friendly',
      reason: lang === 'te' ? 'వర్షపు వాతావరణం · కవర్డ్ ఇండోర్ ఆలయం మరియు సౌకర్యవంతమైన సీటింగ్' : 'Rainy Weather · Covered indoor sanctum and comfortable seating'
    };
  } else if (crowd === 'high' || crowd === 'very-high') {
    rec = {
      title: lang === 'te' ? 'శ్రీ గోవిందరాజ స్వామి ఆలయం' : 'Sri Govindaraja Swamy Temple',
      distance: lang === 'te' ? '6 ని. ప్రయాణం' : '6 min drive',
      crowdStatus: dynamicCrowd,
      link: '/place/govindaraja',
      image: '/assets/temples/govindaraja.png',
      priorityTag: lang === 'te' ? 'క్యూ: అధిక రద్దీ ప్రత్యామ్నాయం' : 'Queue Context: High Crowd Alternate',
      reason: lang === 'te' ? 'తిరుమలలో అధిక రద్దీ · తిరుపతి పట్టణంలో వేగవంతమైన ప్రవేశ ప్రత్యామ్నాయ ఆలయం' : 'High Crowd in Tirumala · Fast entry alternate shrine in Tirupati town'
    };
  }


  return (
    <div style={{ padding: '0 16px 16px 16px' }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '18px 20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)'
      }}>
        
        {/* RECOMMENDED BADGE WITH PRIORITY TAG */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#10B981" />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              {t.recommended}
            </span>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#047857', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '8px' }}>
            {rec.priorityTag}
          </span>
        </div>

        {/* MAIN CONTENT ROW: LEFT DETAILS + RIGHT IMAGE THUMBNAIL */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0', letterSpacing: '-0.01em', lineHeight: '1.2' }}>
              {rec.title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', color: '#475569', fontWeight: 600 }}>
                <Navigation size={15} color="#475569" />
                <span>{rec.distance}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', color: '#0284C7', fontWeight: 700 }}>
                <Users size={15} color="#0284C7" />
                <span>{rec.crowdStatus}</span>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE THUMBNAIL */}
          <div style={{
            width: '90px',
            height: '75px',
            borderRadius: '16px',
            backgroundImage: `url(${rec.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#F1F5F9',
            flexShrink: 0
          }} />
        </div>

        {/* MANDATORY EXPLAINABLE REASON BADGE */}
        <div style={{
          fontSize: '11.5px',
          fontWeight: 700,
          color: '#047857',
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          padding: '8px 12px',
          borderRadius: '12px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px',
          lineHeight: '1.4'
        }}>
          <Info size={15} color="#047857" style={{ flexShrink: 0, marginTop: '1px' }} />
          <span><strong>{t.whyRecommended}</strong> {rec.reason}</span>
        </div>

        {/* FULL-WIDTH BUTTON */}
        <Link href={rec.link} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          color: '#166534',
          padding: '11px',
          borderRadius: '14px',
          fontSize: '14px',
          fontWeight: 800,
          textDecoration: 'none',
          width: '100%',
          textAlign: 'center'
        }}>
          {t.viewDetails}
        </Link>

      </div>
    </div>
  );
}
