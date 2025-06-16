
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartSection, StatsSection } from './monthly';
import { MeditationStats } from '../types/meditationStats';

interface MonthlyTrendsSectionProps {
  meditationStats: MeditationStats;
}

const MonthlyTrendsSection: React.FC<MonthlyTrendsSectionProps> = ({ meditationStats }) => {
  // Generate session data for the chart (mocked for now)
  const sessionData = Array.from({ length: 12 }, (_, i) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
      month: monthNames[i],
      sessions: Math.floor(Math.random() * 20) + 1,
      minutes: Math.floor(Math.random() * 300) + 30
    };
  });
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Monthly Meditation Trends</CardTitle>
          <CardDescription className="text-sm sm:text-base">See how your meditation practice evolves over time</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px] sm:min-w-0">
              <ChartSection sessionData={sessionData} />
            </div>
          </div>
          <div className="mt-4 sm:mt-6">
            <StatsSection meditationStats={meditationStats} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyTrendsSection;
