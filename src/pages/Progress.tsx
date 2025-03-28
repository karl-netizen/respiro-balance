
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
  useMeditationStats
} from "@/components/progress";

const ProgressPage = () => {
  const { preferences } = useUserPreferences();
  const [activeTab, setActiveTab] = useState("overview");
  const { meditationStats, sessions } = useMeditationStats();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <ProgressHero />
        
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
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
              
              <TabsContent value="achievements" className="mt-0">
                <AchievementsTab achievements={meditationStats.achievements} />
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProgressPage;
