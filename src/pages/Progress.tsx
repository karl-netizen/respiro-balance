
import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserPreferences } from "@/context";
import { 
  ProgressHero, 
  OverviewTab, 
  InsightsTab, 
  AchievementsTab,
  CorrelationsTab,
  useMeditationStats
} from "@/components/progress";
import { useSubscriptionContext } from "@/hooks/useSubscriptionContext";
import { useIsMobile } from "@/hooks/use-mobile";
import ViewportToggle from "@/components/layout/ViewportToggle";
import SubscriptionBanner from "@/components/subscription/SubscriptionBanner";
import { ActivityCalendar } from '@/components/dashboard';
import { useLocation, useNavigate } from "react-router-dom";
import { Achievement } from '@/types/achievements';

const Progress = () => {
  const { preferences } = useUserPreferences();
  const location = useLocation();
  const navigate = useNavigate();
  const { isPremium } = useSubscriptionContext();
  const isMobile = useIsMobile();
  
  // Parse tab from URL query parameters
  const getTabFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    return tab && ['overview', 'insights', 'correlations', 'achievements'].includes(tab) 
      ? tab 
      : "overview";
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromUrl());
  const { meditationStats, sessions } = useMeditationStats();
  
  // Update URL when tab changes
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    
    // Update URL without reloading page
    const params = new URLSearchParams(location.search);
    params.set('tab', tabValue);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };
  
  // Listen for URL changes
  useEffect(() => {
    setActiveTab(getTabFromUrl());
  }, [location]);
  
  // Generate activity data for calendar
  const activityData = meditationStats.dailyMinutes?.map(day => ({
    date: new Date(), // This would be based on the actual date in a real app
    minutesCount: day.minutes,
    sessionsCount: day.sessions
  })) || [];
  
  // Convert achievements to match the expected type
  const achievements: Achievement[] = meditationStats.achievements.map(achievement => ({
    id: achievement.name.toLowerCase().replace(/\s+/g, '-'), // Create ID from name
    name: achievement.name,
    description: achievement.description,
    icon: achievement.icon || "award",
    unlocked: achievement.unlocked,
    progress: achievement.progress || 0,
    unlockedDate: achievement.unlockedDate
  }));
  
  return (
    <div className={`min-h-screen flex flex-col ${isMobile ? 'mobile-view' : ''}`}>
      <Header />
      
      <main className="flex-grow">
        <ProgressHero />
        
        {!isPremium && <SubscriptionBanner />}
        
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <Tabs 
              defaultValue={activeTab} 
              value={activeTab} 
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="correlations">Correlations</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="mb-6">
                  <ActivityCalendar data={activityData} />
                </div>
                <OverviewTab 
                  meditationStats={meditationStats} 
                  sessions={sessions || []} 
                />
              </TabsContent>
              
              <TabsContent value="insights" className="mt-0">
                <InsightsTab />
              </TabsContent>
              
              <TabsContent value="correlations" className="mt-0">
                {isPremium ? (
                  <CorrelationsTab />
                ) : (
                  <div className="bg-muted/50 p-8 rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-2">Premium Feature</h3>
                    <p className="text-muted-foreground mb-4">
                      Unlock detailed correlations between your meditation practice and wellbeing metrics.
                    </p>
                    <SubscriptionBanner />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="achievements" className="mt-0">
                <AchievementsTab achievements={achievements} />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
      <ViewportToggle />
    </div>
  );
};

export default Progress;
