
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useUserPreferences } from '@/context';

export interface SmartNotification {
  id: string;
  type: 'engagement' | 'habit' | 'milestone' | 'retention';
  title: string;
  message: string;
  scheduledFor: Date;
  sent: boolean;
  opened: boolean;
  clicked: boolean;
  metadata: Record<string, any>;
}

export interface NotificationTrigger {
  id: string;
  condition: (userData: any) => boolean;
  timing: 'immediate' | 'delayed' | 'optimal';
  cooldown: number; // hours
  template: {
    title: string;
    message: string;
    action?: string;
  };
}

export const useSmartNotifications = () => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [lastSent, setLastSent] = useState<Record<string, Date>>({});

  // Smart notification triggers
  const notificationTriggers: NotificationTrigger[] = [
    {
      id: 'streak_motivation',
      condition: (data) => data.currentStreak >= 3 && data.daysSinceLastSession === 1,
      timing: 'optimal',
      cooldown: 24,
      template: {
        title: '🔥 Keep Your Streak Alive!',
        message: `You're on a ${data => data.currentStreak}-day streak! Don't break it now.`,
        action: 'start_session'
      }
    },
    {
      id: 'comeback_gentle',
      condition: (data) => data.daysSinceLastSession >= 3 && data.daysSinceLastSession <= 7,
      timing: 'optimal',
      cooldown: 48,
      template: {
        title: '🌟 We Miss You',
        message: 'Your meditation practice is waiting. Even 3 minutes can make a difference.',
        action: 'quick_session'
      }
    },
    {
      id: 'milestone_celebration',
      condition: (data) => data.totalSessions % 10 === 0 && data.totalSessions > 0,
      timing: 'immediate',
      cooldown: 0,
      template: {
        title: '🎉 Milestone Achieved!',
        message: `Amazing! You've completed ${data => data.totalSessions} meditation sessions.`,
        action: 'view_progress'
      }
    },
    {
      id: 'optimal_time_reminder',
      condition: (data) => data.hasOptimalTime && !data.todaySessionCompleted,
      timing: 'optimal',
      cooldown: 24,
      template: {
        title: '⏰ Perfect Time to Meditate',
        message: 'Based on your patterns, now is your optimal meditation time.',
        action: 'start_session'
      }
    },
    {
      id: 'stress_relief_support',
      condition: (data) => data.recentStressLevel >= 7,
      timing: 'delayed',
      cooldown: 12,
      template: {
        title: '🫂 Feeling Stressed?',
        message: 'Try our 5-minute stress relief session. You\'ve got this!',
        action: 'stress_session'
      }
    }
  ];

  // Calculate optimal notification time based on user patterns
  const getOptimalTime = (userId: string): Date => {
    const now = new Date();
    const userPatterns = preferences.optimalNotificationTimes || ['09:00', '18:00'];
    
    // Get next optimal time
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    for (const timeStr of userPatterns) {
      const [hour, minute] = timeStr.split(':').map(Number);
      if (hour > currentHour || (hour === currentHour && minute > currentMinute)) {
        const optimalTime = new Date(now);
        optimalTime.setHours(hour, minute, 0, 0);
        return optimalTime;
      }
    }
    
    // If no time today, schedule for tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [hour, minute] = userPatterns[0].split(':').map(Number);
    tomorrow.setHours(hour, minute, 0, 0);
    return tomorrow;
  };

  // Check if notification can be sent (respects cooldown)
  const canSendNotification = (triggerId: string, cooldownHours: number): boolean => {
    const lastSentTime = lastSent[triggerId];
    if (!lastSentTime) return true;
    
    const hoursSinceLastSent = (Date.now() - lastSentTime.getTime()) / (1000 * 60 * 60);
    return hoursSinceLastSent >= cooldownHours;
  };

  // Generate notifications based on user data
  const generateNotifications = (userData: any) => {
    if (!preferences.notificationSettings?.smartNotifications) return;

    for (const trigger of notificationTriggers) {
      if (!trigger.condition(userData)) continue;
      if (!canSendNotification(trigger.id, trigger.cooldown)) continue;

      const scheduledTime = trigger.timing === 'immediate' 
        ? new Date() 
        : trigger.timing === 'optimal'
        ? getOptimalTime(user?.id || '')
        : new Date(Date.now() + 30 * 60 * 1000); // 30 minutes delay

      const notification: SmartNotification = {
        id: `${trigger.id}_${Date.now()}`,
        type: trigger.id.includes('streak') ? 'habit' : 
              trigger.id.includes('milestone') ? 'milestone' :
              trigger.id.includes('comeback') ? 'retention' : 'engagement',
        title: trigger.template.title,
        message: typeof trigger.template.message === 'function' 
          ? trigger.template.message(userData)
          : trigger.template.message,
        scheduledFor: scheduledTime,
        sent: false,
        opened: false,
        clicked: false,
        metadata: {
          triggerId: trigger.id,
          userData: { ...userData },
          action: trigger.template.action
        }
      };

      setNotifications(prev => [...prev, notification]);
      setLastSent(prev => ({ ...prev, [trigger.id]: new Date() }));
    }
  };

  // Send notification (would integrate with push notification service)
  const sendNotification = async (notification: SmartNotification) => {
    try {
      // Mock notification sending
      console.log('Sending smart notification:', notification);
      
      // Update notification as sent
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id 
            ? { ...n, sent: true }
            : n
        )
      );

      // Would integrate with actual push notification service here
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/icon-192x192.png',
          tag: notification.type,
          data: notification.metadata
        });
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  // Process scheduled notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const dueNotifications = notifications.filter(
        n => !n.sent && n.scheduledFor <= now
      );

      dueNotifications.forEach(sendNotification);
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [notifications]);

  // Track notification interactions
  const trackNotificationInteraction = (notificationId: string, action: 'opened' | 'clicked') => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, [action]: true }
          : n
      )
    );
  };

  return {
    notifications,
    generateNotifications,
    trackNotificationInteraction,
    canSendNotification
  };
};
