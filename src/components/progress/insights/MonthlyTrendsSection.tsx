
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from "recharts";
import { TrendingUp } from "lucide-react";
import { MeditationStats } from '../useMeditationStats';

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
        <div className="h-[300px]">
          <ChartContainer 
            className="w-full h-full" 
            config={{
              sessions: { 
                label: "Sessions",
                theme: { light: "#6366f1", dark: "#818cf8" } 
              },
              minutes: { 
                label: "Minutes", 
                theme: { light: "#10b981", dark: "#34d399" } 
              }
            }}
          >
            <BarChart data={sessionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Bar yAxisId="left" dataKey="sessions" fill="var(--color-sessions)" radius={[4, 4, 0, 0]} barSize={20} />
              <Line yAxisId="right" type="monotone" dataKey="minutes" stroke="var(--color-minutes)" strokeWidth={2} dot={{ r: 4 }} />
            </BarChart>
          </ChartContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Sessions</p>
            <h3 className="text-2xl font-bold">{meditationStats.totalSessions}</h3>
            <p className="text-xs text-primary flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Minutes</p>
            <h3 className="text-2xl font-bold">{meditationStats.totalMinutes}</h3>
            <p className="text-xs text-primary flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Avg Duration</p>
            <h3 className="text-2xl font-bold">
              {meditationStats.totalSessions > 0 
                ? Math.round(meditationStats.totalMinutes / meditationStats.totalSessions) 
                : 0} min
            </h3>
            <p className="text-xs text-primary flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2 min from last month
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyTrendsSection;
