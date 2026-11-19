// Service Worker = kleiner Helfer im Browser, der die App-Dateien speichert,
// damit die App installierbar ist und auch ohne Netz startet.
// Bei Änderungen an den App-Dateien die Versionsnummer erhöhen.
const CACHE = 'rheinpegel-v1';
const APP_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Pegeldaten immer live holen (nicht speichern).
  if (event.request.method !== 'GET' || url.hostname === 'pegelonline.wsv.de') return;
  // App-Dateien: zuerst Netz (immer neueste Version), ohne Netz aus dem Speicher.
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
