
// Service Worker for handling background notifications

const CACHE_NAME = 'respiro-balance-cache-v1';
const OFFLINE_URL = '/offline.html';

// Install event - cache app shell and offline page
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching app shell and content');
      return cache.addAll([
        '/',
        '/offline.html',
        '/favicon.ico',
        '/index.html'
      ]);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME;
          })
          .map((cacheName) => {
            console.log('Service Worker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  
  // Ensures the service worker takes control right away
  return self.clients.claim();
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).catch(() => {
          // If main page fails, show offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });
      })
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);
  
  const notification = event.notification;
  notification.close();
  
  // Extract notification data
  const notificationData = notification.data || {};
  
  // Open window or focus existing window
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // If we have a URL to navigate to from the notification data
      const url = notificationData.url || '/work-life-balance';
      
      // Check if there is already a window/tab open with this URL
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window is open, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received', event);
  
  let notificationData = {
    title: 'Respiro Balance',
    body: 'Time for a break!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: {
      url: '/work-life-balance'
    }
  };
  
  try {
    if (event.data) {
      notificationData = JSON.parse(event.data.text());
    }
  } catch (error) {
    console.error('Error parsing push data:', error);
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      data: notificationData.data,
      vibrate: [100, 50, 100]
    })
  );
});
