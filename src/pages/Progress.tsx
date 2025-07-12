
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserPreferences } from "@/context";
import { 
  ProgressHero, 
  OverviewTab, 
  InsightsTab, 
  AchievementsTab,
  CorrelationsTab
} from "@/components/progress";
import { useMeditationStats } from "@/components/progress/useMeditationStats";
import { useSubscriptionContext } from "@/hooks/useSubscriptionContext";
import { useIsMobile } from "@/hooks/use-mobile";
import SubscriptionBanner from "@/components/subscription/SubscriptionBanner";
import { ActivityCalendar } from "@/components/dashboard";
import { useLocation, useNavigate } from "react-router-dom";

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
  
  // Generate activity data for calendar
  const activityData = meditationStats.dailyMinutes?.map(day => ({
    date: day.day,
    value: day.minutes,
    type: day.sessions > 0 ? 'meditation' : undefined
  })) || [];
  
  return (
    <div className={`min-h-screen flex flex-col ${isMobile ? 'mobile-view' : ''}`}>
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
                <AchievementsTab achievements={meditationStats.achievements.map(achievement => ({
                  id: achievement.name.toLowerCase().replace(/\s+/g, '-'),
                  name: achievement.name,
                  description: achievement.description,
                  icon: achievement.icon || "award",
                  unlocked: achievement.unlocked,
                  progress: achievement.progress || 0,
                  unlockedDate: achievement.unlockedDate
                }))} />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Progress;
