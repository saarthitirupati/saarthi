export async function safeFetchJson<T = any>(input: RequestInfo | URL, init?: RequestInit): Promise<T | null> {
  try {
    let urlString = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;
    
    // Dynamically prepend NEXT_PUBLIC_API_URL if configured in environment
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '') : '';
    if (baseUrl && urlString.startsWith('/')) {
      urlString = `${baseUrl}${urlString}`;
    }

    const mergedHeaders = {
      'ngrok-skip-browser-warning': 'true',
      ...(init?.headers || {})
    };
    const res = await fetch(urlString, { ...init, headers: mergedHeaders });
    if (!res.ok) {
      console.warn(`safeFetchJson: Request to ${urlString} returned status ${res.status}`);
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
    console.warn(`safeFetchJson: Non-JSON response received from ${urlString}`);
    return null;
  } catch (e) {
    console.error(`safeFetchJson error fetching ${input}:`, e);
    return null;
  }
}
