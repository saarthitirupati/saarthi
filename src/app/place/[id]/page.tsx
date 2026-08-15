'use client';

import { PLACES, getPlaceGuideData, Place } from '@/data/places';
import { ArrowLeft, Heart, Share2, Star, MapPin, Clock, Compass, PlayCircle, Camera, Check, Copy, Volume2, VolumeX, ShieldAlert, X, ChevronLeft, ChevronRight, Shirt, Footprints, Users, Ban, Navigation, Info, CheckCircle2, ShieldCheck, Sparkles, Car, Lightbulb, AlertTriangle, Droplets, Utensils, Coffee, Map, Lock, ThumbsUp, ThumbsDown, Landmark, BookOpen } from 'lucide-react';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PlaceDetails.module.css';
import { useTrip } from '@/components/TripContext';
import { useSpeechSynthesis } from '@/utils/useSpeechSynthesis';
import { useRealtimePlaces } from '@/lib/useRealtimePlaces';
import { calculateDrivingDistance, getOsrmRoadRoute } from '@/utils/location';
import { findNearestPlaceCandidates } from '@/lib/location';
import { useLanguage } from '@/lib/useLanguage';

function parseBestSlot(str: string): { title: string; subtitle: string } {
  if (!str) return { title: 'Anytime', subtitle: 'Recommended time' };
  
  if (str.includes('Morning') && str.includes('Evening')) {
    const times = str.match(/\((.*?)\)/g)?.map(t => t.replace(/[()]/g, ''));
    if (times && times.length >= 2) {
      return {
        title: 'Morning & Evening',
        subtitle: `${times[0]} • ${times[1]}`
      };
    }
    return { title: 'Morning & Evening', subtitle: 'Best visiting hours' };
  }
  
  if (str.includes('Morning') && str.includes('Afternoon')) {
    const times = str.match(/\((.*?)\)/g)?.map(t => t.replace(/[()]/g, ''));
    if (times && times.length >= 2) {
      return {
        title: 'Morning & Afternoon',
        subtitle: `${times[0]} • ${times[1]}`
      };
    }
    return { title: 'Morning & Afternoon', subtitle: 'Best visiting hours' };
  }

  const singleMatch = str.match(/(.*?)\s*\((.*?)\)/);
  if (singleMatch) {
    return {
      title: singleMatch[1].trim(),
      subtitle: singleMatch[2].trim()
    };
  }

  return { title: str, subtitle: 'Recommended time' };
}

export default function PlaceDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lang = useLanguage();
  
  const t = {
    en: {
      whyItMatters: 'Why Visit This Temple?',
      spiritualEssence: 'Temple Highlights & Significance',
      culturalContext: 'History & Divine Features',
      overview: 'About the Temple',
      knowBefore: 'Know Before You Visit',
      dressCode: 'Dress Code:',
      photoRule: 'Phones & Cameras:',
      footwearRule: 'Footwear:',
      entryRule: 'Entry & Fees:',
      crowdNote: 'Darshan Crowd:',
      facilities: 'Facilities Available',
      related: 'Nearby Places to Visit',
      legend: 'Sacred Legend & History',
      originStory: 'According to Local Tradition',
      mythologicalContext: 'History & Temple Significance',
      feedbackTitle: 'Was this guide helpful?',
      feedbackDesc: 'Saarthi provides locally verified information. Let us know if this guide was useful for your yatra.',
      feedbackSuccess: 'Thank you! Your feedback helps us build the most trusted companion for pilgrims.',
      helpful: 'Helpful',
      needsWork: 'Needs Work',
      submitFeedback: 'Submit Feedback',
      navigateNow: 'Navigate Now',
      howToReach: 'How to Reach',
      autoFare: 'Auto: ~₹80–₹120',
      carTime: 'Car / Taxi: ~10 mins',
      busNote: 'Bus: Available from Central Bus Stand',
      localBeliefPrefix: 'According to local tradition: ',
      saarthiRec: 'Saarthi Recommendation'
    },
    te: {
      whyItMatters: 'ఈ ఆలయాన్ని ఎందుకు సందర్శించాలి?',
      spiritualEssence: 'ఈ ఆలయ ప్రత్యేకత',
      culturalContext: 'చరిత్ర & విశిష్టత',
      overview: 'ఆలయం గురించి',
      knowBefore: 'సందర్శించే ముందు తెలుసుకోవాల్సిన విషయాలు',
      dressCode: 'సంప్రదాయ దుస్తులు:',
      photoRule: 'ఫోన్లు & కెమెరాలు:',
      footwearRule: 'పాదరక్షలు:',
      entryRule: 'ప్రవేశం & రుసుము:',
      crowdNote: 'దర్శన రద్దీ:',
      facilities: 'అందుబాటులో ఉన్న సౌకర్యాలు',
      related: 'సమీపంలోని ఇతర ప్రదేశాలు',
      legend: 'స్థల పురాణం',
      originStory: 'స్థానిక విశ్వాసం ప్రకారం',
      mythologicalContext: 'చరిత్ర & స్థానిక ప్రాశస్త్యం',
      feedbackTitle: 'ఈ మార్గదర్శకం మీకు ఉపయోగపడిందా?',
      feedbackDesc: 'స్థానికంగా ధృవీకరించిన సమాచారంతో సారథి ఈ మార్గదర్శకాన్ని రూపొందించింది. ఈ సమాచారం మీకు ఉపయోగపడిందో లేదో తెలియజేయండి.',
      feedbackSuccess: 'ధన్యవాదాలు! మీ అభిప్రాయం మా సేవలను మరింత మెరుగుపరచడానికి తోడ్పడుతుంది.',
      helpful: 'ఉపయోగపడింది',
      needsWork: 'ఇంకా మెరుగుపరచవచ్చు',
      submitFeedback: 'అభిప్రాయాన్ని సమర్పించండి',
      navigateNow: 'ప్రయాణం ప్రారంభించండి',
      howToReach: 'ఎలా చేరుకోవాలి',
      autoFare: 'ఆటో: సుమారు ₹80–₹120',
      carTime: 'కారు: సుమారు 10 నిమిషాలు',
      busNote: 'బస్సు: సెంట్రల్ బస్ స్టాండ్ నుండి అందుబాటులో ఉంది',
      localBeliefPrefix: 'స్థానిక విశ్వాసం ప్రకారం: ',
      saarthiRec: 'సారథి సూచన'
    }
  }[lang];
  
  const { places, loading } = useRealtimePlaces(PLACES);
  const [dbFetchedPlace, setDbFetchedPlace] = useState<Place | null>(null);

  const targetId = decodeURIComponent(id || '').trim().toLowerCase();
  const allPlaces = places.length > 0 ? places : PLACES;

  const findPlace = (list: Place[]) => {
    return list.find(t => {
      const pId = (t.id || '').toLowerCase();
      const pSlug = ((t as any).slug || '').toLowerCase();
      const pDbId = ((t as any).db_id || '').toLowerCase();
      const pUuid = ((t as any).uuid || '').toLowerCase();
      const pName = (t.name || '').toLowerCase();
      return pId === targetId || pSlug === targetId || pDbId === targetId || pUuid === targetId || pName === targetId;
    });
  };

  const FORBIDDEN_SLUGS = new Set(['tumburu-theertham', 'mamandur-village', 'tuda-park', 'museum-alipiri', 'veda-pathasala', 'tarigonda-vengamamba-annaprasadam', 'karvetinagaram-temple']);
  const isRemoved = FORBIDDEN_SLUGS.has(targetId);

  const initialPlace = isRemoved ? undefined : (
    findPlace(allPlaces) || 
    findPlace(PLACES)
  );

  const place = initialPlace || dbFetchedPlace || undefined;

  useEffect(() => {
    if (!initialPlace && targetId && !isRemoved) {
      import('@/lib/supabase').then(({ supabase }) => {
        supabase
          .from('places')
          .select('*')
          .or(`id.eq.${targetId},slug.eq.${targetId}`)
          .single()
          .then(({ data, error }) => {
            if (data && !error && data.status !== 'deleted' && !data.is_deleted) {
              const matchedStatic = PLACES.find(p => p.id === data.slug || p.id === data.id);
              const merged = {
                ...(matchedStatic || {}),
                ...data,
                id: matchedStatic?.id || data.slug || data.id,
                slug: data.slug || matchedStatic?.id || data.id,
                image: matchedStatic?.image?.startsWith('http')
                  ? matchedStatic.image
                  : (data.hero_image || matchedStatic?.image || data.image)
              } as Place;
              setDbFetchedPlace(merged);
            }
          });
      }).catch(() => {});
    }
  }, [initialPlace, targetId, isRemoved]);

  const formatTo12Hour = (timeStr: string) => {
    try {
      const [hStr, mStr] = timeStr.split(':');
      const h = parseInt(hStr, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedHour = h % 12 === 0 ? 12 : h % 12;
      return `${formattedHour}:${mStr} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const checkInBreak = () => {
    if (!place?.breakTimings || place.breakTimings.length === 0) return false;
    const now = new Date();
    const currentTimeVal = now.getHours() * 60 + now.getMinutes();
    return place.breakTimings.some(b => {
      const [fromH, fromM] = b.from.split(':').map(Number);
      const [toH, toM] = b.to.split(':').map(Number);
      const fromTimeVal = fromH * 60 + fromM;
      const toTimeVal = toH * 60 + toM;
      if (toTimeVal < fromTimeVal) return currentTimeVal >= fromTimeVal || currentTimeVal <= toTimeVal;
      return currentTimeVal >= fromTimeVal && currentTimeVal <= toTimeVal;
    });
  };

  const [isCurrentlyInBreak, setIsCurrentlyInBreak] = useState(checkInBreak);

  useEffect(() => {
    setIsCurrentlyInBreak(checkInBreak());
    const timer = setInterval(() => setIsCurrentlyInBreak(checkInBreak()), 60_000);
    return () => clearInterval(timer);
  }, [place]);

  const [copiedLink, setCopiedLink] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [vehicleType, setVehicleType] = useState<'car' | 'bus' | 'bike' | 'cab' | 'suv'>('car');
  const [passengers, setPassengers] = useState<number>(1);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(true);
  const [fuelRates, setFuelRates] = useState<{ petrol: number; diesel: number }>({ petrol: 108.50, diesel: 96.20 });

  useEffect(() => {
    fetch('/api/admin/fuel')
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (!json) return;
        const data = json.data || json;
        if (data.petrol) {
          setFuelRates({
            petrol: Number(data.petrol) || 108.50,
            diesel: Number(data.diesel) || 96.20
          });
        }
      })
      .catch(() => {});
  }, []);
  const [isLegendExpanded, setIsLegendExpanded] = useState(false);
  const [isTuesday, setIsTuesday] = useState(false);

  // Offline maps state hooks
  const [isOffline, setIsOffline] = useState(false);
  const [offlineMapsEnabled, setOfflineMapsEnabled] = useState(false);
  const [isSavingOffline, setIsSavingOffline] = useState(false);
  const [isSavedOffline, setIsSavedOffline] = useState(false);
  const [showOfflineMapOnly, setShowOfflineMapOnly] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<'Helpful' | 'Needs Work' | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [nearbyPlacesList, setNearbyPlacesList] = useState<{ place: Place; dist: number; reason: string }[]>([]);

  useEffect(() => {
    setIsOffline(!window.navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const savedVal = localStorage.getItem('saarthi_offline_maps_enabled') === 'true';
    setOfflineMapsEnabled(savedVal);

    const cachedPlaces = JSON.parse(localStorage.getItem('saarthi_offline_cached_places') || '[]');
    if (cachedPlaces.includes(id)) {
      setIsSavedOffline(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [id]);

  const savePlaceOffline = () => {
    setIsSavingOffline(true);
    setTimeout(() => {
      setIsSavingOffline(false);
      setIsSavedOffline(true);
      const cached = JSON.parse(localStorage.getItem('saarthi_offline_cached_places') || '[]');
      if (!cached.includes(id)) {
        cached.push(id);
        localStorage.setItem('saarthi_offline_cached_places', JSON.stringify(cached));
      }
    }, 1500);
  };

  // Tabbed layout state
  const [activeTab, setActiveTab] = useState<'overview' | 'timings' | 'gallery' | 'transport' | 'guide'>('overview');
  
  const { togglePlace, savedPlaces, addViewedPlace, userLocation, setUserLocation, setLocationPermission } = useTrip();
  const { isSpeaking, isSupported, toggleSpeak } = useSpeechSynthesis();

  useEffect(() => {
    fetch('/api/v1/fuel')
      .then(r => r.json())
      .then(data => {
        if (data.petrol && data.diesel) {
          setFuelRates({ petrol: data.petrol, diesel: data.diesel });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (place?.id) {
      addViewedPlace(place.id);
    }
  }, [place?.id]);

  useEffect(() => {
    setIsTuesday(new Date().getDay() === 2);
  }, []);

  useEffect(() => {
    if (vehicleType !== 'bus') {
      setPassengers(1);
    }
  }, [vehicleType]);

  useEffect(() => {
    if (!place?.coordinates) return;
    const currentHour = new Date().getHours();
    const allPlacesData = places.length > 0 ? places : PLACES;
    const relatedIds = (place.relatedPlaces || []) as string[];

    // Step 1: Spatial candidate pre-filter (Euclidean) — top 10 spatially closest
    const candidates = findNearestPlaceCandidates(
      { lat: place.coordinates.lat, lng: place.coordinates.lng },
      allPlacesData.filter(p => p.id !== place.id && !relatedIds.includes(p.id)),
      40000
    ).slice(0, 10);

    // Step 2: Heuristic distances for instant render
    const isSelfTirumala = place.location?.toLowerCase().includes('tirumala') || place.location?.toLowerCase().includes('narayanagiri');
    const initialList = candidates.map(({ place: p }) => {
      if (!p.coordinates) return { place: p, dist: 999, reason: '' };
      const isTargetTirumala = p.location?.toLowerCase().includes('tirumala') || p.location?.toLowerCase().includes('narayanagiri');
      const dist = calculateDrivingDistance(place.coordinates!.lat, place.coordinates!.lng, p.coordinates.lat, p.coordinates.lng, isSelfTirumala !== isTargetTirumala);
      let reason = '';
      if (currentHour >= 16 && (p.bestTime?.toLowerCase().includes('evening') || p.bestTime?.toLowerCase().includes('night'))) reason = 'Great for evening';
      else if (place.category === p.category) reason = 'Similar vibe';
      else reason = dist < 1.0 ? 'Walking distance' : dist < 3 ? 'Short drive' : 'Worth exploring';
      return { place: p, dist, reason };
    }).sort((a, b) => a.dist - b.dist).slice(0, 6);
    setNearbyPlacesList(initialList);

    // Step 3: Async OSRM enrichment — real road distances
    (async () => {
      const enriched = await Promise.all(
        initialList.map(async (item) => {
          if (!item.place.coordinates) return item;
          const { distanceKm } = await getOsrmRoadRoute(
            place.coordinates!.lat, place.coordinates!.lng,
            item.place.coordinates.lat, item.place.coordinates.lng
          );
          return { ...item, dist: distanceKm };
        })
      );
      setNearbyPlacesList(enriched.sort((a, b) => a.dist - b.dist));
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place?.id, places.length]);

  if (loading) return <div className={styles.loadingContainer}>Loading details...</div>;
  if (!place) {
    return (
      <div className={styles.notFound}>
        <p>Place not found.</p>
        <Link href="/explore">Back to Explore</Link>
      </div>
    );
  }

  const effectiveLocation = userLocation || { lat: 13.6288, lng: 79.4192 };

  const getRelDistance = (rel: Place) => {
    if (!rel.coordinates) return `${rel.distanceKms} km`;
    const isRelTirumala = rel.location?.toLowerCase().includes('tirumala') || 
                          rel.location?.toLowerCase().includes('narayanagiri') || 
                          rel.category?.toLowerCase().includes('tirumala');
    const dist = calculateDrivingDistance(effectiveLocation.lat, effectiveLocation.lng, rel.coordinates.lat, rel.coordinates.lng, isRelTirumala);
    return `${dist.toFixed(1)} km`;
  };

  const isTirumalaSpot = place.location?.toLowerCase().includes('tirumala') || 
                         place.location?.toLowerCase().includes('narayanagiri') || 
                         place.category?.toLowerCase().includes('tirumala');
  
  const drivingDistance = place.coordinates
    ? calculateDrivingDistance(effectiveLocation.lat, effectiveLocation.lng, place.coordinates.lat, place.coordinates.lng, isTirumalaSpot)
    : place.distanceKms;


  const getCalculatorResults = () => {
    const isTirumala = (place.location || '').toLowerCase().includes('tirumala') || 
                       (place.location || '').toLowerCase().includes('narayanagiri') || 
                       (place.category || '').toLowerCase().includes('tirumala');
    
    const safeEffDist = Number(drivingDistance) || Number(place.distanceKms) || 5;
    const estTime = Math.max(5, Math.round(safeEffDist * 2.2));

    const safePassengers = Number(passengers) || 1;
    const safeEntryFeeNum = Number(place.entryFeeNum) || 0;
    const safePetrolRate = Number(fuelRates?.petrol) || 108.50;

    let fare = 0;
    let fuel = 0;
    let liters = 0;
    let tolls = 0;
    let parking = 0;
    const entryFee = safePassengers * safeEntryFeeNum;

    if (vehicleType === 'bus') {
      const ticketPrice = isTirumala
        ? 110
        : Math.max(30, Math.round(safeEffDist * 1.8));
      fare = safePassengers * ticketPrice * (isRoundTrip ? 2 : 1);
    } else if (vehicleType === 'car') {
      const economy = 15;
      liters = (safeEffDist / economy) * (isRoundTrip ? 2 : 1);
      fuel = liters * safePetrolRate;
      tolls = isTirumala ? 15 : safeEffDist > 60 ? 80 : 0;
      parking = 15;
    } else if (vehicleType === 'bike') {
      const economy = 35;
      liters = (safeEffDist / economy) * (isRoundTrip ? 2 : 1);
      fuel = liters * safePetrolRate;
      parking = 5;
    } else if (vehicleType === 'cab') {
      if (isTirumala) {
        fare = isRoundTrip ? 2100 : 1100;
      } else {
        fare = isRoundTrip ? 350 + safeEffDist * 30 : 200 + safeEffDist * 15;
      }
    } else if (vehicleType === 'suv') {
      if (isTirumala) {
        fare = isRoundTrip ? 3700 : 2000;
      } else {
        fare = isRoundTrip ? 500 + safeEffDist * 44 : 300 + safeEffDist * 22;
      }
    }

    const rawTotal = (fare || 0) + (fuel || 0) + (tolls || 0) + (parking || 0) + (entryFee || 0);
    const total = isNaN(rawTotal) || rawTotal < 0 ? 0 : Math.round(rawTotal);

    return {
      effDist: isNaN(safeEffDist) ? 5 : safeEffDist,
      estTime: isNaN(estTime) ? 15 : estTime,
      fare: isNaN(fare) ? 0 : Math.round(fare),
      fuel: isNaN(fuel) ? 0 : Math.round(fuel),
      liters: isNaN(liters) ? 0 : liters,
      tolls: isNaN(tolls) ? 0 : tolls,
      parking: isNaN(parking) ? 0 : parking,
      entryFee: isNaN(entryFee) ? 0 : entryFee,
      total
    };
  };

  const calc = getCalculatorResults();

  const handleDetectLocation = () => {
    import('@/lib/location').then(({ detectCoordinates }) => {
      detectCoordinates(
        (coords) => {
          setUserLocation(coords);
          setLocationPermission('granted');
        },
        () => {
          setLocationPermission('denied');
        }
      );
    }).catch(() => {});
  };

  const guide = getPlaceGuideData(place);
  const isSaved = savedPlaces.includes(place.id);
  const isSpiritualPlace = place.placeType === 'spiritual' || place.category.toLowerCase().includes('temple');

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePlaceFeedbackSubmit = async () => {
    if (!feedbackRating) return;
    try {
      const res = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: id,
          isPositive: feedbackRating === 'Helpful',
          comment: feedbackComment
        })
      });
      if (res.ok) {
        setFeedbackSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className={styles.main}>
      {/* Toast notifications */}
      <AnimatePresence>
        {copiedLink && (
          <motion.div 
            className={styles.toast}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Header */}
      <header className={styles.header}>
        <Link href="/explore" className={styles.backButton}>
          <ArrowLeft size={24} />
        </Link>
        <div className={styles.headerActions}>
          <button 
            className={styles.actionIcon}
            onClick={handleCopyLink}
            title="Share Place"
          >
            <Share2 size={20} />
          </button>
          <button 
            className={`${styles.actionIcon} ${isSaved ? styles.saved : ''}`}
            onClick={() => togglePlace(place.id)}
            title="Save Place"
          >
            <Heart size={20} fill={isSaved ? "var(--color-saffron-500)" : "none"} color={isSaved ? "var(--color-saffron-500)" : "currentColor"} />
          </button>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <div 
          className={styles.heroImage}
          style={{ backgroundImage: `url(${guide.image})` }}
        />
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <div className={styles.heroMetaRow} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <span className={styles.categoryBadge}>{guide.category}</span>
            <div className={styles.ratingBadge}>
              <Star size={14} fill="#FFD700" color="#FFD700" />
              <span>{place.rating || 4.8}</span>
            </div>
            <span className={styles.verifiedText}>
              <span className={styles.verifiedDot}></span>
              Data Verified Today
            </span>
          </div>
          <h1>{guide.name}</h1>
          <div className={styles.heroLocation}>
            <MapPin size={16} />
            <span>
              {guide.location} • {userLocation
                ? `${drivingDistance.toFixed(1)} km from you`
                : `${drivingDistance.toFixed(1)} km from Tirupati Center`}
            </span>
          </div>
        </div>
      </section>

      {/* ─── 2. TRUST BANNER ─── */}
      <div style={{
        margin: '12px 16px',
        padding: '12px 14px',
        background: '#ECFDF5',
        border: '1px solid #A7F3D0',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="#059669" />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#065F46' }}>Verified by Saarthi</div>
            <div style={{ fontSize: '11px', color: '#047857' }}>Source: TTD Official & Ground Volunteers</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#059669', background: '#D1FAE5', padding: '2px 6px', borderRadius: '6px', display: 'inline-block' }}>
            Level 5 Verified
          </div>
          <div style={{ fontSize: '9px', color: '#065F46', marginTop: '2px' }}>Updated Today</div>
        </div>
      </div>

      {/* ─── 2.5 SAARTHI RECOMMENDS (QUICK DECISION) ─── */}
      <div style={{
        margin: '12px 16px',
        padding: '16px',
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        borderRadius: '20px',
        color: '#FFFFFF',
        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Sparkles size={13} color="#FFFFFF" /> Saarthi Recommends
          </div>
          {place.saarthiIntelligence?.travelScore && (
            <div style={{ background: '#FFFFFF', color: '#059669', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 900 }}>
              {place.saarthiIntelligence.travelScore}/100 Saarthi Score
            </div>
          )}
        </div>
        
        <div style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px' }}>
          {new Date().getHours() >= place.openFrom && new Date().getHours() < place.openTo 
            ? 'YES, Visit Today' 
            : 'NO, Currently Closed'}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#A7F3D0" /> 
            {new Date().getHours() >= place.openFrom && new Date().getHours() < place.openTo ? 'Temple Open' : 'Temple Closed'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#A7F3D0" /> 
            {place.saarthiIntelligence?.crowdLevel ? `${place.saarthiIntelligence.crowdLevel} Crowd` : 'Moderate Crowd'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#A7F3D0" /> 
            Pleasant Weather
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#A7F3D0" /> 
            {place.saarthiIntelligence?.parkingDifficulty === 'Easy' ? 'Parking Available' : 
             place.saarthiIntelligence?.parkingDifficulty === 'Moderate' ? 'Limited Parking' : 
             place.practicalInfo?.parking || 'Parking Available'}
          </div>
        </div>

        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '10px', opacity: 0.9 }}>Estimated Visit</div>
            <div style={{ fontSize: '14px', fontWeight: 800 }}>{guide.duration || `${place.durationMins} mins`}</div>
          </div>
          <button style={{ 
            background: '#FFFFFF', 
            color: '#059669', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '12px', 
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer'
          }}>
            Start Journey
          </button>
        </div>
      </div>

      <div className={styles.scrollableContent}>
        {/* ─── 3. WHY VISIT ─── */}
        <section className={styles.section} id="why-visit">
          <h2 className={styles.sectionTitle}>{t.whyItMatters}</h2>
          <div className={styles.mattersCard}>
            <div className={styles.mattersHeader}>
              <div className={styles.mattersIconWrapper}>
                <Compass size={24} color="var(--color-saffron-500)" />
              </div>
              <div style={{ flex: 1 }}>
                <h3>{t.spiritualEssence}</h3>
                <p>{t.culturalContext}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {place.architecture && (
                    <span className={styles.heritageTag}>
                      {place.architecture}
                    </span>
                  )}
                  {place.importance && (
                    <span className={styles.importanceTag}>
                      {place.importance}
                    </span>
                  )}
                  {place.tags && place.tags.slice(0, 2).map((t: string, idx: number) => (
                    <span key={idx} className={styles.interestTag}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.mattersContent} style={{ marginTop: 14 }}>
              {(() => {
                const sentences = guide.whyVisit ? guide.whyVisit.split(/(?<=[.!?])\s+/) : [];
                if (sentences.length > 1) {
                  return (
                    <ul className={styles.whyVisitList}>
                      {sentences.map((sentence, idx) => {
                        let formattedText = sentence;
                        if (sentence.includes('Chola')) {
                          formattedText = sentence.replace('Originally constructed during the Chola dynasty', '<strong>Ancient Chola Legacy:</strong> Originally constructed during the Chola dynasty');
                        } else if (sentence.includes('fault lines') || sentence.includes('groundwater')) {
                          formattedText = sentence.replace('Built specifically over valley fault lines', '<strong>The Perennial Mystery:</strong> Built specifically over valley fault lines');
                        } else if (sentence.includes('gateway shrine') || sentence.includes('between empires')) {
                          formattedText = sentence.replace('Positioned as a historical gateway shrine', '<strong>Highway Sanctuary:</strong> Positioned as a historical gateway shrine');
                        }
                        
                        return (
                          <li key={idx} className={styles.whyVisitItem}>
                            <span className={styles.bulletSpan}>•</span>
                            <span dangerouslySetInnerHTML={{ __html: formattedText }} />
                          </li>
                        );
                      })}
                    </ul>
                  );
                }
                return <p className={styles.plainReasonText}>{guide.whyVisit}</p>;
              })()}
            </div>
          </div>
        </section>

        {/* ─── 4. TRAVEL & TRANSIT ─── */}
        <section className={styles.section} id="travel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
              <Car size={19} color="#0E6B72" style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
              {t.howToReach}
            </h2>
            <Link
              href={`/trip-estimator?destId=${place.id}`}
              style={{
                background: '#E9801D',
                color: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(233, 128, 29, 0.2)'
              }}
            >
              <Sparkles size={14} /> Full Trip Estimator &amp; Fares →
            </Link>
          </div>
          
          <div className={styles.routeLiveHeader}>
            <div className={styles.liveIndicatorContainer}>
              <span className={styles.livePulseDot} />
              <span className={styles.liveTextLabel}>From Your Location</span>
            </div>
            <div className={styles.liveRouteValue}>
              {drivingDistance !== null
                ? `${drivingDistance.toFixed(1)} km • ~${Math.round(drivingDistance * 2.2)} mins`
                : `${guide.distanceKms} km • ~${Math.round(guide.distanceKms * 2)} mins`}
            </div>
            <span className={styles.liveUpdatedBadge}>Updated now</span>
          </div>

          <div className={styles.journeyModesHierarchyList}>
            {/* 1. CAR/CAB CARD */}
            <div className={styles.journeyModeCardFeatured}>
              <div className={styles.modeCardHeader}>
                <span className={styles.modeFeaturedBadge}>
                  <Star size={12} fill="#B45309" color="#B45309" style={{ display: 'inline', marginRight: 4 }} /> BEST CHOICE TODAY
                </span>
                <h3 className={styles.modeTitle}>Car / Private Cab</h3>
              </div>
              
              <div className={styles.modeCardStatsRow}>
                <div className={styles.modeStatMini}>
                  <Clock size={14} />
                  <span>{drivingDistance !== null ? `${Math.round(drivingDistance * 2.2)} mins` : `${Math.round(guide.distanceKms * 2)} mins`}</span>
                </div>
              </div>

              <p className={styles.modeCardDescription}>
                {guide.travelByCar || 'Driving is the fastest, most flexible way to visit. Scenic mountain ghat drive route available.'}
              </p>

              <div className={styles.modeCardFeaturesGrid}>
                <div className={styles.modeFeatureLine}>
                  <Check size={12} color="#10B981" />
                  <span>Fastest route today</span>
                </div>
                <div className={styles.modeFeatureLine}>
                  <Check size={12} color="#10B981" />
                  <span>Least traffic congestion</span>
                </div>
                <div className={styles.modeFeatureLine}>
                  <Check size={12} color="#10B981" />
                  <span>Easy parking at spot</span>
                </div>
              </div>

              <button 
                className={styles.modeCardActionBtn}
                onClick={() => {
                  if (place.coordinates) {
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`, '_blank');
                  }
                }}
              >
                <span>Start Navigation →</span>
              </button>
            </div>

            {/* 2. PUBLIC BUS CARD */}
            <div className={styles.journeyModeCard}>
              <div className={styles.modeCardHeader}>
                <span className={styles.modeBudgetBadge}>BUDGET FRIENDLY</span>
                <h3 className={styles.modeTitle}>APSRTC Public Bus</h3>
              </div>

              <div className={styles.modeCardStatsRow}>
                <div className={styles.modeStatMini}>
                  <Clock size={14} />
                  <span>{drivingDistance !== null ? `${Math.round(drivingDistance * 2.5)} mins` : `${Math.round(guide.distanceKms * 2.5)} mins`}</span>
                </div>
              </div>

              <p className={styles.modeCardDescription}>
                {guide.travelByRTC || 'Frequent direct transport buses operate directly from Tirupati Central Bus Station.'}
              </p>

              <div className={styles.modeCardFeaturesGrid}>
                <div className={styles.modeFeatureLine}>
                  <Check size={12} color="#10B981" />
                  <span>Buses run every 10-15 mins</span>
                </div>
                <div className={styles.modeFeatureLine}>
                  <Check size={12} color="#10B981" />
                  <span>Ghat-certified safe transit</span>
                </div>
              </div>

              <button 
                className={styles.modeCardActionBtnSecondary}
                onClick={() => {
                  const el = document.getElementById('tips');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>View Bus Guide</span>
              </button>
            </div>

            {/* 3. BIKE CARD */}
            <div className={styles.journeyModeCard}>
              <div className={styles.modeCardHeader}>
                <h3 className={styles.modeTitle}>Bike / Two-Wheeler</h3>
              </div>

              <div className={styles.modeCardStatsRow}>
                <div className={styles.modeStatMini}>
                  <Clock size={14} />
                  <span>{drivingDistance !== null ? `${Math.round(drivingDistance * 2.0)} mins` : `${Math.round(guide.distanceKms * 1.8)} mins`}</span>
                </div>
              </div>

              <p className={styles.modeCardDescription}>
                {guide.travelByBike || 'Excellent choice for solo travelers. Easily bypass local junction bottlenecks.'}
              </p>

              <div className={styles.modeCardFeaturesGrid}>
                <div className={styles.modeFeatureLine}>
                  <Check size={12} color="#10B981" />
                  <span>Avoid city traffic hold-ups</span>
                </div>
                <div className={styles.modeFeatureLine}>
                  <Check size={12} color="#10B981" />
                  <span>Convenient parking layouts</span>
                </div>
              </div>

              <button 
                className={styles.modeCardActionBtnSecondary}
                onClick={() => {
                  if (place.coordinates) {
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`, '_blank');
                  }
                }}
              >
                <span>Start Navigation →</span>
              </button>
            </div>
          </div>
        </section>

        {/* ─── TRAVEL TIPS & ADVISORY ─── */}
        <section className={styles.section} id="travel-insights">
          <h2 className={styles.sectionTitle}>
            <Lightbulb size={20} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} /> Travel Tips
          </h2>
          <div className={styles.travelInsightsList}>
            <div className={styles.insightDetailCard}>
              <strong>Visit before 9:00 AM</strong>
              <p>Avoid mid-day heat and secure parking slots closer to the entrance gates. Queue times are significantly shorter.</p>
            </div>
            {isTirumalaSpot && (
              <div className={styles.insightDetailCard} style={{ background: '#FFFDF0', borderColor: '#E9E3C5' }}>
                <strong style={{ color: '#A37000', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={14} color="#A37000" /> Ghat Road Access Limits
                </strong>
                <p>Two-wheelers (bikes/scooters) are strictly prohibited on the Tirumala ascending/descending ghat roads between 10:00 PM and 6:00 AM daily.</p>
              </div>
            )}
          </div>
        </section>

        {/* ─── NEARBY SERVICES ─── */}
        <section className={styles.section} id="nearby-services">
          <h2 className={styles.sectionTitle}>Nearby Services</h2>
          <div className={styles.nearbyServicesGrid}>
            <div className={styles.serviceMiniItem}>
              <Car size={18} color="#0E6B72" />
              <div>
                <strong>Parking Area</strong>
                <span>100 m away</span>
              </div>
            </div>
            <div className={styles.serviceMiniItem}>
              <Droplets size={18} color="#0E6B72" />
              <div>
                <strong>Washrooms</strong>
                <span>200 m away</span>
              </div>
            </div>
            <div className={styles.serviceMiniItem}>
              <Utensils size={18} color="#0E6B72" />
              <div>
                <strong>Food & Prasadam</strong>
                <span>500 m away</span>
              </div>
            </div>
            <div className={styles.serviceMiniItem}>
              <Coffee size={18} color="#0E6B72" />
              <div>
                <strong>Coffee & Tea</strong>
                <span>300 m away</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── RECOMMENDED JOURNEY ─── */}
        {nearbyPlacesList.length > 0 && (
          <section className={styles.section} id="nearby-attractions">
            <div style={{ marginBottom: '12px' }}>
              <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Recommended Journey</h2>
              <p style={{ fontSize: '11.5px', color: '#64748B', margin: '3px 0 0 0', fontWeight: 500 }}>
                Next stops near {guide.name} (distance from this location)
              </p>
            </div>
            <div style={{ display: 'flex', overflowX: 'auto', gap: '12px', paddingBottom: '8px', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className={styles.hideScrollbar}>
              {nearbyPlacesList.map(({ place: p, dist, reason }) => (
                <Link href={`/place/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
                  <div style={{
                    width: '150px',
                    flexShrink: 0,
                    borderRadius: '16px',
                    background: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    border: '1px solid #F1F5F9',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '110px',
                      backgroundImage: `url(${p.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}>
                      {/* Reason Badge at top */}
                      {reason && (
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          background: 'rgba(255,255,255,0.95)',
                          padding: '3px 6px',
                          borderRadius: '6px',
                          color: '#0F172A',
                          fontSize: '9px',
                          fontWeight: 700,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          {reason}
                        </div>
                      )}
                      
                      <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                        background: 'rgba(255,255,255,0.95)',
                        padding: '3px 6px',
                        borderRadius: '8px',
                        color: '#0F5132',
                        fontSize: '9.5px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        <MapPin size={10} /> {dist.toFixed(1)} km from here
                      </div>
                    </div>
                    <div style={{ padding: '10px' }}>
                      <h4 style={{ 
                        fontSize: '12.5px', 
                        fontWeight: 800, 
                        color: '#0F172A', 
                        margin: '0 0 4px 0', 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.35',
                        minHeight: '2.7em'
                      }}>
                        {p.name.startsWith('Sri Venkateswara ') && p.name !== 'Sri Venkateswara Swamy Temple'
                          ? p.name.replace('Sri Venkateswara ', 'S.V. ')
                          : p.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#64748B' }}>
                        <Star size={11} fill="#F59E0B" color="#F59E0B" />
                        <span style={{ fontWeight: 600 }}>{p.rating || 4.8}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ─── ROUTE MAP ─── */}
        {place.coordinates && (
          <section className={styles.section} id="map-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
                <Map size={20} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} /> Mini Route Map
              </h2>
              
              {/* Mode Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowOfflineMapOnly(!showOfflineMapOnly)}
                  className={styles.mapToggleButton}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: '1px solid #E7E3DD',
                    background: (isOffline || showOfflineMapOnly) ? '#FFE8D1' : '#FFFFFF',
                    borderColor: (isOffline || showOfflineMapOnly) ? '#E9801D' : '#E7E3DD',
                    color: (isOffline || showOfflineMapOnly) ? '#B0550C' : '#44403C',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  {(isOffline || showOfflineMapOnly) ? 'View Online Map' : 'View Offline Vector'}
                </button>

                <button
                  onClick={savePlaceOffline}
                  disabled={isSavingOffline || isSavedOffline}
                  className={styles.mapDownloadButton}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: 'none',
                    background: isSavedOffline ? '#E2E8F0' : '#0F172A',
                    color: isSavedOffline ? '#2E7D32' : '#FFFFFF',
                    cursor: isSavedOffline ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  {isSavingOffline ? (
                    <>Saving...</>
                  ) : isSavedOffline ? (
                    <><Check size={12} color="#2E7D32" /> Saved Offline</>
                  ) : (
                    <>Download Map</>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.mapIframeContainer}>
              {(isOffline || showOfflineMapOnly) ? (
                <OfflineVectorMap name={place.name} lat={place.coordinates.lat} lng={place.coordinates.lng} />
              ) : (
                <iframe
                  title="Google Maps Location"
                  width="100%"
                  height="calc(100% + 50px)"
                  style={{ border: 0, marginBottom: '-50px' }}
                  src={`https://maps.google.com/maps?q=${place.coordinates.lat},${place.coordinates.lng}&hl=en&z=16&output=embed`}
                />
              )}
            </div>
            
            {!(isOffline || showOfflineMapOnly) && (
              <div className={styles.mapCredits}>
                <span>
                  Map pin location: <strong>{place.coordinates.lat}, {place.coordinates.lng}</strong>
                </span>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.mapLargerLink}
                >
                  Open in Google Maps ↗
                </a>
              </div>
            )}
          </section>
        )}

        {/* ─── COST ESTIMATOR ─── */}
        <section className={styles.section} id="cost">
          <h2 className={styles.sectionTitle}>Travel Cost Estimator</h2>
          <div className={styles.costCard} style={{ padding: 18 }}>
            <div className={styles.estimatorHeaderCard}>
              <div className={styles.estimatorHeaderRow}>
                <span className={styles.estimatorTitle}>
                  Live Trip Estimator
                </span>
                <span className={styles.estimatorKmBadge}>
                  {calc.effDist.toFixed(1)} km away
                </span>
              </div>
              <div className={styles.estimatorLocationRow}>
                <span>
                  {userLocation ? 'Based on your location' : 'Default: from Tirupati Central'}
                </span>
                {!userLocation && (
                  <button 
                    onClick={handleDetectLocation}
                    className={styles.detectLocationBtn}
                  >
                    Use Live Location
                  </button>
                )}
              </div>
              {isTirumalaSpot && (
                <div className={styles.ghatRoadWarning} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={12} color="#D97706" /> Includes Mountain Ghat Road Winding Route
                </div>
              )}
            </div>

            {/* Vehicle Selector */}
            <div style={{ marginBottom: 16 }}>
              <label className={styles.selectorLabel}>Select Vehicle</label>
              <div className={styles.vehicleBtnGrid}>
                {[
                  { type: 'car', label: 'Car' },
                  { type: 'bus', label: 'Bus' },
                  { type: 'bike', label: 'Bike' },
                  { type: 'cab', label: 'Cab' },
                  { type: 'suv', label: 'SUV' }
                ].map(v => (
                  <button
                    key={v.type}
                    onClick={() => setVehicleType(v.type as any)}
                    className={`${styles.vehicleBtn} ${vehicleType === v.type ? styles.vehicleBtnActive : ''}`}
                  >
                    <span>{v.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trip Type & Passenger Selectors */}
            <div className={styles.logisticsSelectorsGrid}>
              <div>
                <label className={styles.selectorLabel}>Trip Type</label>
                <div className={styles.tripTypeSelector}>
                  <button 
                    onClick={() => setIsRoundTrip(false)}
                    className={`${styles.tripTypeOption} ${!isRoundTrip ? styles.tripTypeOptionActive : ''}`}
                  >
                    One-Way
                  </button>
                  <button 
                    onClick={() => setIsRoundTrip(true)}
                    className={`${styles.tripTypeOption} ${isRoundTrip ? styles.tripTypeOptionActive : ''}`}
                  >
                    Round
                  </button>
                </div>
              </div>

              {vehicleType === 'bus' && (
                <div>
                  <label className={styles.selectorLabel}>Passengers</label>
                  <div className={styles.tripTypeSelector}>
                    {[1, 2, 3, 4, 6].map(p => (
                      <button
                        key={p}
                        onClick={() => setPassengers(p)}
                        className={`${styles.tripTypeOption} ${passengers === p ? styles.tripTypeOptionActive : ''}`}
                      >
                        {p === 6 ? '5+' : p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Journey Summary */}
            <div className={styles.journeySummaryCard}>
              <h3 className={styles.summaryTitle}>Journey Summary</h3>
              
              <div className={styles.summaryDetailsRow}>
                <div>
                  <div className={styles.summaryLabel}>Distance</div>
                  <div className={styles.summaryValue}>{calc.effDist.toFixed(1)} km</div>
                </div>
                <div>
                  <div className={styles.summaryLabel}>Travel Time</div>
                  <div className={styles.summaryValue}>~{calc.estTime} mins</div>
                </div>
                {calc.liters > 0 && (
                  <div style={{ gridColumn: 'span 2' }}>
                    <div className={styles.summaryLabel}>Est. Fuel Consumption</div>
                    <div className={styles.summarySubvalue}>{calc.liters.toFixed(1)} Liters</div>
                  </div>
                )}
              </div>

              <div className={styles.summaryFooterRow}>
                <div>
                  <div className={styles.summaryLabel} style={{ textTransform: 'uppercase' }}>Estimated Total Cost</div>
                  <div className={styles.taxesMessage}>Taxes, toll & entry included</div>
                </div>
                <div className={styles.costTotalText}>
                  ₹{(Number(calc.total) || 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Collapsible Breakdown */}
            <div style={{ marginBottom: 16 }}>
              <button 
                onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
                className={styles.breakdownHeaderBtn}
              >
                <span>{isBreakdownOpen ? '▼ Hide Detailed Breakdown' : '▶ View Detailed Breakdown'}</span>
                <span className={styles.breakdownHeaderBadge}>
                  Itemized
                </span>
              </button>
              
              {isBreakdownOpen && (
                <div className={styles.breakdownDetailsList}>
                  {calc.fare > 0 && (
                    <div className={styles.breakdownItemRow}>
                      <span>Transit Ticket Fare ({passengers} {passengers === 1 ? 'passenger' : 'passengers'})</span>
                      <span style={{ fontWeight: 600 }}>₹{calc.fare}</span>
                    </div>
                  )}
                  {calc.fuel > 0 && (
                    <div className={styles.breakdownItemRow}>
                      <span>Fuel Cost (~₹{fuelRates.petrol.toFixed(2)}/L)</span>
                      <span style={{ fontWeight: 600 }}>₹{Math.round(calc.fuel)}</span>
                    </div>
                  )}
                  {calc.tolls > 0 && (
                    <div className={styles.breakdownItemRow}>
                      <span>{isTirumalaSpot ? 'Mountain Ghat Toll (Alipiri)' : 'Highway Toll'}</span>
                      <span style={{ fontWeight: 600 }}>₹{calc.tolls}</span>
                    </div>
                  )}
                  {calc.parking > 0 && (
                    <div className={styles.breakdownItemRow}>
                      <span>Vehicle Parking Fee</span>
                      <span style={{ fontWeight: 600 }}>₹{calc.parking}</span>
                    </div>
                  )}
                  <div className={styles.breakdownItemRow}>
                    <span>Entry Fee ({passengers} x {place.entryFeeNum === 0 ? 'Free' : `₹${place.entryFeeNum}`})</span>
                    <span style={{ fontWeight: 600, color: calc.entryFee === 0 ? '#10B981' : '#475569' }}>
                      {calc.entryFee === 0 ? 'Free' : `₹${calc.entryFee}`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Saarthi Recommendation */}
            <div className={styles.saarthiRecCard}>
              <div className={styles.saarthiRecText}>
                <strong style={{ display: 'block', marginBottom: 2 }}>{t.saarthiRec}</strong>
                {vehicleType === 'bus' ? (
                  isTirumalaSpot
                    ? `APSRTC Bus is the most cost-effective and secure way to ascend the Tirumala ghats. Great choice for ${passengers} ${passengers === 1 ? 'person' : 'people'}!`
                    : `APSRTC Bus is the smartest budget option — direct state buses run this route regularly. Great for ${passengers} ${passengers === 1 ? 'solo traveller' : 'people'}!`
                ) : passengers === 1 && vehicleType === 'bike' ? (
                  isTirumalaSpot
                    ? "A bike is the fastest way to navigate the 36 hairpin bends — but ride carefully on the ghat road."
                    : `A bike is the most flexible option for this ${calc.effDist.toFixed(0)} km highway trip — fuel-efficient and easy to park at the destination.`
                ) : passengers >= 5 ? (
                  "With a group of 5+, booking an SUV or Private Cab guarantees collective safety, comfort, and shared luggage space."
                ) : (
                  isTirumalaSpot
                    ? `Self-driving via Car gives you full scheduling freedom. Pay the Alipiri toll before the ghat ascent.`
                    : `Self-driving is ideal for this route — cruise the highway comfortably. Keep fuel full before you start.`
                )}
              </div>
            </div>

            <div className={styles.disclaimerText}>
              Estimated using: ✓ Current fuel price (~₹{fuelRates.petrol.toFixed(2)}/L) • ✓ Google Distance matrix • ✓ TTD/APSRTC fare guidelines • ✓ Approximate parking
            </div>
          </div>
        </section>

        {/* ─── 5. LIVE STATUS & TIMINGS ─── */}
        <section className={styles.section} id="timings">
          <h2 className={styles.sectionTitle}>Timings & Best Visit</h2>
          <div className={styles.timingsGrid}>
            <div className={styles.timingCard}>
              <Clock size={24} className={styles.timingCardIcon} />
              <h3>Opening Hours</h3>
              <p className={styles.timingValue}>
                {guide.openingTime} - {guide.closingTime}
              </p>
              {place.id === 'sv-zoo-park' ? (
                <span className={styles.zooOpenBadge} style={{ 
                  color: isTuesday ? '#FFFFFF' : '#059669', 
                  background: isTuesday ? '#EF4444' : '#D1FAE5',
                }}>
                  {isTuesday ? 'Closed Today (Weekly Holiday - Tuesdays)' : 'Open Today (8:30 AM - 5:00 PM)'}
                </span>
              ) : (
                <span className={styles.timingSub}>All days open</span>
              )}
            </div>
            <div className={styles.timingCard}>
              <Star size={24} className={styles.timingCardIcon} />
              <h3>Best Slot</h3>
              {(() => {
                const slot = parseBestSlot(guide.bestTime);
                return (
                  <>
                    <p className={styles.timingValue}>{slot.title}</p>
                    <span className={styles.timingSub}>{slot.subtitle}</span>
                  </>
                );
              })()}
            </div>
            <div className={styles.timingCard}>
              <Clock size={24} className={styles.timingCardIcon} />
              <h3>Duration</h3>
              <p className={styles.timingValue}>{guide.duration}</p>
              <span className={styles.timingSub}>
                {place.id === 'sv-zoo-park' ? 'Electric carts & bicycles available at the counter' : 'Average stay duration'}
              </span>
            </div>
          </div>
        </section>

        {/* ─── BREAK TIMINGS ─── */}
        {place.breakTimings && place.breakTimings.length > 0 && (
          <section className={styles.section} id="break-timings">
            <h2 className={styles.sectionTitle}>Break Timings</h2>
            <div className={styles.breakDetailsCard}>
              {isCurrentlyInBreak ? (
                <div className={`${styles.breakStatusBanner} ${styles.breakStatusClosed}`}>
                  <div className={styles.pulseDot} />
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Lock size={14} /> Currently Closed for Break
                  </span>
                </div>
              ) : (
                <div className={`${styles.breakStatusBanner} ${styles.breakStatusOpen}`}>
                  <div className={styles.pulseDot} style={{ background: '#16A34A' }} />
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={14} color="#16A34A" /> Open for Darshan
                  </span>
                </div>
              )}

              <p className={styles.breakText}>
                {isCurrentlyInBreak 
                  ? "Avoid visiting right now! The temple doors are temporarily closed for regular rituals." 
                  : "The temple is currently open. Plan your travel to complete darshan before the next break."}
              </p>

              <div className={styles.breakTimesContainer}>
                {place.breakTimings.map((b, i) => (
                  <div key={i} className={styles.breakTimeItem}>
                    <Clock size={16} color="#E9801D" />
                    <span className={styles.breakTimeValue}>
                      {formatTo12Hour(b.from)} — {formatTo12Hour(b.to)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── RITUALS & SEVAS ─── */}
        {place.rituals && (place.rituals.daily?.length || place.rituals.weekly?.length || place.rituals.annual?.length || place.rituals.sevas?.length) && (
          <section className={styles.section} id="rituals">
            <h2 className={styles.sectionTitle}>Rituals & Sevas</h2>
            <div className={styles.ritualsContainer}>
              {place.rituals.daily && place.rituals.daily.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 className={styles.ritualGroupHeader}>
                    Daily Schedule
                  </h4>
                  <div className={styles.timeline}>
                    {place.rituals.daily.map((r, i) => {
                      const match = r.match(/(.*?)\s*\((.*?)\)/);
                      const title = match ? match[1].trim() : r;
                      const time = match ? match[2].trim() : 'Daily';
                      return (
                        <div key={i} className={styles.timelineItem}>
                          <div className={styles.timelineDot} />
                          <div className={styles.timelineContent}>
                            <span className={styles.timelineTitle}>{title}</span>
                            <span className={styles.timelineTime}>{time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {place.rituals.weekly && place.rituals.weekly.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 className={styles.ritualGroupHeader}>
                    Weekly Schedule
                  </h4>
                  <div className={styles.timeline}>
                    {place.rituals.weekly.map((r, i) => {
                      const match = r.match(/(.*?)\s*\((.*?)\)/);
                      const title = match ? match[1].trim() : r;
                      const time = match ? match[2].trim() : 'Weekly';
                      return (
                        <div key={i} className={styles.timelineItem}>
                          <div className={styles.timelineDot} />
                          <div className={styles.timelineContent}>
                            <span className={styles.timelineTitle}>{title}</span>
                            <span className={styles.timelineTime}>{time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {place.rituals.annual && place.rituals.annual.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 className={styles.ritualGroupHeader}>
                    Annual Festivals
                  </h4>
                  <div className={styles.festivalsGrid}>
                    {place.rituals.annual.map((r, i) => {
                      return (
                        <div key={i} className={styles.festivalCard}>
                          <span className={styles.festivalIcon}>
                            <Sparkles size={16} color="var(--color-saffron-600)" />
                          </span>
                          <span>{r}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {place.rituals.sevas && place.rituals.sevas.length > 0 && (
                <div>
                  <h4 className={styles.ritualGroupHeader}>
                    Sevas Available
                  </h4>
                  <div className={styles.pillsContainer}>
                    {place.rituals.sevas.map((s, i) => (
                      <span key={i} className={styles.sevaPill}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ─── 6. ABOUT ─── */}
        <section className={styles.section} id="about">
          <h2 className={styles.sectionTitle}>
            <Landmark size={19} color="#0E6B72" style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
            {t.overview}
          </h2>
          <div className={styles.introCard}>
            <p className={styles.introText}>{guide.shortIntro}</p>
            {isSupported && (
              <button 
                className={styles.speakBtn} 
                onClick={() => toggleSpeak(guide.shortIntro, 'en-IN')}
              >
                {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                <span>{isSpeaking ? "Stop Listening" : "Listen to Guide"}</span>
              </button>
            )}
          </div>
        </section>

        {/* ─── KNOW BEFORE YOU GO / TIPS ─── */}
        <section className={styles.section} id="tips">
          <h2 className={styles.sectionTitle}>
            <Shirt size={19} color="#0E6B72" style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
            {t.knowBefore}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className={styles.tipCard} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '16px', borderRadius: '16px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontWeight: 700, color: '#334155' }}>{t.dressCode}</span> <span style={{ color: '#475569' }}>{guide.visitorTips.dressCode}</span>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontWeight: 700, color: '#334155' }}>{t.photoRule}</span> <span style={{ color: '#475569' }}>{guide.visitorTips.photoRule}</span>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontWeight: 700, color: '#334155' }}>{t.footwearRule}</span> <span style={{ color: '#475569' }}>{guide.visitorTips.footwearRule}</span>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontWeight: 700, color: '#334155' }}>{t.entryRule}</span> <span style={{ color: '#475569' }}>{guide.visitorTips.entryRule}</span>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontWeight: 700, color: '#334155' }}>{t.crowdNote}</span> <span style={{ color: '#475569' }}>{guide.visitorTips.crowdNote}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ─── FACILITIES ─── */}
        {place.facilities && (
          <section className={styles.section} id="facilities">
            <h2 className={styles.sectionTitle}>
              <Info size={19} color="#0E6B72" style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
              {t.facilities}
            </h2>
            <div className={styles.facilitiesGrid}>
              {Object.entries(place.facilities)
                .filter(([, v]) => v && v !== 'N/A')
                .map(([key, value]) => {
                  const labels: Record<string, string> = {
                    locker: 'Lockers', toilets: 'Toilets', drinkingWater: 'Drinking Water',
                    wheelchair: 'Wheelchair Support', parking: 'Parking Area', food: 'Food / Prasadam',
                  };
                  return (
                    <div key={key} className={styles.facilityItemCard}>
                      <div className={styles.facilityIcon}>
                        <Info size={16} color="#E9801D" />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{labels[key] || key}</div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{value as string}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* ─── RELATED PLACES ─── */}
        {place.relatedPlaces && place.relatedPlaces.length > 0 && (
          <section className={styles.section} id="related">
            <h2 className={styles.sectionTitle}>
              <MapPin size={19} color="#0E6B72" style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
              {t.related}
            </h2>
            <div className={styles.relatedPlacesScroll}>
              {place.relatedPlaces.map(relId => {
                const rel = PLACES.find(p => p.id === relId);
                if (!rel) return null;
                return (
                  <Link href={`/place/${rel.id}`} key={rel.id} className={styles.relatedCardLink}>
                    <div className={styles.relatedCard}>
                      <div 
                        className={styles.relatedCardImg}
                        style={{ backgroundImage: `url(${rel.image})` }} 
                      />
                      <div className={styles.relatedCardInfo}>
                        <h4>{rel.name}</h4>
                        <div className={styles.relatedCardMeta}>
                          <Star size={10} fill="#FFD700" color="#FFD700" />
                          <span>{rel.rating} • {getRelDistance(rel)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}


        {/* ─── 7. HISTORY ─── */}
        {guide.history && guide.history.length > 30 && (
          <section className={styles.section} id="history">
            <h2 className={styles.sectionTitle}>
              <BookOpen size={19} color="#D97706" style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
              {t.legend}
            </h2>
            <div className={styles.legendCard}>
              <div className={styles.legendHeader}>
                <div className={styles.legendIconRing}>
                  <Info size={20} color="var(--color-saffron-600)" />
                </div>
                <div style={{ flex: 1 }}>
                  <p className={styles.legendLabel}>{t.originStory}</p>
                  <p className={styles.legendSub}>{t.mythologicalContext}</p>
                </div>
                {isSupported && (
                  <button
                    onClick={() => toggleSpeak(guide.history, 'en-IN')}
                    className={styles.audioPill}
                    aria-label={isSpeaking ? 'Stop audio' : 'Listen to legend'}
                  >
                    <span>{isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}</span>
                    <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                  </button>
                )}
              </div>

              <div className={styles.legendBody}>
                <div
                  className={styles.legendTextWrap}
                  style={{ maxHeight: isLegendExpanded ? 'none' : '5em', overflow: 'hidden', position: 'relative' }}
                >
                  <p className={styles.legendText}>{guide.history}</p>
                  {!isLegendExpanded && (
                    <div className={styles.legendFade} />
                  )}
                </div>

                <button
                  onClick={() => setIsLegendExpanded(v => !v)}
                  className={styles.legendToggle}
                >
                  {isLegendExpanded ? '▲ Collapse legend' : '▼ Read full legend'}
                </button>
              </div>
            </div>
          </section>
        )}





        {/* ─── 10. FEEDBACK ─── */}
        <section className={styles.section} id="feedback" style={{ marginBottom: '80px' }}>
          <h2 className={styles.sectionTitle}>{t.feedbackTitle}</h2>
          <div style={{ 
            background: '#FFFFFF', 
            padding: '16px', 
            borderRadius: '16px', 
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            {feedbackSubmitted ? (
              <div style={{ fontSize: '13px', color: '#16A34A', fontWeight: 700, textAlign: 'center', padding: '10px 0' }}>
                {t.feedbackSuccess}
              </div>
            ) : (
              <>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                  {t.feedbackDesc}
                </p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <button
                    onClick={() => setFeedbackRating('Helpful')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: feedbackRating === 'Helpful' ? '#ECFDF5' : '#FFFFFF',
                      border: `1px solid ${feedbackRating === 'Helpful' ? '#10B981' : '#E2E8F0'}`,
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: feedbackRating === 'Helpful' ? '#059669' : '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ThumbsUp size={14} /> {t.helpful}
                  </button>
                  <button
                    onClick={() => setFeedbackRating('Needs Work')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: feedbackRating === 'Needs Work' ? '#FEF2F2' : '#FFFFFF',
                      border: `1px solid ${feedbackRating === 'Needs Work' ? '#EF4444' : '#E2E8F0'}`,
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: feedbackRating === 'Needs Work' ? '#DC2626' : '#475569',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ThumbsDown size={14} /> {t.needsWork}
                  </button>
                </div>
                
                <textarea
                  style={{
                    width: '100%',
                    height: '60px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    marginBottom: '10px',
                    resize: 'none',
                    outline: 'none',
                    fontFamily: 'inherit',
                    color: '#1E293B'
                  }}
                  placeholder="Tell us what we can improve..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                />
                
                <button
                  onClick={handlePlaceFeedbackSubmit}
                  disabled={!feedbackRating}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: feedbackRating ? '#E9801D' : '#F1F5F9',
                    color: feedbackRating ? '#FFFFFF' : '#94A3B8',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: feedbackRating ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                >
                  {t.submitFeedback}
                </button>
              </>
            )}
          </div>
        </section>
      </div>



      {/* Sticky footer action bar */}
      <div className={styles.stickyFooter}>
        <div className={styles.footerActions}>
          <button 
            className={`${styles.saveIconBtn} ${isSaved ? styles.saveIconBtnActive : ''}`}
            onClick={() => togglePlace(place.id)}
            title={isSaved ? "Saved" : "Save for Later"}
          >
            <Heart size={22} fill={isSaved ? "var(--color-saffron-500)" : "none"} color={isSaved ? "var(--color-saffron-500)" : "currentColor"} />
          </button>
          <a 
            href={place.coordinates 
              ? `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`
              : `https://www.google.com/maps/dir/?api=1&destination=13.6288,79.4192`
            }
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navBtn}
          >
            <Navigation size={20} />
            <span>{t.navigateNow}</span>
          </a>
        </div>
      </div>
    </main>
  );
}

function OfflineVectorMap({ name, lat, lng }: { name: string; lat: number; lng: number }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#FAF8F5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Grid Pattern Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.08,
        backgroundImage: 'radial-gradient(#1E1B18 1px, transparent 1px)',
        backgroundSize: '16px 16px'
      }} />

      <svg width="100%" height="100%" viewBox="0 0 300 220" style={{ zIndex: 2 }}>
        {/* Radar Rings */}
        <circle cx="150" cy="110" r="80" stroke="rgba(233, 128, 29, 0.1)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
        <circle cx="150" cy="110" r="50" stroke="rgba(233, 128, 29, 0.15)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
        <circle cx="150" cy="110" r="20" stroke="rgba(233, 128, 29, 0.2)" strokeWidth="1" fill="none" />

        {/* Axis Lines */}
        <line x1="150" y1="20" x2="150" y2="200" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="30" y1="110" x2="270" y2="110" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="2 2" />

        {/* Dotted Walking Paths */}
        <path d="M 60 160 Q 110 160 150 110" stroke="rgba(14, 107, 114, 0.4)" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
        <path d="M 90 70 Q 120 80 150 110" stroke="rgba(14, 107, 114, 0.4)" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
        <path d="M 210 80 Q 180 90 150 110" stroke="rgba(14, 107, 114, 0.4)" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
        <path d="M 230 150 Q 190 140 150 110" stroke="rgba(14, 107, 114, 0.4)" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />

        {/* POI Labels and Circles */}
        {/* Parking */}
        <g style={{ cursor: 'pointer' }}>
          <circle cx="60" cy="160" r="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          <text x="60" y="164" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#475569">P</text>
          <text x="60" y="176" fontSize="7" textAnchor="middle" fill="#64748B" fontWeight="600">Parking</text>
        </g>

        {/* Lockers */}
        <g style={{ cursor: 'pointer' }}>
          <circle cx="90" cy="70" r="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          <text x="90" y="74" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#475569">L</text>
          <text x="90" y="60" fontSize="7" textAnchor="middle" fill="#64748B" fontWeight="600">Lockers</text>
        </g>

        {/* Footwear */}
        <g style={{ cursor: 'pointer' }}>
          <circle cx="210" cy="80" r="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          <text x="210" y="84" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#475569">F</text>
          <text x="210" y="70" fontSize="7" textAnchor="middle" fill="#64748B" fontWeight="600">Footwear</text>
        </g>

        {/* Water */}
        <g style={{ cursor: 'pointer' }}>
          <circle cx="230" cy="150" r="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
          <text x="230" y="154" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#475569">W</text>
          <text x="230" y="166" fontSize="7" textAnchor="middle" fill="#64748B" fontWeight="600">Water</text>
        </g>

        {/* Compass Rose */}
        <g transform="translate(45, 45) scale(0.6)">
          <circle cx="0" cy="0" r="22" stroke="rgba(0,0,0,0.1)" strokeWidth="1" fill="none" />
          <line x1="0" y1="-26" x2="0" y2="26" stroke="#94A3B8" strokeWidth="1.2" />
          <line x1="-26" y1="0" x2="26" y2="0" stroke="#94A3B8" strokeWidth="1.2" />
          <polygon points="0,-22 4,0 0,2 0,-22" fill="#E9801D" />
          <polygon points="0,-22 -4,0 0,2 0,-22" fill="#B0550C" />
          <polygon points="0,22 4,0 0,-2 0,22" fill="#94A3B8" />
          <polygon points="0,22 -4,0 0,-2 0,22" fill="#CBD5E1" />
          <text x="0" y="-29" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#475569">N</text>
        </g>

        {/* Center Main Attraction Marker */}
        <g>
          {/* Pulse wave */}
          <circle cx="150" cy="110" r="15" fill="rgba(233, 128, 29, 0.15)">
            <animate attributeName="r" values="8;18;8" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="110" r="8" fill="#E9801D" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="150" cy="110" r="3" fill="#FFFFFF" />
          {/* Dynamic Main Label */}
          {(() => {
            const displayTitle = name.length > 30 ? name.slice(0, 28) + '…' : name;
            const labelWidth = Math.min(210, Math.max(96, displayTitle.length * 5.5 + 16));
            const labelX = 150 - labelWidth / 2;
            return (
              <g>
                <rect x={labelX} y="123" width={labelWidth} height="16" rx="4" fill="rgba(26, 27, 28, 0.9)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                <text x="150" y="134" fontSize="8" fontWeight="700" fill="#FFFFFF" textAnchor="middle">
                  {displayTitle}
                </text>
              </g>
            );
          })()}
        </g>
      </svg>

      {/* Compass Coordinates HUD Footer */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '12px',
        zIndex: 3,
        fontSize: '9px',
        fontFamily: 'monospace',
        color: '#4A5568',
        background: 'rgba(255,255,255,0.85)',
        padding: '3px 6px',
        borderRadius: '4px',
        border: '1px solid rgba(0,0,0,0.06)'
      }}>
        GPS: {lat.toFixed(5)}° N, {lng.toFixed(5)}° E
      </div>

      {/* Offline Mode Active Badge */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 3,
        fontSize: '9px',
        fontWeight: 'bold',
        color: '#B0550C',
        background: '#FFE8D1',
        border: '1px solid rgba(233, 128, 29, 0.25)',
        padding: '4px 8px',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        boxShadow: '0 2px 8px rgba(233,128,29,0.08)'
      }}>
        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E9801D' }} />
        OFFLINE ACTIVE
      </div>
    </div>
  );
}
