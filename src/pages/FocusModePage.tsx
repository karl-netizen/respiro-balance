
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Clock, TrendingUp, Calendar, BarChart3, Settings, Zap, Play } from 'lucide-react';
import { ProductivityMetrics } from '@/components/focus-mode/analytics/ProductivityMetrics';
import { TrendAnalysis } from '@/components/focus-mode/analytics/TrendAnalysis';
import { InsightsGenerator } from '@/components/focus-mode/analytics/InsightsGenerator';
import { CalendarIntegration } from '@/components/focus-mode/calendar/CalendarIntegration';
import { FocusScheduler } from '@/components/focus-mode/calendar/FocusScheduler';
import { FocusTimer } from '@/components/focus-mode/FocusTimer';
import { FocusHistory } from '@/components/focus-mode/FocusHistory';
import { FocusControls } from '@/components/focus-mode/FocusControls';
import { FocusSettingsDialog } from '@/components/focus-mode/FocusSettingsDialog';
import { useFocus } from '@/context/FocusProvider';
import BackButton from '@/components/header/BackButton';

const FocusModePage = () => {
  const [activeTab, setActiveTab] = useState('timer');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { timerState, startSession, remaining, stats } = useFocus();
  
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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isActive = timerState !== 'idle' && timerState !== 'completed';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-8 w-8 text-orange-500" />
                  <h1 className="text-3xl font-bold">Focus Mode</h1>
                </div>
                <p className="text-muted-foreground">
                  Transform your productivity with scientifically-proven focus techniques and comprehensive analytics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                Focus Score: 85
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSettingsOpen(true)}
              >
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
                  <p className="text-2xl font-bold">{stats?.totalSessions || 6}</p>
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
                  <p className="text-2xl font-bold">{stats?.currentStreak || 12} days</p>
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
                <CardContent className="space-y-6">
                  {/* Timer Display */}
                  <div className="text-center">
                    <div className="text-6xl font-mono font-bold mb-4">
                      {formatTime(remaining || 1500)}
                    </div>
                    <p className="text-muted-foreground">
                      {timerState === 'idle' && 'Ready to start your focus session'}
                      {timerState === 'work' && 'Focus time - Stay concentrated!'}
                      {timerState === 'break' && 'Break time - Rest and recharge'}
                      {timerState === 'long-break' && 'Long break - Take a longer rest'}
                      {timerState === 'paused' && 'Session paused'}
                      {timerState === 'completed' && 'Session completed!'}
                    </p>
                  </div>

                  {/* Start Session Button when idle */}
                  {timerState === 'idle' && (
                    <div className="text-center">
                      <Button 
                        onClick={startSession}
                        size="lg"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Start Focus Session
                      </Button>
                    </div>
                  )}

                  {/* Focus Controls when active */}
                  {isActive && (
                    <FocusControls />
                  )}

                  {/* Original Focus Timer Component */}
                  <div className="mt-6">
                    <FocusTimer />
                  </div>
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

        {/* Settings Dialog */}
        <FocusSettingsDialog 
          open={settingsOpen} 
          onOpenChange={setSettingsOpen} 
        />
      </div>
    </div>
  );
};

export default FocusModePage;
