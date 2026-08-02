/**
 * Places Service
 * Handles fetching place data via Next.js proxy to FastAPI.
 */

export async function fetchPlaces() {
  const res = await fetch('/api/admin/places');
  if (!res.ok) throw new Error('Failed to fetch places');
  return res.json();
}

export async function fetchPlace(id: string) {
  const res = await fetch(`/api/admin/places/${id}`);
  if (!res.ok) throw new Error('Failed to fetch place');
  return res.json();
}
