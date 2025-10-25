
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Heart, 
  Brain, 
  TrendingUp, 
  TrendingDown,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const BiofeedbackAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('week');

  // Mock biometric data for analysis
  const weeklyData = [
    { date: 'Mon', heartRate: 72, hrv: 45, stress: 40, focus: 75, calm: 80 },
    { date: 'Tue', heartRate: 68, hrv: 52, stress: 35, focus: 80, calm: 85 },
    { date: 'Wed', heartRate: 70, hrv: 48, stress: 42, focus: 72, calm: 78 },
    { date: 'Thu', heartRate: 65, hrv: 55, stress: 30, focus: 85, calm: 88 },
    { date: 'Fri', heartRate: 69, hrv: 50, stress: 38, focus: 78, calm: 82 },
    { date: 'Sat', heartRate: 63, hrv: 58, stress: 25, focus: 90, calm: 92 },
    { date: 'Sun', heartRate: 66, hrv: 53, stress: 28, focus: 88, calm: 90 }
  ];

  const sessionData = [
    { session: 'Session 1', startHR: 78, endHR: 65, stressReduction: 45, focusImprovement: 30 },
    { session: 'Session 2', startHR: 75, endHR: 62, stressReduction: 38, focusImprovement: 35 },
    { session: 'Session 3', startHR: 80, endHR: 68, stressReduction: 42, focusImprovement: 28 },
    { session: 'Session 4', startHR: 72, endHR: 59, stressReduction: 50, focusImprovement: 40 },
    { session: 'Session 5', startHR: 77, endHR: 64, stressReduction: 48, focusImprovement: 38 }
  ];

  const insights = [
    {
      type: 'positive' as const,
      metric: 'Heart Rate Variability',
      trend: '+15%',
      description: 'Your HRV has improved significantly over the past week, indicating better stress recovery.',
      icon: <Heart className="h-5 w-5 text-green-500" />
    },
    {
      type: 'neutral' as const,
      metric: 'Stress Levels',
      trend: '-25%',
      description: 'Stress levels are consistently decreasing during meditation sessions.',
      icon: <Brain className="h-5 w-5 text-blue-500" />
    },
    {
      type: 'attention' as const,
      metric: 'Focus Score',
      trend: '+8%',
      description: 'Focus improvement is moderate. Consider extending session duration.',
      icon: <Target className="h-5 w-5 text-orange-500" />
    }
  ];

  const recommendations = [
    {
      title: 'Optimal Session Time',
      description: 'Your biometric data suggests 15-20 minute sessions yield the best results.',
      action: 'Adjust session length'
    },
    {
      title: 'Morning Sessions',
      description: 'Morning meditation shows 30% better stress reduction compared to evening.',
      action: 'Schedule morning practice'
    },
    {
      title: 'Breathing Focus',
      description: 'Heart rate variability improves most with breathing-focused meditation.',
      action: 'Try breathing exercises'
    }
  ];

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'neutral': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'attention': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Biofeedback Analytics</h2>
          <p className="text-muted-foreground">Deep insights into your meditation and wellness data</p>
        </div>
        <div className="flex items-center gap-2">
          {['week', 'month', 'quarter'].map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(period as any)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Heart Rate</p>
                <p className="text-2xl font-bold">68 BPM</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  -5% this week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">HRV Score</p>
                <p className="text-2xl font-bold">52ms</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +15% this week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Stress Level</p>
                <p className="text-2xl font-bold">32</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  -25% this week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Focus Score</p>
                <p className="text-2xl font-bold">82</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8% this week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Biometric Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="hrv" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Focus & Calm Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="focus" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="calm" stackId="2" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session-by-Session Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessionData.map((session, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{session.session}</h3>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Heart Rate</p>
                        <p className="font-medium">{session.startHR} → {session.endHR} BPM</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">HR Reduction</p>
                        <p className="font-medium text-green-600">-{session.startHR - session.endHR} BPM</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Stress Reduction</p>
                        <p className="font-medium text-blue-600">{session.stressReduction}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Focus Improvement</p>
                        <p className="font-medium text-purple-600">+{session.focusImprovement}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4">
            {insights.map((insight, index) => (
              <Card key={index} className={`border-l-4 ${getInsightColor(insight.type)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {insight.icon}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{insight.metric}</h3>
                        <Badge variant="secondary">{insight.trend}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid gap-4">
            {recommendations.map((rec, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {rec.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BiofeedbackAnalytics;
