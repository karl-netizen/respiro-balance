
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { unifiedAchievementSystem, Achievement } from '@/services/unified-achievement/UnifiedAchievementSystem';
import { intelligentNotificationSystem, ContextualNotification } from '@/services/intelligent-notifications/IntelligentNotificationSystem';
import { sessionIntegrationService, SessionFlow } from '@/services/session-integration/SessionIntegrationService';

export const useEnhancedUX = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [notifications, setNotifications] = useState<ContextualNotification[]>([]);
  const [activeSessionFlow, setActiveSessionFlow] = useState<SessionFlow | null>(null);
  const [sessionRecommendations, setSessionRecommendations] = useState<string[]>([]);

  // Initialize enhanced UX features
  useEffect(() => {
    if (!user) return;

    const initializeEnhancedUX = async () => {
      // Check for active session flow
      const activeSession = sessionIntegrationService.getActiveSession(user.id);
      setActiveSessionFlow(activeSession || null);
      
      // Get session recommendations
      const recommendations = await sessionIntegrationService.generateSessionRecommendations(user.id, {
        biometricData: { stressLevel: 50 } // Would come from actual biometric data
      });
      setSessionRecommendations(recommendations);
      
      // Get notification history
      const notificationHistory = intelligentNotificationSystem.getNotificationHistory();
      setNotifications(notificationHistory);
    };

    initializeEnhancedUX();
  }, [user]);

  // Record user activity and check for achievements
  const recordActivity = useCallback(async (module: string, activityType: string, data: any) => {
    if (!user) return;

    const activity = {
      userId: user.id,
      module,
      activityType,
      data,
      timestamp: new Date()
    };

    // Check for achievements
    const newAchievements = await unifiedAchievementSystem.checkAllAchievements(user.id, activity);
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      
      // Notify about achievements
      for (const achievement of newAchievements) {
        await intelligentNotificationSystem.coordinateAcrossModules('achievement_unlock', {
          achievement,
          userId: user.id
        });
      }
    }

    // Handle session completion
    if (activityType === 'session_complete') {
      await intelligentNotificationSystem.coordinateAcrossModules('session_complete', {
        module,
        userId: user.id,
        sessionData: data
      });
    }
  }, [user]);

  // Start integrated session flow
  const startSessionFlow = useCallback(async (modules: string[], context: any) => {
    if (!user) return;

    const sessionFlow = await sessionIntegrationService.startSessionFlow(user.id, modules, context);
    setActiveSessionFlow(sessionFlow);
    
    return sessionFlow;
  }, [user]);

  // Handle session transitions
  const transitionToModule = useCallback(async (toModule: string, fromModule: string, data: any) => {
    if (!activeSessionFlow) return;

    await sessionIntegrationService.handleSessionTransition(activeSessionFlow.id, {
      fromModule,
      toModule,
      trigger: 'user_choice',
      data,
      preserveContext: true
    });

    // Update active session
    const updatedSession = sessionIntegrationService.getActiveSession(user!.id);
    setActiveSessionFlow(updatedSession || null);
  }, [activeSessionFlow, user]);

  // Complete session flow
  const completeSessionFlow = useCallback(async (outcomes: any) => {
    if (!activeSessionFlow) return;

    await sessionIntegrationService.completeSessionFlow(activeSessionFlow.id, outcomes);
    setActiveSessionFlow(null);
    
    // Update recommendations
    const newRecommendations = await sessionIntegrationService.generateSessionRecommendations(user!.id, outcomes);
    setSessionRecommendations(newRecommendations);
  }, [activeSessionFlow, user]);

  // Send contextual notification
  const sendContextualNotification = useCallback(async (notification: Omit<ContextualNotification, 'id'>) => {
    const fullNotification: ContextualNotification = {
      ...notification,
      id: Math.random().toString(36).substring(2)
    };
    
    await intelligentNotificationSystem.scheduleContextualNotification(fullNotification);
    setNotifications(prev => [...prev, fullNotification]);
  }, []);

  // Handle biometric alerts
  const handleBiometricAlert = useCallback(async (biometrics: any) => {
    if (!user) return;

    await intelligentNotificationSystem.coordinateAcrossModules('biometric_threshold', {
      biometrics,
      userId: user.id
    });
  }, [user]);

  // Clear achievements (for UI)
  const clearAchievements = useCallback(() => {
    setAchievements([]);
  }, []);

  return {
    // Achievement system
    achievements,
    clearAchievements,
    
    // Session integration
    activeSessionFlow,
    sessionRecommendations,
    startSessionFlow,
    transitionToModule,
    completeSessionFlow,
    
    // Notification system
    notifications,
    sendContextualNotification,
    
    // Activity tracking
    recordActivity,
    handleBiometricAlert,
    
    // Status
    hasActiveSession: !!activeSessionFlow
  };
};
