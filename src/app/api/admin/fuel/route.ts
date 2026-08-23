import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DEFAULT_FUEL_RATES, FuelRates } from '@/services/decision/trip.estimator';

const inMemoryRates: FuelRates = { ...DEFAULT_FUEL_RATES };

export async function GET() {
  try {
    const { data, error } = await supabase.from('fuel_prices').select('fuel_type, price');
    if (!error && data && data.length > 0) {
      data.forEach(row => {
        if (row.fuel_type === 'petrol') inMemoryRates.petrol = Number(row.price);
        if (row.fuel_type === 'diesel') inMemoryRates.diesel = Number(row.price);
        if (row.fuel_type === 'cng') inMemoryRates.cng = Number(row.price);
      });
    }
  } catch {}

  return NextResponse.json({
    success: true,
    data: inMemoryRates
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { petrol, diesel, cng } = body;

    if (petrol !== undefined && !isNaN(Number(petrol))) inMemoryRates.petrol = Number(petrol);
    if (diesel !== undefined && !isNaN(Number(diesel))) inMemoryRates.diesel = Number(diesel);
    if (cng !== undefined && !isNaN(Number(cng))) inMemoryRates.cng = Number(cng);

    // Save to Supabase fuel_prices table
    try {
      const updates = [
        { fuel_type: 'petrol', price: inMemoryRates.petrol },
        { fuel_type: 'diesel', price: inMemoryRates.diesel },
        { fuel_type: 'cng', price: inMemoryRates.cng }
      ];
      await supabase.from('fuel_prices').upsert(updates, { onConflict: 'fuel_type' });
    } catch {}

    return NextResponse.json({
      success: true,
      data: inMemoryRates,
      message: 'Fuel rates updated live across all trip estimations'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
