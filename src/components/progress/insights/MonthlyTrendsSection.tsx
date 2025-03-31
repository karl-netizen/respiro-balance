
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MeditationStats } from '../useMeditationStats';
import { ChartSection, StatsSection } from './monthly';

interface MonthlyTrendsSectionProps {
  meditationStats: MeditationStats;
}

const MonthlyTrendsSection: React.FC<MonthlyTrendsSectionProps> = ({ meditationStats }) => {
  // Calculate data points by month for the chart
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  
  // Get the last 6 months in chronological order
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const monthIndex = (currentMonth - 5 + i + 12) % 12;
    return monthNames[monthIndex];
  });
  
  const sessionData = last6Months.map((month, index) => ({
    month,
    sessions: meditationStats.monthlyTrend[index] || 0,
    minutes: (meditationStats.monthlyTrend[index] || 0) * 1.5,
  }));
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Monthly Meditation Trends</CardTitle>
        <CardDescription>
          Track your meditation consistency over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartSection sessionData={sessionData} />
        <StatsSection meditationStats={meditationStats} />
      </CardContent>
    </Card>
  );
};

export default MonthlyTrendsSection;
