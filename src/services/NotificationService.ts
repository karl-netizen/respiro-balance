
import { UserPreferences } from "@/context/types";

export type BreakType = 'micro' | 'medium' | 'lunch' | 'long';

export interface BreakReminder {
  type: BreakType;
  interval: number; // in minutes
  title: string;
  message: string;
  enabled: boolean;
}

export interface NotificationPermissionState {
  granted: boolean;
  requested: boolean;
  denied: boolean;
}

// Default reminder configurations
export const defaultBreakReminders: Record<BreakType, BreakReminder> = {
  micro: {
    type: 'micro',
    interval: 60, // Every hour
    title: 'Time for a micro-break',
    message: 'Take 5 minutes to rest your eyes and stretch',
    enabled: true
  },
  medium: {
    type: 'medium',
    interval: 120, // Every 2 hours
    title: 'Time for a medium break',
    message: 'Take 15 minutes to walk and refresh your mind',
    enabled: true
  },
  lunch: {
    type: 'lunch',
    interval: 0, // Special case, handled by time of day
    title: 'Lunch break reminder',
    message: 'Time to take your lunch break',
    enabled: true
  },
  long: {
    type: 'long',
    interval: 240, // Every 4 hours
    title: 'Time for a longer break',
    message: 'Take 30 minutes to properly disconnect',
    enabled: true
  }
};

class NotificationService {
  private timers: Record<string, number> = {};
  private permissionState: NotificationPermissionState = {
    granted: false,
    requested: false,
    denied: false
  };
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.initPermissionState();
    this.registerServiceWorker();
  }

  private async initPermissionState() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      this.permissionState = { granted: true, requested: true, denied: false };
    } else if (Notification.permission === 'denied') {
      this.permissionState = { granted: false, requested: true, denied: true };
    } else {
      this.permissionState = { granted: false, requested: false, denied: false };
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permissionState.granted) {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      
      this.permissionState = {
        granted,
        requested: true,
        denied: permission === 'denied'
      };
      
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  getPermissionState(): NotificationPermissionState {
    return { ...this.permissionState };
  }

  private async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported in this browser');
      return;
    }

    try {
      this.serviceWorkerRegistration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  async scheduleBreakReminders(reminders: BreakReminder[], preferences: UserPreferences) {
    // Clear existing timers
    this.clearAllReminders();

    // Check permission
    if (!this.permissionState.granted) {
      const granted = await this.requestPermission();
      if (!granted) {
        console.warn('Notification permission not granted');
        return;
      }
    }

    // Schedule interval-based reminders
    reminders.forEach(reminder => {
      if (!reminder.enabled) return;
      
      // Special handling for lunch reminders
      if (reminder.type === 'lunch' && preferences.lunchBreak && preferences.lunchTime) {
        this.scheduleLunchReminder(reminder, preferences.lunchTime);
      }
      // Handle regular interval-based reminders
      else if (reminder.interval > 0) {
        this.scheduleIntervalReminder(reminder);
      }
    });

    console.log('Break reminders scheduled successfully');
  }

  private scheduleLunchReminder(reminder: BreakReminder, lunchTime: string) {
    // Parse lunch time (format: "HH:MM")
    const [hours, minutes] = lunchTime.split(':').map(Number);
    
    const scheduleNextLunch = () => {
      const now = new Date();
      const lunchDate = new Date();
      lunchDate.setHours(hours, minutes, 0, 0);
      
      // If lunch time has passed for today, schedule for tomorrow
      if (now > lunchDate) {
        lunchDate.setDate(lunchDate.getDate() + 1);
      }
      
      const timeUntilLunch = lunchDate.getTime() - now.getTime();
      
      // Schedule the notification
      const timerId = window.setTimeout(() => {
        this.showNotification(reminder.title, reminder.message);
        // Schedule the next one for tomorrow
        scheduleNextLunch();
      }, timeUntilLunch);
      
      this.timers[`lunch`] = timerId;
    };
    
    scheduleNextLunch();
  }

  private scheduleIntervalReminder(reminder: BreakReminder) {
    const intervalMs = reminder.interval * 60 * 1000;
    
    const timerId = window.setInterval(() => {
      this.showNotification(reminder.title, reminder.message);
    }, intervalMs);
    
    this.timers[`${reminder.type}`] = timerId;
  }

  clearReminder(type: BreakType) {
    if (this.timers[type]) {
      clearTimeout(this.timers[type]);
      clearInterval(this.timers[type]); // Clear both in case it's either type
      delete this.timers[type];
    }
  }

  clearAllReminders() {
    Object.keys(this.timers).forEach(key => {
      clearTimeout(this.timers[key]);
      clearInterval(this.timers[key]);
    });
    this.timers = {};
  }

  async showNotification(title: string, message: string, options: NotificationOptions = {}) {
    if (!this.permissionState.granted) {
      console.warn('Notification permission not granted');
      return;
    }

    // Use service worker notification if available (works when app is closed)
    if (this.serviceWorkerRegistration) {
      try {
        await this.serviceWorkerRegistration.showNotification(title, {
          body: message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          vibrate: [100, 50, 100],
          ...options,
          data: {
            ...options.data,
            applicationTag: 'respiro-balance'
          }
        });
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

// Export singleton instance
export const notificationService = new NotificationService();
