
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useUserPreferences } from "@/context";
import { useBiometricData } from "@/hooks/useBiometricData";
import { useMeditationStats } from './useMeditationStats';
import { 
  MonthlyTrendsSection,
  CorrelationsSection,
  InsightsSection
} from './insights';
import ShareableReport from './ShareableReport';
import { Activity, TrendingUp, Lightbulb } from "lucide-react";

const InsightsTab: React.FC = () => {
  const { meditationStats } = useMeditationStats();
  const { preferences } = useUserPreferences();
  const { biometricData } = useBiometricData();
  const [activeSubTab, setActiveSubTab] = useState<string>("monthly");
  
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <CardDescription>
            Track your meditation progress, discover correlations with your wellbeing, and gain personalized insights to improve your practice.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs 
        defaultValue="monthly" 
        value={activeSubTab} 
        onValueChange={setActiveSubTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Monthly</span> Trends
          </TabsTrigger>
          <TabsTrigger value="correlations" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Correlations
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Personalized</span> Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly" className="mt-0">
          <MonthlyTrendsSection meditationStats={meditationStats} />
        </TabsContent>
        
        <TabsContent value="correlations" className="mt-0">
          <CorrelationsSection biometricData={biometricData} meditationStats={meditationStats} />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-0">
          <div className="space-y-6">
            <InsightsSection preferences={preferences} />
            <ShareableReport />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightsTab;
