import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Award, Flame, Target, Star, Trophy } from 'lucide-react';
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface HabitStreak {
  type: string;
  current: number;
  longest: number;
  lastActivity: Date;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  completed: boolean;
}

export const HabitFormationSystem: React.FC = () => {
  const { user } = useAuth();
  const [streaks, setStreaks] = useState<HabitStreak[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    loadUserProgress();
  }, [user]);

  const loadUserProgress = async () => {
    // Mock data - would fetch from API
    setStreaks([
      {
        type: 'meditation',
        current: 7,
        longest: 12,
        lastActivity: new Date()
      },
      {
        type: 'breathing',
        current: 3,
        longest: 8,
        lastActivity: new Date()
      }
    ]);

    setAchievements([
      {
        id: 'first_session',
        title: 'First Steps',
        description: 'Complete your first meditation session',
        icon: <Star className="w-5 h-5" />,
        progress: 1,
        maxProgress: 1,
        unlocked: true,
        rarity: 'common'
      },
      {
        id: 'week_streak',
        title: 'Consistency Master',
        description: 'Maintain a 7-day meditation streak',
        icon: <Flame className="w-5 h-5" />,
        progress: 7,
        maxProgress: 7,
        unlocked: true,
        rarity: 'rare'
      },
      {
        id: 'perfect_month',
        title: 'Zen Master',
        description: 'Complete 30 days of perfect meditation',
        icon: <Trophy className="w-5 h-5" />,
        progress: 15,
        maxProgress: 30,
        unlocked: false,
        rarity: 'legendary'
      }
    ]);

    setMilestones([
      {
        id: 'sessions_10',
        title: '10 Sessions Milestone',
        description: 'Complete 10 meditation sessions',
        progress: 8,
        target: 10,
        reward: '50 bonus points',
        completed: false
      },
      {
        id: 'minutes_100',
        title: '100 Minutes Milestone',
        description: 'Meditate for 100 total minutes',
        progress: 75,
        target: 100,
        reward: 'Exclusive breathing pattern',
        completed: false
      }
    ]);

    setTotalPoints(1250);
    setLevel(3);
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Level and Points Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Level {level}</div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {achievements.filter(a => a.unlocked).length}
              </div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Streaks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5" />
            Current Streaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {streaks.map((streak, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <div>
                  <div className="font-semibold capitalize">{streak.type} Streak</div>
                  <div className="text-sm text-muted-foreground">
                    Longest: {streak.longest} days
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">
                    {streak.current}
                  </div>
                  <div className="text-sm text-muted-foreground">days</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {achievement.icon}
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                  {achievement.unlocked && (
                    <div className="text-green-600">
                      <Award className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold mb-1">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {achievement.description}
                </p>
                <Progress
                  value={(achievement.progress / achievement.maxProgress) * 100}
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {achievement.progress} / {achievement.maxProgress}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Current Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-4 rounded-lg border ${
                  milestone.completed
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{milestone.title}</h3>
                  <Badge variant="outline" className="text-purple-600">
                    {milestone.reward}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {milestone.description}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <Progress
                    value={(milestone.progress / milestone.target) * 100}
                    className="flex-1 mr-4"
                  />
                  <span className="text-sm font-medium">
                    {milestone.progress} / {milestone.target}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
