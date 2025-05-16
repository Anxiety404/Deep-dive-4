const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
    "/",
    "index.html",
    "js/script.js",
    "css/style.css",
    "circle.svg",
    "favicon.ico",
];

const putInCache = async (request, response) => {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response);
};
const networkFirst = async (request) => {
    if (navigator.onLine) {
        try {
            const responseFromNetwork = await fetch(request);
            putInCache(request, responseFromNetwork.clone());
            return responseFromNetwork;
        } catch (e) {
            console.warn("[Service Worker] Network error, falling back to cache");
        }
    }

    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }

    return new Response("Network error happened", {
        status: 408,
        headers: { "Content-Type": "text/plain" },
    });
};

self.addEventListener("fetch", (event) => {
    event.respondWith(networkFirst(event.request));
});

self.addEventListener("install", (event) => {
    const preCache = async () => {
        const cache = await caches.open(CACHE_NAME);
        return cache.addAll(urlsToCache);
    };
    event.waitUntil(preCache());
});
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service worker registered:', reg.scope))
      .catch(err => console.error('Service worker registration failed:', err));
  });
}
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
