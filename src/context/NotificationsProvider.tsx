
import React, { createContext, useContext } from 'react';
import { Notification, useRitualNotifications } from '@/hooks/useRitualNotifications';
import { useOnboardingNotifications } from '@/hooks/useOnboardingNotifications';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  addStreakAchievementNotification: (ritual: any) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ritualNotifications = useRitualNotifications();
  const onboardingNotifications = useOnboardingNotifications();
  
  // Combine both notification types
  const allNotifications = [
    ...ritualNotifications.notifications,
    ...onboardingNotifications.notifications.map(notif => ({
      id: notif.id,
      title: notif.title,
      message: notif.message,
      type: notif.type === 'onboarding-guide' || notif.type === 'step-complete' || notif.type === 'milestone' 
        ? 'general' as const
        : notif.type as 'achievement' | 'reminder' | 'update' | 'general',
      read: notif.read,
      createdAt: notif.createdAt
    }))
  ];

  const combinedUnreadCount = allNotifications.filter(n => !n.read).length;

  const combinedMarkAsRead = (notificationId: string) => {
    // Try to mark in ritual notifications first
    const ritualNotif = ritualNotifications.notifications.find(n => n.id === notificationId);
    if (ritualNotif) {
      ritualNotifications.markAsRead(notificationId);
    } else {
      // Mark in onboarding notifications
      onboardingNotifications.markAsRead(notificationId);
    }
  };

  const combinedMarkAllAsRead = () => {
    ritualNotifications.markAllAsRead();
    onboardingNotifications.notifications.forEach(n => onboardingNotifications.markAsRead(n.id));
  };

  const notificationsService = {
    notifications: allNotifications,
    unreadCount: combinedUnreadCount,
    markAsRead: combinedMarkAsRead,
    markAllAsRead: combinedMarkAllAsRead,
    clearNotification: ritualNotifications.clearNotification,
    clearAllNotifications: ritualNotifications.clearAllNotifications,
    addStreakAchievementNotification: ritualNotifications.addStreakAchievementNotification
  };
  
  return (
    <NotificationsContext.Provider value={notificationsService}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
