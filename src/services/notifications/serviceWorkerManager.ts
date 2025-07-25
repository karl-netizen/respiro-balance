
// Service worker registration and management
class ServiceWorkerManager {
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported in this browser');
      return null;
    }

    try {
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');
      
      // Add error handling for fetch events
      this.serviceWorkerRegistration.addEventListener('updatefound', () => {
        console.log('SW update found');
      });
      
      return this.serviceWorkerRegistration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      // Continue without SW if registration fails
      return null;
    }
  }

  getServiceWorkerRegistration(): ServiceWorkerRegistration | null {
    return this.serviceWorkerRegistration;
  }
}

export const serviceWorkerManager = new ServiceWorkerManager();
