const CACHE_NAME = "criyago-v2.0"
const STATIC_CACHE = "criyago-static-v2.0"
const DYNAMIC_CACHE = "criyago-dynamic-v2.0"

const urlsToCache = ["/", "/manifest.json", "/icon-192.jpg", "/icon-512.jpg", "/offline.html"]

self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker")
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Caching static assets")
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        console.log("[SW] Static assets cached successfully")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("[SW] Failed to cache static assets:", error)
      }),
  )
})

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("[SW] Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("[SW] Service worker activated")
        return self.clients.claim()
      }),
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== "GET" || url.protocol === "chrome-extension:") {
    return
  }

  // Handle navigation requests (pages)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseClone))
          }
          return response
        })
        .catch(() => {
          // Fallback to cache, then offline page
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match("/offline.html")
          })
        }),
    )
    return
  }

  // Handle static assets (cache-first strategy)
  if (
    request.destination === "image" ||
    request.destination === "script" ||
    request.destination === "style" ||
    request.url.includes("/icon-")
  ) {
    event.respondWith(
      caches
        .match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          return fetch(request).then((response) => {
            if (response.status === 200) {
              const responseClone = response.clone()
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, responseClone))
            }
            return response
          })
        })
        .catch(() => {
          console.log("[SW] Failed to fetch asset:", request.url)
        }),
    )
    return
  }

  // Default network-first strategy for other requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseClone))
        }
        return response
      })
      .catch(() => {
        return caches.match(request)
      }),
  )
})

self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag)
  if (event.tag === "background-sync") {
    event.waitUntil(
      // Handle any background sync tasks here
      Promise.resolve(),
    )
  }
})

self.addEventListener("push", (event) => {
  console.log("[SW] Push notification received")
  const options = {
    body: event.data ? event.data.text() : "New games available!",
    icon: "/icon-192.jpg",
    badge: "/icon-192.jpg",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Explore Games",
        icon: "/icon-192.jpg",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon-192.jpg",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("Criyago", options))
})

self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.action)
  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"))
  }
})
