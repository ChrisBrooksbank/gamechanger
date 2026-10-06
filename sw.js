const CACHE = 'gamechanger-v2';
// Every file the page needs to boot offline — including the ES modules it imports
const PRECACHE = [
  '/', '/manifest.json', '/icon-192.png', '/icon-512.png',
  '/spin.js', '/select.js', '/util.js',
];

self.addEventListener('install', e => {
  // cache: 'reload' bypasses the HTTP cache so a new SW never precaches stale files
  e.waitUntil(caches.open(CACHE).then(c =>
    c.addAll(PRECACHE.map(url => new Request(url, { cache: 'reload' })))
  ));
});

self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Cache API only stores GET; leave everything else to the network
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      const cacheable = resp.ok || resp.type === 'opaque';
      if (cacheable && (e.request.url.startsWith('https://fonts.') || e.request.url.startsWith(self.location.origin))) {
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return resp;
    }))
  );
});
