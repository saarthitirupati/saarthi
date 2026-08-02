/**
 * Status Service
 */

export async function fetchStatus() {
  const res = await fetch('/api/v1/status'); // Adjust this to your actual endpoint
  if (!res.ok) throw new Error('Failed to fetch status');
  return res.json();
}
