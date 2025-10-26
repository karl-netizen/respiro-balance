
import { useState, useEffect, useCallback } from 'react';
import { UserPreferences } from '@/context/types';

interface SmartNotification {
  id: string;
  title: string;
  body: string;
  type: 'reminder' | 'motivation' | 'achievement' | 'social';
  scheduledTime: Date;
  sent: boolean;
  userId: string;
}

interface NotificationAnalytics {
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  bestTimes: string[];
  effectiveTypes: string[];
}

export const useSmartNotifications = () => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [analytics, setAnalytics] = useState<NotificationAnalytics>({
    openRate: 0,
    clickRate: 0,
    unsubscribeRate: 0,
    bestTimes: [],
    effectiveTypes: []
  });
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setIsPermissionGranted(permission === 'granted');
    }
  };

  const scheduleSmartNotification = useCallback(async (
    preferences: UserPreferences,
    type: 'reminder' | 'motivation' | 'achievement' | 'social',
    customMessage?: string
  ) => {
    if (!isPermissionGranted || !preferences.notifications?.enabled) return;

    // Check if this type of notification is enabled
    if (!preferences.notifications.types?.[type as keyof typeof preferences.notifications.types]) return;

    const optimalTime = calculateOptimalTime(preferences);
    
    const notification: SmartNotification = {
      id: Date.now().toString(),
      title: getNotificationTitle(type),
      body: customMessage || getNotificationBody(type, preferences),
      type,
      scheduledTime: optimalTime,
      sent: false,
      userId: 'current-user' // This would come from auth context
    };

    setNotifications(prev => [...prev, notification]);
    
    // Schedule the actual notification
    scheduleNotification(notification);
  }, [isPermissionGranted]);

  const calculateOptimalTime = (_preferences: UserPreferences): Date => {
    // Default to morning if no specific preference
    const baseTime = new Date();
    baseTime.setHours(9, 0, 0, 0); // 9 AM default
    
    // Add some variation based on user activity patterns
    const variation = Math.random() * 120 - 60; // ±1 hour
    baseTime.setMinutes(baseTime.getMinutes() + variation);
    
    return baseTime;
  };

  const scheduleNotification = (notification: SmartNotification) => {
    const delay = notification.scheduledTime.getTime() - Date.now();
    
    if (delay > 0) {
      setTimeout(() => {
        if (isPermissionGranted) {
          new Notification(notification.title, {
            body: notification.body,
            icon: '/icon-96x96.png',
            badge: '/icon-96x96.png',
            tag: notification.id
          });
          
          // Mark as sent
          setNotifications(prev =>
            prev.map(n => n.id === notification.id ? { ...n, sent: true } : n)
          );
        }
      }, delay);
    }
  };

  const getNotificationTitle = (type: string): string => {
    switch (type) {
      case 'reminder':
        return 'Time to Meditate';
      case 'motivation':
        return 'Stay Mindful';
      case 'achievement':
        return 'Congratulations!';
      case 'social':
        return 'Community Update';
      default:
        return 'Respiro';
    }
  };

  const getNotificationBody = (type: string, _preferences: UserPreferences): string => {
    const messages = {
      reminder: [
        'Your daily mindfulness session awaits',
        'Take a moment to center yourself',
        'Time for your meditation practice'
      ],
      motivation: [
        'You\'re doing great! Keep up the mindfulness journey',
        'Every breath is a new beginning',
        'Your consistency is building a stronger mind'
      ],
      achievement: [
        'You\'ve completed another meditation session!',
        'Streak milestone achieved!',
        'Your dedication to mindfulness is paying off'
      ],
      social: [
        'See what your meditation community is up to',
        'New guided sessions available',
        'Join today\'s group meditation'
      ]
    };

    const typeMessages = messages[type as keyof typeof messages] || messages.reminder;
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  };

  const cancelNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const updateAnalytics = (action: 'opened' | 'clicked' | 'dismissed') => {
    // Update analytics based on user actions
    setAnalytics(prev => ({
      ...prev,
      openRate: action === 'opened' ? prev.openRate + 1 : prev.openRate,
      clickRate: action === 'clicked' ? prev.clickRate + 1 : prev.clickRate
    }));
  };

  return {
    notifications,
    analytics,
    isPermissionGranted,
    scheduleSmartNotification,
    cancelNotification,
    updateAnalytics,
    checkNotificationPermission
  };
};
