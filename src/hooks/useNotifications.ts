
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences } from '@/context';
import { notificationService } from '@/services/notifications/NotificationService';

export const useNotifications = () => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }

    // Initialize notification service
    notificationService.initialize();
  }, []);

  useEffect(() => {
    if (user && permissionStatus === 'granted' && preferences.notification_settings) {
      // Schedule intelligent reminders based on user preferences
      notificationService.scheduleIntelligentReminders(user.id, preferences);
    }
  }, [user, permissionStatus, preferences]);

  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
    return granted;
  };

  const sendTestNotification = async () => {
    if (permissionStatus !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    await notificationService.showNotification({
      title: 'Test Notification',
      message: 'Notifications are working correctly!',
      type: 'reminder'
    });

    return true;
  };

  const scheduleCustomReminder = async (title: string, message: string, scheduledFor: Date) => {
    if (!user) return false;

    await notificationService.scheduleNotification(user.id, {
      title,
      message,
      type: 'reminder',
      scheduledFor: scheduledFor.toISOString()
    });

    return true;
  };

  return {
    isSupported,
    permissionStatus,
    requestPermission,
    sendTestNotification,
    scheduleCustomReminder
  };
};
