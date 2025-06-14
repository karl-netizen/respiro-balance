
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Clock, TrendingUp, Calendar, BarChart3, Settings, Zap } from 'lucide-react';
import { ProductivityMetrics } from '@/components/focus-mode/analytics/ProductivityMetrics';
import { TrendAnalysis } from '@/components/focus-mode/analytics/TrendAnalysis';
import { InsightsGenerator } from '@/components/focus-mode/analytics/InsightsGenerator';
import { CalendarIntegration } from '@/components/focus-mode/calendar/CalendarIntegration';
import { FocusScheduler } from '@/components/focus-mode/calendar/FocusScheduler';
import { FocusTimer } from '@/components/focus-mode/FocusTimer';
import { FocusHistory } from '@/components/focus-mode/FocusHistory';

const FocusModePage = () => {
  const [activeTab, setActiveTab] = useState('timer');
  
  // Mock data for trend analysis
  const trendData = [
    { date: '2024-01-01', focusScore: 75, sessions: 3, distractions: 5, productivity: 80 },
    { date: '2024-01-02', focusScore: 82, sessions: 4, distractions: 3, productivity: 85 },
    { date: '2024-01-03', focusScore: 78, sessions: 2, distractions: 4, productivity: 75 },
    { date: '2024-01-04', focusScore: 88, sessions: 5, distractions: 2, productivity: 90 },
    { date: '2024-01-05', focusScore: 85, sessions: 3, distractions: 3, productivity: 88 },
  ];

  const insights = [
    {
      type: 'positive' as const,
      title: 'Peak Performance Window',
      description: 'Your focus scores are highest between 9-11 AM. Schedule important tasks during this time.',
    },
    {
      type: 'suggestion' as const,
      title: 'Reduce Afternoon Distractions',
      description: 'Consider using Focus Mode notifications or finding a quieter environment for afternoon sessions.',
      action: 'Enable Focus Mode'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-8 w-8 text-orange-500" />
                <h1 className="text-3xl font-bold">Focus Mode</h1>
              </div>
              <p className="text-muted-foreground">
                Transform your productivity with scientifically-proven focus techniques and comprehensive analytics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                Focus Score: 85
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Focus Mode Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Focus Mode Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Today's Focus</p>
                  <p className="text-2xl font-bold">2h 45m</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                  <p className="text-2xl font-bold">6</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <p className="text-2xl font-bold">12 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Efficiency</p>
                  <p className="text-2xl font-bold">87%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-500" />
                    Focus Mode Timer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FocusTimer />
                </CardContent>
              </Card>
            </div>
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
      </div>
    </div>
  );
};

export default FocusModePage;
