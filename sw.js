const CACHE_NAME = 'vibeflow-v1';
const ASSETS = [
  'index.html',
  'style.css',
  'script.js',
  'sounds/bird-tweet.mp3',
  'sounds/body_and_mind_harmony.mp3',
  'sounds/cyberpunk_relax.mp3',
  'sounds/peaceful_water_sounds.mp3'
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