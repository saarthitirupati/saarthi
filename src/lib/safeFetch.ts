import { PLACES } from '@/data/places';

function cleanCacheKey(url: string): string {
  try {
    const parsed = new URL(url, 'https://dummy.local');
    parsed.searchParams.delete('t');
    parsed.searchParams.delete('_');
    return `saarthi_cache:${parsed.pathname}${parsed.search}`;
  } catch {
    return `saarthi_cache:${url.replace(/[?&]t=\d+/, '')}`;
  }
}

function getOfflineFallback<T>(cacheKey: string, urlString: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch {
    // Ignore read errors
  }

  // Built-in static fallback for places data if user launches offline
  if (urlString.includes('/api/v1/places')) {
    return {
      success: true,
      data: PLACES,
      deletedSlugs: []
    } as any as T;
  }

  return null;
}

export async function safeFetchJson<T = any>(input: RequestInfo | URL, init?: RequestInit): Promise<T | null> {
  const isServer = typeof window === 'undefined';
  let urlString = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;
  const method = (init?.method || 'GET').toUpperCase();
  const isGet = method === 'GET';
  const cacheKey = cleanCacheKey(urlString);

  try {
    // In browser client, relative URLs like '/api/v1/status' use same-origin fetch.
    // Prepend NEXT_PUBLIC_API_URL only when running server-side or when NEXT_PUBLIC_API_URL points to absolute custom host.
    const envApiUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '') : '';
    if (isServer && envApiUrl && urlString.startsWith('/')) {
      urlString = `${envApiUrl}${urlString}`;
    }

    const mergedHeaders = {
      'ngrok-skip-browser-warning': 'true',
      ...(init?.headers || {})
    };

    const res = await fetch(urlString, { credentials: 'include', ...init, headers: mergedHeaders });
    if (!res.ok) {
      console.warn(`safeFetchJson: Request to ${urlString} returned status ${res.status}`);
      if (!isServer && isGet) {
        return getOfflineFallback<T>(cacheKey, urlString);
      }
      return null;
    }

    let parsedData: any = null;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      parsedData = await res.json();
    } else {
      const text = await res.text();
      if (text && (text.trim().startsWith('{') || text.trim().startsWith('['))) {
        parsedData = JSON.parse(text);
      }
    }

    if (parsedData !== null) {
      if (!isServer && isGet) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(parsedData));
        } catch {
          // Ignore localStorage quota errors
        }
      }
      return parsedData;
    }

    console.warn(`safeFetchJson: Non-JSON response received from ${urlString}`);
    if (!isServer && isGet) {
      return getOfflineFallback<T>(cacheKey, urlString);
    }
    return null;
  } catch (e) {
    console.warn(`safeFetchJson offline/network fallback for ${urlString}:`, (e as any)?.message || e);
    if (!isServer && isGet) {
      return getOfflineFallback<T>(cacheKey, urlString);
    }
    return null;
  }
}

