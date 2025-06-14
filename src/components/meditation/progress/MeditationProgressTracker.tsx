
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Calendar, Clock, Flame, Star } from 'lucide-react';
import { MeditationSession } from '@/types/meditation';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'sessions' | 'time' | 'streak' | 'rating';
}

interface MeditationStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  averageRating: number;
  favoriteCategory: string;
  thisWeekSessions: number;
  thisWeekMinutes: number;
}

interface MeditationProgressTrackerProps {
  sessions: MeditationSession[];
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

const defaultAchievements: Omit<Achievement, 'progress' | 'unlocked'>[] = [
  {
    id: 'first-session',
    title: 'First Steps',
    description: 'Complete your first meditation session',
    icon: '🌟',
    target: 1,
    category: 'sessions'
  },
  {
    id: 'sessions-5',
    title: 'Getting Started',
    description: 'Complete 5 meditation sessions',
    icon: '🎯',
    target: 5,
    category: 'sessions'
  },
  {
    id: 'sessions-25',
    title: 'Regular Practitioner',
    description: 'Complete 25 meditation sessions',
    icon: '🏆',
    target: 25,
    category: 'sessions'
  },
  {
    id: 'sessions-100',
    title: 'Meditation Master',
    description: 'Complete 100 meditation sessions',
    icon: '👑',
    target: 100,
    category: 'sessions'
  },
  {
    id: 'time-60',
    title: 'Hour of Mindfulness',
    description: 'Meditate for 60 minutes total',
    icon: '⏰',
    target: 60,
    category: 'time'
  },
  {
    id: 'time-300',
    title: 'Five Hours Strong',
    description: 'Meditate for 300 minutes total',
    icon: '⌛',
    target: 300,
    category: 'time'
  },
  {
    id: 'time-1000',
    title: 'Zen Guardian',
    description: 'Meditate for 1000 minutes total',
    icon: '🧘',
    target: 1000,
    category: 'time'
  },
  {
    id: 'streak-3',
    title: 'Three Days Running',
    description: 'Maintain a 3-day meditation streak',
    icon: '🔥',
    target: 3,
    category: 'streak'
  },
  {
    id: 'streak-7',
    title: 'Weekly Warrior',
    description: 'Maintain a 7-day meditation streak',
    icon: '🌟',
    target: 7,
    category: 'streak'
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day meditation streak',
    icon: '💎',
    target: 30,
    category: 'streak'
  },
  {
    id: 'rating-high',
    title: 'Quality Seeker',
    description: 'Maintain an average rating of 4.5 stars',
    icon: '⭐',
    target: 4.5,
    category: 'rating'
  }
];

const MeditationProgressTracker: React.FC<MeditationProgressTrackerProps> = ({
  sessions,
  onAchievementUnlocked
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<MeditationStats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageRating: 0,
    favoriteCategory: '',
    thisWeekSessions: 0,
    thisWeekMinutes: 0
  });

  // Calculate meditation statistics
  useEffect(() => {
    const completedSessions = sessions.filter(s => s.completed);
    const totalSessions = completedSessions.length;
    const totalMinutes = completedSessions.reduce((sum, s) => sum + s.duration, 0);
    
    // Calculate streaks
    const { currentStreak, longestStreak } = calculateStreaks(completedSessions);
    
    // Calculate average rating
    const ratedSessions = completedSessions.filter(s => s.rating);
    const averageRating = ratedSessions.length > 0
      ? ratedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / ratedSessions.length
      : 0;

    // Find favorite category
    const categoryCount: Record<string, number> = {};
    completedSessions.forEach(s => {
      categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
    });
    const favoriteCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    // This week's stats
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeekSessions = completedSessions.filter(s => 
      new Date(s.completed_at || s.started_at) > weekAgo
    );
    const thisWeekMinutes = thisWeekSessions.reduce((sum, s) => sum + s.duration, 0);

    setStats({
      totalSessions,
      totalMinutes,
      currentStreak,
      longestStreak,
      averageRating,
      favoriteCategory,
      thisWeekSessions: thisWeekSessions.length,
      thisWeekMinutes
    });
  }, [sessions]);

  // Calculate achievements
  useEffect(() => {
    const updatedAchievements = defaultAchievements.map(achievement => {
      let progress = 0;
      
      switch (achievement.category) {
        case 'sessions':
          progress = stats.totalSessions;
          break;
        case 'time':
          progress = stats.totalMinutes;
          break;
        case 'streak':
          progress = Math.max(stats.currentStreak, stats.longestStreak);
          break;
        case 'rating':
          progress = stats.averageRating;
          break;
      }

      const unlocked = progress >= achievement.target;
      
      return {
        ...achievement,
        progress,
        unlocked,
        unlockedAt: unlocked ? new Date() : undefined
      };
    });

    // Check for newly unlocked achievements
    const previouslyUnlocked = new Set(achievements.filter(a => a.unlocked).map(a => a.id));
    const newlyUnlocked = updatedAchievements.filter(a => 
      a.unlocked && !previouslyUnlocked.has(a.id)
    );

    newlyUnlocked.forEach(achievement => {
      if (onAchievementUnlocked) {
        onAchievementUnlocked(achievement);
      }
    });

    setAchievements(updatedAchievements);
  }, [stats, onAchievementUnlocked]);

  const calculateStreaks = (sessions: MeditationSession[]) => {
    if (sessions.length === 0) return { currentStreak: 0, longestStreak: 0 };

    // Sort sessions by date
    const sortedSessions = sessions
      .map(s => ({
        ...s,
        date: new Date(s.completed_at || s.started_at).toDateString()
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Get unique dates
    const uniqueDates = Array.from(new Set(sortedSessions.map(s => s.date)));
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    // Calculate longest streak
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Calculate current streak
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let streakDate = today;
    if (!uniqueDates.includes(today)) {
      streakDate = yesterdayStr;
    }

    if (uniqueDates.includes(streakDate)) {
      currentStreak = 1;
      for (let i = uniqueDates.indexOf(streakDate) - 1; i >= 0; i--) {
        const date = new Date(uniqueDates[i]);
        const nextDate = new Date(uniqueDates[i + 1]);
        const diffDays = (nextDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    return { currentStreak, longestStreak };
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const inProgressAchievements = achievements.filter(a => !a.unlocked && a.progress > 0);
  const lockedAchievements = achievements.filter(a => !a.unlocked && a.progress === 0);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Minutes</p>
                <p className="text-2xl font-bold">{stats.totalMinutes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{stats.currentStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}⭐</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
            <Badge variant="secondary">{unlockedAchievements.length}/{achievements.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Unlocked</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {unlockedAchievements.map(achievement => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In Progress Achievements */}
          {inProgressAchievements.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">In Progress</h4>
              <div className="space-y-3">
                {inProgressAchievements.map(achievement => (
                  <div key={achievement.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{achievement.icon}</span>
                        <div>
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {achievement.progress}/{achievement.target}
                      </div>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.target) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Locked</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lockedAchievements.map(achievement => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg opacity-60">
                    <div className="text-xl grayscale">{achievement.icon}</div>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationProgressTracker;
