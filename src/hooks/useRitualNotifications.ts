
import { useState, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'achievement' | 'reminder' | 'update' | 'general';
  read: boolean;
  createdAt: string;
}

export function useRitualNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Load notifications on mount (would connect to backend in real app)
  useEffect(() => {
    // Mock notifications for demo
    const demoNotifications: Notification[] = [
      {
        id: '1',
        title: 'Welcome to Respiro Balance',
        message: 'Start your journey to mindfulness and better work-life balance.',
        type: 'general',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Morning Ritual Reminder',
        message: 'Your morning meditation session is scheduled in 15 minutes.',
        type: 'reminder',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];
    
    setNotifications(demoNotifications);
  }, []);
  
  // Mark a notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  // Remove a notification
  const clearNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };
  
  // Remove all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Add a streak achievement notification
  const addStreakAchievementNotification = (ritual: any) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: 'New Streak Achievement!',
      message: `You've completed ${ritual.streak} consecutive days of ${ritual.name}. Keep it up!`,
      type: 'achievement',
      read: false,
      createdAt: new Date().toISOString()
    };
    
    setNotifications([newNotification, ...notifications]);
  };
  
  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    addStreakAchievementNotification
  };
}
