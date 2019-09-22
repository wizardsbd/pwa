const cacheName = 'tdc-v1';

const staticAssets = [
  './',
  './assets/css/style.css',
  './assets/plugins/font-awesome/css/font-awesome.min.css',
  './assets/plugins/bootstrap/css/bootstrap.min.css',
  './assets/pages/css/animate.css',
  './assets/plugins/fancybox/source/jquery.fancybox.css',
  './assets/plugins/owl.carousel/assets/owl.carousel.css',
  './assets/pages/css/components.css',
  './assets/css/style-responsive.css',
  './assets/css/custom.css',
  './assets/css/custom-responsive.css',
  './assets/plugins/respond.min.js',
  './assets/plugins/jquery.min.js',
  './assets/plugins/jquery-migrate.min.js',
  './assets/plugins/bootstrap/js/bootstrap.min.js',
  './assets/scripts/back-to-top.js',
  './assets/plugins/fancybox/source/jquery.fancybox.pack.js',
  './assets/plugins/owl.carousel/owl.carousel.min.js',
  './assets/js/custom.js',
  './assets/pages/scripts/bs-carousel.js',
];

self.addEventListener('install', async function () {
  const cache = await caches.open(cacheName);
  cache.addAll(staticAssets);
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});



async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}

async function networkFirst(request) {
  const dynamicCache = await caches.open('tdc-news');
  try {
    const networkResponse = await fetch(request);
    dynamicCache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    const cachedResponse = await dynamicCache.match(request);
    return cachedResponse || await caches.match('./fallback.json');
  }
}
