
import { UserPreferences } from "@/context/types";
import { BreakType, BreakReminder, NotificationPermissionState } from "./notifications/types";
import { defaultBreakReminders } from "./notifications/defaults";
import { serviceWorkerManager } from "./notifications/serviceWorkerManager";
import { permissionManager } from "./notifications/permissionManager";
import { notificationDisplay } from "./notifications/notificationDisplay";
import { breakReminderScheduler } from "./notifications/breakReminderScheduler";

// Re-export types and defaults
export { BreakType, type BreakReminder, type NotificationPermissionState, defaultBreakReminders };

class NotificationService {
  constructor() {
    // Initialize service worker
    serviceWorkerManager.registerServiceWorker();
  }

  // Permission management methods
  async requestPermission(): Promise<boolean> {
    return permissionManager.requestPermission();
  }

  getPermissionState(): NotificationPermissionState {
    return permissionManager.getPermissionState();
  }

  // Schedule break reminders
  async scheduleBreakReminders(reminders: BreakReminder[], preferences: UserPreferences) {
    // Clear existing timers
    this.clearAllReminders();

    // Check permission
    if (!this.getPermissionState().granted) {
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
        breakReminderScheduler.scheduleLunchReminder(reminder, preferences.lunchTime);
      }
      // Handle regular interval-based reminders
      else if (reminder.interval > 0) {
        breakReminderScheduler.scheduleIntervalReminder(reminder);
      }
    });

    console.log('Break reminders scheduled successfully');
  }

  // Clear reminders
  clearReminder(type: BreakType) {
    breakReminderScheduler.clearReminder(type);
  }

  clearAllReminders() {
    breakReminderScheduler.clearAllReminders();
  }

  // Show notifications
  async showNotification(title: string, message: string, options: NotificationOptions = {}) {
    if (!this.getPermissionState().granted) {
      console.warn('Notification permission not granted');
      return;
    }
    
    notificationDisplay.showNotification(title, message, options);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
