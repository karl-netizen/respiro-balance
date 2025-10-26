import React, { useState, lazy, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserPreferences } from "@/context";
import { useBiometricData } from "@/hooks/useBiometricData";
import { useMeditationStats } from './useMeditationStats';
import { Activity, TrendingUp, Lightbulb } from "lucide-react";

// Lazy load heavy chart sections
const MonthlyTrendsSection = lazy(() => 
  import('./insights').then(m => ({ default: m.MonthlyTrendsSection }))
);
const CorrelationsSection = lazy(() => 
  import('./insights').then(m => ({ default: m.CorrelationsSection }))
);
const InsightsSection = lazy(() => 
  import('./insights').then(m => ({ default: m.InsightsSection }))
);
const ShareableReport = lazy(() => import('./ShareableReport'));

// Loading fallback for heavy sections
const SectionLoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
);

const InsightsTab: React.FC = () => {
  const { meditationStats } = useMeditationStats();
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
          <Suspense fallback={<SectionLoadingFallback />}>
            <MonthlyTrendsSection meditationStats={meditationStats} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="correlations" className="mt-0">
          <Suspense fallback={<SectionLoadingFallback />}>
            <CorrelationsSection biometricData={biometricData} meditationStats={meditationStats} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="insights" className="mt-0">
          <Suspense fallback={<SectionLoadingFallback />}>
            <div className="space-y-6">
              <InsightsSection />
              <ShareableReport />
            </div>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightsTab;
