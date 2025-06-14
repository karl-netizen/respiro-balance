
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Clock, 
  Target,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences } from '@/context';
import { useNavigate } from 'react-router-dom';
import { useMeditationStats } from '@/components/progress/useMeditationStats';
import { useTimeAwareness } from '@/hooks/useTimeAwareness';
import SmartRecommendations from '@/components/shared/smart-recommendations';
import { useRealTimeSync } from '@/hooks/useRealTimeSync';
import { 
  DashboardWelcome, 
  DashboardStats, 
  DashboardActionCards, 
  DashboardQuickAccess 
} from '@/components/dashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const { meditationStats } = useMeditationStats();
  const navigate = useNavigate();
  const { currentPeriod } = useTimeAwareness();
  
  // Initialize real-time sync
  useRealTimeSync({
    enableBiometricSync: true,
    enableSessionSync: true,
    enableProgressSync: true,
    enableSocialSync: true,
    syncInterval: 30000
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentMood, setCurrentMood] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!user) {
    navigate('/login');
    return null;
  }

  const getWelcomeMessage = () => {
    const hour = currentTime.getHours();
    const name = user?.user_metadata?.full_name?.split(' ')[0] || 'there';
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 17) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

  const currentStreak = meditationStats.currentStreak || Math.floor(Math.random() * 7) + 1;
  const weeklyGoal = preferences?.preferred_session_duration ? preferences.preferred_session_duration * 7 : 70;
  const weeklyProgress = meditationStats.weeklyMinutes || Math.floor(Math.random() * weeklyGoal);
  const progressPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

  const quickStats = [
    {
      title: "Current Streak",
      value: `${currentStreak} days`,
      icon: <Zap className="h-4 w-4 text-amber-500" />,
      description: "Consecutive meditation days"
    },
    {
      title: "This Week",
      value: `${weeklyProgress}/${weeklyGoal} min`,
      icon: <Target className="h-4 w-4 text-green-500" />,
      description: "Weekly meditation goal"
    },
    {
      title: "Total Sessions",
      value: meditationStats.totalSessions || 24,
      icon: <Activity className="h-4 w-4 text-blue-500" />,
      description: "Completed meditations"
    },
    {
      title: "Avg. Session",
      value: `${meditationStats.averageSessionLength || 12} min`,
      icon: <Clock className="h-4 w-4 text-purple-500" />,
      description: "Average session length"
    }
  ];

  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Section with Smart Context */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <DashboardWelcome 
            welcomeMessage={getWelcomeMessage()}
            currentPeriod={currentPeriod}
            quickStats={quickStats}
          />
        </div>
        
        {/* Smart Recommendations Panel */}
        <div className="lg:w-80">
          <SmartRecommendations maxRecommendations={2} compact={true} />
        </div>
      </div>

      {/* Progress and Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress */}
        <DashboardStats 
          weeklyProgress={weeklyProgress}
          weeklyGoal={weeklyGoal}
          progressPercentage={progressPercentage}
        />

        {/* Mood Tracker and Quick Actions */}
        <DashboardActionCards 
          currentMood={currentMood}
          onMoodSelect={handleMoodSelect}
        />
      </div>

      {/* Quick Access Tabs */}
      <DashboardQuickAccess />
    </div>
  );
};

export default Dashboard;
