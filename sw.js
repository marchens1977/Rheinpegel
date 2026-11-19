// Service Worker = kleiner Helfer im Browser, der die App-Dateien speichert,
// damit die App installierbar ist, ohne Netz startet und Updates erkennt.
//
// WICHTIG: Bei JEDER Änderung an index.html, manifest.webmanifest oder icons/
// die VERSION unten erhöhen! Nur dann bekommen die Handys das Update.
const VERSION = '2';
const CACHE = 'rheinpegel-v' + VERSION;
const APP_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1'
];

// Neue Version herunterladen (am Browser-Zwischenspeicher vorbei, damit es wirklich die neueste ist).
// Sie wird erst aktiv, wenn die App das Signal SKIP_WAITING schickt (Update installieren).
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(APP_FILES.map(url => new Request(url, { cache: 'reload' }))))
  );
});

// Alte Versionen aufräumen.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('rheinpegel-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') self.skipWaiting();
  if (data.type === 'GET_VERSION' && event.ports[0]) event.ports[0].postMessage({ version: VERSION });
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Pegeldaten immer live holen (nie speichern).
  if (event.request.method !== 'GET' || url.hostname === 'pegelonline.wsv.de') return;
  // App-Dateien aus dem Speicher dieser Version, sonst aus dem Netz.
  event.respondWith(
    caches.open(CACHE)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(cached => cached || fetch(event.request))
  );
});
