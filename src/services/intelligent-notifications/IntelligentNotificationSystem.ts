
import { notificationService } from '../NotificationService';
import { MorningRitual } from '@/context/types';

export interface ContextualNotification {
  id: string;
  type: 'reminder' | 'achievement' | 'suggestion' | 'intervention' | 'social';
  module: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timing: 'immediate' | 'optimal' | 'scheduled';
  scheduledTime?: Date;
  context: NotificationContext;
  actions?: NotificationAction[];
}

export interface NotificationContext {
  biometricState?: any;
  userActivity?: string;
  socialActivity?: any;
  timeContext?: string;
  streakRisk?: boolean;
  weatherContext?: string;
}

export interface NotificationAction {
  label: string;
  action: string;
  module?: string;
  data?: any;
}

export class IntelligentNotificationSystem {
  private static instance: IntelligentNotificationSystem;
  private pendingNotifications: Map<string, ContextualNotification> = new Map();
  private notificationHistory: ContextualNotification[] = [];

  private constructor() {}

  public static getInstance(): IntelligentNotificationSystem {
    if (!IntelligentNotificationSystem.instance) {
      IntelligentNotificationSystem.instance = new IntelligentNotificationSystem();
    }
    return IntelligentNotificationSystem.instance;
  }

  // Context-aware notification scheduling
  async scheduleContextualNotification(notification: ContextualNotification): Promise<void> {
    try {
      // Analyze optimal timing based on context
      const optimalTime = await this.calculateOptimalTiming(notification);
      
      if (notification.timing === 'immediate' || optimalTime <= new Date()) {
        await this.sendNotification(notification);
      } else {
        // Schedule for later
        notification.scheduledTime = optimalTime;
        this.pendingNotifications.set(notification.id, notification);
        
        setTimeout(() => {
          this.sendNotification(notification);
          this.pendingNotifications.delete(notification.id);
        }, optimalTime.getTime() - Date.now());
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  // Cross-module coordination
  async coordinateAcrossModules(event: string, data: any): Promise<void> {
    switch (event) {
      case 'session_complete':
        await this.handleSessionComplete(data);
        break;
      case 'achievement_unlock':
        await this.handleAchievementUnlock(data);
        break;
      case 'biometric_threshold':
        await this.handleBiometricAlert(data);
        break;
      case 'streak_risk':
        await this.handleStreakRisk(data);
        break;
      case 'social_activity':
        await this.handleSocialActivity(data);
        break;
    }
  }

  private async handleSessionComplete(data: any): Promise<void> {
    const { module, userId, sessionData } = data;
    
    // Suggest next activity based on session outcomes
    if (module === 'meditation' && sessionData.stressReduction > 0.3) {
      await this.scheduleContextualNotification({
        id: this.generateId(),
        type: 'suggestion',
        module: 'focus',
        title: 'Perfect Time for Focus',
        message: 'Your stress levels dropped significantly. This is ideal for a focus session!',
        priority: 'medium',
        timing: 'immediate',
        context: { biometricState: sessionData.biometrics },
        actions: [
          { label: 'Start Focus Session', action: 'navigate', module: 'focus' }
        ]
      });
    }

    // Social sharing suggestion
    if (sessionData.achievement) {
      await this.scheduleContextualNotification({
        id: this.generateId(),
        type: 'suggestion',
        module: 'social',
        title: 'Share Your Success!',
        message: `You just unlocked "${sessionData.achievement}". Share with your community?`,
        priority: 'low',
        timing: 'immediate',
        context: { socialActivity: sessionData.achievement },
        actions: [
          { label: 'Share Achievement', action: 'share', module: 'social' }
        ]
      });
    }
  }

  private async handleAchievementUnlock(data: any): Promise<void> {
    const { achievement, userId } = data;
    
    await this.scheduleContextualNotification({
      id: this.generateId(),
      type: 'achievement',
      module: 'general',
      title: '🎉 Achievement Unlocked!',
      message: `${achievement.icon} ${achievement.title}: ${achievement.description}`,
      priority: 'high',
      timing: 'immediate',
      context: {},
      actions: [
        { label: 'View Progress', action: 'navigate', module: 'progress' },
        { label: 'Share', action: 'share', module: 'social' }
      ]
    });
  }

  private async handleBiometricAlert(data: any): Promise<void> {
    const { biometrics, userId } = data;
    
    if (biometrics.stressLevel > 80) {
      await this.scheduleContextualNotification({
        id: this.generateId(),
        type: 'intervention',
        module: 'breathing',
        title: 'High Stress Detected',
        message: 'Your stress levels are elevated. A 3-minute breathing exercise can help.',
        priority: 'urgent',
        timing: 'immediate',
        context: { biometricState: biometrics },
        actions: [
          { label: 'Quick Breathing Exercise', action: 'navigate', module: 'breathing', data: { duration: 3 } }
        ]
      });
    }
  }

  private async handleStreakRisk(data: any): Promise<void> {
    const { ritual, userId } = data;
    
    await this.scheduleContextualNotification({
      id: this.generateId(),
      type: 'reminder',
      module: 'morning-ritual',
      title: 'Streak Protection',
      message: `Your ${ritual.streak}-day streak for "${ritual.title}" is at risk. Even 2 minutes counts!`,
      priority: 'high',
      timing: 'optimal',
      context: { streakRisk: true },
      actions: [
        { label: 'Quick Version', action: 'navigate', module: 'morning-ritual', data: { quick: true } },
        { label: 'Skip Today', action: 'skip' }
      ]
    });
  }

  private async handleSocialActivity(data: any): Promise<void> {
    const { activity, userId } = data;
    
    if (activity.type === 'friend_achievement') {
      await this.scheduleContextualNotification({
        id: this.generateId(),
        type: 'social',
        module: 'social',
        title: 'Friend Achievement',
        message: `${activity.friendName} just completed a 7-day meditation streak! Join the challenge?`,
        priority: 'medium',
        timing: 'optimal',
        context: { socialActivity: activity },
        actions: [
          { label: 'Join Challenge', action: 'navigate', module: 'social' }
        ]
      });
    }
  }

  private async calculateOptimalTiming(notification: ContextualNotification): Promise<Date> {
    const now = new Date();
    
    // Basic timing optimization
    if (notification.type === 'reminder') {
      // Morning ritual reminders 1 hour before scheduled time
      return new Date(now.getTime() + 60 * 60 * 1000);
    }
    
    if (notification.priority === 'urgent') {
      return now; // Send immediately
    }
    
    // Default to next optimal engagement window (simplified)
    return new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes
  }

  private async sendNotification(notification: ContextualNotification): Promise<void> {
    await notificationService.showNotification(
      notification.title,
      notification.message,
      {
        tag: notification.id,
        data: {
          module: notification.module,
          actions: notification.actions
        }
      }
    );
    
    this.notificationHistory.push(notification);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Cleanup methods
  clearPendingNotifications(): void {
    this.pendingNotifications.clear();
  }

  getNotificationHistory(): ContextualNotification[] {
    return this.notificationHistory;
  }
}

export const intelligentNotificationSystem = IntelligentNotificationSystem.getInstance();
