
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useUserPreferences } from '@/context';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'ritual' | 'achievement' | 'reminder' | 'system';
  actionUrl?: string;
}

export const useRitualNotifications = () => {
  const { preferences } = useUserPreferences();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Load notifications from localStorage on initial load
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (err) {
        console.error('Error parsing notifications from localStorage:', err);
      }
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotification = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };

    setNotifications(prev => [newNotification, ...prev]);
    return newNotification.id;
  };

  const addStreakAchievementNotification = (ritual: any) => {
    // Only add streak notifications for significant milestones (5, 10, 15, etc)
    if (ritual.streak % 5 === 0 && ritual.streak > 0) {
      addNotification({
        title: `${ritual.streak} Day Streak!`,
        message: `You've completed "${ritual.title}" for ${ritual.streak} days in a row. Keep it up!`,
        type: 'achievement',
        actionUrl: '/morning-ritual'
      });
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    addNotification,
    addStreakAchievementNotification
  };
};
