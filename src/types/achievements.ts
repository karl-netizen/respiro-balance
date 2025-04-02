
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  unlockedDate?: string;
}

export interface AchievementCategory {
  id: string;
  name: string;
  description: string;
  achievements: Achievement[];
}

export interface AchievementNotification {
  id: string;
  achievementId: string;
  title: string;
  message: string;
  icon: string;
  read: boolean;
  time: string;
}

export interface AchievementStats {
  total: number;
  unlocked: number;
  percentComplete: number;
  recentUnlocked?: Achievement;
}
