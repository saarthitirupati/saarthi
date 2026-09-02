import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface CachedFuelData {
  timestamp: number;
  rates: {
    petrol: number;
    diesel: number;
    cng: number;
    evKwh: number;
  };
  district: string;
  source: string;
}

// 12-hour server memory cache
let cachedFuel: CachedFuelData | null = null;
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

const FALLBACK_RATES = {
  petrol: 108.49,
  diesel: 100.28,
  cng: 88.50,
  evKwh: 8.50
};

export async function GET() {
  const now = Date.now();

  // Return cached rates if fresh
  if (cachedFuel && now - cachedFuel.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({
      success: true,
      cached: true,
      data: cachedFuel
    });
  }

  const apiKey = process.env.INDIANAPI_FUEL_KEY || 'sk-live-KDF1N9oWAXvWStmhN3li9IlFHjNzs725LYvgBNrl';

  try {
    const headers = { 'x-api-key': apiKey };

    // Fetch live Petrol & Diesel in parallel
    const [petrolRes, dieselRes] = await Promise.all([
      fetch('https://fuel.indianapi.in/live_fuel_price?fuel_type=petrol&location_type=city', {
        headers,
        next: { revalidate: 43200 }
      }),
      fetch('https://fuel.indianapi.in/live_fuel_price?fuel_type=diesel&location_type=city', {
        headers,
        next: { revalidate: 43200 }
      })
    ]);

    let petrolPrice = FALLBACK_RATES.petrol;
    let dieselPrice = FALLBACK_RATES.diesel;

    if (petrolRes.ok) {
      const petrolData = await petrolRes.json();
      if (Array.isArray(petrolData)) {
        const match = petrolData.find(item => /chittoor|tirupati/i.test(item.city)) ||
                      petrolData.find(item => /andhra/i.test(item.city));
        if (match && match.price) {
          const parsed = parseFloat(match.price);
          if (!isNaN(parsed) && parsed > 50) petrolPrice = parsed;
        }
      }
    }

    if (dieselRes.ok) {
      const dieselData = await dieselRes.json();
      if (Array.isArray(dieselData)) {
        const match = dieselData.find(item => /chittoor|tirupati/i.test(item.city)) ||
                      dieselData.find(item => /andhra/i.test(item.city));
        if (match && match.price) {
          const parsed = parseFloat(match.price);
          if (!isNaN(parsed) && parsed > 40) dieselPrice = parsed;
        }
      }
    }

    const payload: CachedFuelData = {
      timestamp: now,
      rates: {
        petrol: petrolPrice,
        diesel: dieselPrice,
        cng: FALLBACK_RATES.cng,
        evKwh: FALLBACK_RATES.evKwh
      },
      district: 'Tirupati / Chittoor District',
      source: 'IndianAPI (Live)'
    };

    cachedFuel = payload;

    return NextResponse.json({
      success: true,
      cached: false,
      data: payload
    });
  } catch (error) {
    console.error('Fuel API error, using regional defaults:', error);
    
    // Return resilient fallback if upstream network fails
    const fallbackPayload: CachedFuelData = {
      timestamp: now,
      rates: FALLBACK_RATES,
      district: 'Tirupati (Regional Benchmark)',
      source: 'Fallback Benchmark'
    };

    return NextResponse.json({
      success: true,
      cached: false,
      fallback: true,
      data: fallbackPayload
    });
  }
}
