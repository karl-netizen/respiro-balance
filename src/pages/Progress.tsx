
import React, { useState } from 'react';
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
import { Achievement } from '@/types/achievements';

const Progress = () => {
  const { preferences } = useUserPreferences();
  const [activeTab, setActiveTab] = useState("overview");
  const { meditationStats, sessions } = useMeditationStats();
  
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <ProgressHero />
        
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="correlations">Correlations</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <OverviewTab 
                  meditationStats={meditationStats} 
                  sessions={sessions} 
                />
              </TabsContent>
              
              <TabsContent value="insights" className="mt-0">
                <InsightsTab />
              </TabsContent>
              
              <TabsContent value="correlations" className="mt-0">
                <CorrelationsTab />
              </TabsContent>
              
              <TabsContent value="achievements" className="mt-0">
                <AchievementsTab achievements={achievements} />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Progress;
