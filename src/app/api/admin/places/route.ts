import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PLACES } from '@/data/places';

export async function GET() {
  try {
    const { data, error } = await supabase.from('places').select('*');
    if (error) throw error;
    
    if (data && data.length > 0) {
      return NextResponse.json({ places: data });
    }
  } catch (err) {
    console.error('Failed to fetch places from Supabase:', err);
  }

  // Fallback to static places if Supabase fails or is empty
  return NextResponse.json({ places: PLACES });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) body.id = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    if (!body.practicalInfo) body.practicalInfo = { dressCode: 'Casual', food: 'Nearby', parking: 'Available' };

    const doc = {
      id: body.id,
      name: body.name,
      category: body.category || 'Spiritual',
      placeType: body.placeType || 'spiritual',
      location: body.location || 'Tirupati',
      distanceKms: Number(body.distanceKms) || 0,
      durationMins: Number(body.durationMins) || 60,
      budgetLevel: body.budgetLevel || 'budget',
      entryFeeNum: Number(body.entryFeeNum) || 0,
      interests: body.interests || [],
      openFrom: Number(body.openFrom) || 6,
      openTo: Number(body.openTo) || 21,
      isMustVisit: !!body.isMustVisit,
      description: body.description || '',
      descriptionTe: body.descriptionTe || '',
      history: body.history || '',
      historyTe: body.historyTe || '',
      timings: body.timings || '6:00 AM - 9:00 PM',
      entryFee: body.entryFee || 'Free',
      address: body.address || '',
      rating: Number(body.rating) || 4.5,
      reviewCount: Number(body.reviewCount) || 10,
      coordinates: body.coordinates || { lat: 13.6288, lng: 79.4192 },
      tags: body.tags || [],
      bestTime: body.bestTime || 'Morning',
      spiritualInfo: body.spiritualInfo,
      practicalInfo: body.practicalInfo,
      videoUrl: body.videoUrl,
      _dynamic: true
    };

    const { data, error } = await supabase.from('places').insert([doc]).select();
    
    if (error) throw error;

    return NextResponse.json({ place: data[0] }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
