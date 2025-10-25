import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Star, 
  Crown, 
  Target,
  Calendar,
  Flame,
  Heart,
  Brain,
  Clock,
  Award,
  Gift,
  Sparkles,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'streak' | 'session' | 'time' | 'special' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  xpReward: number;
  coinReward: number;
  condition: string;
}

interface UserStats {
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  totalMinutes: number;
  averageSessionLength: number;
  favoriteCategory: string;
  level: number;
  xp: number;
  coins: number;
  achievements: string[];
}

interface GamifiedAchievementSystemProps {
  userStats: UserStats;
  onClaimReward: (achievement: Achievement) => void;
}

const GamifiedAchievementSystem: React.FC<GamifiedAchievementSystemProps> = ({
  userStats,
  onClaimReward
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentUnlocks, setRecentUnlocks] = useState<Achievement[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Achievement definitions
  const achievementDefinitions: Omit<Achievement, 'progress' | 'isUnlocked' | 'unlockedAt'>[] = [
    // Streak Achievements
    {
      id: 'first_session',
      title: 'First Steps',
      description: 'Complete your first meditation session',
      icon: <Star className="w-6 h-6" />,
      category: 'session',
      rarity: 'common',
      maxProgress: 1,
      xpReward: 50,
      coinReward: 10,
      condition: 'Complete 1 session'
    },
    {
      id: 'streak_3',
      title: 'Getting Started',
      description: 'Maintain a 3-day streak',
      icon: <Flame className="w-6 h-6" />,
      category: 'streak',
      rarity: 'common',
      maxProgress: 3,
      xpReward: 100,
      coinReward: 25,
      condition: '3-day streak'
    },
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: 'Complete a 7-day meditation streak',
      icon: <Trophy className="w-6 h-6" />,
      category: 'streak',
      rarity: 'rare',
      maxProgress: 7,
      xpReward: 200,
      coinReward: 50,
      condition: '7-day streak'
    },
    {
      id: 'streak_30',
      title: 'Monthly Master',
      description: 'Achieve a 30-day meditation streak',
      icon: <Crown className="w-6 h-6" />,
      category: 'streak',
      rarity: 'epic',
      maxProgress: 30,
      xpReward: 500,
      coinReward: 150,
      condition: '30-day streak'
    },
    {
      id: 'streak_100',
      title: 'Zen Legend',
      description: 'Maintain a 100-day streak - true dedication!',
      icon: <Crown className="w-6 h-6 text-gold" />,
      category: 'streak',
      rarity: 'legendary',
      maxProgress: 100,
      xpReward: 1000,
      coinReward: 500,
      condition: '100-day streak'
    },
    
    // Session Count Achievements
    {
      id: 'sessions_10',
      title: 'Dedicated Practitioner',
      description: 'Complete 10 total sessions',
      icon: <Target className="w-6 h-6" />,
      category: 'session',
      rarity: 'common',
      maxProgress: 10,
      xpReward: 150,
      coinReward: 30,
      condition: '10 total sessions'
    },
    {
      id: 'sessions_50',
      title: 'Mindful Explorer',
      description: 'Complete 50 total sessions',
      icon: <Brain className="w-6 h-6" />,
      category: 'session',
      rarity: 'rare',
      maxProgress: 50,
      xpReward: 300,
      coinReward: 75,
      condition: '50 total sessions'
    },
    {
      id: 'sessions_100',
      title: 'Meditation Master',
      description: 'Complete 100 total sessions',
      icon: <Award className="w-6 h-6" />,
      category: 'session',
      rarity: 'epic',
      maxProgress: 100,
      xpReward: 750,
      coinReward: 200,
      condition: '100 total sessions'
    },
    
    // Time-based Achievements
    {
      id: 'time_1h',
      title: 'Hour of Peace',
      description: 'Meditate for a total of 1 hour',
      icon: <Clock className="w-6 h-6" />,
      category: 'time',
      rarity: 'common',
      maxProgress: 60,
      xpReward: 100,
      coinReward: 20,
      condition: '60 minutes total'
    },
    {
      id: 'time_10h',
      title: 'Deep Diver',
      description: 'Accumulate 10 hours of meditation',
      icon: <Heart className="w-6 h-6" />,
      category: 'time',
      rarity: 'rare',
      maxProgress: 600,
      xpReward: 400,
      coinReward: 100,
      condition: '600 minutes total'
    },
    {
      id: 'time_50h',
      title: 'Zen Devotee',
      description: 'Reach 50 hours of total meditation',
      icon: <Sparkles className="w-6 h-6" />,
      category: 'time',
      rarity: 'epic',
      maxProgress: 3000,
      xpReward: 1000,
      coinReward: 300,
      condition: '3000 minutes total'
    },
    
    // Special Achievements
    {
      id: 'early_bird',
      title: 'Early Bird',
      description: 'Complete 5 morning meditation sessions',
      icon: <Calendar className="w-6 h-6" />,
      category: 'special',
      rarity: 'rare',
      maxProgress: 5,
      xpReward: 250,
      coinReward: 60,
      condition: '5 morning sessions'
    },
    {
      id: 'night_owl',
      title: 'Night Owl',
      description: 'Complete 5 evening meditation sessions',
      icon: <Calendar className="w-6 h-6" />,
      category: 'special',
      rarity: 'rare',
      maxProgress: 5,
      xpReward: 250,
      coinReward: 60,
      condition: '5 evening sessions'
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Complete 10 full sessions without skipping',
      icon: <CheckCircle className="w-6 h-6" />,
      category: 'special',
      rarity: 'epic',
      maxProgress: 10,
      xpReward: 500,
      coinReward: 150,
      condition: '10 complete sessions'
    }
  ];

  const categories = [
    { id: 'all', label: 'All', icon: Trophy },
    { id: 'streak', label: 'Streaks', icon: Flame },
    { id: 'session', label: 'Sessions', icon: Target },
    { id: 'time', label: 'Time', icon: Clock },
    { id: 'special', label: 'Special', icon: Star }
  ];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBorderColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  // Calculate achievement progress based on user stats
  const calculateProgress = (achievement: Omit<Achievement, 'progress' | 'isUnlocked' | 'unlockedAt'>) => {
    switch (achievement.id) {
      case 'first_session':
        return Math.min(userStats.totalSessions, 1);
      case 'streak_3':
        return Math.min(userStats.currentStreak, 3);
      case 'streak_7':
        return Math.min(userStats.currentStreak, 7);
      case 'streak_30':
        return Math.min(userStats.currentStreak, 30);
      case 'streak_100':
        return Math.min(userStats.currentStreak, 100);
      case 'sessions_10':
        return Math.min(userStats.totalSessions, 10);
      case 'sessions_50':
        return Math.min(userStats.totalSessions, 50);
      case 'sessions_100':
        return Math.min(userStats.totalSessions, 100);
      case 'time_1h':
        return Math.min(userStats.totalMinutes, 60);
      case 'time_10h':
        return Math.min(userStats.totalMinutes, 600);
      case 'time_50h':
        return Math.min(userStats.totalMinutes, 3000);
      default:
        return 0;
    }
  };

  // Initialize achievements
  useEffect(() => {
    const processedAchievements = achievementDefinitions.map(def => {
      const progress = calculateProgress(def);
      const isUnlocked = userStats.achievements.includes(def.id) || progress >= def.maxProgress;
      
      return {
        ...def,
        progress,
        isUnlocked,
        unlockedAt: isUnlocked ? new Date() : undefined
      };
    });

    setAchievements(processedAchievements);

    // Check for new unlocks
    const newUnlocks = processedAchievements.filter(
      achievement => 
        achievement.isUnlocked && 
        !userStats.achievements.includes(achievement.id) &&
        achievement.progress >= achievement.maxProgress
    );

    if (newUnlocks.length > 0) {
      setRecentUnlocks(newUnlocks);
      setShowCelebration(true);
      
      newUnlocks.forEach(achievement => {
        setTimeout(() => {
          toast.success(`🎉 Achievement Unlocked!`, {
            description: `${achievement.title}: ${achievement.description}`,
            action: {
              label: "Claim Reward",
              onClick: () => onClaimReward(achievement)
            }
          });
        }, 500);
      });
    }
  }, [userStats]);

  const filteredAchievements = achievements.filter(
    achievement => selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalAchievements = achievements.length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Achievements</h2>
            <p className="text-muted-foreground">
              {unlockedCount} of {totalAchievements} unlocked
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{userStats.level}</div>
            <div className="text-sm text-muted-foreground">Level</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round((unlockedCount / totalAchievements) * 100)}%</span>
          </div>
          <Progress value={(unlockedCount / totalAchievements) * 100} className="h-3" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                achievement.isUnlocked 
                  ? `${getRarityBorderColor(achievement.rarity)} shadow-md` 
                  : 'border-border opacity-75'
              }`}
            >
              {/* Rarity Glow Effect */}
              {achievement.isUnlocked && (
                <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(achievement.rarity)} opacity-10`} />
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-full ${
                    achievement.isUnlocked 
                      ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white` 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant={achievement.isUnlocked ? "default" : "secondary"}
                      className={`text-xs ${
                        achievement.isUnlocked ? getRarityColor(achievement.rarity).replace('from-', 'bg-').replace(' to-', '').split(' ')[0] : ''
                      }`}
                    >
                      {achievement.rarity}
                    </Badge>
                    {achievement.isUnlocked && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <CardTitle className="text-base font-semibold mb-1">
                      {achievement.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {achievement.description}
                    </p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{achievement.progress}</span>
                      <span>{achievement.maxProgress}</span>
                    </div>
                    <Progress 
                      value={(achievement.progress / achievement.maxProgress) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  {/* Rewards */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-blue-500" />
                        <span>{achievement.xpReward} XP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gift className="w-3 h-3 text-yellow-500" />
                        <span>{achievement.coinReward}</span>
                      </div>
                    </div>
                    
                    {achievement.isUnlocked && !userStats.achievements.includes(achievement.id) && (
                      <Button 
                        size="sm" 
                        onClick={() => onClaimReward(achievement)}
                        className="text-xs"
                      >
                        Claim
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-background rounded-lg p-6 text-center max-w-sm mx-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center"
              >
                <Trophy className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground mb-2">Achievement Unlocked!</h3>
              <p className="text-muted-foreground mb-4">
                You've unlocked {recentUnlocks.length} new achievement{recentUnlocks.length > 1 ? 's' : ''}!
              </p>
              <Button onClick={() => setShowCelebration(false)}>
                Awesome!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamifiedAchievementSystem;