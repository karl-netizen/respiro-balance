
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { 
  DashboardWelcome, 
  DashboardStats,
  WeeklyProgressCard,
  MoodTracker,
  RecommendationCard,
  QuickAccessSection,
  ActivityCalendar
} from '@/components/dashboard';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';
import { MeditationStats } from '@/components/progress/types/meditationStats';

const Dashboard = () => {
  const { user } = useAuth();
  const { isPremium } = useSubscriptionContext();
  const [currentMood, setCurrentMood] = React.useState<string | null>(null);
  
  // Mock meditation stats - would come from API in real implementation
  const meditationStats: MeditationStats = {
    totalSessions: 15,
    totalMinutes: 345,
    weeklyGoal: 5,
    weeklyCompleted: 3,
    streak: 2,
    longestStreak: 7,
    lastSessionDate: new Date().toISOString(),
    sessionsThisWeek: 3,
    completionRate: 60,
    monthlyTrend: [],
    lastSession: "",
    focusScores: [],
    stressScores: [],
    achievements: [],
    moodCorrelation: {
      withMeditation: 0,
      withoutMeditation: 0,
    },
    focusCorrelation: {
      withMeditation: 0,
      withoutMeditation: 0,
    },
    dailyMinutes: [],
    achievementProgress: {
      unlocked: 0,
      total: 0,
    }
  };
  
  // Handle mood selection
  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
    // In real implementation, save to user profile
    console.log(`Mood selected: ${mood}`);
  };
  
  const userName = user?.email?.split('@')[0] || 'Friend';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <DashboardWelcome userName={userName} />
        
        {!isPremium && <SubscriptionBanner />}
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-6">
            <MoodTracker onMoodSelect={handleMoodSelect} currentMood={currentMood} />
            <RecommendationCard currentMood={currentMood} />
            <ActivityCalendar data={[]} />
          </div>
          
          <div className="md:col-span-4 space-y-6">
            <DashboardStats meditationStats={meditationStats} />
            <WeeklyProgressCard progress={meditationStats} />
            <QuickAccessSection isPremium={isPremium} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
