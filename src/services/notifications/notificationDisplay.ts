
import { serviceWorkerManager } from "./serviceWorkerManager";

class NotificationDisplay {
  async showNotification(title: string, message: string, options: NotificationOptions = {}) {
    // Use service worker notification if available (works when app is closed)
    const serviceWorkerRegistration = serviceWorkerManager.getServiceWorkerRegistration();
    
    if (serviceWorkerRegistration) {
      try {
        const notificationOptions: NotificationOptions & { vibrate?: number[] } = {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
          data: {
            ...options.data,
            applicationTag: 'respiro-balance'
          }
        };
        
        // Add vibration pattern if supported by the browser
        if ('vibrate' in navigator) {
          notificationOptions.vibrate = [100, 50, 100];
        }
        
        await serviceWorkerRegistration.showNotification(title, notificationOptions);
      } catch (error) {
        console.error('Error showing notification through service worker:', error);
        this.showFallbackNotification(title, message, options);
      }
    } else {
      this.showFallbackNotification(title, message, options);
    }
  }

  private showFallbackNotification(title: string, message: string, options: NotificationOptions = {}) {
    try {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        ...options
      });
    } catch (error) {
      console.error('Error showing fallback notification:', error);
    }
  }
}

export const notificationDisplay = new NotificationDisplay();
