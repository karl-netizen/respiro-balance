
import { useState, useEffect, useCallback } from 'react';
import { useUserPreferences } from '@/context';
import { MorningRitual, RitualReminder } from '@/context/types';
import { useToast } from '@/hooks/use-toast';
import { shouldDoRitualToday } from '@/components/morning-ritual/utils/dateUtils';
import { isSupabaseConfigured } from '@/lib/supabase';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'streak' | 'achievement';
  timestamp: string;
  read: boolean;
  ritualId?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useRitualNotifications = () => {
  const { preferences } = useUserPreferences();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const rituals = preferences.morningRituals || [];

  // Check for pending notifications
  const checkPendingNotifications = useCallback(() => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const newNotifications: Notification[] = [];
    
    // Check each ritual for reminders
    rituals.forEach(ritual => {
      // Skip if ritual is not scheduled for today
      if (!shouldDoRitualToday(ritual.recurrence, ritual.daysOfWeek)) {
        return;
      }
      
      // Check if ritual already has a notification
      const hasNotification = notifications.some(
        notification => notification.ritualId === ritual.id && notification.type === 'reminder'
      );
      
      if (hasNotification) {
        return;
      }
      
      // Get ritual time in minutes since midnight
      const [ritualHours, ritualMinutes] = ritual.timeOfDay.split(':').map(Number);
      const ritualTimeInMinutes = ritualHours * 60 + ritualMinutes;
      
      // Create notification 15 minutes before ritual time
      const notifyTimeInMinutes = ritualTimeInMinutes - 15;
      
      // If it's within 5 minutes of the notification time, create a notification
      if (
        Math.abs(currentTime - notifyTimeInMinutes) <= 5 && 
        ritual.status !== 'completed' &&
        now.getHours() >= 4 // Don't send notifications before 4 AM
      ) {
        newNotifications.push({
          id: `reminder-${ritual.id}-${Date.now()}`,
          title: 'Morning Ritual Reminder',
          message: `Time for your '${ritual.title}' ritual in 15 minutes.`,
          type: 'reminder',
          timestamp: new Date().toISOString(),
          read: false,
          ritualId: ritual.id,
          action: {
            label: 'View',
            onClick: () => {
              // Navigate to morning ritual page
              window.location.href = '/morning-ritual';
            }
          }
        });
      }
    });
    
    // Add new notifications
    if (newNotifications.length > 0) {
      setNotifications(prev => [...prev, ...newNotifications]);
      
      // Show toast for the latest notification
      const latestNotification = newNotifications[0];
      toast({
        title: latestNotification.title,
        description: latestNotification.message,
      });
    }
  }, [rituals, notifications, toast]);

  // Poll for notifications every minute
  useEffect(() => {
    const intervalId = setInterval(checkPendingNotifications, 60000);
    
    // Check immediately on mount
    checkPendingNotifications();
    
    return () => clearInterval(intervalId);
  }, [checkPendingNotifications]);

  // Mark a notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Clear a notification
  const clearNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Add a streak achievement notification
  const addStreakAchievementNotification = (ritual: MorningRitual) => {
    // Only create achievement notifications for significant streaks
    if (ritual.streak && (ritual.streak === 7 || ritual.streak === 30 || ritual.streak === 100)) {
      const notification: Notification = {
        id: `streak-${ritual.id}-${Date.now()}`,
        title: 'Streak Achievement!',
        message: `You've maintained a ${ritual.streak}-day streak for "${ritual.title}"! Keep it up!`,
        type: 'achievement',
        timestamp: new Date().toISOString(),
        read: false,
        ritualId: ritual.id,
        action: {
          label: 'View',
          onClick: () => {
            window.location.href = '/morning-ritual';
          }
        }
      };
      
      setNotifications(prev => [...prev, notification]);
      
      toast({
        title: notification.title,
        description: notification.message,
      });
    }
  };

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    addStreakAchievementNotification
  };
};
