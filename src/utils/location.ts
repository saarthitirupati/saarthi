/**
 * Validates coordinate ranges and order (WGS84 standard).
 * Rejects NaN, Infinite, out-of-range, and Null Island (0, 0) values.
 */
export function isValidCoordinates(lat: any, lng: any): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
  if (lat === 0 && lng === 0) return false;
  return true;
}

export interface LocationOption {
  id: string;
  nameEn: string;
  nameTe: string;
  shortName: string;
  category: 'local-hub' | 'kshethram' | 'transit-hub' | 'planning-city';
  subtextEn: string;
  subtextTe: string;
  coords: { lat: number; lng: number };
}

/**
 * Calculates the geodesic distance (in kilometers) between two coordinates
 * using the Haversine formula.
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (!isValidCoordinates(lat1, lon1) || !isValidCoordinates(lat2, lon2)) {
    return 0;
  }

  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Alipiri Toll Gate / Ghat Road Entry Point
 * The single motorized gateway connecting Tirupati plains and Tirumala Hill.
 */
export const ALIPIRI_GATE = { lat: 13.647051, lng: 79.405856 };

/**
 * Tirumala Main Temple Square / Bus Station Anchor
 */
export const TIRUMALA_CENTER = { lat: 13.68323, lng: 79.34731 };

/**
 * Fallback Tirupati Central Railway Station / Bus Stand Anchor
 */
export const TIRUPATI_CENTER = { lat: 13.6288, lng: 79.4192 };

export const PRESET_LOCATIONS: LocationOption[] = [
  // Local Pilgrim Hubs
  {
    id: 'tirupati',
    nameEn: 'Tirupati (City & Foothills)',
    nameTe: 'తిరుపతి (నగరం & అలిపిరి దిగువ)',
    shortName: 'Tirupati',
    category: 'local-hub',
    subtextEn: 'Alipiri, Railway Station, Central RTC Bus Stand',
    subtextTe: 'అలిపిరి, రైల్వే స్టేషన్, సెంట్రల్ బస్టాండ్',
    coords: TIRUPATI_CENTER
  },
  {
    id: 'tirumala',
    nameEn: 'Tirumala (Hill Top & Temple)',
    nameTe: 'తిరుమల (కొండపై & శ్రీవారి సన్నిధి)',
    shortName: 'Tirumala',
    category: 'local-hub',
    subtextEn: 'Venkateswara Temple, CRO, Balaji Nagar, Mada Streets',
    subtextTe: 'శ్రీవారి ఆలయం, సీఆర్వో, బాలాజీ నగర్, మాడ వీధులు',
    coords: TIRUMALA_CENTER
  },
  {
    id: 'renigunta',
    nameEn: 'Renigunta (Airport & Rail Hub)',
    nameTe: 'రేణిగుంట (విమానాశ్రయం & రైల్వే జంక్షన్)',
    shortName: 'Renigunta',
    category: 'transit-hub',
    subtextEn: 'Tirupati Airport (TIR) & Major Rail Junction',
    subtextTe: 'తిరుపతి ఎయిర్‌పోర్ట్ మరియు రైల్వే జంక్షన్',
    coords: { lat: 13.6477, lng: 79.5167 }
  },
  {
    id: 'chandragiri',
    nameEn: 'Chandragiri (Fort & Suburbs)',
    nameTe: 'చంద్రగిరి (కోట & చుట్టుపక్కల)',
    shortName: 'Chandragiri',
    category: 'transit-hub',
    subtextEn: 'Historic Raja Mahal Fort & Valley',
    subtextTe: 'రాజమహల్ కోట మరియు పరిసరాలు',
    coords: { lat: 13.5843, lng: 79.3158 }
  },

  // Nearby Kshethrams
  {
    id: 'srikalahasti',
    nameEn: 'Srikalahasti (Vayu Lingam)',
    nameTe: 'శ్రీకాళహస్తి (వాయు లింగేశ్వరుడు)',
    shortName: 'Srikalahasti',
    category: 'kshethram',
    subtextEn: 'Rahu-Ketu Kshethram (~38 km from Tirupati)',
    subtextTe: 'రాహు-కేతు పరిహార క్షేత్రం (తిరుపతికి ~38 కి.మీ)',
    coords: { lat: 13.7500, lng: 79.7000 }
  },
  {
    id: 'kanipakam',
    nameEn: 'Kanipakam (Varasiddhi Vinayaka)',
    nameTe: 'కాణిపాకం (వరసిద్ధి వినాయక క్షేత్రం)',
    shortName: 'Kanipakam',
    category: 'kshethram',
    subtextEn: 'Swayambhu Vinayaka Temple (~70 km from Tirupati)',
    subtextTe: 'స్వయంభూ వినాయక ఆలయం (తిరుపతికి ~70 కి.మీ)',
    coords: { lat: 13.2845, lng: 79.0345 }
  },
  {
    id: 'srinivasa-mangapuram',
    nameEn: 'Srinivasa Mangapuram',
    nameTe: 'శ్రీనివాస మంగాపురం',
    shortName: 'Srinivasa Mangapuram',
    category: 'kshethram',
    subtextEn: 'Sri Kalyana Venkateswara Swamy Temple (~12 km)',
    subtextTe: 'శ్రీ కల్యాణ వేంకటేశ్వర స్వామి సన్నిధి (~12 కి.మీ)',
    coords: { lat: 13.6108, lng: 79.3277 }
  },
  {
    id: 'appalayagunta',
    nameEn: 'Appalayagunta',
    nameTe: 'అప్పలాయగుంట',
    shortName: 'Appalayagunta',
    category: 'kshethram',
    subtextEn: 'Sri Prasanna Venkateswara Swamy (~16 km)',
    subtextTe: 'శ్రీ ప్రసన్న వేంకటేశ్వర స్వామి సన్నిధి (~16 కి.మీ)',
    coords: { lat: 13.5374, lng: 79.4776 }
  },
  {
    id: 'surutapalli',
    nameEn: 'Surutapalli (Pallikondeswara)',
    nameTe: 'సురుటుపల్లె (పళ్ళకొండేశ్వరుడు)',
    shortName: 'Surutapalli',
    category: 'kshethram',
    subtextEn: 'Rare Reclining Bhoga Sayana Shiva (~73 km)',
    subtextTe: 'అరుదైన శయన శివ పరిహార క్షేత్రం (~73 కి.మీ)',
    coords: { lat: 13.3344, lng: 79.8746 }
  },

  // Major Planning Hubs (Planning From Home)
  {
    id: 'bengaluru',
    nameEn: 'Bengaluru (Planning Trip)',
    nameTe: 'బెంగళూరు (యాత్ర ప్లానింగ్)',
    shortName: 'Bengaluru',
    category: 'planning-city',
    subtextEn: 'Majestic / Kempegowda Intl Airport (~250 km)',
    subtextTe: 'మెజెస్టిక్ / విమానాశ్రయం (~250 కి.మీ)',
    coords: { lat: 12.9716, lng: 77.5946 }
  },
  {
    id: 'chennai',
    nameEn: 'Chennai (Planning Trip)',
    nameTe: 'చెన్నై (యాత్ర ప్లానింగ్)',
    shortName: 'Chennai',
    category: 'planning-city',
    subtextEn: 'Central / Koyambedu / Airport (~135 km)',
    subtextTe: 'సెంట్రల్ / కోయంబేడు / ఎయిర్‌పోర్ట్ (~135 కి.మీ)',
    coords: { lat: 13.0827, lng: 80.2707 }
  },
  {
    id: 'hyderabad',
    nameEn: 'Hyderabad (Planning Trip)',
    nameTe: 'హైదరాబాద్ (యాత్ర ప్లానింగ్)',
    shortName: 'Hyderabad',
    category: 'planning-city',
    subtextEn: 'Secunderabad / Shamshabad Airport (~550 km)',
    subtextTe: 'సికింద్రాబాద్ / శంషాబాద్ ఎయిర్‌పోర్ట్ (~550 కి.మీ)',
    coords: { lat: 17.3850, lng: 78.4867 }
  },
  {
    id: 'vijayawada',
    nameEn: 'Vijayawada (Planning Trip)',
    nameTe: 'విజయవాడ (యాత్ర ప్లానింగ్)',
    shortName: 'Vijayawada',
    category: 'planning-city',
    subtextEn: 'Central Junction / Kanaka Durga (~380 km)',
    subtextTe: 'రైల్వే జంక్షన్ / కనకదుర్గ (~380 కి.మీ)',
    coords: { lat: 16.5062, lng: 80.6480 }
  },
  {
    id: 'nellore',
    nameEn: 'Nellore',
    nameTe: 'నెల్లూరు',
    shortName: 'Nellore',
    category: 'planning-city',
    subtextEn: 'NH16 Corridor (~130 km)',
    subtextTe: 'జాతీయ రహదారి 16 కారిడార్ (~130 కి.మీ)',
    coords: { lat: 14.4426, lng: 79.9865 }
  },
  {
    id: 'kadapa',
    nameEn: 'Kadapa (Devuni Kadapa)',
    nameTe: 'కడప (దేవుని కడప)',
    shortName: 'Kadapa',
    category: 'planning-city',
    subtextEn: 'Gateway to Tirumala (~140 km)',
    subtextTe: 'శ్రీవారి ముఖద్వారం కడప (~140 కి.మీ)',
    coords: { lat: 14.4673, lng: 78.8242 }
  },
  {
    id: 'anantapur',
    nameEn: 'Anantapur',
    nameTe: 'అనంతపురం',
    shortName: 'Anantapur',
    category: 'planning-city',
    subtextEn: 'Rayalaseema Gateway (~290 km)',
    subtextTe: 'రాయలసీమ ముఖద్వారం (~290 కి.మీ)',
    coords: { lat: 14.6819, lng: 77.6006 }
  },
  {
    id: 'vellore',
    nameEn: 'Vellore (Golden Temple)',
    nameTe: 'వెల్లూరు (స్వర్ణ దేవాలయం)',
    shortName: 'Vellore',
    category: 'planning-city',
    subtextEn: 'Sripuram & Katpadi Junction (~105 km)',
    subtextTe: 'శ్రీపురం మరియు కాట్పాడి (~105 కి.మీ)',
    coords: { lat: 12.9165, lng: 79.1325 }
  }
];

/**
 * Helper to determine if coordinates are truly located on Tirumala Hill (Seshachalam Hills).
 * Tirumala Hill plateau is located north-west of Alipiri:
 * Lat 13.655 to 13.735, Lng 79.300 to 79.385, within 7.5 km of Tirumala Center.
 */
export function isCoordinateOnTirumalaHill(lat: number, lng: number): boolean {
  if (!isValidCoordinates(lat, lng)) return false;
  return (
    lat >= 13.655 &&
    lat <= 13.735 &&
    lng >= 79.300 &&
    lng <= 79.385 &&
    calculateDistance(lat, lng, TIRUMALA_CENTER.lat, TIRUMALA_CENTER.lng) <= 7.5
  );
}

/**
 * Checks if a location is within the Greater Tirupati Pilgrimage Circuit (<= 120 km)
 * or matches any explicitly supported preset hub.
 *
 * This covers the complete regional pilgrimage circuit:
 * - Tirupati city & foothills
 * - Tirumala hill top
 * - Renigunta (~10 km), Chandragiri (~12 km), Srinivasa Mangapuram (~12 km), Appalayagunta (~16 km)
 * - Srikalahasti (~38 km), Narayanavanam (~45 km), Talakona (~52 km)
 * - Nagalapuram (~65 km), Kanipakam (~70 km), Surutapalli (~73 km), Vellore (~105 km)
 * And explicitly selected planning cities from PRESET_LOCATIONS.
 */
export function isWithinTirupatiRegion(lat: number, lng: number): boolean {
  if (!isValidCoordinates(lat, lng)) return false;
  if (isCoordinateOnTirumalaHill(lat, lng)) return true;
  if (calculateDistance(lat, lng, TIRUPATI_CENTER.lat, TIRUPATI_CENTER.lng) <= 120) return true;

  // Support any preset hub chosen by the user (Bengaluru, Chennai, Hyderabad, etc.)
  return PRESET_LOCATIONS.some(preset => 
    calculateDistance(lat, lng, preset.coords.lat, preset.coords.lng) <= 25
  );
}

/**
 * Resolves an intelligent, human-readable region or hub name from GPS coordinates.
 * Avoids blind binary 'Tirupati'/'Tirumala' labeling by matching against known pilgrimage
 * and transit hubs.
 */
export function resolveLocationName(lat: number, lng: number, fallbackCity?: string): string {
  if (!isValidCoordinates(lat, lng)) {
    return fallbackCity || 'Tirupati';
  }

  // 1. Direct hill check
  if (isCoordinateOnTirumalaHill(lat, lng)) {
    return 'Tirumala';
  }

  // 2. Direct Alipiri check (within 1.8 km of Alipiri Gate / foothills)
  if (calculateDistance(lat, lng, ALIPIRI_GATE.lat, ALIPIRI_GATE.lng) <= 1.8) {
    return 'Alipiri';
  }

  // 3. Check closest preset location
  let closestPreset: LocationOption | null = null;
  let minDistance = Infinity;

  for (const preset of PRESET_LOCATIONS) {
    const dist = calculateDistance(lat, lng, preset.coords.lat, preset.coords.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestPreset = preset;
    }
  }

  // If within 35 km of a specific known hub or city (Tirupati, Renigunta, Chandragiri, Chennai, Bengaluru, Hyderabad, etc.)
  if (closestPreset && minDistance <= 35) {
    return closestPreset.shortName;
  }

  // Use reverse-geocoded or IP city name if provided
  if (fallbackCity && fallbackCity.trim().length > 0) {
    return fallbackCity.trim();
  }

  // If near a regional preset (within 60 km)
  if (closestPreset && minDistance <= 60) {
    return closestPreset.shortName;
  }

  // Default to Tirupati if within local 45 km radius
  if (calculateDistance(lat, lng, TIRUPATI_CENTER.lat, TIRUPATI_CENTER.lng) <= 45) {
    return 'Tirupati';
  }

  return closestPreset ? closestPreset.shortName : 'Tirupati';
}


/**
 * Calculates a realistic driving distance by applying origin-aware road routing factors.
 * - Handles Tirupati Foothill <-> Tirumala Hill Ghat Road (~22-25 km via Alipiri Gate)
 * - Handles local Tirumala hill routes (~0.1 km - 5 km)
 * - Handles local Tirupati town and regional highway routes
 */
export function calculateDrivingDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  isTirumalaSpot: boolean = false
): number {
  if (!isValidCoordinates(lat1, lon1) || !isValidCoordinates(lat2, lon2)) {
    return 0;
  }

  const rawDist = calculateDistance(lat1, lon1, lat2, lon2);
  if (rawDist <= 0) return 0;

  // Determine if origin & destination are on Tirumala hill
  const isOriginOnHill = isCoordinateOnTirumalaHill(lat1, lon1);
  const isDestOnHill = isTirumalaSpot || isCoordinateOnTirumalaHill(lat2, lon2);

  // ── CASE 1: Both Origin & Destination are on Tirumala Hill ──
  if (isOriginOnHill && isDestOnHill) {
    // Local hill travel along winding mountain roads / footpaths
    const hillFactor = rawDist < 0.5 ? 1.15 : (rawDist < 1.5 ? 1.30 : 1.45);
    const dist = rawDist * hillFactor;
    return Number((dist < 1 ? Math.max(0.01, dist) : dist).toFixed(dist < 10 ? 2 : 1));
  }

  // ── CASE 2: Origin is Plains & Destination is Tirumala Hill ──
  if (!isOriginOnHill && isDestOnHill) {
    // Step 1: Drive from Origin in plains to Alipiri Toll Gate
    const rawAlipiri = calculateDistance(lat1, lon1, ALIPIRI_GATE.lat, ALIPIRI_GATE.lng);
    const distToAlipiri = rawAlipiri < 0.4 ? 0 : rawAlipiri * (rawAlipiri < 5 ? 1.25 : 1.15);
    // Step 2: Up-Ghat Road from Alipiri Gate to Tirumala Center (~18.5 km)
    const ghatRoadKm = 18.5;
    // Step 3: Local hill road from Tirumala Center to destination landmark
    const localHillRaw = calculateDistance(TIRUMALA_CENTER.lat, TIRUMALA_CENTER.lng, lat2, lon2);
    const localHillDist = localHillRaw > 0.2 ? localHillRaw * (lat2 > 13.685 ? 1.5 : 1.25) : 0;

    const totalDistance = distToAlipiri + ghatRoadKm + localHillDist;
    return Number(totalDistance.toFixed(1));
  }

  // ── CASE 3: Origin is Tirumala Hill & Destination is Plains ──
  if (isOriginOnHill && !isDestOnHill) {
    // Step 1: Local hill road from Origin on hill to Tirumala Center
    const localHillRaw = calculateDistance(lat1, lon1, TIRUMALA_CENTER.lat, TIRUMALA_CENTER.lng);
    const localHillDist = localHillRaw > 0.2 ? localHillRaw * (lat1 > 13.685 ? 1.5 : 1.25) : 0;
    // Step 2: Down-Ghat Road from Tirumala Center to Alipiri Gate (~19.5 km)
    const ghatRoadKm = 19.5;
    // Step 3: Drive from Alipiri Gate to destination in plains
    const rawAlipiri = calculateDistance(ALIPIRI_GATE.lat, ALIPIRI_GATE.lng, lat2, lon2);
    const distFromAlipiri = rawAlipiri < 0.4 ? 0 : rawAlipiri * (rawAlipiri < 5 ? 1.25 : 1.15);

    const totalDistance = localHillDist + ghatRoadKm + distFromAlipiri;
    return Number(totalDistance.toFixed(1));
  }

  // ── CASE 4: Both Origin & Destination are in Plains (Tirupati, Renigunta, Chandragiri, Srikalahasti, etc.) ──
  let factor = 1.12;
  if (rawDist < 0.5) {
    factor = 1.15; // Immediate walking/street access
  } else if (rawDist < 3.0) {
    factor = 1.25; // City street grid & turns
  } else if (rawDist < 12.0) {
    factor = 1.20; // Arterial town roads
  } else if (rawDist < 40.0) {
    factor = 1.16; // State highways
  }

  const dist = rawDist * factor;
  return Number((dist < 1 ? Math.max(0.01, dist) : dist).toFixed(dist < 10 ? 2 : 1));
}

/**
 * Formats a distance in kilometers into a clean, human-readable string.
 * - Under 1 km: Displays in meters, e.g. "80 m", "250 m", "800 m" (Telugu: "80 మీ.", "250 మీ.")
 * - 1 to 10 km: Displays 1 decimal place, e.g. "1.2 km", "5.4 km" (Telugu: "1.2 కి.మీ")
 * - Over 10 km: Displays rounded integer, e.g. "18 km", "135 km" (Telugu: "18 కి.మీ")
 */
export function formatDistance(distanceKm: number, lang: string = 'en'): string {
  if (distanceKm === undefined || distanceKm === null || isNaN(distanceKm) || distanceKm <= 0) {
    return lang === 'te' ? 'సమీపంలో' : 'Nearby';
  }

  if (distanceKm < 1) {
    const meters = Math.max(10, Math.round(distanceKm * 1000));
    return lang === 'te' ? `${meters} మీ.` : `${meters} m`;
  }

  if (distanceKm < 10) {
    return lang === 'te' ? `${distanceKm.toFixed(1)} కి.మీ` : `${distanceKm.toFixed(1)} km`;
  }

  const rounded = Math.round(distanceKm);
  return lang === 'te' ? `${rounded} కి.మీ` : `${rounded} km`;
}

/**
 * OSRM Real Road Distance Helper:
 * Fetches real driving distance (in km) and travel duration (in mins) via OpenStreetMap OSRM routing API.
 */
export async function getOsrmRoadRoute(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): Promise<{ distanceKm: number; durationMins: number; source: 'osrm' | 'fallback' }> {
  if (!isValidCoordinates(lat1, lon1) || !isValidCoordinates(lat2, lon2)) {
    return { distanceKm: 0, durationMins: 0, source: 'fallback' };
  }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
    const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      if (data?.routes?.[0]) {
        const route = data.routes[0];
        const distanceKm = Number((route.distance / 1000).toFixed(1));
        const durationMins = Math.max(1, Math.round(route.duration / 60));
        return { distanceKm, durationMins, source: 'osrm' };
      }
    }
  } catch (_e) {
    // Fallback if offline or timeout
  }

  const fallbackDist = calculateDrivingDistance(lat1, lon1, lat2, lon2);
  const fallbackTime = estimateDriveDuration(fallbackDist);
  return { distanceKm: fallbackDist, durationMins: fallbackTime, source: 'fallback' };
}

/**
 * Intelligent Drive Duration Estimator
 * Models city traffic (30 km/h), suburban transitions (40 km/h), regional highways (50-60 km/h), and Ghat roads.
 */
export function estimateDriveDuration(distanceKm: number, isTirumalaRoute: boolean = false): number {
  if (!distanceKm || isNaN(distanceKm) || distanceKm <= 0) return 0;

  if (isTirumalaRoute) {
    return Math.max(5, Math.round(distanceKm * 2.1));
  }
  if (distanceKm <= 5) {
    return Math.max(2, Math.round(distanceKm * 2.0)); // City streets
  }
  if (distanceKm <= 20) {
    return Math.max(5, Math.round(5 * 2.0 + (distanceKm - 5) * 1.5)); // Arterial roads
  }
  // Regional state/national highways for distant kshetras (Nagalapuram, Penchalakona, Kanipakam, Bengaluru)
  return Math.max(15, Math.round(5 * 2.0 + 15 * 1.5 + (distanceKm - 20) * 1.15));
}

/**
 * Formats minutes cleanly into hours and minutes (e.g. 1 hr 15 mins, 45 mins, 2 hrs)
 */
export function formatTravelTime(minutes: number, lang: string = 'en'): string {
  if (!minutes || isNaN(minutes) || minutes <= 0) {
    return lang === 'te' ? 'సమీపంలో' : 'Nearby';
  }

  let mins = Math.max(1, Math.round(minutes));
  if (mins >= 30) {
    mins = Math.round(mins / 5) * 5;
  }
  if (mins < 60) {
    return lang === 'te' ? `${mins} ని.` : `${mins} mins`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (remainingMins === 0) {
    if (lang === 'te') {
      return `${hours} గం.`;
    }
    return hours === 1 ? '1 hr' : `${hours} hrs`;
  }
  if (lang === 'te') {
    return `${hours} గం. ${remainingMins} ని.`;
  }
  return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMins} mins`;
}


