const CACHE_NAME = 'wordcloud-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/script.js',
  '/styles.css',
  '/manifest.json',
  '/bg.mp4',
  '/fonts/rawline-100.ttf',
  '/fonts/rawline-200.ttf',
  '/fonts/rawline-300.ttf',
  '/fonts/rawline-400.ttf',
  '/fonts/rawline-500.ttf',
  '/fonts/rawline-600.ttf',
  '/fonts/rawline-700.ttf',
  '/fonts/rawline-800.ttf',
  '/fonts/rawline-900.ttf',
  // Adicione outros arquivos de fontes se necessário
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
}); 