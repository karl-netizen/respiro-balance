
import { UserPreferences } from "@/context/types";
import { supabase } from "@/lib/supabase";

export interface PushNotificationData {
  title: string;
  message: string;
  type: 'reminder' | 'achievement' | 'insight' | 'streak' | 'session';
  data?: any;
  scheduledFor?: string;
}

export class NotificationService {
  private swRegistration: ServiceWorkerRegistration | null = null;

  async initialize() {
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async scheduleNotification(userId: string, notification: PushNotificationData) {
    if (!supabase) return;

    try {
      await supabase.from('notification_queue').insert({
        user_id: userId,
        notification_type: notification.type,
        title: notification.title,
        message: notification.message,
        scheduled_for: notification.scheduledFor || new Date().toISOString(),
        data: notification.data || {}
      });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }

  async showNotification(notification: PushNotificationData) {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    if (this.swRegistration) {
      await this.swRegistration.showNotification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: notification.type,
        data: notification.data,
        requireInteraction: notification.type === 'achievement',
        actions: this.getNotificationActions(notification.type)
      });
    } else {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png',
        tag: notification.type,
        data: notification.data
      });
    }
  }

  private getNotificationActions(type: string) {
    switch (type) {
      case 'reminder':
        return [
          { action: 'start', title: 'Start Now', icon: '/images/play.png' },
          { action: 'later', title: 'Remind Later', icon: '/images/clock.png' }
        ];
      case 'achievement':
        return [
          { action: 'view', title: 'View Progress', icon: '/images/trophy.png' },
          { action: 'share', title: 'Share', icon: '/images/share.png' }
        ];
      default:
        return [
          { action: 'open', title: 'Open App', icon: '/images/app.png' }
        ];
    }
  }

  async scheduleIntelligentReminders(userId: string, preferences: UserPreferences) {
    const currentHour = new Date().getHours();
    const notifications: PushNotificationData[] = [];

    // Morning meditation reminder
    if (preferences.notification_settings?.session_reminders) {
      const morningTime = new Date();
      morningTime.setHours(8, 0, 0, 0);
      if (morningTime > new Date()) {
        morningTime.setDate(morningTime.getDate() + 1);
      }

      notifications.push({
        title: 'Good Morning! 🌅',
        message: 'Start your day with a peaceful meditation session',
        type: 'reminder',
        scheduledFor: morningTime.toISOString(),
        data: { suggestedDuration: preferences.preferred_session_duration }
      });
    }

    // Workday break reminders
    if (preferences.work_days?.includes(this.getCurrentDayName().toLowerCase())) {
      const breakTime = new Date();
      const [workHours, workMinutes] = (preferences.work_start_time || '09:00').split(':');
      breakTime.setHours(parseInt(workHours) + 2, parseInt(workMinutes), 0, 0);

      if (breakTime > new Date()) {
        notifications.push({
          title: 'Mindful Break Time 🧘',
          message: 'Take a few minutes to center yourself and reduce stress',
          type: 'reminder',
          scheduledFor: breakTime.toISOString(),
          data: { suggestedType: 'breathing', duration: 5 }
        });
      }
    }

    // Evening reflection reminder
    if (preferences.notification_settings?.weekly_summary) {
      const eveningTime = new Date();
      eveningTime.setHours(20, 0, 0, 0);
      if (eveningTime > new Date()) {
        eveningTime.setDate(eveningTime.getDate() + 1);
      }

      notifications.push({
        title: 'Evening Reflection 🌙',
        message: 'Reflect on your day with a calming meditation',
        type: 'reminder',
        scheduledFor: eveningTime.toISOString(),
        data: { suggestedType: 'gratitude', duration: 10 }
      });
    }

    // Schedule all notifications
    for (const notification of notifications) {
      await this.scheduleNotification(userId, notification);
    }
  }

  async sendAchievementNotification(userId: string, achievement: any) {
    await this.showNotification({
      title: 'Achievement Unlocked! 🏆',
      message: `You've earned the "${achievement.title}" achievement!`,
      type: 'achievement',
      data: { achievementId: achievement.id }
    });
  }

  async sendStreakNotification(userId: string, streakCount: number) {
    const messages = [
      'Keep the momentum going!',
      'You\'re building a powerful habit!',
      'Consistency is the key to transformation!',
      'Your dedication is inspiring!'
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];

    await this.showNotification({
      title: `${streakCount} Day Streak! 🔥`,
      message,
      type: 'streak',
      data: { streakCount }
    });
  }

  async sendInsightNotification(userId: string, insight: string) {
    await this.showNotification({
      title: 'Personal Insight 💡',
      message: insight,
      type: 'insight',
      data: { insight }
    });
  }

  private getCurrentDayName(): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }
}

export const notificationService = new NotificationService();
