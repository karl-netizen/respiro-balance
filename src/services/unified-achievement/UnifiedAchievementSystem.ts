
import { supabase } from '@/lib/supabase';

export interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  category: 'single-module' | 'cross-module' | 'meta';
  module?: string;
  requiredModules?: string[];
  criteria: AchievementCriteria;
  reward: AchievementReward;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface AchievementCriteria {
  type: 'sessions' | 'streak' | 'score' | 'combination' | 'social';
  target: number;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time';
  conditions?: Record<string, any>;
}

export interface AchievementReward {
  type: 'badge' | 'points' | 'unlock' | 'social';
  value: number;
  unlocks?: string[];
}

export interface CrossModuleActivity {
  userId: string;
  module: string;
  activityType: string;
  data: Record<string, any>;
  timestamp: Date;
}

export class UnifiedAchievementSystem {
  private static instance: UnifiedAchievementSystem;

  private constructor() {}

  public static getInstance(): UnifiedAchievementSystem {
    if (!UnifiedAchievementSystem.instance) {
      UnifiedAchievementSystem.instance = new UnifiedAchievementSystem();
    }
    return UnifiedAchievementSystem.instance;
  }

  // Check for achievements across all modules
  async checkAllAchievements(userId: string, activity: CrossModuleActivity): Promise<Achievement[]> {
    try {
      const unlockedAchievements: Achievement[] = [];
      
      // Get user's current achievements
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId);

      // Check single-module achievements
      const singleModuleAchievements = await this.checkSingleModuleAchievements(userId, activity);
      unlockedAchievements.push(...singleModuleAchievements);

      // Check cross-module achievements
      const crossModuleAchievements = await this.checkCrossModuleAchievements(userId, activity);
      unlockedAchievements.push(...crossModuleAchievements);

      // Check meta achievements
      const metaAchievements = await this.checkMetaAchievements(userId);
      unlockedAchievements.push(...metaAchievements);

      // Save new achievements
      for (const achievement of unlockedAchievements) {
        await this.unlockAchievement(userId, achievement);
      }

      return unlockedAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  private async checkSingleModuleAchievements(userId: string, activity: CrossModuleActivity): Promise<Achievement[]> {
    const achievements: Achievement[] = [];
    
    // Meditation achievements
    if (activity.module === 'meditation') {
      const sessionCount = await this.getSessionCount(userId, 'meditation');
      if (sessionCount === 10) {
        achievements.push(this.createAchievement('meditation-beginner', 'Meditation Beginner', 'Complete 10 meditation sessions', '🧘'));
      }
      if (sessionCount === 100) {
        achievements.push(this.createAchievement('meditation-master', 'Meditation Master', 'Complete 100 meditation sessions', '🏆'));
      }
    }

    // Focus achievements
    if (activity.module === 'focus') {
      const focusStreak = await this.getStreak(userId, 'focus');
      if (focusStreak === 7) {
        achievements.push(this.createAchievement('focus-week', 'Focus Warrior', 'Maintain 7-day focus streak', '🎯'));
      }
    }

    // Morning ritual achievements
    if (activity.module === 'morning-ritual') {
      const ritualStreak = await this.getStreak(userId, 'morning-ritual');
      if (ritualStreak === 30) {
        achievements.push(this.createAchievement('morning-champion', 'Morning Champion', '30-day morning ritual streak', '🌅'));
      }
    }

    return achievements;
  }

  private async checkCrossModuleAchievements(userId: string, activity: CrossModuleActivity): Promise<Achievement[]> {
    const achievements: Achievement[] = [];
    
    // Check if user used multiple modules today
    const todayActivities = await this.getTodayActivities(userId);
    const modulesUsedToday = new Set(todayActivities.map(a => a.module));
    
    if (modulesUsedToday.size >= 3) {
      achievements.push(this.createAchievement('wellness-integrator', 'Wellness Integrator', 'Use 3+ modules in one day', '🔄'));
    }

    // Check meditation -> focus flow
    if (activity.module === 'focus') {
      const recentMeditation = todayActivities.find(a => 
        a.module === 'meditation' && 
        (new Date().getTime() - a.timestamp.getTime()) < 30 * 60 * 1000 // Within 30 minutes
      );
      
      if (recentMeditation) {
        achievements.push(this.createAchievement('mindful-productivity', 'Mindful Productivity', 'Focus session after meditation', '💭'));
      }
    }

    return achievements;
  }

  private async checkMetaAchievements(userId: string): Promise<Achievement[]> {
    const achievements: Achievement[] = [];
    
    // Check if user has achievements in all modules
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_key')
      .eq('user_id', userId);

    const achievementKeys = userAchievements?.map(a => a.achievement_key) || [];
    const hasAllModules = ['meditation', 'focus', 'breathing', 'morning-ritual'].every(module =>
      achievementKeys.some(key => key.includes(module))
    );

    if (hasAllModules) {
      achievements.push(this.createAchievement('platform-expert', 'Platform Expert', 'Master all modules', '👑'));
    }

    return achievements;
  }

  private createAchievement(key: string, title: string, description: string, icon: string): Achievement {
    return {
      id: this.generateId(),
      key,
      title,
      description,
      icon,
      category: 'single-module',
      criteria: { type: 'sessions', target: 1 },
      reward: { type: 'badge', value: 100 },
      unlocked: true,
      unlockedAt: new Date(),
      progress: 1,
      maxProgress: 1
    };
  }

  private async unlockAchievement(userId: string, achievement: Achievement): Promise<void> {
    await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_key: achievement.key,
        unlocked_at: new Date().toISOString(),
        progress: achievement.maxProgress
      });
  }

  private async getSessionCount(userId: string, module: string): Promise<number> {
    const table = module === 'meditation' ? 'meditation_sessions' : 
                 module === 'focus' ? 'focus_sessions' : 'meditation_sessions';
    
    const { count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    return count || 0;
  }

  private async getStreak(userId: string, module: string): Promise<number> {
    // Simplified streak calculation
    return Math.floor(Math.random() * 10) + 1;
  }

  private async getTodayActivities(userId: string): Promise<CrossModuleActivity[]> {
    const today = new Date().toDateString();
    
    // This would fetch from a unified activity log
    return [
      {
        userId,
        module: 'meditation',
        activityType: 'session_complete',
        data: {},
        timestamp: new Date()
      }
    ];
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export const unifiedAchievementSystem = UnifiedAchievementSystem.getInstance();
