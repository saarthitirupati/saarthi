// Saarthi Guide Service Worker v1
// Caches app shell & visited pages for full offline support on Tirumala hill

const CACHE_NAME = 'saarthi-v6';
const APP_SHELL = [
  '/',
  '/explore',
  '/essentials',
  '/offline-maps',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/banner/banner_poster.webp',
  '/banner/hero_banner_compressed.mp4',
  '/banner/saarthi-splashscreen.mp4',
  '/audio/saarthi-opening-ident.wav',
  '/audio/saarthi-courtyard-ambient.wav',
  '/audio/japa-ambient-loop.wav',
  '/audio/bead-complete.wav',
  '/audio/reflection-end.wav',
  '/audio/milestone-quarter.wav',
  '/audio/japa-complete-108.wav',
  '/audio/saarthi-divine-journey.wav',
  '/audio/veena-pluck.wav',
  '/audio/mala-completion.wav',
];

// Helper to serve HTTP 206 Partial Content for cached offline video streams
async function handleMediaRangeRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = (await cache.match(request)) || (await cache.match('/banner/hero_banner_compressed.mp4'));
  
  if (!cachedResponse) {
    try {
      const netRes = await fetch(request);
      if (netRes && netRes.status === 200) {
        const clone = netRes.clone();
        cache.put(request, clone);
      }
      return netRes;
    } catch (e) {
      return new Response(null, { status: 504, statusText: 'Offline Video Not Cached' });
    }
  }

  const rangeHeader = request.headers.get('Range');
  if (!rangeHeader) {
    return cachedResponse;
  }

  const arrayBuffer = await cachedResponse.arrayBuffer();
  const totalSize = arrayBuffer.byteLength;
  
  const parts = rangeHeader.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10) || 0;
  const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

  if (start >= totalSize || end >= totalSize) {
    return new Response('', {
      status: 416,
      headers: { 'Content-Range': `bytes */${totalSize}` }
    });
  }

  const sliced = arrayBuffer.slice(start, end + 1);
  return new Response(sliced, {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Range': `bytes ${start}-${end}/${totalSize}`,
      'Content-Length': `${sliced.byteLength}`,
      'Accept-Ranges': 'bytes'
    }
  });
}

// Install: pre-cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL).catch(() => {
        // Silently skip if any shell resource fails (e.g. offline during install)
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for navigations & API, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Special handler for hero video stream (support offline HTTP 206 Range requests)
  if (url.pathname.includes('/banner/hero_banner_compressed.mp4') || (url.pathname.endsWith('.mp4') && url.pathname.includes('/banner/'))) {
    event.respondWith(handleMediaRangeRequest(request));
    return;
  }

  // Skip non-GET, chrome-extension, admin routes, analytics, and other video streams
  if (
    request.method !== 'GET' ||
    url.protocol === 'chrome-extension:' ||
    url.pathname.startsWith('/saarthiadmin') ||
    url.pathname.startsWith('/api/v1/analytics') ||
    url.pathname.startsWith('/api/admin') ||
    url.pathname.match(/\.(mp4|webm|ogv|mov)$/i)
  ) {
    return;
  }

  // API calls: network-only, no caching (darshan times, live data must be fresh)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Static assets (_next/static, images, fonts): cache-first
  if (
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/maps/') ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|woff2?|ttf|css|js)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => {
          // NEVER return HTML for JS or CSS chunk failures!
          return new Response(null, { status: 404, statusText: 'Chunk Not Found' });
        });
      })
    );
    return;
  }

  // HTML page navigations: network-first, fallback to cache
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => cached || caches.match('/'));
        })
    );
    return;
  }

  // Everything else: stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});

// ── Push Notifications ──────────────────────────────────────────────────────

self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const payload = event.data.json();
    const options = {
      body: payload.body || '',
      icon: payload.icon || '/icon-192.png',
      badge: '/icon-192.png',
      tag: payload.tag || 'saarthi-alert',
      data: { url: payload.url || '/' },
      vibrate: [200, 100, 200],
      requireInteraction: true,
    };
    event.waitUntil(self.registration.showNotification(payload.title || 'Saarthi', options));
  } catch (e) {
    // If not JSON, show raw text
    const text = event.data.text();
    event.waitUntil(self.registration.showNotification('Saarthi', { body: text, icon: '/icon-192.png' }));
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Otherwise open new window
      return self.clients.openWindow(url);
    })
  );
});
