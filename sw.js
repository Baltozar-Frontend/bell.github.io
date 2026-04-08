const CACHE_NAME = 'sofia-clicker-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './index.js',
  './manifest.json',
  './img/mamac sofia.jpg',
  './img/corona.png',
  './img/inventar.jpg',
  './img/image-magazine.png'
];

// Установка и кэширование
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Выдача файлов из кэша без интернета
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
