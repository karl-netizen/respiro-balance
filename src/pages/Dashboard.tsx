
import React, { useState, useEffect } from 'react';
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
  ActivityCalendar,
  ActivityEntry
} from '@/components/dashboard';
import SubscriptionBanner from '@/components/subscription/SubscriptionBanner';
import { MeditationStats } from '@/components/progress/types/meditationStats';
import { format, subDays } from 'date-fns';
import { useMeditationSessions } from '@/hooks/useMeditationSessions';

const Dashboard = () => {
  const { user } = useAuth();
  const { isPremium } = useSubscriptionContext();
  const { sessions } = useMeditationSessions();
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  
  // Mock meditation stats - would come from API in real implementation
  const meditationStats: MeditationStats = {
    totalSessions: sessions?.length || 15,
    totalMinutes: sessions?.reduce((total, session) => total + session.duration, 0) || 345,
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
    
    // Store the mood in local storage for persistence
    localStorage.setItem('currentMood', mood);
    localStorage.setItem('moodTimestamp', new Date().toISOString());
  };
  
  // Load saved mood from local storage on component mount
  useEffect(() => {
    const savedMood = localStorage.getItem('currentMood');
    const moodTimestamp = localStorage.getItem('moodTimestamp');
    
    // Only use the saved mood if it was set within the last 12 hours
    if (savedMood && moodTimestamp) {
      const moodTime = new Date(moodTimestamp).getTime();
      const currentTime = new Date().getTime();
      const hoursDiff = (currentTime - moodTime) / (1000 * 60 * 60);
      
      if (hoursDiff < 12) {
        setCurrentMood(savedMood);
      }
    }
  }, []);
  
  const userName = user?.email?.split('@')[0] || 'Friend';
  
  // Create activity data from meditation sessions
  const activityData: ActivityEntry[] = React.useMemo(() => {
    // If we have real sessions, use them
    if (sessions && sessions.length > 0) {
      const sessionMap = new Map<string, number>();
      
      // Group sessions by date and sum up durations
      sessions.forEach(session => {
        if (!session.started_at) return;
        
        const dateStr = session.started_at.split('T')[0]; // Extract YYYY-MM-DD
        const currentValue = sessionMap.get(dateStr) || 0;
        sessionMap.set(dateStr, currentValue + session.duration);
      });
      
      // Convert map to activity entries
      return Array.from(sessionMap.entries()).map(([date, value]) => ({
        date,
        value,
        type: 'meditation'
      }));
    }
    
    // Generate some example data for the past 30 days if no real data
    return Array(30).fill(0).map((_, i) => {
      const date = subDays(new Date(), i);
      // Format as YYYY-MM-DD string
      return {
        date: format(date, 'yyyy-MM-dd'), 
        value: Math.random() > 0.3 ? Math.floor(Math.random() * 60) : 0,
        type: 'meditation'
      };
    });
  }, [sessions]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <DashboardWelcome userName={userName} />
        
        {!isPremium && <SubscriptionBanner />}
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-6">
            <MoodTracker onMoodSelect={handleMoodSelect} currentMood={currentMood} />
            <RecommendationCard 
              currentMood={currentMood} 
              timeOfDay={
                new Date().getHours() < 12 ? 'morning' :
                new Date().getHours() < 18 ? 'afternoon' : 'evening'
              }
              recentSessions={sessions?.length || 0}
            />
            <ActivityCalendar data={activityData} />
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
