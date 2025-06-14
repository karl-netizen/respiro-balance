
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'session' | 'streak' | 'performance' | 'time';
  threshold: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
}

export const useAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  const defaultAchievements: Omit<Achievement, 'unlocked' | 'progress' | 'unlockedAt'>[] = [
    {
      id: 'first-focus',
      title: 'First Focus',
      description: 'Complete your first focus session',
      icon: '🎯',
      category: 'session',
      threshold: 1
    },
    {
      id: 'focus-starter',
      title: 'Focus Starter',
      description: 'Maintain a 3-day focus streak',
      icon: '🔥',
      category: 'streak',
      threshold: 3
    },
    {
      id: 'dedicated-focuser',
      title: 'Dedicated Focuser',
      description: 'Achieve a 7-day focus streak',
      icon: '⭐',
      category: 'streak',
      threshold: 7
    },
    {
      id: 'focus-champion',
      title: 'Focus Champion',
      description: 'Complete a 30-day focus streak',
      icon: '👑',
      category: 'streak',
      threshold: 30
    },
    {
      id: 'century-club',
      title: 'Century Club',
      description: 'Complete 100 total focus sessions',
      icon: '💯',
      category: 'session',
      threshold: 100
    },
    {
      id: 'zen-focus',
      title: 'Zen Focus',
      description: 'Achieve a perfect focus score (100/100)',
      icon: '🧘',
      category: 'performance',
      threshold: 100
    },
    {
      id: 'marathon-master',
      title: 'Marathon Master',
      description: 'Complete 10 hours of focus in one week',
      icon: '🏃',
      category: 'time',
      threshold: 600 // 10 hours in minutes
    },
    {
      id: 'efficiency-expert',
      title: 'Efficiency Expert',
      description: 'Maintain 95%+ completion rate',
      icon: '⚡',
      category: 'performance',
      threshold: 95
    }
  ];

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    if (!user) return;

    try {
      // Get user's achievement progress
      const { data: userAchievements, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Get current stats for progress calculation
      const stats = await calculateUserStats();

      const achievementsWithProgress = defaultAchievements.map(achievement => {
        const userAchievement = userAchievements?.find(ua => ua.achievement_id === achievement.id);
        const progress = calculateProgress(achievement, stats);
        
        return {
          ...achievement,
          unlocked: userAchievement?.unlocked || false,
          unlockedAt: userAchievement?.unlocked_at ? new Date(userAchievement.unlocked_at) : undefined,
          progress
        };
      });

      setAchievements(achievementsWithProgress);

      // Check for newly unlocked achievements
      const newlyUnlocked = achievementsWithProgress.filter(a => 
        !a.unlocked && a.progress >= a.threshold
      );

      if (newlyUnlocked.length > 0) {
        await unlockAchievements(newlyUnlocked);
      }

    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const calculateUserStats = async () => {
    if (!user) return {};

    const { data: sessions, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    const completedSessions = sessions?.filter(s => s.completed) || [];
    const totalSessions = completedSessions.length;
    const totalMinutes = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const averageFocusScore = completedSessions.length > 0 
      ? completedSessions.reduce((sum, s) => sum + (s.focus_score || 0), 0) / completedSessions.length 
      : 0;
    const maxFocusScore = Math.max(...completedSessions.map(s => s.focus_score || 0), 0);
    const completionRate = sessions && sessions.length > 0 
      ? (completedSessions.length / sessions.length) * 100 
      : 0;

    // Calculate current streak
    const currentStreak = calculateCurrentStreak(sessions || []);

    // Calculate weekly minutes
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyMinutes = completedSessions
      .filter(s => new Date(s.start_time) >= oneWeekAgo)
      .reduce((sum, s) => sum + (s.duration || 0), 0);

    return {
      totalSessions,
      totalMinutes,
      weeklyMinutes,
      averageFocusScore,
      maxFocusScore,
      completionRate,
      currentStreak
    };
  };

  const calculateProgress = (achievement: any, stats: any) => {
    switch (achievement.category) {
      case 'session':
        return stats.totalSessions || 0;
      case 'streak':
        return stats.currentStreak || 0;
      case 'performance':
        if (achievement.id === 'zen-focus') {
          return stats.maxFocusScore || 0;
        }
        if (achievement.id === 'efficiency-expert') {
          return stats.completionRate || 0;
        }
        return 0;
      case 'time':
        if (achievement.id === 'marathon-master') {
          return stats.weeklyMinutes || 0;
        }
        return stats.totalMinutes || 0;
      default:
        return 0;
    }
  };

  const calculateCurrentStreak = (sessions: any[]): number => {
    if (sessions.length === 0) return 0;

    const completedSessions = sessions.filter(s => s.completed);
    if (completedSessions.length === 0) return 0;

    // Group sessions by date
    const sessionsByDate = new Map<string, any[]>();
    completedSessions.forEach(session => {
      const date = new Date(session.start_time).toDateString();
      if (!sessionsByDate.has(date)) {
        sessionsByDate.set(date, []);
      }
      sessionsByDate.get(date)!.push(session);
    });

    // Calculate streak
    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);

    while (true) {
      const dateString = currentDate.toDateString();
      if (sessionsByDate.has(dateString)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        if (streak === 0 && dateString === today.toDateString()) {
          currentDate.setDate(currentDate.getDate() - 1);
          continue;
        }
        break;
      }
    }

    return streak;
  };

  const unlockAchievements = async (newAchievements: Achievement[]) => {
    if (!user) return;

    try {
      // Save to database
      const achievementRecords = newAchievements.map(achievement => ({
        user_id: user.id,
        achievement_id: achievement.id,
        unlocked: true,
        unlocked_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('user_achievements')
        .upsert(achievementRecords);

      if (error) throw error;

      // Update local state
      setAchievements(prev => prev.map(achievement => {
        const newAchievement = newAchievements.find(na => na.id === achievement.id);
        if (newAchievement) {
          return { ...achievement, unlocked: true, unlockedAt: new Date() };
        }
        return achievement;
      }));

      // Show notifications
      setNewAchievements(newAchievements);

    } catch (error) {
      console.error('Error unlocking achievements:', error);
    }
  };

  const dismissNewAchievements = () => {
    setNewAchievements([]);
  };

  return {
    achievements,
    newAchievements,
    dismissNewAchievements,
    refreshAchievements: loadAchievements
  };
};
