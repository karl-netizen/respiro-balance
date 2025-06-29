
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Target, Trophy, Calendar, Star, TrendingUp } from 'lucide-react';

interface HabitStreak {
  id: string;
  habitType: 'meditation' | 'breathing' | 'mindfulness' | 'focus';
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: Date;
  targetFrequency: number; // days per week
  weeklyGoal: number;
  completedThisWeek: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'milestone' | 'consistency' | 'exploration';
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface Milestone {
  day: number;
  title: string;
  description: string;
  reward: string;
  completed: boolean;
}

export const HabitFormationSystem: React.FC = () => {
  const [streaks, setStreaks] = useState<HabitStreak[]>([
    {
      id: 'meditation',
      habitType: 'meditation',
      currentStreak: 7,
      longestStreak: 15,
      lastCompletedDate: new Date(),
      targetFrequency: 5,
      weeklyGoal: 5,
      completedThisWeek: 4
    },
    {
      id: 'breathing',
      habitType: 'breathing',
      currentStreak: 3,
      longestStreak: 8,
      lastCompletedDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      targetFrequency: 3,
      weeklyGoal: 3,
      completedThisWeek: 2
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_week',
      title: 'First Week Warrior',
      description: 'Complete 7 consecutive days of meditation',
      icon: '🏆',
      category: 'streak',
      requirement: 7,
      progress: 7,
      unlocked: true,
      unlockedAt: new Date()
    },
    {
      id: 'consistency_king',
      title: 'Consistency King',
      description: 'Maintain a 21-day streak',
      icon: '👑',
      category: 'streak',
      requirement: 21,
      progress: 7,
      unlocked: false
    },
    {
      id: 'explorer',
      title: 'Mindful Explorer',
      description: 'Try 5 different meditation types',
      icon: '🧭',
      category: 'exploration',
      requirement: 5,
      progress: 3,
      unlocked: false
    }
  ]);

  const [milestones] = useState<Milestone[]>([
    {
      day: 1,
      title: 'First Step',
      description: 'Complete your first meditation session',
      reward: 'Welcome badge',
      completed: true
    },
    {
      day: 3,
      title: 'Building Momentum',
      description: 'Three days in a row!',
      reward: 'Streak badge',
      completed: true
    },
    {
      day: 7,
      title: 'One Week Strong',
      description: 'Seven consecutive days of practice',
      reward: 'Warrior badge + Premium content unlock',
      completed: true
    },
    {
      day: 21,
      title: 'Habit Formed',
      description: 'Science says it takes 21 days to form a habit',
      reward: 'Master badge + Advanced features',
      completed: false
    },
    {
      day: 66,
      title: 'Automatic Habit',
      description: 'Your practice is now automatic!',
      reward: 'Legend status + Exclusive content',
      completed: false
    }
  ];

  const getStreakColor = (streak: number) => {
    if (streak >= 21) return 'text-purple-600';
    if (streak >= 14) return 'text-blue-600';
    if (streak >= 7) return 'text-green-600';
    if (streak >= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 21) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '🌟';
    if (streak >= 3) return '✨';
    return '💫';
  };

  const getMotivationalMessage = (streak: number, isToday: boolean) => {
    if (!isToday) {
      return "Don't break the chain! Complete today's session.";
    }
    
    if (streak >= 21) {
      return "Incredible! You've mastered the art of consistency! 🔥";
    }
    if (streak >= 14) {
      return "Two weeks strong! You're building a powerful habit! ⚡";
    }
    if (streak >= 7) {
      return "One week complete! You're on fire! 🌟";
    }
    if (streak >= 3) {
      return "Great momentum! Keep it going! ✨";
    }
    return "You're building something amazing! Every day counts! 💫";
  };

  const calculateNextMilestone = () => {
    const maxStreak = Math.max(...streaks.map(s => s.currentStreak));
    return milestones.find(m => m.day > maxStreak && !m.completed);
  };

  const nextMilestone = calculateNextMilestone();
  const totalSessions = streaks.reduce((sum, s) => sum + s.currentStreak, 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Habit Formation Journey</h2>
        <p className="text-muted-foreground">
          Build lasting wellness habits with psychology-backed motivation
        </p>
      </div>

      {/* Current Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {streaks.map(streak => {
          const isToday = new Date().toDateString() === streak.lastCompletedDate.toDateString();
          
          return (
            <Card key={streak.id} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 text-6xl opacity-10">
                {getStreakEmoji(streak.currentStreak)}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="capitalize">{streak.habitType}</span>
                  <Badge variant={isToday ? "default" : "secondary"}>
                    {isToday ? "Completed Today" : "Pending"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getStreakColor(streak.currentStreak)}`}>
                      {streak.currentStreak}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-muted-foreground">
                      {streak.longestStreak}
                    </div>
                    <div className="text-sm text-muted-foreground">Personal Best</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>This Week</span>
                    <span>{streak.completedThisWeek} / {streak.weeklyGoal}</span>
                  </div>
                  <Progress 
                    value={(streak.completedThisWeek / streak.weeklyGoal) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="text-sm text-center p-3 bg-muted rounded-lg">
                  {getMotivationalMessage(streak.currentStreak, isToday)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Next Milestone */}
      {nextMilestone && (
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Next Milestone: {nextMilestone.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{nextMilestone.description}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Day {nextMilestone.day}</span>
                <span>{Math.max(...streaks.map(s => s.currentStreak))} / {nextMilestone.day}</span>
              </div>
              <Progress 
                value={(Math.max(...streaks.map(s => s.currentStreak)) / nextMilestone.day) * 100} 
                className="h-3"
              />
            </div>

            <div className="bg-white p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-600 mb-1">Reward:</div>
              <div className="text-sm">{nextMilestone.reward}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 w-5 text-yellow-600" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(achievement => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked 
                    ? 'border-yellow-300 bg-yellow-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-center space-y-2">
                  <div className="text-3xl">{achievement.icon}</div>
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  
                  {!achievement.unlocked && (
                    <div className="space-y-1">
                      <Progress 
                        value={(achievement.progress / achievement.requirement) * 100} 
                        className="h-2"
                      />
                      <div className="text-xs text-muted-foreground">
                        {achievement.progress} / {achievement.requirement}
                      </div>
                    </div>
                  )}
                  
                  {achievement.unlocked && (
                    <Badge variant="default" className="bg-yellow-500">
                      Unlocked!
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            This Week's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {streaks.reduce((sum, s) => sum + s.completedThisWeek, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Sessions This Week</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.max(...streaks.map(s => s.currentStreak))}
              </div>
              <div className="text-sm text-muted-foreground">Current Best Streak</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {achievements.filter(a => a.unlocked).length}
              </div>
              <div className="text-sm text-muted-foreground">Achievements Earned</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round((streaks.reduce((sum, s) => sum + s.completedThisWeek, 0) / streaks.reduce((sum, s) => sum + s.weeklyGoal, 0)) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Weekly Goal</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
