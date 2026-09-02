import { NextResponse } from 'next/server';
import { calculateTripEstimates, FuelRates } from '@/services/decision/trip.estimator';
import { PLACES, Place } from '@/data/places';
import { fetchLivePlaces } from '@/lib/placesSync';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const WELL_KNOWN_HUBS: Record<string, { lat: number; lng: number; name: string }> = {
  'renigunta-junction': { lat: 13.6288, lng: 79.4192, name: 'Tirupati Central / Railway Station' },
  'tirupati-railway-station': { lat: 13.6288, lng: 79.4192, name: 'Tirupati Railway Station' },
  'central-bus-station': { lat: 13.6335, lng: 79.4215, name: 'APSRTC Central Bus Station (CBS)' },
  'alipiri-checkpoint': { lat: 13.6470, lng: 79.4058, name: 'Alipiri Toll Gate / Ghat Road Entry' },
  'alipiri-gateway': { lat: 13.6470, lng: 79.4058, name: 'Alipiri Gateway (Mettu)' },
  'srinivasam': { lat: 13.6320, lng: 79.4225, name: 'Srinivasam Complex (Opp. RTC Bus Stand)' },
  'vishnu-nivasam': { lat: 13.6292, lng: 79.4185, name: 'Vishnu Nivasam (Opp. Railway Station)' },
  'tirupati-airport': { lat: 13.6324, lng: 79.5434, name: 'Tirupati International Airport (TIR)' },
  'tirumala-bus-stand': { lat: 13.6820, lng: 79.3490, name: 'Tirumala CRO / Central Bus Stand' },
};

async function resolveCoordinates(id?: string | null, lat?: number | null, lng?: number | null, fallbackName = 'Tirupati Location') {
  if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
    return { lat, lng, name: fallbackName };
  }

  if (id && WELL_KNOWN_HUBS[id]) {
    return WELL_KNOWN_HUBS[id];
  }

  if (id) {
    const livePlaces = await fetchLivePlaces();
    const found = livePlaces.find(p => p.id === id);
    if (found && found.coordinates) {
      return { lat: found.coordinates.lat, lng: found.coordinates.lng, name: found.name };
    }
    const staticFound = PLACES.find(p => p.id === id);
    if (staticFound && staticFound.coordinates) {
      return { lat: staticFound.coordinates.lat, lng: staticFound.coordinates.lng, name: staticFound.name };
    }
  }

  return { lat: 13.6288, lng: 79.4192, name: fallbackName };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const originId = searchParams.get('originId');
    const destId = searchParams.get('destId');
    const originLat = searchParams.get('originLat') ? Number(searchParams.get('originLat')) : null;
    const originLng = searchParams.get('originLng') ? Number(searchParams.get('originLng')) : null;
    const destLat = searchParams.get('destLat') ? Number(searchParams.get('destLat')) : null;
    const destLng = searchParams.get('destLng') ? Number(searchParams.get('destLng')) : null;
    const passengers = searchParams.get('passengers') ? Number(searchParams.get('passengers')) : 1;
    const isRoundTrip = searchParams.get('roundTrip') === 'true' || searchParams.get('isRoundTrip') === 'true';

    const origin = await resolveCoordinates(originId, originLat, originLng, searchParams.get('originName') || 'Origin');
    const dest = await resolveCoordinates(destId, destLat, destLng, searchParams.get('destName') || 'Srivari Venkateswara Temple');

    // Fetch live fuel prices if available
    const fuelRates: Partial<FuelRates> = {};
    try {
      const { data } = await supabase.from('fuel_prices').select('fuel_type, price');
      if (data && data.length > 0) {
        data.forEach(row => {
          if (row.fuel_type === 'petrol') fuelRates.petrol = Number(row.price);
          if (row.fuel_type === 'diesel') fuelRates.diesel = Number(row.price);
          if (row.fuel_type === 'cng') fuelRates.cng = Number(row.price);
        });
      }
    } catch {}

    const result = await calculateTripEstimates({
      originLat: origin.lat,
      originLng: origin.lng,
      destLat: dest.lat,
      destLng: dest.lng,
      originName: origin.name,
      destName: dest.name,
      passengers,
      isRoundTrip,
      fuelRates
    });

    return NextResponse.json({
      success: true,
      data: result
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      originId,
      destId,
      originLat,
      originLng,
      destLat,
      destLng,
      originName,
      destName,
      passengers = 1,
      isRoundTrip = false,
      customMileage = {},
      fuelRates = {}
    } = body;

    const origin = await resolveCoordinates(originId, originLat, originLng, originName || 'Current Location');
    const dest = await resolveCoordinates(destId, destLat, destLng, destName || 'Destination');

    const result = await calculateTripEstimates({
      originLat: origin.lat,
      originLng: origin.lng,
      destLat: dest.lat,
      destLng: dest.lng,
      originName: origin.name,
      destName: dest.name,
      passengers,
      isRoundTrip,
      customMileage,
      fuelRates
    });

    return NextResponse.json({
      success: true,
      data: result
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
