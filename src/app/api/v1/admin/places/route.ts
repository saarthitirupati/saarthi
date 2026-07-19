import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

  // Return empty array if Supabase fails or is empty
  return NextResponse.json({ places: [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) body.id = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    if (!body.practicalInfo) body.practicalInfo = { dressCode: 'Casual', food: 'Nearby', parking: 'Available' };

    // Fetch schema columns to prevent database mismatches
    const { data: schemaRow } = await supabase.from('places').select('*').limit(1);
    const validKeys = schemaRow && schemaRow.length > 0 ? new Set(Object.keys(schemaRow[0])) : null;

    const rawDoc: any = {
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
      image: body.image || '',
      images: body.images || [],
      video: body.video || '',
      coordinates: body.coordinates || { lat: 13.6288, lng: 79.4192 },
      tags: body.tags || [],
      bestTime: body.bestTime || 'Morning',
      spiritualInfo: body.spiritualInfo,
      practicalInfo: body.practicalInfo,
      videoUrl: body.videoUrl,
      // Phase 1 Schema Fields
      shortIntro: body.shortIntro,
      whyVisit: body.whyVisit,
      openingTime: body.openingTime,
      closingTime: body.closingTime,
      duration: body.duration,
      travelByRTC: body.travelByRTC,
      travelByCar: body.travelByCar,
      travelByBike: body.travelByBike,
      approxRTCFare: body.approxRTCFare,
      approxCarCost: body.approxCarCost,
      approxBikeCost: body.approxBikeCost,
      youtubeLink: body.youtubeLink,
      visitorTips: body.visitorTips,
      guideAudio: body.guideAudio,
      // Sprint 1 Schema Fields
      architecture: body.architecture,
      importance: body.importance,
      deity: body.deity,
      deityType: body.deityType,
      breakTimings: body.breakTimings,
      isHiddenGem: body.isHiddenGem !== undefined ? !!body.isHiddenGem : undefined,
      rituals: body.rituals,
      facilities: body.facilities,
      difficulty: body.difficulty,
      bestSeason: body.bestSeason,
      relatedPlaces: body.relatedPlaces,
      nearbyTemples: body.nearbyTemples,
      _dynamic: true
    };

    const doc: any = {};
    for (const [k, v] of Object.entries(rawDoc)) {
      if (v !== undefined && (!validKeys || validKeys.has(k))) {
        doc[k] = v;
      }
    }

    const { data, error } = await supabase.from('places').insert([doc]).select();
    
    if (error) throw error;

    return NextResponse.json({ place: data[0] }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
