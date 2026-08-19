'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Heart, Share2, Star, MapPin, Clock, Shirt, 
  Camera, Navigation, Sparkles, CheckCircle2, 
  ChevronDown, ChevronUp, Droplets, Utensils, Lock,
  Bus, Car, Shield, Check, Zap, BookOpen, Flame, Landmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLACES, Place, getPlaceGuideData } from '@/data/places';
import { useTrip } from '@/components/TripContext';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';
import { calculateDrivingDistance, isCoordinateOnTirumalaHill, isWithinTirupatiRegion, TIRUPATI_CENTER } from '@/utils/location';
import { findNearestPlaceCandidates } from '@/lib/location';
import { useLanguage } from '@/lib/useLanguage';
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

  // Distance from user (if local within 80km) or from Tirupati Center
  const isLocalUser = userLocation && isWithinTirupatiRegion(userLocation.lat, userLocation.lng);
  const effectiveLocation = isLocalUser ? userLocation! : TIRUPATI_CENTER;

  const drivingDistance = useMemo(() => {
    if (!place.coordinates) return place.distanceKms || 5;
    const isTirumala = place.category === 'Tirumala Spot' || isCoordinateOnTirumalaHill(place.coordinates.lat, place.coordinates.lng);
    return calculateDrivingDistance(effectiveLocation.lat, effectiveLocation.lng, place.coordinates.lat, place.coordinates.lng, isTirumala);
  }, [place, effectiveLocation]);

  const driveTimeMins = Math.max(3, Math.round(drivingDistance * 1.8));

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
          fontSize: '18px',
          flexShrink: 0
        }}>
          🚧
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#92400E', margin: 0 }}>
              {lang === 'te' ? 'తీర్థయాత్రికుల సమాచారం: పునర్నిర్మాణం & ఆధునీకరణ' : 'Pilgrim Advisory: Under Reconstruction & Modernization'}
            </h3>
            <span style={{
              fontSize: '10.5px',
              fontWeight: 800,
              color: '#92400E',
              backgroundColor: '#FDE68A',
              padding: '2px 8px',
              borderRadius: '12px'
            }}>
              {lang === 'te' ? 'తాత్కాలికంగా మూసివేయబడింది' : 'Temporarily Closed'}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.5, margin: '0 0 6px' }}>
            {lang === 'te' 
              ? (place.closureNotice?.te || 'ఈ ప్రదేశం ప్రస్తుతం పునర్నిర్మాణం పనుల నిమిత్తం తాత్కాలికంగా మూసివేయబడింది.')
              : (place.closureNotice?.en || 'TTD is transforming Srivari Museum into a ₹125+ Cr world-class digital immersive 3D heritage center in partnership with TCS. General visitor entry is temporarily closed during active reconstruction.')}
          </p>
          <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#B45309' }}>
            ℹ️ {lang === 'te' ? 'టీటీడీ పనులు పూర్తయిన తర్వాత పునఃప్రారంభ తేదీ ప్రకటించబడుతుంది.' : 'TTD will announce the grand reopening schedule once digital modernization is complete.'}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  // 2. QUICK FACTS
  const quickFactsNode = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
      {/* Timings */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.06)', borderRadius: '16px', padding: '12px 14px', boxShadow: '0 4px 12px rgba(15,23,42,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Clock size={15} color="#0F5132" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>{lang === 'te' ? 'దర్శన సమయాలు' : 'Timings'}</span>
        </div>
        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.35 }}>
          {timingsStr.includes('(') ? (
            <div>
              <span>{timingsStr.split('(')[0].trim()}</span>
              <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B', marginTop: '2px' }}>
                ({timingsStr.split('(')[1]}
              </div>
            </div>
          ) : (
            timingsStr
          )}
        </div>
      </div>

      {/* Dress Code */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.06)', borderRadius: '16px', padding: '12px 14px', boxShadow: '0 4px 12px rgba(15,23,42,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Shirt size={15} color="#0F5132" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>{lang === 'te' ? 'దుస్తుల నియమావళి' : 'Dress Code'}</span>
        </div>
        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
          {lang === 'te' 
            ? 'సాంప్రదాయ దుస్తులు' 
            : (place.practicalInfo?.dressCode?.includes('Strict') ? 'Traditional Mandatory' : 'Traditional / Modest')}
        </div>
      </div>

      {/* Entry Fee */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.06)', borderRadius: '16px', padding: '12px 14px', boxShadow: '0 4px 12px rgba(15,23,42,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Sparkles size={15} color="#0F5132" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>{lang === 'te' ? 'ప్రవేశ రుసుము' : 'Entry Fee'}</span>
        </div>
        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
          {place.entryFeeNum === 0 || !place.entryFeeNum 
            ? (lang === 'te' ? 'ఉచిత దర్శనం' : 'Free Darshan') 
            : (lang === 'te' ? `₹${place.entryFeeNum} ఒక్కొక్కరికి` : `₹${place.entryFeeNum} per person`)}
        </div>
      </div>

      {/* Parking */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.06)', borderRadius: '16px', padding: '12px 14px', boxShadow: '0 4px 12px rgba(15,23,42,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Car size={15} color="#0F5132" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>{lang === 'te' ? 'పార్కింగ్' : 'Parking'}</span>
        </div>
        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
          {lang === 'te' 
            ? 'పార్కింగ్ అందుబాటులో ఉంది' 
            : (() => {
                const rawParking = toSafeText(place.facilities?.parking, toSafeText(place.practicalInfo?.parking, 'Available Nearby'));
                if (rawParking.toLowerCase().includes('dedicated')) return 'Dedicated Free Parking';
                if (rawParking.toLowerCase().includes('spacious') || rawParking.toLowerCase().includes('ample') || rawParking.toLowerCase().includes('large')) return 'Ample Parking';
                if (rawParking.toLowerCase().includes('street')) return 'Street Parking';
                if (rawParking.toLowerCase().includes('limited')) return 'Limited Parking';
                return rawParking.split(',')[0].trim() || 'Available Nearby';
              })()}
        </div>
      </div>

      {/* Accessibility */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.06)', borderRadius: '16px', padding: '12px 14px', boxShadow: '0 4px 12px rgba(15,23,42,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <CheckCircle2 size={15} color="#0F5132" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>{lang === 'te' ? 'దివ్యాంగుల సౌలభ్యం' : 'Accessibility'}</span>
        </div>
        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
          {lang === 'te'
            ? (place.recommendationContext?.wheelchairAccessible ? 'వీల్ చైర్ సౌకర్యం' : 'ర్యాంప్ / సులభ ప్రవేశం')
            : (place.recommendationContext?.wheelchairAccessible ? 'Wheelchair Friendly' : 'Ramp / Ground Access')}
        </div>
      </div>

      {/* Photography / Mobile */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(15, 23, 42, 0.06)', borderRadius: '16px', padding: '12px 14px', boxShadow: '0 4px 12px rgba(15,23,42,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Camera size={15} color="#0F5132" />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>{lang === 'te' ? 'ఫోన్లు & కెమెరా' : 'Phones & Camera'}</span>
        </div>
        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
          {lang === 'te'
            ? (place.id === 'venkateswara' ? 'ఖచ్చితంగా నిషేధం' : 'గర్భగుడి వెలుపల అనుమతి')
            : (place.id === 'venkateswara' ? 'Strictly Prohibited' : 'Allowed Outside Sanctum')}
        </div>
      </div>
    </div>
  );

  // 3. SAARTHI SUGGESTS
  const saarthiSuggestsNode = (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1.5px solid rgba(200, 155, 60, 0.35)',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFDF7 100%)',
      borderRadius: '20px',
      padding: '16px 18px',
      boxShadow: '0 8px 24px -4px rgba(200, 155, 60, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: '#FEF9C3', border: '1px solid #FDE047', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={14} color="#CA8A04" />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 800, color: '#854D0E', letterSpacing: '0.2px' }}>
          {lang === 'te' ? 'సారథి సూచన' : 'Saarthi Suggests'}
        </span>
      </div>

      <p style={{ fontSize: '13px', color: '#1E293B', fontWeight: 700, lineHeight: 1.45, margin: '0 0 10px' }}>
        {lang === 'te' 
          ? (place.id === 'govindaraja'
              ? 'ఉదయం 7:30 లోపు లేదా సాయంత్రం 5:30 (ఊంజల్ సేవ / కల్యాణోత్సవం) వేళల్లో దర్శనం అత్యంత శ్రేయస్కరం. తక్కువ నిరీక్షణ సమయం (15–25 నిమిషాలు).'
              : (place.id === 'sv-zoo-park'
                  ? 'ఉదయం 9:00 - 11:30 మధ్య జంతువులు చురుగ్గా ఉంటాయి. సఫారీ రైడ్ కోసం ముందుగా టికెట్లు తీసుకోండి.'
                  : (isTemple ? 'ఉదయం వేళల్లో దర్శనం ప్రశాంతంగా ఉంటుంది. తక్కువ క్యూ సమయం (15–25 నిమిషాలు).' : 'ఉదయం లేదా సాయంత్రం వేళల్లో సందర్శించడం ఆహ్లాదకరంగా ఉంటుంది.')))
          : (place.id === 'sv-zoo-park'
              ? 'Visit between 9:00 AM - 11:30 AM when animals are most active in open enclosures. Battery vehicles and safari available.'
              : saarthiTip)}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px', color: '#64748B', borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Clock size={13} color="#64748B" />
          {lang === 'te' ? 'సమయం:' : 'Visit:'} <strong>{lang === 'te' ? (place.durationMins ? `${place.durationMins} నిమి.` : '45 నిమిషాలు') : (place.durationMins ? `${place.durationMins} mins` : (guide.duration || '45 mins'))}</strong>
        </span>
        <span>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Zap size={13} color="#CA8A04" />
          {lang === 'te' ? 'మంచి సమయం:' : 'Best:'} <strong>{lang === 'te' ? 'ఉదయం వేళలు' : (guide.bestTime?.split('(')[0] || 'Morning')}</strong>
        </span>
      </div>
    </div>
  );

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
          borderRadius: '16px',
          padding: '16px 20px',
          fontSize: '15px',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          cursor: 'pointer',
          boxShadow: '0 8px 24px -4px rgba(15, 81, 50, 0.4)',
          transition: 'transform 0.15s ease',
          letterSpacing: '-0.01em'
        }}
      >
        <Navigation size={18} color="#FFFFFF" fill="#FFFFFF" />
        <span style={{ color: '#FFFFFF' }}>
          {lang === 'te' 
            ? (isTemple ? `దర్శన మార్గం ప్రారంభించండి (${driveTimeMins} ని.)` : `మార్గం ప్రారంభించండి (${driveTimeMins} ని.)`) 
            : `Start Navigation (${driveTimeMins} mins)`}
        </span>
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button
          onClick={() => togglePlace(place.id)}
          style={{
            backgroundColor: isSaved ? '#FFF1F2' : '#FFFFFF',
            border: isSaved ? '1px solid #FECDD3' : '1px solid rgba(15, 23, 42, 0.08)',
            borderRadius: '14px',
            padding: '11px',
            fontSize: '12.5px',
            fontWeight: 700,
            color: isSaved ? '#E11D48' : '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <Heart size={16} fill={isSaved ? '#E11D48' : 'none'} />
          <span>{isSaved ? (lang === 'te' ? 'సేవ్ చేయబడింది' : 'Saved') : (lang === 'te' ? (isTemple ? 'ఆలయాన్ని సేవ్ చేయండి' : 'ప్రదేశాన్ని సేవ్ చేయండి') : (isTemple ? 'Save Temple' : 'Save Place'))}</span>
        </button>

        <button
          onClick={handleShare}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            borderRadius: '14px',
            padding: '11px',
            fontSize: '12.5px',
            fontWeight: 700,
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <Share2 size={16} color="#0F172A" />
          <span>{lang === 'te' ? 'షేర్ చేయండి' : 'Share Place'}</span>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {evaluatedFacilities.map((fac) => {
          const FacIcon = fac.icon;
          return (
            <div
              key={fac.id}
              style={{
                backgroundColor: fac.available ? '#F8FAFC' : '#FAFAFA',
                border: fac.available ? '1px solid rgba(15,23,42,0.04)' : '1px dashed #CBD5E1',
                borderRadius: '12px',
                padding: '8px 6px',
                textAlign: 'center',
                opacity: fac.available ? 1 : 0.85
              }}
            >
              <FacIcon
                size={15}
                color={fac.available ? '#0F5132' : '#94A3B8'}
                style={{ margin: '0 auto 3px' }}
              />
              <span style={{
                fontSize: '10.5px',
                fontWeight: 700,
                color: fac.available ? '#0F172A' : '#64748B',
                display: 'block',
                textDecoration: fac.available ? 'none' : 'none'
              }}>
                {fac.title}
              </span>
              <span style={{
                fontSize: '9px',
                fontWeight: 600,
                color: fac.available ? '#64748B' : '#DC2626'
              }}>
                {fac.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );



  // 7. ABOUT THIS PLACE / TEMPLE
  const aboutTempleNode = (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid rgba(15, 23, 42, 0.06)',
      borderRadius: '20px',
      padding: '18px 20px',
      boxShadow: '0 4px 14px rgba(15,23,42,0.03)'
    }}>
      <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
        {lang === 'te' ? (isTemple ? 'ఆలయ విశేషాలు' : 'ప్రదేశ విశేషాలు') : (isTemple ? 'About This Temple' : (isZooOrWildlife ? 'About This Zoological Park' : 'About This Place'))}
      </h2>
      <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.6, margin: '0 0 12px' }}>
        {lang === 'te' 
          ? (place.id === 'govindaraja'
              ? 'శ్రీ గోవిందరాజ స్వామి వారి ఆలయం తిరుపతి నడిబొడ్డున ఉన్న 12వ శతాబ్దపు ప్రసిద్ధ ద్రవిడ ఆలయం. ఇక్కడ శయన ముద్రలో ఉన్న మహావిష్ణువు కొలువై ఉన్నారు.'
              : (place.id === 'sv-zoo-park'
                  ? 'ఆసియాలోనే అతిపెద్ద జూ పార్కులలో ఒకటైన ఇది శేషాచలం కొండల పాదాల వద్ద 1,200 హెక్టార్ల విస్తీర్ణంలో విస్తరించి ఉంది.'
                  : (isTemple ? 'తిరుపతి ప్రాంతంలో ఎంతో ప్రాశస్త్యం కలిగిన పవిత్ర పుణ్యక్షేత్రం.' : 'తిరుపతి ప్రాంతంలో ప్రసిద్ధి చెందిన సందర్శనీయ ప్రదేశం.')))
          : (place.shortIntro || (place.description ? String(place.description).split('.')[0] + '.' : (isTemple ? 'A sacred shrine deeply revered in Tirupati.' : 'A popular destination in Tirupati.')))}
      </p>
      <button
        onClick={() => toggleDrawer('legend')}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          fontSize: '12.5px',
          fontWeight: 800,
          color: '#0F5132',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <span>
          {lang === 'te' 
            ? (isTemple ? 'స్థల పురాణం & పవిత్ర విశేషాలు చదవండి ↓' : 'చరిత్ర & సందర్శకుల వివరాలు చదవండి ↓') 
            : (isTemple ? 'Read Sacred Legend & Sthala Puranam ↓' : 'Read History & Highlights ↓')}
        </span>
      </button>
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
        gridTemplateColumns: 'repeat(2, 1fr)',
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
    <div>
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
              <span>{lang === 'te' ? (isTemple ? 'ఆలయ శిల్పకళ & నియమావళి' : 'లేఅవుట్ & సందర్శకుల నియమావళి') : (isTemple ? 'Architecture & Sanctum Guidelines' : 'Layout, Safari & Guidelines')}</span>
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
                      ? 'Built in classical South Indian Dravidian temple architecture style featuring intricately carved stone pillars, Raja Gopuram tower, and sanctum sanctorum designed according to ancient Agama Sastras.'
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
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas, #FAF8F5)', color: '#0F172A', paddingBottom: '90px' }}>
      <style>{`
        .place-hero-box {
          position: relative;
          width: 100%;
          overflow: hidden;
          height: clamp(280px, 38vh, 340px);
        }
        .place-mobile-container {
          max-width: 640px;
          margin: 0 auto;
          padding: 12px 14px 24px 14px;
          display: flex;
          flex-direction: column;
          gap: 14px;
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
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
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
            <ArrowLeft size={20} color="#0F172A" />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleShare}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
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
              <Share2 size={18} color="#0F172A" />
            </button>

            <button
              onClick={() => togglePlace(place.id)}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
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
              <Heart size={18} fill={isSaved ? '#E11D48' : 'none'} color={isSaved ? '#E11D48' : '#0F172A'} />
            </button>
          </div>
        </div>

        {/* Hero Title and Badges */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          zIndex: 5
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
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}>
              <Star size={12} fill="#CA8A04" color="#CA8A04" />
              <span>{place.rating || 4.8}</span>
            </span>

            {place.isTemporarilyClosed ? (
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                backgroundColor: 'rgba(217, 119, 6, 0.35)',
                color: '#FDE047',
                padding: '3px 9px',
                borderRadius: '6px',
                border: '1px solid rgba(253, 224, 71, 0.6)'
              }}>
                🚧 {lang === 'te' ? 'పునర్నిర్మాణంలో ఉంది (మూసివేయబడింది)' : 'Under Reconstruction (Closed)'}
              </span>
            ) : (
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                backgroundColor: isOpenNow ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                color: isOpenNow ? '#86EFAC' : '#FCA5A5',
                padding: '3px 9px',
                borderRadius: '6px',
                border: `1px solid ${isOpenNow ? 'rgba(134, 239, 172, 0.4)' : 'rgba(252, 165, 165, 0.4)'}`
              }}>
                ● {isOpenNow ? 'Open Now' : 'Closed Now'}
              </span>
            )}
          </div>

          <h1 style={{
            fontSize: 'clamp(21px, 5.5vw, 28px)',
            fontWeight: 900,
            color: '#FFFFFF',
            margin: '0 0 4px',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 0.8)',
            wordBreak: 'break-word'
          }}>
            {place.name}
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '13px',
            color: '#F1F5F9',
            fontWeight: 600,
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'
          }}>
            <MapPin size={14} color="#CBD5E1" />
            <span>{place.location} • ~{driveTimeMins} mins {isLocalUser ? 'from you' : 'from Tirupati'} ({drivingDistance.toFixed(1)} km)</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          MOBILE FLOW (< 900px): Exact 1 -> 9 Pilgrim Order
          ═══════════════════════════════════════════════════ */}
      <div className="place-mobile-container">
        {closureAlertNode}
        {quickFactsNode}
        {saarthiSuggestsNode}
        {ctaButtonsNode}
        {offlineMapNode}
        {essentialFacilitiesNode}
        {aboutTempleNode}
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
          {aboutTempleNode}
          {heritageAccordionsNode}
          {nearbyTemplesNode}
        </div>

        {/* Right Column: Sticky Quick Action & Briefing Sidebar */}
        <div className="place-desktop-sidebar">
          {quickFactsNode}
          {saarthiSuggestsNode}
          {ctaButtonsNode}
          {essentialFacilitiesNode}
        </div>
      </div>

    </main>
  );
}
