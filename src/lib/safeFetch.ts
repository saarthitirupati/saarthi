export async function safeFetchJson<T = any>(input: RequestInfo | URL, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(input, init);
    if (!res.ok) {
      console.warn(`safeFetchJson: Request to ${input} returned status ${res.status}`);
      return null;
    }
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    const text = await res.text();
    if (text && (text.trim().startsWith('{') || text.trim().startsWith('['))) {
      return JSON.parse(text);
    }
    console.warn(`safeFetchJson: Non-JSON response received from ${input}`);
    return null;
  } catch (e) {
    console.error(`safeFetchJson error fetching ${input}:`, e);
    return null;
  }
}
