
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { ResponsiveChart, ResponsiveXAxis, ResponsiveYAxis, ResponsiveTooltip } from '@/components/charts/ResponsiveChart';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { FadeIn, SlideIn } from '@/components/animations/MicroInteractions';
import { useMeditationStats } from '@/components/progress/useMeditationStats';
import { useBiometricData } from '@/hooks/useBiometricData';

const UnifiedProgressDashboard: React.FC = () => {
  const { meditationStats } = useMeditationStats();

  // Sample data for demonstration
  const weeklyProgress = [
    { day: 'Mon', meditation: 15, stress: 6, focus: 7 },
    { day: 'Tue', meditation: 20, stress: 5, focus: 8 },
    { day: 'Wed', meditation: 25, stress: 4, focus: 8 },
    { day: 'Thu', meditation: 18, stress: 6, focus: 7 },
    { day: 'Fri', meditation: 30, stress: 3, focus: 9 },
    { day: 'Sat', meditation: 35, stress: 2, focus: 9 },
    { day: 'Sun', meditation: 28, stress: 4, focus: 8 }
  ];

  const goalProgress = [
    { name: 'Daily Meditation', value: 85, color: 'hsl(var(--primary))' },
    { name: 'Stress Reduction', value: 72, color: 'hsl(var(--chart-2))' },
    { name: 'Focus Improvement', value: 90, color: 'hsl(var(--chart-3))' },
    { name: 'Sleep Quality', value: 68, color: 'hsl(var(--chart-4))' }
  ];

  // Mobile-optimized chart configurations
  const getChartHeight = () => {
    const isMobile = window.innerWidth < 768;
    return isMobile ? 200 : 250;
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Progress</h2>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Last 7 days</span>
          </div>
        </div>
      </FadeIn>

      {/* Quick Stats - Mobile Responsive Grid */}
      <SlideIn direction="up" delay={100}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Total Sessions</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold">{meditationStats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Total Minutes</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold">{meditationStats.totalMinutes}</div>
              <p className="text-xs text-muted-foreground">+8% from last week</p>
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Current Streak</CardTitle>
              <Target className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold">{meditationStats.currentStreak}</div>
              <p className="text-xs text-muted-foreground">days in a row</p>
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Achievements</CardTitle>
              <Award className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">badges earned</p>
            </CardContent>
          </Card>
        </div>
      </SlideIn>

      {/* Main Progress Charts - Mobile Optimized */}
      <SlideIn direction="up" delay={200}>
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          {/* Mobile-friendly tab list */}
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="meditation" className="text-xs sm:text-sm px-2 py-2">
              Meditation
            </TabsTrigger>
            <TabsTrigger value="wellness" className="text-xs sm:text-sm px-2 py-2">
              Wellness
            </TabsTrigger>
            <TabsTrigger value="goals" className="text-xs sm:text-sm px-2 py-2">
              Goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <ResponsiveChart height={getChartHeight()}>
                    <LineChart data={weeklyProgress}>
                      <ResponsiveXAxis dataKey="day" fontSize={11} />
                      <ResponsiveYAxis fontSize={11} width={30} />
                      <ResponsiveTooltip />
                      <Line 
                        type="monotone" 
                        dataKey="meditation" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">Wellness Metrics</CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <ResponsiveChart height={getChartHeight()}>
                    <BarChart data={weeklyProgress}>
                      <ResponsiveXAxis dataKey="day" fontSize={11} />
                      <ResponsiveYAxis fontSize={11} width={30} />
                      <ResponsiveTooltip />
                      <Bar dataKey="stress" fill="hsl(var(--chart-2))" maxBarSize={20} />
                      <Bar dataKey="focus" fill="hsl(var(--chart-3))" maxBarSize={20} />
                    </BarChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="meditation" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Meditation Progress</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <ResponsiveChart height={getChartHeight()}>
                  <LineChart data={weeklyProgress}>
                    <ResponsiveXAxis dataKey="day" fontSize={11} />
                    <ResponsiveYAxis fontSize={11} width={30} />
                    <ResponsiveTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="meditation" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveChart>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">Stress Levels</CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <ResponsiveChart height={getChartHeight()}>
                    <LineChart data={weeklyProgress}>
                      <ResponsiveXAxis dataKey="day" fontSize={11} />
                      <ResponsiveYAxis fontSize={11} width={30} />
                      <ResponsiveTooltip />
                      <Line 
                        type="monotone" 
                        dataKey="stress" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base sm:text-lg">Focus Score</CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6">
                  <ResponsiveChart height={getChartHeight()}>
                    <LineChart data={weeklyProgress}>
                      <ResponsiveXAxis dataKey="day" fontSize={11} />
                      <ResponsiveYAxis fontSize={11} width={30} />
                      <ResponsiveTooltip />
                      <Line 
                        type="monotone" 
                        dataKey="focus" 
                        stroke="hsl(var(--chart-3))" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Goal Achievement</CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <ResponsiveChart height={getChartHeight()}>
                  <PieChart>
                    <Pie
                      data={goalProgress}
                      cx="50%"
                      cy="50%"
                      outerRadius={window.innerWidth < 768 ? 60 : 80}
                      dataKey="value"
                      label={({ name, value }) => window.innerWidth > 640 ? `${name}: ${value}%` : `${value}%`}
                      fontSize={window.innerWidth < 768 ? 10 : 12}
                    >
                      {goalProgress.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ResponsiveTooltip />
                  </PieChart>
                </ResponsiveChart>
                
                {/* Mobile legend */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 sm:hidden">
                  {goalProgress.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <div 
                        className="w-3 h-3 rounded-full shrink-0" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="truncate">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SlideIn>
    </div>
  );
};

export default UnifiedProgressDashboard;
