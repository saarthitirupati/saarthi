import { NextResponse } from 'next/server';
import { calculateTripEstimates, FuelRates } from '@/services/decision/trip.estimator';
import { PLACES } from '@/data/places';
import { fetchLivePlaces } from '@/lib/placesSync';
import { supabase } from '@/lib/supabase';

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
    const isRoundTrip = searchParams.get('roundTrip') === 'true';

    // Fetch places to resolve IDs
    const livePlaces = await fetchLivePlaces();
    const placesMap = new Map(livePlaces.map(p => [p.id, p]));

    let oLat = originLat || 13.6288;
    let oLng = originLng || 79.4192;
    let oName = searchParams.get('originName') || 'Tirupati Railway Station';

    let dLat = destLat || 13.6780;
    let dLng = destLng || 79.3510;
    let dName = searchParams.get('destName') || 'Srivari Venkateswara Temple';

    if (originId && placesMap.has(originId)) {
      const p = placesMap.get(originId)!;
      if (p.coordinates) {
        oLat = p.coordinates.lat;
        oLng = p.coordinates.lng;
        oName = p.name;
      }
    }

    if (destId && placesMap.has(destId)) {
      const p = placesMap.get(destId)!;
      if (p.coordinates) {
        dLat = p.coordinates.lat;
        dLng = p.coordinates.lng;
        dName = p.name;
      }
    }

    // Fetch live fuel prices from Supabase if available
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
      originLat: oLat,
      originLng: oLng,
      destLat: dLat,
      destLng: dLng,
      originName: oName,
      destName: dName,
      passengers,
      isRoundTrip,
      fuelRates
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      originLat = 13.6288,
      originLng = 79.4192,
      destLat = 13.6780,
      destLng = 79.3510,
      originName = 'Origin',
      destName = 'Destination',
      passengers = 1,
      isRoundTrip = false,
      customMileage = {},
      fuelRates = {}
    } = body;

    const result = await calculateTripEstimates({
      originLat,
      originLng,
      destLat,
      destLng,
      originName,
      destName,
      passengers,
      isRoundTrip,
      customMileage,
      fuelRates
    });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
