
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  RadialBar,
  RadialBarChart,
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Brain, Activity, Heart, ArrowUpRight, ArrowDownRight, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, LayoutDashboard } from "lucide-react";
import { MeditationStats } from '../useMeditationStats';
import { BiometricData } from '@/types/supabase';

interface CorrelationsSectionProps {
  biometricData: BiometricData[];
  meditationStats: MeditationStats;
}

const CorrelationsSection: React.FC<CorrelationsSectionProps> = ({ 
  biometricData = [],
  meditationStats 
}) => {
  const [activeTab, setActiveTab] = useState('comparison');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  
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

  // Generate real-time biometric visualization data
  const getBiometricTrends = () => {
    // If we have actual biometric data, use it
    if (biometricData && biometricData.length > 0) {
      return biometricData.map(data => ({
        date: new Date(data.recorded_at).toLocaleDateString(),
        heartRate: data.heart_rate || 0,
        hrv: data.hrv || 0,
        stress: data.stress_score || 0,
      }));
    }
    
    // Otherwise use sample data
    return [
      { date: 'Mon', heartRate: 72, hrv: 65, stress: 40, meditation: true },
      { date: 'Tue', heartRate: 68, hrv: 70, stress: 35, meditation: true },
      { date: 'Wed', heartRate: 70, hrv: 68, stress: 38, meditation: true },
      { date: 'Thu', heartRate: 82, hrv: 55, stress: 60, meditation: false },
      { date: 'Fri', heartRate: 76, hrv: 60, stress: 50, meditation: true },
      { date: 'Sat', heartRate: 74, hrv: 62, stress: 45, meditation: true },
      { date: 'Sun', heartRate: 85, hrv: 52, stress: 65, meditation: false },
    ];
  };

  const biometricTrends = getBiometricTrends();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Calculate average heart rate
  const calculateAvgHeartRate = () => {
    return Math.round(
      biometricTrends.reduce((acc, data) => acc + data.heartRate, 0) / biometricTrends.length
    );
  };

  // Calculate average HRV
  const calculateAvgHRV = () => {
    return Math.round(
      biometricTrends.reduce((acc, data) => acc + data.hrv, 0) / biometricTrends.length
    );
  };

  // Calculate average stress
  const calculateAvgStress = () => {
    return Math.round(
      biometricTrends.reduce((acc, data) => acc + data.stress, 0) / biometricTrends.length
    );
  };
  
  const renderComparisonChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart
            data={correlationData}
            margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Line type="monotone" dataKey="meditation" stroke="var(--color-meditation)" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="nonMeditation" stroke="var(--color-nonMeditation)" />
          </LineChart>
        );
      
      case 'pie':
        return (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <h3 className="text-sm font-medium mb-2">With Meditation</h3>
                <PieChart width={150} height={150}>
                  <Pie
                    data={correlationData}
                    cx={75}
                    cy={75}
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="meditation"
                  >
                    {correlationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                </PieChart>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium mb-2">Without Meditation</h3>
                <PieChart width={150} height={150}>
                  <Pie
                    data={correlationData}
                    cx={75}
                    cy={75}
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="nonMeditation"
                  >
                    {correlationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                </PieChart>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {correlationData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center text-xs">
                  <div className="w-3 h-3 mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        );
      
      default: // bar chart
        return (
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
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="realtime">Real-time Data</TabsTrigger>
          <TabsTrigger value="wellbeing">Well-being</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Meditation Impact</CardTitle>
                  <CardDescription>
                    Compare days with and without meditation
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={chartType === 'bar' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setChartType('bar')}
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Bar
                  </Button>
                  <Button 
                    variant={chartType === 'line' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setChartType('line')}
                  >
                    <LineChartIcon className="h-4 w-4 mr-1" />
                    Line
                  </Button>
                  <Button 
                    variant={chartType === 'pie' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setChartType('pie')}
                  >
                    <PieChartIcon className="h-4 w-4 mr-1" />
                    Pie
                  </Button>
                </div>
              </div>
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
                  {renderComparisonChart()}
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="realtime" className="mt-0">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-primary" />
                    Biometric Trends
                  </CardTitle>
                  <CardDescription>
                    Track your biometrics against meditation practice
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={timeRange === 'week' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeRange('week')}
                  >
                    Week
                  </Button>
                  <Button 
                    variant={timeRange === 'month' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setTimeRange('month')}
                  >
                    Month
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer 
                  className="w-full h-full" 
                  config={{
                    heartRate: { 
                      label: "Heart Rate",
                      theme: { light: "#ef4444", dark: "#f87171" } 
                    },
                    hrv: { 
                      label: "HRV", 
                      theme: { light: "#3b82f6", dark: "#60a5fa" } 
                    },
                    stress: { 
                      label: "Stress", 
                      theme: { light: "#f97316", dark: "#fb923c" } 
                    }
                  }}
                >
                  <ResponsiveContainer>
                    <AreaChart
                      data={biometricTrends}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-heartRate)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="var(--color-heartRate)" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorHrv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-hrv)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="var(--color-hrv)" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-stress)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="var(--color-stress)" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Legend content={<ChartLegendContent />} />
                      <Area type="monotone" dataKey="heartRate" stroke="var(--color-heartRate)" fillOpacity={1} fill="url(#colorHeartRate)" />
                      <Area type="monotone" dataKey="hrv" stroke="var(--color-hrv)" fillOpacity={1} fill="url(#colorHrv)" />
                      <Area type="monotone" dataKey="stress" stroke="var(--color-stress)" fillOpacity={1} fill="url(#colorStress)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              <div className="mt-6 border-t pt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Avg. Heart Rate</p>
                  <p className="text-2xl font-bold">
                    {calculateAvgHeartRate()}
                    <span className="text-sm font-normal ml-1">bpm</span>
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Avg. HRV</p>
                  <p className="text-2xl font-bold">
                    {calculateAvgHRV()}
                    <span className="text-sm font-normal ml-1">ms</span>
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Avg. Stress</p>
                  <p className="text-2xl font-bold">
                    {calculateAvgStress()}
                    <span className="text-sm font-normal ml-1">/100</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wellbeing" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                Well-being Score
              </CardTitle>
              <CardDescription>
                Based on your meditation habits and biometrics
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
                    clockWise={true}
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
              
              <div className="mt-4 border-t pt-4">
                <h3 className="font-medium mb-2">Recommendations</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <div className="p-1 rounded-full bg-primary/10 mr-2 mt-0.5">
                      <LayoutDashboard className="h-3 w-3 text-primary" />
                    </div>
                    <span>Try a 15-minute focused breathing session to further reduce stress levels</span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 rounded-full bg-primary/10 mr-2 mt-0.5">
                      <LayoutDashboard className="h-3 w-3 text-primary" />
                    </div>
                    <span>Maintain your current meditation streak for optimal well-being scores</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CorrelationsSection;
