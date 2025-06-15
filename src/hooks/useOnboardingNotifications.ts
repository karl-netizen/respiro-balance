
import { useState, useEffect } from 'react';
import { onboardingNotificationService } from '@/services/OnboardingNotificationService';

export interface OnboardingNotification {
  id: string;
  title: string;
  message: string;
  type: 'onboarding-guide' | 'step-complete' | 'milestone';
  read: boolean;
  createdAt: string;
  priority: 'high' | 'medium' | 'low';
}

export function useOnboardingNotifications() {
  const [notifications, setNotifications] = useState<OnboardingNotification[]>([]);
  
  useEffect(() => {
    // Check if user should see the onboarding guide
    if (onboardingNotificationService.shouldShowOnboardingGuide()) {
      const guideNotification: OnboardingNotification = {
        id: 'getting-started-guide',
        title: 'Getting Started Guide',
        message: 'Welcome to Respiro Balance! Follow our comprehensive guide to begin your wellness journey.',
        type: 'onboarding-guide',
        read: false,
        createdAt: new Date().toISOString(),
        priority: 'high'
      };
      
      setNotifications([guideNotification]);
    }
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const addMilestoneNotification = (milestone: string) => {
    const milestoneNotification: OnboardingNotification = {
      id: `milestone-${Date.now()}`,
      title: 'Milestone Achieved! 🎉',
      message: `Congratulations! You've completed ${milestone}. Keep up the great work!`,
      type: 'milestone',
      read: false,
      createdAt: new Date().toISOString(),
      priority: 'medium'
    };
    
    setNotifications(prev => [milestoneNotification, ...prev]);
  };

  const addStepCompleteNotification = (stepTitle: string) => {
    const stepNotification: OnboardingNotification = {
      id: `step-${Date.now()}`,
      title: 'Step Completed!',
      message: `Great job completing: ${stepTitle}`,
      type: 'step-complete',
      read: false,
      createdAt: new Date().toISOString(),
      priority: 'low'
    };
    
    setNotifications(prev => [stepNotification, ...prev]);
  };

  return {
    notifications,
    markAsRead,
    addMilestoneNotification,
    addStepCompleteNotification
  };
}
