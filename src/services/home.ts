/**
 * Home Service
 * Handles API calls related to the home page content (weather, telemetry, daily content).
 */

export async function fetchWeather() {
  const res = await fetch('/api/v1/weather');
  if (!res.ok) throw new Error('Failed to fetch weather');
  return res.json();
}

export async function fetchDailyContent() {
  const res = await fetch('/api/v1/content/daily');
  if (!res.ok) throw new Error('Failed to fetch daily content');
  return res.json();
}

export async function submitTelemetry(event: string, action: string, label?: string, data?: any) {
  try {
    await fetch('/api/v1/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, action, label, ...data }),
    });
  } catch (error) {
    console.error('Telemetry error:', error);
  }
}
