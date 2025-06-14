
export interface ContextualNotification {
  id: string;
  title: string;
  message: string;
  type: 'achievement' | 'session_complete' | 'biometric_threshold' | 'reminder';
  priority: 'low' | 'medium' | 'high';
  data?: any;
  createdAt: Date;
}

class IntelligentNotificationSystemClass {
  private static instance: IntelligentNotificationSystemClass;
  private notifications: ContextualNotification[] = [];

  private constructor() {}

  public static getInstance(): IntelligentNotificationSystemClass {
    if (!IntelligentNotificationSystemClass.instance) {
      IntelligentNotificationSystemClass.instance = new IntelligentNotificationSystemClass();
    }
    return IntelligentNotificationSystemClass.instance;
  }

  async coordinateAcrossModules(eventType: string, data: any): Promise<void> {
    console.log('Coordinating notification across modules:', eventType, data);
    
    // Mock notification coordination
    if (eventType === 'achievement_unlock') {
      this.notifications.push({
        id: Math.random().toString(),
        title: 'Achievement Unlocked!',
        message: `You've earned: ${data.achievement.title}`,
        type: 'achievement',
        priority: 'high',
        data,
        createdAt: new Date()
      });
    }
  }

  async scheduleContextualNotification(notification: ContextualNotification): Promise<void> {
    this.notifications.push(notification);
  }

  getNotificationHistory(): ContextualNotification[] {
    return this.notifications;
  }
}

export const intelligentNotificationSystem = IntelligentNotificationSystemClass.getInstance();
