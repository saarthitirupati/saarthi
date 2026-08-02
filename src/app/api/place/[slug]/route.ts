import { NextResponse } from 'next/server';
import { fetchLivePlaces } from '@/lib/placesSync';
import { calculateDrivingDistance, TIRUPATI_CENTER } from '@/utils/location';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);

    const userLat = parseFloat(searchParams.get('lat') || '') || TIRUPATI_CENTER.lat;
    const userLng = parseFloat(searchParams.get('lng') || '') || TIRUPATI_CENTER.lng;

    if (!slug) {
      return NextResponse.json({ error: "Slug or Place ID is required" }, { status: 400 });
    }

    const livePlaces = await fetchLivePlaces();
    const place = livePlaces.find(
      p => p.id === slug || (p as any).slug === slug || (p as any).db_id === slug || (p as any).uuid === slug || p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug
    );

    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    const targetLat = place.coordinates?.lat || (place as any).latitude || TIRUPATI_CENTER.lat;
    const targetLng = place.coordinates?.lng || (place as any).longitude || TIRUPATI_CENTER.lng;

    const locLower = (place.location || '').toLowerCase();
    const isTirumala = locLower.includes('tirumala') || locLower.includes('narayanagiri') || place.id === 'venkateswara';

    const distKm = calculateDrivingDistance(userLat, userLng, targetLat, targetLng, isTirumala);
    const bikeMins = Math.max(2, Math.round(distKm * 2.2));
    const carMins = Math.max(3, Math.round(distKm * 2.5));
    const walkMins = Math.max(3, Math.round(distKm * 14));

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLng}`;

    return NextResponse.json({
      success: true,
      data: {
        id: place.id,
        name: place.name,
        slug: (place as any).slug || place.id,
        category: place.category,
        placeType: place.placeType,
        location: place.location,
        description: place.description,
        history: place.history,
        timings: place.timings,
        entryFee: place.entryFee,
        rating: place.rating,
        reviewCount: place.reviewCount,
        image: place.image,
        coordinates: {
          latitude: targetLat,
          longitude: targetLng
        },
        dynamicContext: {
          distanceKm: distKm,
          distanceStr: `${distKm.toFixed(1)} km`,
          travelTimeStr: `${bikeMins} mins`,
          transit: {
            bike: `${bikeMins} mins`,
            car: `${carMins} mins`,
            walk: distKm <= 1.5 ? `${walkMins} mins` : 'Not recommended'
          },
          googleMapsUrl
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching place:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch place" }, { status: 500 });
  }
}
