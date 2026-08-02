import { NextResponse } from 'next/server';
import { fetchLivePlaces } from '@/lib/placesSync';
import { calculateDrivingDistance, TIRUPATI_CENTER } from '@/utils/location';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userLat = parseFloat(searchParams.get('lat') || '') || TIRUPATI_CENTER.lat;
    const userLng = parseFloat(searchParams.get('lng') || '') || TIRUPATI_CENTER.lng;
    const category = searchParams.get('category') || undefined;

    // 1. Fetch live places from DB
    const livePlaces = await fetchLivePlaces();

    // 2. Filter category if specified
    const filtered = livePlaces.filter(p => {
      if ((p as any).status === 'deleted' || (p as any).is_deleted) return false;
      if (!category || category === 'all') return true;
      return p.category.toLowerCase().includes(category.toLowerCase()) || p.placeType === category;
    });

    // 3. Compute dynamic distance and travel time relative to user GPS
    const evaluated = filtered.map(place => {
      const targetLat = place.coordinates?.lat || (place as any).latitude || TIRUPATI_CENTER.lat;
      const targetLng = place.coordinates?.lng || (place as any).longitude || TIRUPATI_CENTER.lng;

      const locLower = (place.location || '').toLowerCase();
      const isTirumala = locLower.includes('tirumala') || locLower.includes('narayanagiri') || place.id === 'venkateswara';

      const distKm = calculateDrivingDistance(userLat, userLng, targetLat, targetLng, isTirumala);
      const walkMins = Math.max(3, Math.round(distKm * 14));
      const bikeMins = Math.max(2, Math.round(distKm * 2.2));
      const busMins = Math.max(3, Math.round(distKm * 3.1));

      return {
        id: place.id,
        name: place.name,
        category: place.category,
        placeType: place.placeType,
        location: place.location,
        rating: place.rating,
        image: place.image,
        coordinates: { lat: targetLat, lng: targetLng },
        distanceKm: distKm,
        distanceStr: `${distKm.toFixed(1)} km`,
        travelTimeStr: `${bikeMins} mins`,
        transitModes: {
          walk: `${distKm <= 1.5 ? `${distKm.toFixed(1)} km • ${walkMins} mins • Walk` : `${distKm.toFixed(1)} km • Walk not recommended`}`,
          bike: `${distKm.toFixed(1)} km • ${bikeMins} mins • Bike`,
          bus: `${distKm.toFixed(1)} km • ${busMins} mins • Bus/Car`
        }
      };
    });

    // 4. Sort strictly nearest to farthest
    evaluated.sort((a, b) => a.distanceKm - b.distanceKm);

    return NextResponse.json({
      success: true,
      totalCount: evaluated.length,
      userLocation: { lat: userLat, lng: userLng },
      places: evaluated
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch explore context'
    }, { status: 500 });
  }
}
