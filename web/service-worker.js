var dataUrl = "//ladder.cncnet.org/api/v1/ladder/yr/games/recent/5";
var dataCache = "cncnet-data-v1";
var cacheShell = "cncnet-shell-v1";
var shellFiles = [
    '/',
    '/index.html',
    '/js/app.min.js',
    '/js/material.min.js',
    '/css/app.min.css',
    '/images/icon-192.png',
    '/images/icon-512.png',
    '/images/logo.png',
    '/images/lost.png',
    '/images/won.png',
];

self.addEventListener('install', function(e) 
{
    console.log('ServiceWorker ** Install');
    e.waitUntil
    (
        caches.open(cacheShell).then(function(cache) 
        {
            console.log('ServiceWorker ** Caching app shell');
            return cache.addAll(shellFiles);
        })
    );
});

self.addEventListener('activate', function(e) 
{
    console.log('ServiceWorker ** Activate');
    e.waitUntil
    (
        caches.keys().then(function(keyList) 
        {
            return Promise.all(keyList.map(function(key) 
            {
                if (key !== cacheShell && key !== dataCache) 
                {
                    console.log('ServiceWorker ** Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(e) 
{
    console.log('ServiceWorker ** Fetch', e.request.url);
    if (e.request.url.indexOf(dataUrl) > -1) 
    {
        /*
        * When the request URL contains dataUrl, the app is asking for fresh data
        * In this case, the service worker always goes to the
        * network and then caches the response. This is called the "Cache then
        * network" strategy:
        * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
        */
        e.respondWith(
            caches.open(dataCache).then(function(cache) 
            {
                return fetch(e.request).then(function(response)
                {
                    cache.put(e.request.url, response.clone());
                    return response;
                });
            })
        );
    } 
    else 
    {
        /*
        * The app is asking for app shell files. In this scenario the app uses the
        * "Cache, falling back to the network" offline strategy:
        * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
        */
        e.respondWith(
            caches.match(e.request).then(function(response) 
            {
                return response || fetch(e.request);
            })
        );
    }
});
  