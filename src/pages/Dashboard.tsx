
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences } from '@/context';
import { useOnboardingTrigger } from '@/hooks/useOnboardingTrigger';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
import { useTimeAwareness } from '@/hooks/useTimeAwareness';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { preferences } = useUserPreferences();
  
  // Use the onboarding trigger hook
  useOnboardingTrigger();
  
  // State for tracking overall loading state
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/landing');
      } else {
        // Set a timeout to prevent infinite loading
        const timer = setTimeout(() => {
          setIsPageLoading(false);
        }, 5000); // Force loading to end after 5 seconds max
        
        // Clear timeout if component unmounts
        return () => clearTimeout(timer);
      }
    }
  }, [user, isLoading, navigate]);
  
  // Force loading to end if it takes too long
  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timer = setTimeout(() => {
      if (isPageLoading) {
        console.log("Force ending loading state after timeout");
        setIsPageLoading(false);
      }
    }, 5000); // Force loading to end after 5 seconds max
    
    // Clear timeout if component unmounts
    return () => clearTimeout(timer);
  }, [isPageLoading]);

  // Show loading state while checking auth
  if (isLoading || isPageLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render the dashboard
  if (!user) {
    return null;
  }
  
  // Initialize error handling for data hooks
  try {
    const { isPremium } = useSubscriptionContext();
    const { sessions } = useMeditationSessions();
    const [currentMood, setCurrentMood] = useState<string | null>(null);
    const { timePeriod, recommendations, recordMood, getGreeting } = useTimeAwareness();
    
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
      // Record mood in TimeAwarenessService
      recordMood(mood);
      
      // Store the mood in local storage for persistence
      localStorage.setItem('currentMood', mood);
      localStorage.setItem('moodTimestamp', new Date().toISOString());
      console.log(`Mood selected: ${mood} during ${timePeriod}`);
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
          <DashboardWelcome 
            userName={userName} 
            greeting={getGreeting(userName)} 
            timePeriod={timePeriod}
          />
          
          {!isPremium && <SubscriptionBanner />}
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-6">
              <MoodTracker onMoodSelect={handleMoodSelect} currentMood={currentMood} />
              <RecommendationCard 
                currentMood={currentMood} 
                timeOfDay={timePeriod}
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
  } catch (error) {
    console.error("Error rendering dashboard:", error);
    toast.error("There was an issue loading your dashboard. Please try refreshing the page.");
    
    // Fallback UI when data hooks fail
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              We had trouble loading your dashboard data. This might be due to network issues or 
              a temporary service disruption.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
};

export default Dashboard;

