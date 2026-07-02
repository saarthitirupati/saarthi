import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PLACES } from '@/data/places';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { data, error } = await supabase.from('places').select('*').eq('id', id).single();
    if (!error && data) {
      return NextResponse.json({ place: data });
    }
  } catch (err) {
    console.error('Failed to fetch place from Supabase:', err);
  }

  // Fallback to static places
  const staticPlace = PLACES.find(p => p.id === id);
  if (staticPlace) {
    return NextResponse.json({ place: { ...staticPlace, _dynamic: true } });
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  try {
    // Map body fields to fit Supabase update payload
    const updates = {
      name: body.name,
      category: body.category,
      placeType: body.placeType,
      location: body.location,
      distanceKms: body.distanceKms !== undefined ? Number(body.distanceKms) : undefined,
      durationMins: body.durationMins !== undefined ? Number(body.durationMins) : undefined,
      budgetLevel: body.budgetLevel,
      entryFeeNum: body.entryFeeNum !== undefined ? Number(body.entryFeeNum) : undefined,
      interests: body.interests,
      openFrom: body.openFrom !== undefined ? Number(body.openFrom) : undefined,
      openTo: body.openTo !== undefined ? Number(body.openTo) : undefined,
      isMustVisit: body.isMustVisit !== undefined ? !!body.isMustVisit : undefined,
      description: body.description,
      descriptionTe: body.descriptionTe,
      history: body.history,
      historyTe: body.historyTe,
      timings: body.timings,
      entryFee: body.entryFee,
      address: body.address,
      rating: body.rating !== undefined ? Number(body.rating) : undefined,
      reviewCount: body.reviewCount !== undefined ? Number(body.reviewCount) : undefined,
      image: body.image,
      images: body.images,
      coordinates: body.coordinates,
      tags: body.tags,
      bestTime: body.bestTime,
      spiritualInfo: body.spiritualInfo,
      practicalInfo: body.practicalInfo,
      videoUrl: body.videoUrl,
      // Sprint 1 columns
      architecture: body.architecture,
      importance: body.importance,
      deity: body.deity,
      deityType: body.deityType,
      builtBy: body.builtBy,
      keyPoojas: body.keyPoojas,
      breakTimings: body.breakTimings,
      isHiddenGem: body.isHiddenGem !== undefined ? !!body.isHiddenGem : undefined,
      rituals: body.rituals,
      facilities: body.facilities,
      difficulty: body.difficulty,
      bestSeason: body.bestSeason,
      relatedPlaces: body.relatedPlaces,
      nearbyTemples: body.nearbyTemples
    };

    // Filter undefined values
    const cleanUpdates: any = {};
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined) cleanUpdates[k] = v;
    }

    const { data, error } = await supabase.from('places').update(cleanUpdates).eq('id', id).select();
    if (error) throw error;

    return NextResponse.json({ place: data[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { error } = await supabase.from('places').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
