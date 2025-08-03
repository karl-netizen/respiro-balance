import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, BarChart3, Calendar, TrendingUp, Target } from 'lucide-react';
import { ProductivityMetrics } from './analytics/ProductivityMetrics';
import { TrendAnalysis } from './analytics/TrendAnalysis';
import { InsightsGenerator } from './analytics/InsightsGenerator';
import { CalendarIntegration } from './calendar/CalendarIntegration';
import { FocusScheduler } from './calendar/FocusScheduler';
import { FocusHistory } from './FocusHistory';
import { FocusTimerTab } from './FocusTimerTab';

interface FocusTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  timerState: string;
  remaining: number;
  onStartSession: () => void;
  trendData: any[];
  insights: any[];
}

export const FocusTabs: React.FC<FocusTabsProps> = ({
  activeTab,
  onTabChange,
  timerState,
  remaining,
  onStartSession,
  trendData,
  insights
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="timer" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Focus Timer
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Schedule
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          History
        </TabsTrigger>
        <TabsTrigger value="insights" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Insights
        </TabsTrigger>
      </TabsList>

      <TabsContent value="timer">
        <FocusTimerTab 
          timerState={timerState}
          remaining={remaining}
          onStartSession={onStartSession}
        />
      </TabsContent>

      <TabsContent value="analytics">
        <div className="grid gap-6 md:grid-cols-2">
          <ProductivityMetrics />
          <TrendAnalysis data={trendData} timeframe="week" />
        </div>
      </TabsContent>

      <TabsContent value="calendar">
        <div className="grid gap-6 lg:grid-cols-2">
          <CalendarIntegration />
          <FocusScheduler />
        </div>
      </TabsContent>

      <TabsContent value="history">
        <FocusHistory />
      </TabsContent>

      <TabsContent value="insights">
        <InsightsGenerator 
          insights={insights}
          onActionClick={(insight) => {
            console.log('Focus Mode action clicked:', insight);
          }}
        />
      </TabsContent>
    </Tabs>
  );
};