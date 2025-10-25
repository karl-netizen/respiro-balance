
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Zap, Target, TrendingUp } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MeditationAnalyticsProps {
  timeframe?: 'week' | 'month' | 'year';
}

export const MeditationAnalytics: React.FC<MeditationAnalyticsProps> = () => {
  const analytics = {
    totalSessions: 45,
    totalMinutes: 680,
    avgFocusScore: 82,
    avgCalmScore: 78,
    streakDays: 12,
    weeklyGoal: 150,
    weeklyProgress: 120,
    moodImprovement: 15,
    stressReduction: 23
  };

  const progressData = [
    { date: 'Mon', focusScore: 75, calmScore: 72, sessions: 2 },
    { date: 'Tue', focusScore: 82, calmScore: 78, sessions: 1 },
    { date: 'Wed', focusScore: 78, calmScore: 75, sessions: 3 },
    { date: 'Thu', focusScore: 88, calmScore: 85, sessions: 2 },
    { date: 'Fri', focusScore: 85, calmScore: 82, sessions: 1 },
    { date: 'Sat', focusScore: 90, calmScore: 88, sessions: 2 },
    { date: 'Sun', focusScore: 87, calmScore: 85, sessions: 1 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Focus Score</span>
            </div>
            <div className="text-2xl font-bold">{analytics.avgFocusScore}</div>
            <Badge variant="default" className="mt-1">
              +5 from last week
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Calm Score</span>
            </div>
            <div className="text-2xl font-bold">{analytics.avgCalmScore}</div>
            <Badge variant="default" className="mt-1">
              +3 from last week
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Sessions</span>
            </div>
            <div className="text-2xl font-bold">{analytics.totalSessions}</div>
            <Badge variant="outline" className="mt-1">
              This month
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Streak</span>
            </div>
            <div className="text-2xl font-bold">{analytics.streakDays}</div>
            <Badge variant="outline" className="mt-1">
              Days
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Minutes Meditated</span>
              <span className="text-sm text-muted-foreground">
                {analytics.weeklyProgress} / {analytics.weeklyGoal} min
              </span>
            </div>
            <Progress value={(analytics.weeklyProgress / analytics.weeklyGoal) * 100} className="h-2" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-green-600">+{analytics.moodImprovement}%</div>
                <div className="text-xs text-muted-foreground">Mood Improvement</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-600">-{analytics.stressReduction}%</div>
                <div className="text-xs text-muted-foreground">Stress Reduction</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-purple-600">{analytics.totalMinutes}</div>
                <div className="text-xs text-muted-foreground">Total Minutes</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis domain={[0, 100]} fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="focusScore"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name="Focus Score"
                />
                <Area
                  type="monotone"
                  dataKey="calmScore"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                  name="Calm Score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
