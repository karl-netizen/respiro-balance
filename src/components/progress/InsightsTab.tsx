
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
  ResponsiveContainer,
  RadialBar,
  RadialBarChart
} from "recharts";
import { Brain, Activity, TrendingUp, Heart, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useMeditationStats } from './useMeditationStats';
import { useUserPreferences } from "@/context";
import { useBiometricData } from "@/hooks/useBiometricData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Monthly trends section with actual visualization
const MonthlyTrendsSection: React.FC<{ meditationStats: any }> = ({ meditationStats }) => {
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

// Correlation section to show relationships between meditation and other metrics
const CorrelationsSection: React.FC<{ 
  biometricData: any[],
  meditationStats: any 
}> = ({ 
  biometricData = [],
  meditationStats 
}) => {
  // Sample correlation data (in a real app, this would come from analyzing actual user data)
  const correlationData = [
    { name: 'Focus', meditation: 65, nonMeditation: 40 },
    { name: 'Stress', meditation: 35, nonMeditation: 70 },
    { name: 'Sleep', meditation: 75, nonMeditation: 50 },
    { name: 'Mood', meditation: 80, nonMeditation: 55 },
    { name: 'Productivity', meditation: 70, nonMeditation: 45 },
  ];
  
  // Sample well-being score based on meditation consistency
  const wellbeingScore = meditationStats.streak > 5 ? 75 : meditationStats.streak > 2 ? 60 : 45;
  
  const wellbeingData = [
    { name: 'Well-being', value: wellbeingScore, fill: `hsl(${wellbeingScore * 1.2}, 70%, 50%)` },
  ];
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Meditation Impact</CardTitle>
          <CardDescription>
            Compare days with and without meditation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer 
              className="w-full h-full" 
              config={{
                meditation: { 
                  label: "With Meditation",
                  theme: { light: "#6366f1", dark: "#818cf8" } 
                },
                nonMeditation: { 
                  label: "Without Meditation", 
                  theme: { light: "#94a3b8", dark: "#64748b" } 
                }
              }}
            >
              <BarChart
                data={correlationData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
                <Bar dataKey="meditation" stackId="a" fill="var(--color-meditation)" />
                <Bar dataKey="nonMeditation" stackId="a" fill="var(--color-nonMeditation)" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Well-being Score
          </CardTitle>
          <CardDescription>
            Based on your meditation habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center">
            <RadialBarChart
              width={250}
              height={250}
              innerRadius="60%"
              outerRadius="80%"
              data={wellbeingData}
              startAngle={180}
              endAngle={0}
            >
              <RadialBar
                background
                clockWise
                dataKey="value"
                cornerRadius={10}
              />
              <Tooltip content={<ChartTooltipContent />} />
            </RadialBarChart>
            
            <div className="text-center -mt-32">
              <h2 className="text-4xl font-bold">{wellbeingScore}</h2>
              <p className="text-muted-foreground">Well-being Score</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full mt-8">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 mr-2">
                  <Heart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Stress</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    -15% this week
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-2">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Focus</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +22% this week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Personalized insights based on user data
const InsightsSection: React.FC<{ preferences: any }> = ({ preferences }) => {
  // Generate personalized insights based on user preferences and patterns
  // This would ideally use AI or pattern matching to provide valuable recommendations
  
  const insights = [
    {
      title: "Best Time to Meditate",
      description: "Based on your activity patterns, meditating between 7-8am may improve your focus for the day.",
      icon: <Brain className="h-5 w-5 text-primary" />,
      action: "Try a morning meditation tomorrow"
    },
    {
      title: "Stress Reduction Pattern",
      description: "You show a 23% decrease in reported stress levels after guided breathing sessions.",
      icon: <Activity className="h-5 w-5 text-primary" />,
      action: "Schedule 3 breathing sessions this week"
    },
    {
      title: "Focus Improvement",
      description: "Sessions longer than 15 minutes correlate with better focus scores in your data.",
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
      action: "Increase session duration gradually"
    }
  ];
  
  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <div className="p-2 rounded-full bg-primary/10 mr-2">
                {insight.icon}
              </div>
              {insight.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{insight.description}</p>
            <div className="bg-secondary/40 p-3 rounded-md text-sm font-medium">
              Recommendation: {insight.action}
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress Snapshot</CardTitle>
          <CardDescription>
            Download or share your progress report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <button className="flex items-center justify-center w-full py-2 px-4 border border-primary/30 rounded-md hover:bg-primary/5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PDF Report
            </button>
            <button className="flex items-center justify-center w-full py-2 px-4 border border-primary/30 rounded-md hover:bg-primary/5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Share Progress
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsTab;
