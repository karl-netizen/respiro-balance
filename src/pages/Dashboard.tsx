
import React, { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from '@/hooks/useAuth';
import { MeditationHistoryList } from '@/components/meditation/MeditationHistoryList';
import { useMeditationStats } from '@/components/progress/useMeditationStats';
import { useSubscriptionContext } from '@/hooks/useSubscriptionContext';
import { useUserPreferences } from '@/context';
import { 
  DashboardWelcome,
  DashboardStats,
  WeeklyProgressCard,
  MoodTracker,
  RecommendationCard,
  QuickAccessSection
} from '@/components/dashboard';
import SubscriptionBanner from "@/components/subscription/SubscriptionBanner";
import { Card } from '@/components/ui/card';
import ViewportToggle from '@/components/layout/ViewportToggle';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { user } = useAuth();
  const { isPremium } = useSubscriptionContext();
  const { preferences } = useUserPreferences();
  const { meditationStats, sessions } = useMeditationStats();
  const isMobile = useIsMobile();
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  
  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
    // In a real app, this would save the mood to user data
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${isMobile ? 'mobile-view' : ''}`}>
      <Header />
      
      <main className="flex-grow px-4 py-6 md:px-6">
        <div className="max-w-6xl mx-auto">
          <DashboardWelcome 
            userName={user?.name || user?.email?.split('@')[0] || 'Friend'} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <MoodTracker 
                onMoodSelect={handleMoodSelect} 
                currentMood={currentMood}
              />
            </div>
            
            <DashboardStats meditationStats={meditationStats} />
          </div>
          
          {!isPremium && <SubscriptionBanner className="mb-6" />}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <RecommendationCard currentMood={currentMood} />
              
              <Card className="p-4 mt-6">
                <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                <MeditationHistoryList />
              </Card>
            </div>
            
            <div className="space-y-6">
              <WeeklyProgressCard 
                meditationStats={meditationStats} 
                sessions={sessions || []} 
              />
              
              <QuickAccessSection isPremium={isPremium} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <ViewportToggle />
    </div>
  );
};

export default Dashboard;
