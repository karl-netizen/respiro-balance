
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserPreferences } from "@/context";
import { useBiometricData } from "@/hooks/useBiometricData";
import { useMeditationStats } from './useMeditationStats';
import { 
  MonthlyTrendsSection,
  CorrelationsSection,
  InsightsSection
} from './insights';

const InsightsTab: React.FC = () => {
  const { meditationStats } = useMeditationStats();
  const { preferences } = useUserPreferences();
  const { biometricData } = useBiometricData();
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="insights">Personalized Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly" className="mt-0">
          <MonthlyTrendsSection meditationStats={meditationStats} />
        </TabsContent>
        
        <TabsContent value="correlations" className="mt-0">
          <CorrelationsSection biometricData={biometricData} meditationStats={meditationStats} />
        </TabsContent>
        
        <TabsContent value="insights" className="mt-0">
          <InsightsSection preferences={preferences} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightsTab;
