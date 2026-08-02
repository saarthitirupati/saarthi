/**
 * Alerts Service
 */

export async function fetchAlerts() {
  const res = await fetch('/api/v1/alerts'); // Adjust this to your actual endpoint
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}
