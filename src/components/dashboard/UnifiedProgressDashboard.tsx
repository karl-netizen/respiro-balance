
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
  const { biometricData } = useBiometricData();

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

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Your Progress</h2>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Last 7 days</span>
          </div>
        </div>
      </FadeIn>

      {/* Quick Stats */}
      <SlideIn direction="up" delay={100}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{meditationStats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Minutes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{meditationStats.totalMinutes}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{meditationStats.currentStreak}</div>
              <p className="text-xs text-muted-foreground">
                days in a row
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                badges earned
              </p>
            </CardContent>
          </Card>
        </div>
      </SlideIn>

      {/* Main Progress Charts */}
      <SlideIn direction="up" delay={200}>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="meditation">Meditation</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart>
                    <LineChart data={weeklyProgress}>
                      <ResponsiveXAxis dataKey="day" />
                      <ResponsiveYAxis />
                      <ResponsiveTooltip />
                      <Line 
                        type="monotone" 
                        dataKey="meditation" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Wellness Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart>
                    <BarChart data={weeklyProgress}>
                      <ResponsiveXAxis dataKey="day" />
                      <ResponsiveYAxis />
                      <ResponsiveTooltip />
                      <Bar dataKey="stress" fill="hsl(var(--chart-2))" />
                      <Bar dataKey="focus" fill="hsl(var(--chart-3))" />
                    </BarChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="meditation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meditation Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveChart>
                  <LineChart data={weeklyProgress}>
                    <ResponsiveXAxis dataKey="day" />
                    <ResponsiveYAxis />
                    <ResponsiveTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="meditation" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveChart>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Stress Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart>
                    <LineChart data={weeklyProgress}>
                      <ResponsiveXAxis dataKey="day" />
                      <ResponsiveYAxis />
                      <ResponsiveTooltip />
                      <Line 
                        type="monotone" 
                        dataKey="stress" 
                        stroke="hsl(var(--chart-2))" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Focus Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveChart>
                    <LineChart data={weeklyProgress}>
                      <ResponsiveXAxis dataKey="day" />
                      <ResponsiveYAxis />
                      <ResponsiveTooltip />
                      <Line 
                        type="monotone" 
                        dataKey="focus" 
                        stroke="hsl(var(--chart-3))" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveChart>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Goal Achievement</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveChart>
                  <PieChart>
                    <Pie
                      data={goalProgress}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {goalProgress.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ResponsiveTooltip />
                  </PieChart>
                </ResponsiveChart>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SlideIn>
    </div>
  );
};

export default UnifiedProgressDashboard;
