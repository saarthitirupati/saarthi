// Saarthi Guide Service Worker v1
// Caches app shell & visited pages for full offline support on Tirumala hill

const CACHE_NAME = 'saarthi-v12';
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

  // Skip non-GET, chrome-extension, admin routes, analytics, and video streaming files
  // Video files require native HTTP 206 Partial Content range requests which fail when intercepted by SW
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

  // API calls for v1 content/places/status/alerts: network-first with cache fallback for offline usage
  if (url.pathname.startsWith('/api/v1/')) {
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
          return caches.match(request);
        })
    );
    return;
  }

  // Other API calls (admin, auth): bypass cache
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Static assets (_next/static, images, fonts, banner videos, audio): cache-first
  if (
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/banner/') ||
    url.pathname.startsWith('/maps/') ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|woff2?|ttf|css|js|mp4)$/)
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
          return new Response(null, { status: 404, statusText: 'Not Found' });
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
  let title = 'Saarthi Live Alert';
  let body = 'Live Tirumala darshan and temple advisory available.';
  let url = '/alerts';
  let icon = '/icon-192.png';
  let badge = '/icon-96.png';
  let tag = 'saarthi-alert-' + Date.now();

  if (event.data) {
    try {
      const payload = event.data.json();
      if (payload.title) title = payload.title;
      if (payload.body) body = payload.body;
      if (payload.url) url = payload.url;
      if (payload.icon) icon = payload.icon;
      if (payload.badge) badge = payload.badge;
      if (payload.tag) tag = payload.tag;
    } catch (_err) {
      const text = event.data.text();
      if (text) body = text;
    }
  }

  const origin = self.location.origin || 'https://www.saarthiguide.in';
  const iconUrl = icon.startsWith('http') ? icon : new URL(icon, origin).href;
  const badgeUrl = badge.startsWith('http') ? badge : new URL(badge, origin).href;

  const options = {
    body: body,
    icon: iconUrl,
    badge: badgeUrl,
    tag: tag,
    renotify: true,
    data: { url: url },
    vibrate: [200, 100, 200],
    requireInteraction: false,
    silent: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/alerts';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
