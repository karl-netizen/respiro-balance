
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
          <CardTitle>Monthly Meditation Trends</CardTitle>
          <CardDescription>See how your meditation practice evolves over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartSection sessionData={sessionData} />
          <StatsSection meditationStats={meditationStats} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyTrendsSection;
