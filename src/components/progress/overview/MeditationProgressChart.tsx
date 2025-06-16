
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChartSkeleton, ChartHeader, MeditationChart, ChartSummary } from './chart';

interface MeditationProgressChartProps {
  dailyData: {
    day: string;
    minutes: number;
    sessions: number;
  }[];
}

const MeditationProgressChart: React.FC<MeditationProgressChartProps> = ({ dailyData }) => {
  const [view, setView] = React.useState<'daily' | 'weekly'>('daily');
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Simulate loading for demonstration
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate average minutes
  const average = dailyData.reduce((sum, item) => sum + item.minutes, 0) / dailyData.length;
  const totalMinutes = dailyData.reduce((sum, item) => sum + item.minutes, 0);
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <ChartHeader view={view} onViewChange={setView} />
        <CardContent className="p-3 sm:p-6">
          <ChartSkeleton />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full overflow-hidden">
      <ChartHeader view={view} onViewChange={setView} />
      
      <CardContent className="p-2 sm:p-4 lg:p-6">
        <MeditationChart data={dailyData} average={average} />
        <ChartSummary average={average} totalMinutes={totalMinutes} />
      </CardContent>
    </Card>
  );
};

export default MeditationProgressChart;
