import { NextResponse } from 'next/server';
import { updatePlace, deletePlace, readDynamicPlaces } from '@/lib/adminDb';
import { PLACES } from '@/data/places';
import { client } from '@/sanity/lib/client';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const isSanityConfigured = 
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && 
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'your-project-id';

  if (isSanityConfigured) {
    try {
      const sanityPlace = await client.fetch(
        `*[_type == "place" && (_id == $id || _id == $placeId)][0] {
          _id,
          name,
          category,
          placeType,
          location,
          distanceKms,
          durationMins,
          budgetLevel,
          entryFeeNum,
          interests,
          openFrom,
          openTo,
          isMustVisit,
          description,
          descriptionTe,
          history,
          historyTe,
          timings,
          entryFee,
          address,
          rating,
          reviewCount,
          "image": image.asset->url,
          coordinates,
          tags,
          bestTime,
          spiritualInfo,
          practicalInfo,
          videoUrl
        }`,
        { id, placeId: `place-${id}` }
      );
      if (sanityPlace) {
        return NextResponse.json({
          place: {
            ...sanityPlace,
            id: sanityPlace._id.startsWith('place-') ? sanityPlace._id.replace('place-', '') : sanityPlace._id,
            image: sanityPlace.image || '/assets/placeholder.png',
            travelEstimates: sanityPlace.travelEstimates || {}
          }
        });
      }
    } catch (err) {
      console.error('Failed to fetch place from Sanity:', err);
    }
  }

  const dynamicPlaces = readDynamicPlaces();
  let place = dynamicPlaces.find(p => p.id === id);
  
  if (!place) {
    const staticPlace = PLACES.find(p => p.id === id);
    if (staticPlace) {
      place = { ...staticPlace, _dynamic: true, _createdAt: new Date().toISOString() } as any;
    }
  }

  if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ place });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const isSanityConfigured = 
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && 
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'your-project-id' &&
    process.env.SANITY_API_TOKEN;

  if (isSanityConfigured) {
    try {
      const { createClient } = require('next-sanity');
      const writeClient = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        apiVersion: '2023-05-03',
        useCdn: false,
        token: process.env.SANITY_API_TOKEN
      });

      const docId = id.startsWith('place-') ? id : `place-${id}`;
      const existing = await client.fetch(`*[_type == "place" && _id == $docId][0]`, { docId });

      if (existing) {
        const updatedDoc = {
          ...existing,
          name: body.name ?? existing.name,
          category: body.category ?? existing.category,
          placeType: body.placeType ?? existing.placeType,
          location: body.location ?? existing.location,
          distanceKms: body.distanceKms !== undefined ? Number(body.distanceKms) : existing.distanceKms,
          durationMins: body.durationMins !== undefined ? Number(body.durationMins) : existing.durationMins,
          budgetLevel: body.budgetLevel ?? existing.budgetLevel,
          entryFeeNum: body.entryFeeNum !== undefined ? Number(body.entryFeeNum) : existing.entryFeeNum,
          interests: body.interests ?? existing.interests,
          openFrom: body.openFrom !== undefined ? Number(body.openFrom) : existing.openFrom,
          openTo: body.openTo !== undefined ? Number(body.openTo) : existing.openTo,
          isMustVisit: body.isMustVisit !== undefined ? !!body.isMustVisit : existing.isMustVisit,
          description: body.description ?? existing.description,
          descriptionTe: body.descriptionTe ?? existing.descriptionTe,
          history: body.history ?? existing.history,
          historyTe: body.historyTe ?? existing.historyTe,
          timings: body.timings ?? existing.timings,
          entryFee: body.entryFee ?? existing.entryFee,
          address: body.address ?? existing.address,
          rating: body.rating !== undefined ? Number(body.rating) : existing.rating,
          reviewCount: body.reviewCount !== undefined ? Number(body.reviewCount) : existing.reviewCount,
          coordinates: body.coordinates ?? existing.coordinates,
          tags: body.tags ?? existing.tags,
          bestTime: body.bestTime ?? existing.bestTime,
          spiritualInfo: body.spiritualInfo ?? existing.spiritualInfo,
          practicalInfo: body.practicalInfo ?? existing.practicalInfo,
          videoUrl: body.videoUrl ?? existing.videoUrl
        };

        await writeClient.createOrReplace(updatedDoc);
        return NextResponse.json({ place: { ...updatedDoc, id } });
      }
    } catch (err) {
      console.error('Failed to update in Sanity:', err);
    }
  }

  const updated = updatePlace(id, body);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ place: updated });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const isSanityConfigured = 
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && 
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'your-project-id' &&
    process.env.SANITY_API_TOKEN;

  if (isSanityConfigured) {
    try {
      const { createClient } = require('next-sanity');
      const writeClient = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        apiVersion: '2023-05-03',
        useCdn: false,
        token: process.env.SANITY_API_TOKEN
      });
      const docId = id.startsWith('place-') ? id : `place-${id}`;
      await writeClient.delete(docId);
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error('Failed to delete in Sanity:', err);
    }
  }

  const ok = deletePlace(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
