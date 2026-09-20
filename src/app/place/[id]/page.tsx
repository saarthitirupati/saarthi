'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Heart, Share2, Star, MapPin, Clock, Shirt, 
  Camera, Navigation, Sparkles, CheckCircle2, 
  ChevronDown, ChevronUp, Droplets, Utensils, Lock,
  Bus, Car, Shield, Check, Zap, BookOpen, Flame, Landmark, Fuel,
  AlertTriangle, Info, Compass, IndianRupee
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLACES, Place, getPlaceGuideData } from '@/data/places';
import { PlaceSignificance, TraditionType } from '@/types/place';
import { useTrip } from '@/components/TripContext';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';
import { calculateDrivingDistance, isCoordinateOnTirumalaHill, isWithinTirupatiRegion, TIRUPATI_CENTER, formatTravelTime, estimateDriveDuration, formatDistance } from '@/utils/location';
import { findNearestPlaceCandidates } from '@/lib/location';
import { useLanguage } from '@/lib/useLanguage';
import { getFestivalCrowdIntelligence } from '@/utils/festivalCrowd';
import OfflineTempleMap from '@/components/place/OfflineTempleMap';

export default function PlaceDetails() {
  const routeParams = useParams();
  const id = typeof routeParams?.id === 'string' ? routeParams.id : (Array.isArray(routeParams?.id) ? routeParams.id[0] : '');
  const lang = useLanguage();
  const { togglePlace, savedPlaces, addViewedPlace, userLocation } = useTrip();

  const { places, loading } = useRealtimePlaces(PLACES);
  const [copied, setCopied] = useState(false);

  // Collapsible drawers state
  const [openDrawer, setOpenDrawer] = useState<'legend' | 'festivals' | 'architecture' | 'faqs' | null>(null);
  const [isSignificanceOpen, setIsSignificanceOpen] = useState(false);

  const targetId = decodeURIComponent(id || '').trim().toLowerCase();
  const allPlaces = places.length > 0 ? places : PLACES;

  const place = useMemo(() => {
    const cleanTarget = targetId.replace(/[^a-z0-9]/g, '');
    return allPlaces.find(t => {
      const pId = (t.id || '').toLowerCase();
      const pSlug = ((t as any).slug || '').toLowerCase();
      const pName = (t.name || '').toLowerCase();
      const cleanId = pId.replace(/[^a-z0-9]/g, '');
      const cleanSlug = pSlug.replace(/[^a-z0-9]/g, '');
      return pId === targetId || pSlug === targetId || pName === targetId || cleanId === cleanTarget || cleanSlug === cleanTarget || (cleanTarget.length > 5 && cleanId.includes(cleanTarget));
    }) || PLACES[0];
  }, [allPlaces, targetId]);

  const guide = useMemo(() => getPlaceGuideData(place), [place]);
  const isSaved = savedPlaces.includes(place.id);

  // Dynamic place category checks
  const isTemple = place.placeType === 'spiritual' || place.category === 'Temple' || (place.tags || []).some((t: string) => t.toLowerCase().includes('temple'));
  const isZooOrWildlife = place.id === 'sv-zoo-park' || (place.tags || []).some((t: string) => ['zoo', 'safari', 'wildlife', 'deer park'].includes(t.toLowerCase()));
  const isNatureSpot = place.category === 'Nature' || place.placeType === 'leisure' || (place.tags || []).some((t: string) => ['waterfall', 'nature', 'viewpoint', 'dam', 'hills', 'garden'].includes(t.toLowerCase()));

  useEffect(() => {
    if (place?.id) {
      addViewedPlace(place.id);
    }
  }, [place?.id, addViewedPlace]);

  // Nearby places calculation
  const nearbyPlacesList = useMemo(() => {
    if (!place?.coordinates) return [];
    
    const validNeighbors = allPlaces.filter(p => {
      if (p.id === place.id) return false;
      if (isTemple) {
        return p.placeType === 'spiritual' || p.category === 'Temple' || (p.tags || []).includes('temple');
      }
      return true;
    });

    const candidates = findNearestPlaceCandidates(
      { lat: place.coordinates.lat, lng: place.coordinates.lng },
      validNeighbors,
      35000
    ).slice(0, 4);

    const isSelfTirumala = place.category === 'Tirumala Spot' || (place.coordinates ? isCoordinateOnTirumalaHill(place.coordinates.lat, place.coordinates.lng) : false);
    return candidates.map(({ place: p }) => {
      if (!p.coordinates) return { place: p, dist: 5, timeMins: 15 };
      const isTargetTirumala = p.category === 'Tirumala Spot' || isCoordinateOnTirumalaHill(p.coordinates.lat, p.coordinates.lng);
      const dist = calculateDrivingDistance(
        place.coordinates!.lat, place.coordinates!.lng,
        p.coordinates.lat, p.coordinates.lng,
        isSelfTirumala !== isTargetTirumala
      );
      const timeMins = Math.max(4, Math.round(dist * 2.5));
      return { place: p, dist, timeMins };
    });
  }, [place, allPlaces]);

  // Distance from user or fallback to Tirupati Center
  const effectiveLocation = userLocation || TIRUPATI_CENTER;

  const isDestOnHill = place.category === 'Tirumala Spot' || (place.coordinates ? isCoordinateOnTirumalaHill(place.coordinates.lat, place.coordinates.lng) : false);
  const isOriginOnHill = isCoordinateOnTirumalaHill(effectiveLocation.lat, effectiveLocation.lng);
  const isGhatTrip = isDestOnHill !== isOriginOnHill;

  const drivingDistance = useMemo(() => {
    if (!place.coordinates) return place.distanceKms || 5;
    return calculateDrivingDistance(effectiveLocation.lat, effectiveLocation.lng, place.coordinates.lat, place.coordinates.lng, isDestOnHill);
  }, [place, effectiveLocation, isDestOnHill]);

  const driveTimeMins = useMemo(() => estimateDriveDuration(drivingDistance, isGhatTrip), [drivingDistance, isGhatTrip]);
  const formattedDriveTime = useMemo(() => formatTravelTime(driveTimeMins, lang), [driveTimeMins, lang]);

  // Dynamic Festival Crowd Intelligence Hook
  const festivalCrowd = useMemo(() => getFestivalCrowdIntelligence(place.id), [place.id]);

  // Dynamic Facilities Evaluation Hook (Executed unconditionally with all hooks)
  const evaluatedFacilities = useMemo(() => {
    const isNature = place.placeType === 'nature' || place.category === 'Nature' || place.category === 'Viewpoint';
    const isFootpath = place.id.includes('footpath') || place.id.includes('mettu');
    const isMajorTemple = ['venkateswara', 'govindaraja', 'padmavathi', 'iskcon-tirupati', 'kapila-theertham'].includes(place.id);

    // 1. Food
    let foodAvailable = true;
    let foodTitle = lang === 'te' ? 'ఆహారం' : 'Food';
    let foodStatus = lang === 'te' ? 'అందుబాటులో ఉంది' : 'Available';
    if (isMajorTemple || place.practicalInfo?.food?.toLowerCase().includes('prasadam')) {
      foodTitle = lang === 'te' ? 'అన్నప్రసాదం' : 'Prasadam / Food';
      foodStatus = lang === 'te' ? 'ఉచిత ప్రసాదం' : 'Free / Available';
    } else if (isNature || place.practicalInfo?.food?.toLowerCase().includes('not available') || place.practicalInfo?.food?.toLowerCase().includes('no food')) {
      foodAvailable = false;
      foodTitle = lang === 'te' ? 'ఆహారం' : 'Food';
      foodStatus = lang === 'te' ? 'స్నాక్స్ తెచ్చుకోండి' : 'Carry Snacks';
    } else if (place.practicalInfo?.food) {
      foodStatus = lang === 'te' ? 'సమీపంలో లభ్యం' : 'Nearby Stalls';
    }

    // 2. Drinking Water
    let waterAvailable = true;
    let waterTitle = lang === 'te' ? 'మంచినీరు' : 'RO Water';
    let waterStatus = lang === 'te' ? 'RO శుద్ధ జలం' : 'Purified';
    if (isNature && !place.detailedFacilities?.drinkingWater?.available) {
      waterAvailable = false;
      waterTitle = lang === 'te' ? 'మంచినీరు' : 'Water';
      waterStatus = lang === 'te' ? 'బాటిల్ వెంట ఉంచండి' : 'Carry Bottle';
    } else if (!isMajorTemple && !place.detailedFacilities?.drinkingWater?.available) {
      waterStatus = lang === 'te' ? 'స్టాల్స్ వద్ద లభ్యం' : 'At Stalls';
    }

    // 3. Lockers
    let lockerAvailable = isMajorTemple || place.detailedFacilities?.locker?.available === true;
    let lockerTitle = lang === 'te' ? 'లాకర్లు' : 'Lockers';
    let lockerStatus = lockerAvailable 
      ? (lang === 'te' ? 'ఉచిత కౌంటర్' : 'Free Counter')
      : (lang === 'te' ? 'అందుబాటులో లేవు' : 'Not Available');

    // 4. Public Transit (Bus / Auto)
    let transitAvailable = true;
    let transitTitle = lang === 'te' ? 'రవాణా సౌకర్యం' : 'Bus / Auto';
    let transitStatus = lang === 'te' ? 'డైరెక్ట్ రూట్' : 'Direct Route';
    if (isFootpath) {
      transitStatus = lang === 'te' ? 'బేస్ వద్ద డ్రాప్' : 'Drop at Base';
    } else if (place.distanceKms > 30 || isNature) {
      transitStatus = lang === 'te' ? 'ప్రైవేట్ క్యాబ్ / ఆటో' : 'Hire Taxi / Auto';
    } else if (place.distanceKms < 5) {
      transitStatus = lang === 'te' ? 'తరచుగా లభ్యం' : 'High Frequency';
    }

    // 5. Restrooms
    let restroomAvailable = place.detailedFacilities?.washrooms?.available !== false;
    let restroomTitle = lang === 'te' ? 'శౌచాలయాలు' : 'Restrooms';
    let restroomStatus = lang === 'te' ? 'ఆలయ ప్రవేశం వద్ద' : 'Near Gate';
    if (isNature) {
      restroomStatus = lang === 'te' ? 'పార్కింగ్ బేస్ వద్ద' : 'At Base Only';
    } else if (place.detailedFacilities?.washrooms?.available === false) {
      restroomAvailable = false;
      restroomStatus = lang === 'te' ? 'అందుబాటులో లేవు' : 'Not Available';
    }

    // 6. Taxi / Cab
    let taxiAvailable = true;
    let taxiTitle = lang === 'te' ? 'క్యాబ్ / ఆటో' : 'Taxi / Cab';
    let taxiStatus = lang === 'te' ? 'డ్రాప్ పాయింట్' : 'Direct Drop';
    if (isFootpath) {
      taxiStatus = lang === 'te' ? 'బేస్ వరకే అనుమతి' : 'Base Drop Only';
    } else if (place.distanceKms > 35) {
      taxiStatus = lang === 'te' ? 'డే రెంటల్ క్యాబ్' : 'Day Rental';
    }

    return [
      { id: 'food', icon: Utensils, title: foodTitle, status: foodStatus, available: foodAvailable },
      { id: 'water', icon: Droplets, title: waterTitle, status: waterStatus, available: waterAvailable },
      { id: 'lockers', icon: Lock, title: lockerTitle, status: lockerStatus, available: lockerAvailable },
      { id: 'transit', icon: Bus, title: transitTitle, status: transitStatus, available: transitAvailable },
      { id: 'restrooms', icon: Shield, title: restroomTitle, status: restroomStatus, available: restroomAvailable },
      { id: 'taxi', icon: Car, title: taxiTitle, status: taxiStatus, available: taxiAvailable }
    ];
  }, [place, lang]);

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: place.name,
        text: `Visiting ${place.name} in Tirupati. Verified guide on Saarthi:`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openNavigation = () => {
    const lat = place.coordinates?.lat || 13.6832;
    const lng = place.coordinates?.lng || 79.3473;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const toggleDrawer = (key: 'legend' | 'festivals' | 'architecture' | 'faqs') => {
    setOpenDrawer(prev => prev === key ? null : key);
  };

  // Helper to ensure objects are never rendered directly as React children
  const toSafeText = (val: any, fallback: string = ''): string => {
    if (!val) return fallback;
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (typeof val === 'object') {
      if (val.display) return String(val.display);
      if (val.available !== undefined) return val.available ? (val.distance ? `Available (${val.distance})` : 'Available') : 'Not Available';
      if (val.opening && val.closing) return `${val.opening} – ${val.closing}`;
      if (val.open && val.close) return `${val.open} – ${val.close}`;
      if (val.name) return String(val.name);
      if (val.title) return String(val.title);
    }
    return fallback;
  };

  // Determine current open status
  const currentHour = new Date().getHours() + new Date().getMinutes() / 60;
  const isOpenNow = (place.openFrom !== undefined && place.openTo !== undefined)
    ? currentHour >= place.openFrom && currentHour < place.openTo
    : true;

  // Format timings string safely
  const defaultTimingsFallback = `${place.openFrom || 6}:00 AM – ${place.openTo ? (place.openTo > 12 ? `${place.openTo - 12}:00 PM` : `${place.openTo}:00 AM`) : '9:00 PM'}`;
  const timingsStr = toSafeText(place.timings, defaultTimingsFallback);

  // Smart Saarthi Tip
  const saarthiTip = place.saarthiIntelligence?.crowdLevel === 'High'
    ? 'Visit early before 7:30 AM or post 7:00 PM. High devotee rush during afternoon hours.'
    : 'Comfortable visiting hours. Mornings are serene with minimal queue times (15–25 mins).';

  // ═══════════════════════════════════════════════════
  // MODULAR SUB-BLOCKS (Rendered once, shared cleanly)
  // ═══════════════════════════════════════════════════

  // 1. CLOSURE & RECONSTRUCTION ADVISORY BANNER
  const closureAlertNode = place.isTemporarilyClosed ? (
    <div style={{
      backgroundColor: '#FFFBEB',
      border: '1.5px solid #F59E0B',
      borderRadius: '18px',
      padding: '16px 18px',
      boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          backgroundColor: '#FEF3C7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <AlertTriangle size={20} color="#D97706" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#92400E', margin: 0, wordBreak: 'break-word' }}>
              {lang === 'te' ? 'తీర్థయాత్రికుల సమాచారం: పునర్నిర్మాణం & ఆధునీకరణ' : 'Pilgrim Advisory: Under Reconstruction & Modernization'}
            </h3>
            <span style={{
              fontSize: '10.5px',
              fontWeight: 800,
              color: '#92400E',
              backgroundColor: '#FDE68A',
              padding: '2px 8px',
              borderRadius: '12px',
              whiteSpace: 'nowrap'
            }}>
              {lang === 'te' ? 'తాత్కాలికంగా మూసివేయబడింది' : 'Temporarily Closed'}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.5, margin: '0 0 6px', wordBreak: 'break-word' }}>
            {lang === 'te' 
              ? (place.closureNotice?.te || 'ఈ ప్రదేశం ప్రస్తుతం పునర్నిర్మాణం పనుల నిమిత్తం తాత్కాలికంగా మూసివేయబడింది.')
              : (place.closureNotice?.en || 'TTD is transforming Srivari Museum into a ₹125+ Cr world-class digital immersive 3D heritage center in partnership with TCS. General visitor entry is temporarily closed during active reconstruction.')}
          </p>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#B45309', wordBreak: 'break-word', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Info size={13} color="#B45309" style={{ flexShrink: 0 }} />
            <span>{lang === 'te' ? 'టీటీడీ పనులు పూర్తయిన తర్వాత పునఃప్రారంభ తేదీ ప్రకటించబడుతుంది.' : 'TTD will announce the grand reopening schedule once digital modernization is complete.'}</span>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  // 0. TOP 4 PRIMARY METRIC PILLS (Icon + Value + Tiny Label)
  const topMetricsNode = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '8px' }}>
      {/* Distance */}
      <div suppressHydrationWarning style={{ backgroundColor: '#FFFFFF', border: '1.5px solid rgba(15, 81, 50, 0.15)', borderRadius: '14px', padding: '9px 4px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
        <MapPin size={13} color="#0F5132" style={{ marginBottom: '3px' }} />
        <div suppressHydrationWarning style={{ fontSize: '13px', fontWeight: 900, color: '#0F5132', lineHeight: 1.1 }}>
          {formatDistance(drivingDistance, lang)}
        </div>
        <div suppressHydrationWarning style={{ fontSize: '9px', fontWeight: 700, color: '#64748B', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          {lang === 'te' ? 'దూరం' : 'Distance'}
        </div>
      </div>

      {/* Travel Time */}
      <div suppressHydrationWarning style={{ backgroundColor: '#FFFFFF', border: '1.5px solid rgba(217, 119, 6, 0.2)', borderRadius: '14px', padding: '9px 4px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
        <Car size={13} color="#D97706" style={{ marginBottom: '3px' }} />
        <div suppressHydrationWarning style={{ fontSize: '13px', fontWeight: 900, color: '#D97706', lineHeight: 1.1 }}>
          {formattedDriveTime ? formattedDriveTime.replace(/\bm\b/, 'min') : `${driveTimeMins} min`}
        </div>
        <div suppressHydrationWarning style={{ fontSize: '9px', fontWeight: 700, color: '#64748B', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          {lang === 'te' ? 'సమయం' : 'Drive'}
        </div>
      </div>

      {/* Status */}
      <div suppressHydrationWarning style={{ backgroundColor: '#FFFFFF', border: `1.5px solid ${isOpenNow ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, borderRadius: '14px', padding: '9px 4px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isOpenNow ? '#16A34A' : '#DC2626', marginBottom: '4px' }} />
        <div suppressHydrationWarning style={{ fontSize: '13px', fontWeight: 900, color: isOpenNow ? '#16A34A' : '#DC2626', lineHeight: 1.1 }}>
          {isOpenNow ? (lang === 'te' ? 'ఓపెన్' : 'Open') : (lang === 'te' ? 'మూసివేత' : 'Closed')}
        </div>
        <div suppressHydrationWarning style={{ fontSize: '9px', fontWeight: 700, color: '#64748B', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          {lang === 'te' ? 'స్థితి' : 'Status'}
        </div>
      </div>

      {/* Entry Fee */}
      <div suppressHydrationWarning style={{ backgroundColor: '#FFFFFF', border: '1.5px solid rgba(37, 99, 235, 0.2)', borderRadius: '14px', padding: '9px 4px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
        <IndianRupee size={13} color="#2563EB" style={{ marginBottom: '3px' }} />
        <div suppressHydrationWarning style={{ fontSize: '13px', fontWeight: 900, color: '#2563EB', lineHeight: 1.1 }}>
          {place.entryFeeNum === 0 || !place.entryFeeNum ? (lang === 'te' ? 'ఉచితం' : 'Free') : `₹${place.entryFeeNum}`}
        </div>
        <div suppressHydrationWarning style={{ fontSize: '9px', fontWeight: 700, color: '#64748B', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          {lang === 'te' ? 'ప్రవేశం' : 'Entry'}
        </div>
      </div>
    </div>
  );

  // 1.5 CULTURAL SIGNIFICANCE & PRACTICAL ACTION ("Tradition -> Meaning -> Action")
  const significanceData: PlaceSignificance = useMemo(() => {
    if (place.significance) {
      return place.significance;
    }

    const pType = place.placeType;
    const pCat = (place.category || '').toLowerCase();
    const tags = (place.tags || []).map(t => t.toLowerCase());

    const isNature = pType === 'nature' || pCat.includes('nature') || pCat.includes('water') || tags.some(t => ['waterfall', 'hills', 'dam', 'forest'].includes(t));
    const isHeritage = pType === 'historical' || pCat.includes('historical') || pCat.includes('heritage') || tags.some(t => ['fort', 'monument', 'history'].includes(t));
    const isFood = pType === 'food' || pCat.includes('food') || tags.some(t => ['restaurant', 'sweets', 'dining', 'food'].includes(t));

    if (isNature) {
      return {
        traditionType: 'nature',
        whyVisitTe: place.whyVisit ? `${place.whyVisit}` : 'ప్రకృతి అందాలు, ఆహ్లాదకరమైన వాతావరణం మరియు పరిసరాలను అన్వేషించడానికి ప్రజలు ఇక్కడికి వస్తారు.',
        whyVisitEn: place.whyVisit || 'Visitors come to experience scenic nature, fresh air, and peaceful outdoor surroundings.',
        actionsTe: [
          'పరిసర ప్రకృతి అందాలను మరియు వ్యూ పాయింట్లను వీక్షిస్తారు',
          'సురక్షిత వాకింగ్ మార్గాల గుండా నడుస్తూ వాతావరణాన్ని ఆస్వాదిస్తారు',
          'స్థానిక నిబంధనలను పాటిస్తూ ఫోటోలు తీసుకుంటారు'
        ],
        actionsEn: [
          'Take in scenic panoramic views and natural landscapes',
          'Walk designated walking trails and enjoy the fresh forest air',
          'Observe local eco-guidelines and nature preservation'
        ],
        culturalMeaningTe: place.history || 'ఈ ప్రదేశానికి స్థానిక సహజ వనరులు మరియు ప్రాంతీయ జీవవైవిధ్యంతో ప్రత్యేక అనుబంధం ఉంది.',
        culturalMeaningEn: place.history || 'This scenic spot holds deep ecological and regional connection in the Tirupati district.',
        saarthiTipTe: 'వాతావరణ పరిస్థితిని బట్టి సందర్శించండి. ఉదయం లేదా సాయంత్రం వేళల్లో వాతావరణం ఆహ్లాదకరంగా ఉంటుంది.',
        saarthiTipEn: 'Morning and late afternoon hours offer the most pleasant weather for outdoor exploration.'
      };
    }

    if (isHeritage) {
      return {
        traditionType: 'heritage',
        whyVisitTe: place.whyVisit ? `${place.whyVisit}` : 'ఈ చారిత్రక ప్రాముఖ్యత కలిగిన నిర్మాణ వైభవాన్ని మరియు నాటి సంస్కృతిని ప్రత్యక్షంగా వీక్షించడానికి సందర్శిస్తారు.',
        whyVisitEn: place.whyVisit || 'Visitors come to explore the historical architecture and regional cultural heritage.',
        actionsTe: [
          'ప్రాచీన నిర్మాణ శైలి మరియు శిల్పకళను పరిశీలిస్తారు',
          'చారిత్రక విశేషాలను తెలుసుకుంటూ ప్రాంగణంలో నడుస్తారు',
          'స్థానిక సమాచార ఫలకాలను గమనిస్తూ చరిత్రను అర్థం చేసుకుంటారు'
        ],
        actionsEn: [
          'Examine historical architectural styles and ancient stone craftsmanship',
          'Walk through preserved heritage courtyards and monuments',
          'Learn historical context and regional dynastic legacy'
        ],
        culturalMeaningTe: place.history || 'ఈ చారిత్రక ప్రదేశం శతాబ్దాల నాటి సాంస్కృతిక వారసత్వానికి మరియు పాలనా చరిత్రకు సాక్ష్యంగా నిలుస్తుంది.',
        culturalMeaningEn: place.history || 'This historical landmark stands as an enduring monument to centuries of regional culture and architectural mastery.',
        saarthiTipTe: 'చారిత్రక ప్రదేశాన్ని పూర్తిగా చూడటానికి తగినంత సమయం కేటాయించండి. సౌకర్యవంతమైన పాదరక్షలు ధరించండి.',
        saarthiTipEn: 'Allocate adequate time to explore the heritage site comfortably. Wear walking-friendly shoes.'
      };
    }

    if (isFood) {
      return {
        traditionType: 'food',
        whyVisitTe: place.whyVisit ? `${place.whyVisit}` : 'స్థానిక సాంప్రదాయ రుచులు మరియు ప్రసిద్ధ వంటకాలను ఆస్వాదించడానికి ప్రజలు ఇక్కడికి వస్తారు.',
        whyVisitEn: place.whyVisit || 'Visitors stop here to experience authentic local culinary traditions and specialties.',
        actionsTe: [
          'తాజా సాంప్రదాయ వంటకాలు మరియు ప్రత్యేక పదార్థాలను రుచి చూస్తారు',
          'పరిశుభ్రమైన సాత్విక/స్థానిక భోజనం లేదా అల్పాహారం స్వీకరిస్తారు',
          'ప్రయాణానికి అవసరమైన ఆహారాన్ని ప్యాక్ చేయించుకుంటారు'
        ],
        actionsEn: [
          'Sample fresh traditional delicacies and signature dishes',
          'Enjoy wholesome regional meals or refreshments',
          'Pack travel-friendly items for the onward journey'
        ],
        culturalMeaningTe: place.history || 'తీర్థయాత్ర సంస్కృతిలో భాగంగా యాత్రికులు స్థానిక రుచులను ఆస్వాదించడం ఒక ఆచారం.',
        culturalMeaningEn: place.history || 'Enjoying wholesome local food forms an integral part of the pilgrim travel experience in Tirupati.',
        saarthiTipTe: 'రద్దీ సమయాలను నివారించడానికి భోజన వేళలకు కొద్దిగా ముందుగా లేదా తర్వాత వెళ్లడం సౌకర్యవంతం.',
        saarthiTipEn: 'Visiting slightly before or after peak meal hours ensures faster service and seating.'
      };
    }

    // Default: Temple / Spiritual
    const knownFor = place.spiritualInfo?.knownFor;
    const wishes = place.spiritualInfo?.wishes;
    return {
      traditionType: 'temple',
      whyVisitTe: wishes
        ? `${wishes} కోసం మరియు స్వామివారి దివ్య దర్శనం కోసం భక్తులు ఇక్కడికి వస్తారు.`
        : (knownFor
            ? `${knownFor} కోసం ప్రసిద్ధి చెందిన ఈ పవిత్ర క్షేత్రాన్ని దర్శించి పూజలు నిర్వహిస్తారు.`
            : (place.whyVisit || 'ఈ పవిత్ర ఆలయాన్ని దర్శించి స్వామివారి దివ్యానుగ్రహం మరియు మనశ్శాంతి పొందడం ఇక్కడి భక్తి సంప్రదాయం.')),
      whyVisitEn: knownFor
        ? `Devotees visit to seek blessings for ${knownFor}.`
        : (place.whyVisit || 'Pilgrims visit to offer traditional prayers, fulfill vows, and receive divine blessings.'),
      actionsTe: place.spiritualInfo?.devoteeTips && place.spiritualInfo.devoteeTips.length > 0
        ? place.spiritualInfo.devoteeTips
        : [
            'గర్భాలయంలో మూలవిరాట్టును భక్తిశ్రద్ధలతో దర్శించుకుంటారు',
            'ఆలయ ప్రదక్షిణ చేసి తీర్థ ప్రసాదాలు స్వీకరిస్తారు',
            'కుటుంబ క్షేమం & మనశ్శాంతి కోసం ప్రార్థిస్తారు'
          ],
      actionsEn: [
        'Receive darshan of the main deity inside the temple with reverence',
        'Perform circumambulation (pradakshina) and receive sacred teertham & prasadam',
        'Offer silent prayers for family peace, good health, and prosperity'
      ],
      culturalMeaningTe: place.history || 'ఈ పవిత్ర క్షేత్రానికి ప్రాచీన సంప్రదాయాలలో విశిష్ట స్థానం ఉంది. భక్తుల మనోభీష్టాలను నెరవేర్చే పుణ్యభూమిగా పరిగణించబడుతుంది.',
      culturalMeaningEn: place.history || 'This sacred shrine holds a revered place in regional heritage, sanctified by generations of faithful devotees.',
      saarthiTipTe: place.practicalInfo?.dressCode
        ? `దుస్తుల నియమావళి: ${place.practicalInfo.dressCode}. ఉదయం వేళల్లో దర్శనం ప్రశాంతంగా పూర్తవుతుంది.`
        : 'ఉదయం వేళల్లో దర్శనం ప్రశాంతంగా మరియు తక్కువ క్యూ సమయంతో పూర్తవుతుంది.',
      saarthiTipEn: place.practicalInfo?.dressCode
        ? `Dress code: ${place.practicalInfo.dressCode}. Visiting during morning hours offers a smooth darshan experience.`
        : 'Visiting during early morning hours offers the most serene darshan experience.'
    };
  }, [place]);

  const traditionTheme = useMemo(() => {
    switch (significanceData.traditionType) {
      case 'nature':
        return {
          icon: Compass,
          iconColor: '#0D9488',
          borderColor: 'rgba(13, 148, 136, 0.22)',
          bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDFA 100%)',
          badgeBg: '#CCFBF1',
          badgeColor: '#0F766E',
          titleTe: 'సహజ సౌందర్యం & సందర్శన విశేషాలు',
          titleEn: 'Natural Wonder & Highlights',
          badgeTe: 'సహజ సౌందర్యం & అనుభవం',
          badgeEn: 'Nature & Experience',
          buttonClosedTe: 'సందర్శన క్రమం, అనుభవాలు & సూచనలు చూడండి',
          buttonClosedEn: 'View Activity Steps, Experiences & Tips',
          actionTitleTe: 'సందర్శకులు చేయవలసిన ముఖ్య కార్యకలాపాలు',
          actionTitleEn: 'Key Activities & Experiences',
          meaningTitleTe: 'భౌగోళిక & పర్యావరణ విశిష్టత',
          meaningTitleEn: 'Geographical & Ecological Significance'
        };
      case 'heritage':
        return {
          icon: Landmark,
          iconColor: '#2563EB',
          borderColor: 'rgba(37, 99, 235, 0.22)',
          bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #EFF6FF 100%)',
          badgeBg: '#DBEAFE',
          badgeColor: '#1E40AF',
          titleTe: 'చారిత్రక వైభవం & ప్రాముఖ్యత',
          titleEn: 'Historical Heritage & Architecture',
          badgeTe: 'చారిత్రక వారసత్వం',
          badgeEn: 'Historical Heritage',
          buttonClosedTe: 'చారిత్రక విశేషాలు, నిర్మాణ శైలి & మార్గదర్శనం చూడండి',
          buttonClosedEn: 'View Key Sights, Dynastic Lore & Guidelines',
          actionTitleTe: 'ప్రత్యక్షంగా చూడవలసిన చారిత్రక విశేషాలు',
          actionTitleEn: 'Key Sights & Architectural Highlights',
          meaningTitleTe: 'చారిత్రక ప్రాశస్త్యం & రాజవంశాల నేపథ్యం',
          meaningTitleEn: 'Historical Significance & Dynastic Legacy'
        };
      case 'food':
        return {
          icon: Utensils,
          iconColor: '#D97706',
          borderColor: 'rgba(217, 119, 6, 0.22)',
          bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFFBEB 100%)',
          badgeBg: '#FEF3C7',
          badgeColor: '#92400E',
          titleTe: 'ఆహార సంస్కృతి & ప్రత్యేకతలు',
          titleEn: 'Culinary Tradition & Specialties',
          badgeTe: 'ఆహార సంస్కృతి',
          badgeEn: 'Culinary Tradition',
          buttonClosedTe: 'ప్రసిద్ధ రుచులు, పదార్థాలు & వివరాలు చూడండి',
          buttonClosedEn: 'View Signature Items & Specialties',
          actionTitleTe: 'రుచి చూడవలసిన ప్రసిద్ధ సాంప్రదాయ పదార్థాలు',
          actionTitleEn: 'Signature Specialties & Must-Try Items',
          meaningTitleTe: 'ఆహార సంప్రదాయ నేపథ్యం',
          meaningTitleEn: 'Culinary Heritage & Tradition'
        };
      case 'theertham':
        return {
          icon: Droplets,
          iconColor: '#0284C7',
          borderColor: 'rgba(2, 132, 199, 0.22)',
          bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 100%)',
          badgeBg: '#E0F2FE',
          badgeColor: '#0369A1',
          titleTe: 'పుణ్య తీర్థం & పవిత్రత',
          titleEn: 'Sacred Theertham & Holy Waters',
          badgeTe: 'పవిత్ర తీర్థం',
          badgeEn: 'Sacred Theertham',
          buttonClosedTe: 'తీర్థ విధి, విశేషాలు & ప్రాశస్త్యం చూడండి',
          buttonClosedEn: 'View Bathing Customs & Sthala Puranam',
          actionTitleTe: 'భక్తులు ఆచరించే తీర్థస్నాన విధి & పూజలు',
          actionTitleEn: 'Sacred Bathing Rituals & Observances',
          meaningTitleTe: 'తీర్థ మహత్యం & పురాణ నేపథ్యం',
          meaningTitleEn: 'Sacred Purana & Theertha Mahatyam'
        };
      case 'temple':
      default:
        return {
          icon: Sparkles,
          iconColor: '#0F5132',
          borderColor: 'rgba(15, 81, 50, 0.22)',
          bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAF7 100%)',
          badgeBg: '#E8F5E9',
          badgeColor: '#0F5132',
          titleTe: 'ఆలయ ప్రాశస్త్యం & సంప్రదాయం',
          titleEn: 'Temple Tradition & Devotional Purpose',
          badgeTe: 'క్షేత్ర ప్రాశస్త్యం & ఆచారం',
          badgeEn: 'Sacred Tradition & Practice',
          buttonClosedTe: 'దర్శన క్రమం, విశిష్టత & ఆచారాలు చూడండి',
          buttonClosedEn: 'View Darshan Steps, Traditions & Guidance',
          actionTitleTe: 'భక్తులు ఆచరించే దర్శన క్రమం & సంప్రదాయాలు',
          actionTitleEn: 'Traditional Darshan Sequence & Practices',
          meaningTitleTe: 'స్థల పురాణం & సంప్రదాయ ప్రాశస్త్యం',
          meaningTitleEn: 'Sthala Purana & Sacred Significance'
        };
    }
  }, [significanceData.traditionType]);

  const traditionChips = useMemo(() => {
    switch (significanceData.traditionType) {
      case 'nature':
        return [
          { icon: Compass, color: '#0D9488', label: lang === 'te' ? 'సహజ సౌందర్యం' : 'Scenic Nature' },
          { icon: Droplets, color: '#0284C7', label: lang === 'te' ? 'జలపాతం & కొండలు' : 'Water & Hills' },
          { icon: MapPin, color: '#16A34A', label: lang === 'te' ? 'పర్యావరణం' : 'Eco Zone' }
        ];
      case 'heritage':
        return [
          { icon: Landmark, color: '#1E40AF', label: lang === 'te' ? 'చారిత్రక వారసత్వం' : 'Heritage' },
          { icon: Shield, color: '#D97706', label: lang === 'te' ? 'రాజవంశాల చరిత్ర' : 'Dynastic Lore' },
          { icon: BookOpen, color: '#0F5132', label: lang === 'te' ? 'పురాతన శిల్పకళ' : 'Architecture' }
        ];
      case 'food':
        return [
          { icon: Utensils, color: '#D97706', label: lang === 'te' ? 'సాంప్రదాయ రుచులు' : 'Local Food' },
          { icon: Sparkles, color: '#0F5132', label: lang === 'te' ? 'పవిత్ర ప్రసాదం' : 'Prasadam' },
          { icon: Heart, color: '#E11D48', label: lang === 'te' ? 'స్పెషాలిటీ' : 'Signature' }
        ];
      case 'theertham':
        return [
          { icon: Droplets, color: '#0284C7', label: lang === 'te' ? 'పుణ్య తీర్థం' : 'Holy Water' },
          { icon: Sparkles, color: '#D97706', label: lang === 'te' ? 'తీర్థ స్నాన విధి' : 'Sacred Bath' },
          { icon: BookOpen, color: '#0F5132', label: lang === 'te' ? 'పురాణ కథ' : 'Sthala Puranam' }
        ];
      case 'temple':
      default:
        return [
          { icon: Landmark, color: '#0F5132', label: lang === 'te' ? 'ఆలయ ప్రాశస్త్యం' : 'Sacred Shrine' },
          { icon: Sparkles, color: '#D97706', label: lang === 'te' ? 'భక్తి సంప్రదాయం' : 'Tradition' },
          { icon: BookOpen, color: '#2563EB', label: lang === 'te' ? 'స్థల పురాణం' : 'Sthala Puranam' }
        ];
    }
  }, [significanceData.traditionType, lang]);

  // ZONE 2: WHY THIS PLACE IS SPECIAL (Practical + Cultural Foundation)
  const placeSignificanceNode = (
    <div style={{
      backgroundColor: '#FFFFFF',
      background: traditionTheme.bgGradient,
      border: `1.5px solid ${traditionTheme.borderColor}`,
      borderRadius: '18px',
      padding: '16px 16px',
      boxShadow: '0 3px 12px rgba(15, 23, 42, 0.04)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            backgroundColor: traditionTheme.badgeBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <traditionTheme.icon size={15} color={traditionTheme.iconColor} />
          </div>
          <h2 style={{
            fontSize: '13.5px',
            fontWeight: 800,
            color: '#0F172A',
            margin: 0,
            letterSpacing: '-0.01em',
            wordBreak: 'break-word'
          }}>
            {lang === 'te' ? traditionTheme.titleTe : traditionTheme.titleEn}
          </h2>
        </div>
        <span style={{
          fontSize: '10.5px',
          fontWeight: 700,
          color: traditionTheme.badgeColor,
          backgroundColor: traditionTheme.badgeBg,
          padding: '2.5px 8px',
          borderRadius: '8px',
          whiteSpace: 'nowrap'
        }}>
          {lang === 'te' ? traditionTheme.badgeTe : traditionTheme.badgeEn}
        </span>
      </div>

      {/* 3 Visual Chips (Heritage • Tradition • Story) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {traditionChips.map((chip, idx) => {
          const ChipIcon = chip.icon;
          return (
            <span key={idx} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              borderRadius: '8px',
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#334155'
            }}>
              <ChipIcon size={12} color={chip.color} />
              <span>{chip.label}</span>
            </span>
          );
        })}
      </div>

      {/* Core 1-2 Sentence Reason: Why This Place Matters */}
      <p style={{
        fontSize: '13px',
        color: '#1E293B',
        fontWeight: 600,
        lineHeight: 1.5,
        margin: '0 0 12px',
        wordBreak: 'break-word'
      }}>
        {lang === 'te' ? significanceData.whyVisitTe : significanceData.whyVisitEn}
      </p>

      {/* Practical Action Box: What to Notice & Do (3 Points) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        padding: '10px 12px',
        marginBottom: '10px'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 800,
          color: '#0F5132',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <CheckCircle2 size={13} color="#0F5132" />
          <span>{lang === 'te' ? traditionTheme.actionTitleTe : traditionTheme.actionTitleEn}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {(lang === 'te' ? significanceData.actionsTe : significanceData.actionsEn).slice(0, 3).map((action, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#0F5132', marginTop: '6px', flexShrink: 0 }} />
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Saarthi Practical Tip */}
      <div style={{
        backgroundColor: '#FEF3C7',
        border: '1px solid #FDE68A',
        borderRadius: '12px',
        padding: '9px 12px',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '7px'
      }}>
        <Sparkles size={14} color="#92400E" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '2px' }}>
            {lang === 'te' ? 'సారథి సూచన' : 'Saarthi Tip'}
          </span>
          <p style={{ fontSize: '11.5px', color: '#78350F', fontWeight: 600, lineHeight: 1.45, margin: 0 }}>
            {lang === 'te' ? significanceData.saarthiTipTe : significanceData.saarthiTipEn}
          </p>
        </div>
      </div>

      {/* Read Deep Sacred Story Link */}
      <button
        onClick={() => {
          setOpenDrawer('legend');
          const el = document.getElementById('heritage-accordions');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        style={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '9px 12px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#0F5132',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BookOpen size={14} color="#0F5132" />
          <span>{lang === 'te' ? 'స్థల పురాణం & పవిత్ర చరిత్ర చదవండి ↓' : 'Read Sacred Story & History ↓'}</span>
        </span>
        <ChevronDown size={14} color="#64748B" />
      </button>
    </div>
  );

  // 2. QUICK FACTS ("Before you go" - 6 Scannable Visual Object Tiles)
  const quickFactsNode = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <h2 style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A', margin: '4px 0 2px 0', letterSpacing: '-0.01em' }}>
        {lang === 'te' ? 'సందర్శించే ముందు (ముఖ్య నియమాలు)' : 'Before you go'}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
        {/* 1. Timings */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '14px', padding: '10px 12px', boxShadow: '0 2px 6px rgba(15,23,42,0.02)', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
            <Clock size={14} color="#0F5132" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>{lang === 'te' ? 'సమయాలు' : 'Timings'}</span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', lineHeight: 1.25, wordBreak: 'break-word' }}>
            {timingsStr.split('(')[0].trim()}
          </div>
        </div>

        {/* 2. Dress Code */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '14px', padding: '10px 12px', boxShadow: '0 2px 6px rgba(15,23,42,0.02)', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
            <Shirt size={14} color="#0F5132" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>{lang === 'te' ? 'దుస్తుల నియమం' : 'Dress Code'}</span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', lineHeight: 1.25, wordBreak: 'break-word' }}>
            {lang === 'te' 
              ? 'సాంప్రదాయ దుస్తులు' 
              : (place.practicalInfo?.dressCode?.includes('Strict') ? 'Traditional Mandatory' : 'Traditional / Modest')}
          </div>
        </div>

        {/* 3. Parking */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '14px', padding: '10px 12px', boxShadow: '0 2px 6px rgba(15,23,42,0.02)', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
            <Car size={14} color="#0F5132" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>{lang === 'te' ? 'పార్కింగ్' : 'Parking'}</span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', lineHeight: 1.25, wordBreak: 'break-word' }}>
            {lang === 'te' 
              ? 'పార్కింగ్ అందుబాటులో ఉంది' 
              : (() => {
                  const rawParking = toSafeText(place.facilities?.parking, toSafeText(place.practicalInfo?.parking, 'Available Nearby'));
                  if (rawParking.toLowerCase().includes('dedicated')) return 'Dedicated Parking';
                  if (rawParking.toLowerCase().includes('spacious') || rawParking.toLowerCase().includes('ample') || rawParking.toLowerCase().includes('large')) return 'Ample Parking';
                  if (rawParking.toLowerCase().includes('street')) return 'Street Parking';
                  if (rawParking.toLowerCase().includes('limited')) return 'Limited Parking';
                  return rawParking.split(',')[0].trim() || 'Available Nearby';
                })()}
          </div>
        </div>

        {/* 4. Accessibility */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '14px', padding: '10px 12px', boxShadow: '0 2px 6px rgba(15,23,42,0.02)', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
            <CheckCircle2 size={14} color="#0F5132" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>{lang === 'te' ? 'ప్రవేశ సౌలభ్యం' : 'Accessibility'}</span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', lineHeight: 1.25, wordBreak: 'break-word' }}>
            {lang === 'te'
              ? (place.recommendationContext?.wheelchairAccessible ? 'వీల్ చైర్ సౌకర్యం' : 'ర్యాంప్ / సులభ ప్రవేశం')
              : (place.recommendationContext?.wheelchairAccessible ? 'Wheelchair Friendly' : 'Ramp / Ground Access')}
          </div>
        </div>

        {/* 5. Camera & Phones */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '14px', padding: '10px 12px', boxShadow: '0 2px 6px rgba(15,23,42,0.02)', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
            <Camera size={14} color="#0F5132" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>{lang === 'te' ? 'ఫోన్లు & కెమెరా' : 'Camera Rules'}</span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', lineHeight: 1.25, wordBreak: 'break-word' }}>
            {lang === 'te'
              ? (place.id === 'venkateswara' ? 'ఖచ్చితంగా నిషేధం' : 'గర్భగుడి వెలుపల అనుమతి')
              : (place.id === 'venkateswara' ? 'Strictly Prohibited' : 'Outside Main Temple')}
          </div>
        </div>

        {/* 6. Water & Prasadam */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '14px', padding: '10px 12px', boxShadow: '0 2px 6px rgba(15,23,42,0.02)', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
            <Droplets size={14} color="#0F5132" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap' }}>{lang === 'te' ? 'మంచినీరు' : 'Water Facility'}</span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', lineHeight: 1.25, wordBreak: 'break-word' }}>
            {evaluatedFacilities.find(f => f.id === 'water')?.status || (lang === 'te' ? 'RO శుద్ధ జలం' : 'RO Purified')}
          </div>
        </div>
      </div>
    </div>
  );

  // 3. FESTIVAL CROWD INTELLIGENCE (Rendered only if there is active festival impact)
  const festivalAlertNode = festivalCrowd.hasImpact ? (
    <div style={{
      backgroundColor: festivalCrowd.isFestivalActive ? '#FFFDF7' : '#F0F9FF',
      border: festivalCrowd.isFestivalActive ? '1.5px solid #F59E0B' : '1.5px solid #93C5FD',
      borderRadius: '16px',
      padding: '12px 14px',
      boxShadow: festivalCrowd.isFestivalActive 
        ? '0 4px 14px rgba(245, 158, 11, 0.12)' 
        : '0 4px 14px rgba(37, 99, 235, 0.08)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Flame size={14} color={festivalCrowd.isFestivalActive ? '#D97706' : '#2563EB'} />
          <span style={{ fontSize: '12.5px', fontWeight: 800, color: festivalCrowd.isFestivalActive ? '#92400E' : '#1E40AF' }}>
            {lang === 'te' ? festivalCrowd.alertTitleTe : festivalCrowd.alertTitleEn}
          </span>
        </div>
        <span style={{
          fontSize: '10px',
          fontWeight: 800,
          color: festivalCrowd.isFestivalActive ? '#92400E' : '#1D4ED8',
          backgroundColor: festivalCrowd.isFestivalActive ? '#FEF3C7' : '#DBEAFE',
          padding: '2px 7px',
          borderRadius: '6px',
          border: festivalCrowd.isFestivalActive ? '1px solid #FCD34D' : '1px solid #BFDBFE'
        }}>
          {lang === 'te' ? festivalCrowd.badgeTextTe : festivalCrowd.badgeTextEn}
        </span>
      </div>
      <p style={{ fontSize: '12px', color: '#1E293B', fontWeight: 600, lineHeight: 1.45, margin: '0 0 8px' }}>
        {lang === 'te' ? festivalCrowd.alertMessageTe : festivalCrowd.alertMessageEn}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#64748B', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '6px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} color="#64748B" />
          {lang === 'te' ? 'సమయం:' : 'Visit:'} <strong>{lang === 'te' ? (place.durationMins ? `${place.durationMins} నిమి.` : '45 నిమిషాలు') : (place.durationMins ? `${place.durationMins} mins` : (guide.duration || '45 mins'))}</strong>
        </span>
        <span>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Zap size={12} color="#CA8A04" />
          {lang === 'te' ? 'అనుకూలం:' : 'Best:'} <strong>{festivalCrowd.recommendedTime}</strong>
        </span>
      </div>
    </div>
  ) : null;

  // 4. PRIMARY ACTION BUTTONS
  const ctaButtonsNode = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <button
        onClick={openNavigation}
        style={{
          width: '100%',
          backgroundColor: '#0F5132',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '14px',
          padding: '14px 18px',
          fontSize: '14.5px',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          cursor: 'pointer',
          boxShadow: '0 6px 20px -3px rgba(15, 81, 50, 0.38)',
          transition: 'transform 0.15s ease',
          letterSpacing: '-0.01em'
        }}
      >
        <Navigation size={17} color="#FFFFFF" fill="#FFFFFF" />
        <span style={{ color: '#FFFFFF' }}>
          {lang === 'te' 
            ? (isTemple ? 'దర్శన మార్గం ప్రారంభించండి' : 'మార్గం ప్రారంభించండి') 
            : 'Start Navigation'}
        </span>
        <span style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '2px 8px',
          borderRadius: '10px',
          fontSize: '11.5px',
          fontWeight: 700,
          color: '#FFFFFF'
        }}>
          {formattedDriveTime}
        </span>
      </button>

      {/* Fuel & Trip Cost Estimator Link */}
      <Link
        href={`/trip-estimator?destId=${place.id}`}
        style={{
          width: '100%',
          backgroundColor: '#F8FAFC',
          color: '#1E293B',
          border: '1px solid rgba(15, 23, 42, 0.1)',
          borderRadius: '14px',
          padding: '12px 14px',
          minHeight: '48px',
          fontSize: '12.5px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          textDecoration: 'none',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          transition: 'background 0.15s ease',
          boxSizing: 'border-box',
          textAlign: 'center',
          wordBreak: 'break-word'
        }}
      >
        <Fuel size={16} color="#059669" style={{ flexShrink: 0 }} />
        <span>{lang === 'te' ? 'ఇంధనం & ప్రయాణ ఖర్చు అంచనా (బైక్ / కారు)' : 'Estimate Fuel & Trip Cost (Bike / Car)'}</span>
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
        <button
          onClick={() => togglePlace(place.id)}
          style={{
            backgroundColor: isSaved ? '#FFF1F2' : '#FFFFFF',
            border: isSaved ? '1px solid #FECDD3' : '1px solid rgba(15, 23, 42, 0.08)',
            borderRadius: '14px',
            padding: '12px 8px',
            minHeight: '48px',
            fontSize: '12px',
            fontWeight: 700,
            color: isSaved ? '#E11D48' : '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            minWidth: 0,
            boxSizing: 'border-box'
          }}
        >
          <Heart size={16} fill={isSaved ? '#E11D48' : 'none'} style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{isSaved ? (lang === 'te' ? 'సేవ్ చేయబడింది' : 'Saved') : (lang === 'te' ? (isTemple ? 'ఆలయాన్ని సేవ్ చేయండి' : 'ప్రదేశాన్ని సేవ్ చేయండి') : (isTemple ? 'Save Temple' : 'Save Place'))}</span>
        </button>

        <button
          onClick={handleShare}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            borderRadius: '14px',
            padding: '12px 8px',
            minHeight: '48px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            minWidth: 0,
            boxSizing: 'border-box'
          }}
        >
          <Share2 size={16} color="#0F172A" style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lang === 'te' ? 'షేర్ చేయండి' : 'Share Place'}</span>
        </button>
      </div>
    </div>
  );

  // 5. ESSENTIAL FACILITIES
  const essentialFacilitiesNode = (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid rgba(15, 23, 42, 0.06)',
      borderRadius: '20px',
      padding: '16px 18px',
      boxShadow: '0 4px 14px rgba(15,23,42,0.03)'
    }}>
      <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px' }}>
        {lang === 'te' ? 'ముఖ్య సౌకర్యాలు' : 'Essential Facilities'}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
        {evaluatedFacilities.map((fac) => {
          const FacIcon = fac.icon;
          return (
            <div
              key={fac.id}
              style={{
                backgroundColor: fac.available ? '#F8FAFC' : '#FAFAFA',
                border: fac.available ? '1px solid rgba(15,23,42,0.04)' : '1px dashed #CBD5E1',
                borderRadius: '12px',
                padding: '8px 4px',
                textAlign: 'center',
                opacity: fac.available ? 1 : 0.85,
                minWidth: 0,
                overflow: 'hidden'
              }}
            >
              <FacIcon
                size={15}
                color={fac.available ? '#0F5132' : '#94A3B8'}
                style={{ margin: '0 auto 3px', display: 'block' }}
              />
              <span style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: fac.available ? '#0F172A' : '#64748B',
                display: 'block',
                textDecoration: fac.available ? 'none' : 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {fac.title}
              </span>
              <span style={{
                fontSize: '9px',
                fontWeight: 600,
                color: fac.available ? '#64748B' : '#DC2626',
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {fac.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );




  // 8. NEARBY PLACES
  const nearbyTemplesNode = nearbyPlacesList.length > 0 ? (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid rgba(15, 23, 42, 0.06)',
      borderRadius: '20px',
      padding: '18px 18px',
      boxShadow: '0 4px 14px rgba(15,23,42,0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          {lang === 'te' ? (isTemple ? 'సమీప పవిత్ర ఆలయాలు' : 'సమీప సందర్శనీయ ప్రదేశాలు') : (isTemple ? 'Nearby Sacred Temples' : 'Nearby Places to Visit')}
        </h2>
        <Link href="/explore" style={{ fontSize: '12px', fontWeight: 800, color: '#0F5132', textDecoration: 'none' }}>
          {lang === 'te' ? 'అన్నీ చూడండి →' : 'View All →'}
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '12px'
      }}>
        {nearbyPlacesList.map(({ place: p, timeMins, dist }) => (
          <Link
            key={p.id}
            href={`/place/${p.id}`}
            style={{
              textDecoration: 'none',
              backgroundColor: '#F8FAFC',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(15,23,42,0.02)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.15s ease'
            }}
          >
            <div style={{
              width: '100%',
              height: '92px',
              backgroundImage: `url(${p.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#E2E8F0',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: '6px',
                left: '6px',
                backgroundColor: 'rgba(15, 23, 42, 0.82)',
                backdropFilter: 'blur(4px)',
                padding: '2px 7px',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <Clock size={10} color="#6EE7B7" />
                <span>{timeMins} {lang === 'te' ? 'నిమి.' : 'mins'}</span>
              </div>
            </div>
            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
              <p style={{
                fontSize: '12.5px',
                fontWeight: 800,
                color: '#0F172A',
                margin: '0 0 4px',
                lineHeight: 1.3,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: '32px'
              }}>
                {p.name}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                <MapPin size={11} color="#94A3B8" />
                <span>{dist.toFixed(1)} km away</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  ) : null;

  // 10. HERITAGE / VISITOR ACCORDIONS
  const heritageAccordionsNode = (
    <div id="heritage-accordions">
      <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px' }}>
        {lang === 'te' ? (isTemple ? 'ఆలయ చరిత్ర & సంప్రదాయాలు' : 'చరిత్ర & సందర్శకుల సమాచారం') : (isTemple ? 'More Details & Heritage' : 'History & Visitor Highlights')}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Drawer 1: History & Overview */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15,23,42,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          <button
            onClick={() => toggleDrawer('legend')}
            style={{
              width: '100%',
              padding: '14px 18px',
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: 800,
              color: '#0F172A'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} color="#0F5132" />
              <span>{lang === 'te' ? (isTemple ? 'స్థల పురాణం & పవిత్ర విశేషాలు' : 'చరిత్ర & విశేషాలు') : (isTemple ? 'Sthala Puranam & Sacred Legend' : 'History & Overview')}</span>
            </span>
            {openDrawer === 'legend' ? <ChevronUp size={16} color="#0F5132" /> : <ChevronDown size={16} color="#94A3B8" />}
          </button>
          {openDrawer === 'legend' && (
            <div style={{ padding: '0 18px 18px', fontSize: '13px', color: '#475569', lineHeight: 1.6, borderTop: '1px solid #F1F5F9' }}>
              <p style={{ marginTop: '12px' }}>
                {lang === 'te' 
                  ? (place.id === 'govindaraja'
                      ? 'స్థల పురాణం ప్రకారం, శ్రీవారి కల్యాణం కోసం కుబేరుడు ఇచ్చిన రుణాన్ని లెక్కించడానికి, నిర్వహించడానికి వేంకటేశ్వర స్వామి అన్నగారైన శ్రీ గోవిందరాజ స్వామి ఇక్కడ వెలిశారు. క్రీ.శ. 1130లో వైష్ణవాచార్యులు శ్రీ రామానుజాచార్యుల వారు చిదంబరం నుండి స్వామివారి మూలవిరాట్టును తెచ్చి ఈ పవిత్ర ఆలయంలో ప్రతిష్ఠించి, మందిరాన్ని స్థాపించారు. సంపద, ఐశ్వర్యం, రుణ విముక్తి కోసం భక్తులు స్వామివారిని దర్శించుకుంటారు.'
                      : (place.history || (isTemple ? 'ఈ పవిత్ర ఆలయానికి ఘనమైన చరిత్ర మరియు ఆధ్యాత్మిక ప్రాశస్త్యం ఉన్నాయి.' : 'ఈ ప్రదేశానికి తిరుపతి ప్రాంతంలో ప్రత్యేక గుర్తింపు ఉంది.')))
                  : (place.history || (isTemple ? 'This sacred shrine holds deep importance in regional traditions, passing down timeless lore of divine grace and protection.' : (place.whyVisit || place.description || 'A key attraction in the Tirupati region.')))}
              </p>
            </div>
          )}
        </div>

        {/* Drawer 2: Events / Season */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15,23,42,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          <button
            onClick={() => toggleDrawer('festivals')}
            style={{
              width: '100%',
              padding: '14px 18px',
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: 800,
              color: '#0F172A'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={16} color="#D97706" />
              <span>{lang === 'te' ? (isTemple ? 'ఉత్సవాలు & వార్షిక వేడుకలు' : 'ప్రత్యేక సందర్భాలు & అనువైన కాలం') : (isTemple ? 'Festivals & Annual Celebrations' : 'Special Events & Best Season')}</span>
            </span>
            {openDrawer === 'festivals' ? <ChevronUp size={16} color="#0F5132" /> : <ChevronDown size={16} color="#94A3B8" />}
          </button>
          {openDrawer === 'festivals' && (
            <div style={{ padding: '0 18px 18px', fontSize: '13px', color: '#475569', lineHeight: 1.6, borderTop: '1px solid #F1F5F9' }}>
              <p style={{ marginTop: '12px' }}>
                {lang === 'te' 
                  ? (isTemple
                      ? 'వార్షిక బ్రహ్మోత్సవాలు, నవరాత్రి ఉత్సవాలు మరియు ప్రతినెలా పౌర్ణమి గరుడసేవ ఊరేగింపులు ఆలయ అర్చకులు మరియు భక్తుల సమక్షంలో అత్యంత వైభవంగా జరుగుతాయి.'
                      : (place.bestTime ? `సందర్శించడానికి అనువైన సమయం: ${place.bestTime}. వారాంతాల్లో మరియు సెలవు దినాల్లో పర్యాటకుల రద్దీ ఎక్కువగా ఉంటుంది.` : 'వారాంతాల్లో మరియు సెలవు దినాల్లో పర్యాటకులు అధిక సంఖ్యలో సందర్శిస్తారు.'))
                  : (isTemple
                      ? 'Annual Brahmotsavams, Navaratri Utsavams, and special monthly Pournami processions are celebrated with deep fervor by the temple priests and visiting devotees.'
                      : (place.bestTime ? `Best visiting hours: ${place.bestTime}. High tourist rush observed during weekends and public holidays.` : 'Popular weekend destination with high visitor footfall during winter and holiday seasons.'))}
              </p>
            </div>
          )}
        </div>

        {/* Drawer 3: Layout & Guidelines */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15,23,42,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          <button
            onClick={() => toggleDrawer('architecture')}
            style={{
              width: '100%',
              padding: '14px 18px',
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: 800,
              color: '#0F172A'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Landmark size={16} color="#0F5132" />
              <span>{lang === 'te' ? (isTemple ? 'ఆలయ శిల్పకళ & నియమావళి' : 'లేఅవుట్ & సందర్శకుల నియమావళి') : (isTemple ? 'Architecture & Temple Guidelines' : 'Layout, Safari & Guidelines')}</span>
            </span>
            {openDrawer === 'architecture' ? <ChevronUp size={16} color="#0F5132" /> : <ChevronDown size={16} color="#94A3B8" />}
          </button>
          {openDrawer === 'architecture' && (
            <div style={{ padding: '0 18px 18px', fontSize: '13px', color: '#475569', lineHeight: 1.6, borderTop: '1px solid #F1F5F9' }}>
              <p style={{ marginTop: '12px' }}>
                {lang === 'te' 
                  ? (isTemple
                      ? 'దక్షిణ భారతీయ ద్రవిడ శైలిలో నిర్మించబడిన ఈ ఆలయం అద్భుతమైన రాతి స్తంభాలు, 7 అంతస్తుల రాజగోపురం మరియు ఆగమ శాస్త్రాల ప్రకారం రూపొందించిన గర్భగుడితో అలరారుతోంది.'
                      : (place.id === 'sv-zoo-park'
                          ? '1987లో స్థాపించబడిన ఈ జూ పార్క్ పౌరాణిక ఇతివృత్తంతో రూపొందించబడింది. జంతువులను సహజసిద్ధమైన భారీ ఆవరణలలో సంరక్షిస్తున్నారు. ప్లాస్టిక్ నిషేధం అమలులో ఉంది.'
                          : (place.practicalInfo?.dressCode ? `నియమావళి: ${place.practicalInfo.dressCode}. పరిసరాలను పరిశుభ్రంగా ఉంచండి.` : 'సందర్శకులు పరిసరాల నియమాలను పాటించాలి.')))
                  : (isTemple
                      ? 'Built in classical South Indian Dravidian temple architecture style featuring intricately carved stone pillars, Raja Gopuram tower, and main deity shrine designed according to ancient Agama Sastras.'
                      : (place.id === 'sv-zoo-park'
                          ? 'Spanning over 1,200 hectares, this zoo is designed on mythological themes with large open moated enclosures mimicking natural habitats rather than traditional cages. Plastic-free zone.'
                          : (place.practicalInfo?.dressCode ? `Guidelines: ${place.practicalInfo.dressCode}. Keep the premises clean.` : 'Visitors are requested to follow on-site park guidelines and preserve nature.')))}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 11. OFFLINE PRECINCT VECTOR MAP & WAYFINDING
  const offlineMapNode = (
    <OfflineTempleMap placeId={place.id} place={place} lang={lang} isTemple={isTemple} coordinates={place.coordinates} />
  );

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas, #FAF8F5)', color: '#0F172A', paddingBottom: 'calc(36px + env(safe-area-inset-bottom, 20px))', width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
      <style>{`
        .place-hero-box {
          position: relative;
          width: 100%;
          overflow: hidden;
          height: clamp(280px, 38vh, 340px);
        }
        .place-mobile-container {
          width: 100%;
          max-width: 640px;
          margin: 0 auto;
          padding: 12px 12px calc(36px + env(safe-area-inset-bottom, 20px)) 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-sizing: border-box;
          overflow-x: hidden;
        }
        .place-desktop-container {
          display: none;
        }
        @media (min-width: 900px) {
          .place-hero-box {
            max-width: 1600px;
            width: calc(100% - 48px);
            margin: 20px auto 28px auto;
            border-radius: 28px;
            height: 440px;
            box-shadow: 0 20px 48px -10px rgba(15, 23, 42, 0.18);
          }
          .place-mobile-container {
            display: none !important;
          }
          .place-desktop-container {
            max-width: 1600px;
            width: calc(100% - 48px);
            margin: 0 auto;
            padding: 0;
            display: grid !important;
            grid-template-columns: minmax(0, 1.45fr) minmax(420px, 1fr);
            gap: 32px;
            align-items: start;
          }
          .place-desktop-main {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .place-desktop-sidebar {
            position: sticky;
            top: 24px;
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
        }
      `}</style>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            style={{
              position: 'fixed',
              bottom: '80px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 700,
              zIndex: 9999,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Check size={16} color="#4ADE80" />
            <span>Link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════
          1. HERO SECTION (Edge-to-Edge mobile / Rounded on desktop)
          ═══════════════════════════════════════════════════ */}
      <div className="place-hero-box">
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${place.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#0F172A'
        }} />
        
        {/* Rich dark gradient scrim for 100% text readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 35%, rgba(15,23,42,0.7) 65%, rgba(15,23,42,0.95) 100%)'
        }} />

        {/* Top Floating Action Bar (High contrast white glass pills) */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: 0,
          right: 0,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}>
          <Link
            href="/explore"
            style={{
              width: '48px',
              height: '48px',
              minWidth: '48px',
              minHeight: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0F172A',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)'
            }}
          >
            <ArrowLeft size={22} color="#0F172A" />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleShare}
              style={{
                width: '48px',
                height: '48px',
                minWidth: '48px',
                minHeight: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0F172A',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)'
              }}
            >
              <Share2 size={20} color="#0F172A" />
            </button>

            <button
              onClick={() => togglePlace(place.id)}
              style={{
                width: '48px',
                height: '48px',
                minWidth: '48px',
                minHeight: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isSaved ? '#E11D48' : '#0F172A',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.18)'
              }}
            >
              <Heart size={20} fill={isSaved ? '#E11D48' : 'none'} color={isSaved ? '#E11D48' : '#0F172A'} />
            </button>
          </div>
        </div>

        {/* Hero Title and Badges */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          zIndex: 5,
          maxWidth: 'calc(100% - 32px)',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#0F172A',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              flexShrink: 0
            }}>
              <Star size={12} fill="#CA8A04" color="#CA8A04" />
              <span>{place.rating || 4.8}</span>
            </span>

            {festivalCrowd.hasImpact && (
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                backgroundColor: festivalCrowd.isFestivalActive 
                  ? (festivalCrowd.isDirectCenter ? 'rgba(220, 38, 38, 0.75)' : 'rgba(217, 119, 6, 0.75)')
                  : 'rgba(37, 99, 235, 0.75)',
                color: '#FFFFFF',
                padding: '3px 8px',
                borderRadius: '6px',
                border: `1px solid ${festivalCrowd.isFestivalActive ? (festivalCrowd.isDirectCenter ? '#FCA5A5' : '#FDE047') : '#93C5FD'}`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(6px)',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {lang === 'te' ? festivalCrowd.badgeTextTe : festivalCrowd.badgeTextEn}
              </span>
            )}

            {place.isTemporarilyClosed ? (
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                backgroundColor: 'rgba(217, 119, 6, 0.35)',
                color: '#FDE047',
                padding: '3px 9px',
                borderRadius: '6px',
                border: '1px solid rgba(253, 224, 71, 0.6)',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertTriangle size={12} color="#FDE047" />
                <span>{lang === 'te' ? 'పునర్నిర్మాణంలో ఉంది (మూసివేయబడింది)' : 'Under Reconstruction (Closed)'}</span>
              </span>
            ) : (
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                backgroundColor: isOpenNow ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                color: isOpenNow ? '#86EFAC' : '#FCA5A5',
                padding: '3px 9px',
                borderRadius: '6px',
                border: `1px solid ${isOpenNow ? 'rgba(134, 239, 172, 0.4)' : 'rgba(252, 165, 165, 0.4)'}`,
                whiteSpace: 'nowrap',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                ● {isOpenNow ? 'Open Now' : 'Closed Now'}
              </span>
            )}
          </div>

          <h1 style={{
            fontSize: 'clamp(20px, 5.2vw, 28px)',
            fontWeight: 900,
            color: '#FFFFFF',
            margin: '0 0 4px',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 0.8)',
            wordBreak: 'break-word',
            maxWidth: '100%'
          }}>
            {place.name}
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '12.5px',
            color: '#F1F5F9',
            fontWeight: 600,
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
            flexWrap: 'wrap',
            minWidth: 0,
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <MapPin size={14} color="#CBD5E1" style={{ flexShrink: 0 }} />
            <span style={{ minWidth: 0, wordBreak: 'break-word' }}>{place.location} • ~{formattedDriveTime} {userLocation ? (lang === 'te' ? 'మీ నుండి' : 'from you') : (lang === 'te' ? 'తిరుపతి నుండి' : 'from Tirupati')} ({formatDistance(drivingDistance, lang)})</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          MOBILE FLOW (< 900px): Exact 1 -> 9 Pilgrim Order
          ═══════════════════════════════════════════════════ */}
      <div className="place-mobile-container">
        {closureAlertNode}
        {topMetricsNode}
        {placeSignificanceNode}
        {quickFactsNode}
        {festivalAlertNode}
        {ctaButtonsNode}
        {offlineMapNode}
        {essentialFacilitiesNode}
        {nearbyTemplesNode}
        {heritageAccordionsNode}
      </div>

      {/* ═══════════════════════════════════════════════════
          DESKTOP GRID (>= 900px): 2-Column Responsive Layout
          ═══════════════════════════════════════════════════ */}
      <div className="place-desktop-container">
        {/* Left Column: Sacred Heritage & Visuals */}
        <div className="place-desktop-main">
          {closureAlertNode}
          {offlineMapNode}
          {heritageAccordionsNode}
          {nearbyTemplesNode}
        </div>

        {/* Right Column: Sticky Quick Action & Briefing Sidebar */}
        <div className="place-desktop-sidebar">
          {topMetricsNode}
          {placeSignificanceNode}
          {quickFactsNode}
          {festivalAlertNode}
          {ctaButtonsNode}
          {essentialFacilitiesNode}
        </div>
      </div>

    </main>
  );
}
