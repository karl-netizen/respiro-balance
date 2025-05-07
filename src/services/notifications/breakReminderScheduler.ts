
import { BreakReminder, BreakType } from "./types";
import { UserPreferences } from "@/context/types";
import { notificationDisplay } from "./notificationDisplay";

class BreakReminderScheduler {
  private timers: Record<string, number> = {};
  
  scheduleLunchReminder(reminder: BreakReminder, lunchTime: string) {
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
        notificationDisplay.showNotification(reminder.title, reminder.message);
        // Schedule the next one for tomorrow
        scheduleNextLunch();
      }, timeUntilLunch);
      
      this.timers[`lunch`] = timerId;
    };
    
    scheduleNextLunch();
  }

  scheduleIntervalReminder(reminder: BreakReminder) {
    const intervalMs = reminder.interval * 60 * 1000;
    
    const timerId = window.setInterval(() => {
      notificationDisplay.showNotification(reminder.title, reminder.message);
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
}

export const breakReminderScheduler = new BreakReminderScheduler();
