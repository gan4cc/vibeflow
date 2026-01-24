const CACHE_NAME = 'vibeflow-v1.3';
const ASSETS = [
  './',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'icon-512.png',
  'sounds/bird-tweet.ogg',
  'sounds/body_and_mind_harmony.ogg',
  'sounds/cyberpunk_relax.ogg',
  'sounds/peaceful_water_sounds.ogg'
];

// Установка: кешируем все файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Работа в офлайне: отдаем файлы из кеша
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});