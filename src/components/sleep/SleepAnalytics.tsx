import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Moon,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Clock,
  Zap,
  Activity,
  Target,
  Wind,
  Brain,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

import {
  SleepAnalytics as SleepAnalyticsType,
  SleepTrend,
  BreathingTechnique,
  SleepChallenge,
  WindDownActivity
} from '@/types/sleepRecovery';

interface SleepAnalyticsProps {
  analytics: SleepAnalyticsType;
  trends: SleepTrend[];
  onViewDetails?: (metric: string) => void;
  onUpdateGoals?: () => void;
}

export const SleepAnalytics: React.FC<SleepAnalyticsProps> = ({
  analytics,
  trends,
  onViewDetails,
  onUpdateGoals
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  // Color schemes for charts
  const colors = {
    primary: '#3b82f6',
    secondary: '#10b981',
    tertiary: '#f59e0b',
    quaternary: '#ef4444',
    success: '#22c55e',
    warning: '#eab308',
    danger: '#dc2626'
  };

  // Prepare chart data
  const sleepTrendData = trends.map((trend, index) => ({
    date: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sleepQuality: trend.sleepQuality,
    morningEnergy: trend.morningEnergy,
    timeToFallAsleep: trend.timeToFallAsleep,
    totalSleepTime: trend.totalSleepTime,
    stressLevel: trend.stressLevelBeforeBed || 5,
    breathingSession: trend.breathingSessionUsed ? 1 : 0
  }));

  const challengesData = analytics.mostCommonChallenges.map(challenge => ({
    name: challenge.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: Math.floor(Math.random() * 30) + 10 // Mock frequency data
  }));

  const windDownData = analytics.mostEffectiveWindDownActivities.map(activity => ({
    name: activity.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    effectiveness: Math.floor(Math.random() * 40) + 60,
    usage: Math.floor(Math.random() * 20) + 10
  }));

  const breathingEffectivenessData = analytics.mostEffectiveTechniques.map(technique => ({
    name: technique.technique.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    improvement: technique.averageImprovement,
    usage: technique.usageCount
  }));

  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sleep Quality</p>
                <p className="text-2xl font-bold">{analytics.averageSleepQuality.toFixed(1)}/10</p>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(analytics.sleepQualityTrend)}
                <span className={`text-xs ${getTrendColor(analytics.sleepQualityTrend)}`}>
                  {analytics.sleepQualityTrend}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Morning Energy</p>
                <p className="text-2xl font-bold">{analytics.averageMorningEnergy.toFixed(1)}/10</p>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(analytics.morningEnergyTrend)}
                <span className={`text-xs ${getTrendColor(analytics.morningEnergyTrend)}`}>
                  {analytics.morningEnergyTrend}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Time to Sleep</p>
                <p className="text-2xl font-bold">{Math.round(analytics.averageTimeToFallAsleep)}m</p>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(analytics.consistencyTrend)}
                <span className={`text-xs ${getTrendColor(analytics.consistencyTrend)}`}>
                  {analytics.consistencyTrend}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Night Wakings</p>
                <p className="text-2xl font-bold">{analytics.averageNightWakeups.toFixed(1)}</p>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-blue-600">per night</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sleep Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Sleep Quality & Energy Trends
          </CardTitle>
          <CardDescription>
            Track your sleep quality and morning energy over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sleepTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sleepQuality"
                stroke={colors.primary}
                strokeWidth={2}
                name="Sleep Quality"
              />
              <Line
                type="monotone"
                dataKey="morningEnergy"
                stroke={colors.secondary}
                strokeWidth={2}
                name="Morning Energy"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Correlation Insights */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <div className="text-sm font-medium">Stress Impact</div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">
                {Math.abs(analytics.stressImpactOnSleep * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">
                correlation with sleep quality
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-500" />
              <div className="text-sm font-medium">Exercise Impact</div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">
                {Math.abs(analytics.exerciseImpactOnSleep * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">
                correlation with sleep quality
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-green-500" />
              <div className="text-sm font-medium">Breathing Impact</div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">
                {Math.abs(analytics.breathingImpactOnSleep * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">
                improvement when used
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPatterns = () => (
    <div className="space-y-6">
      {/* Sleep Schedule Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-500" />
            Sleep Schedule Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Suggested Optimal Bedtime</span>
                <Badge variant="outline">{analytics.suggestedOptimalBedtime}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Suggested Optimal Wake Time</span>
                <Badge variant="outline">{analytics.suggestedOptimalWakeTime}</Badge>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Schedule Insights</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Your best sleep quality occurs with consistent timing</p>
                <p>• Weekend variations impact Monday energy levels</p>
                <p>• Earlier bedtime correlates with better morning energy</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sleep Quality by Day */}
      <Card>
        <CardHeader>
          <CardTitle>Sleep Quality by Day of Week</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={Object.entries(analytics.sleepQualityByDayOfWeek).map(([day, quality]) => ({
              day: day.charAt(0).toUpperCase() + day.slice(1, 3),
              quality: quality
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Bar dataKey="quality" fill={colors.primary} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Most Common Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Sleep Challenge Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Most Common Challenges</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={challengesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {challengesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(colors)[index % Object.values(colors).length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Recommended Actions</h4>
              {analytics.suggestedWindDownAdjustments.map((suggestion, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBreathingAnalysis = () => (
    <div className="space-y-6">
      {/* Breathing Session Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-green-500" />
              <div className="text-sm font-medium text-muted-foreground">Sessions Used</div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {analytics.breathingSessionsUsed}
            </div>
            <div className="text-xs text-muted-foreground">
              in the last {analytics.period}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div className="text-sm font-medium text-muted-foreground">Avg Effectiveness</div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {analytics.averageBreathingEffectiveness.toFixed(1)}/10
            </div>
            <div className="text-xs text-muted-foreground">
              user-reported rating
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div className="text-sm font-medium text-muted-foreground">Sleep Improvement</div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {(analytics.breathingImpactOnSleep * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">
              when sessions used
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Effective Techniques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Most Effective Breathing Techniques
          </CardTitle>
          <CardDescription>
            Techniques ranked by sleep improvement and usage frequency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={breathingEffectivenessData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="improvement" fill={colors.secondary} name="Avg Improvement" />
              <Bar dataKey="usage" fill={colors.tertiary} name="Usage Count" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommended Techniques */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Technique Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recommendedBreathingTechniques.map((technique, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Wind className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">
                      {technique.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Based on your sleep patterns and goals
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">Recommended</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Breathing Session Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Breathing Session Impact on Sleep Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={sleepTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="sleepQuality"
                stackId="1"
                stroke={colors.primary}
                fill={colors.primary}
                fillOpacity={0.6}
                name="Sleep Quality"
              />
              <Area
                type="monotone"
                dataKey="breathingSession"
                stackId="2"
                stroke={colors.secondary}
                fill={colors.secondary}
                fillOpacity={0.8}
                name="Breathing Session Used"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Personalized Sleep Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics.stressImpactOnSleep > 0.6 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Stress-Sleep Connection</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your stress levels have a strong impact on sleep quality. Consider stress-reduction breathing techniques before bedtime.
                  </p>
                </div>
              </div>
            </div>
          )}

          {analytics.averageTimeToFallAsleep > 20 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Sleep Onset Opportunity</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    You're taking longer than average to fall asleep. Try the 4-7-8 breathing technique or progressive muscle relaxation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {analytics.breathingImpactOnSleep > 0.5 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Breathing Success</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Breathing techniques are significantly improving your sleep quality. Continue your current practice!
                  </p>
                </div>
              </div>
            </div>
          )}

          {analytics.morningEnergyTrend === 'declining' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Energy Decline Alert</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Your morning energy has been declining. This may indicate sleep quality issues or insufficient recovery.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.suggestedWindDownAdjustments.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">Optimize Wind-Down Routine</div>
                  <div className="text-sm text-muted-foreground">{suggestion}</div>
                </div>
              </div>
            ))}

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Wind className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium">Try Recommended Breathing Techniques</div>
                <div className="text-sm text-muted-foreground">
                  Based on your patterns, {analytics.recommendedBreathingTechniques[0]?.replace('-', ' ')} may be most effective
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <div className="font-medium">Optimize Sleep Schedule</div>
                <div className="text-sm text-muted-foreground">
                  Consider adjusting bedtime to {analytics.suggestedOptimalBedtime} for better sleep quality
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Sleep Goals Progress</CardTitle>
          <CardDescription>
            How you're progressing toward your sleep objectives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-medium">Fall asleep faster</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${Math.max(0, (30 - analytics.averageTimeToFallAsleep) / 30 * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {analytics.averageTimeToFallAsleep > 20 ? 'Needs work' : 'Good progress'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Wake up refreshed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${analytics.averageMorningEnergy * 10}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {analytics.averageMorningEnergy >= 7 ? 'Excellent' :
                   analytics.averageMorningEnergy >= 5 ? 'Good' : 'Needs improvement'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Sleep through the night</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${Math.max(0, (3 - analytics.averageNightWakeups) / 3 * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {analytics.averageNightWakeups <= 1 ? 'Excellent' : 'Room for improvement'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Moon className="h-8 w-8 text-primary" />
            Sleep Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Deep insights into your sleep patterns and breathing effectiveness
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{analytics.period} view</Badge>
          {onUpdateGoals && (
            <Button variant="outline" onClick={onUpdateGoals}>
              Update Goals
            </Button>
          )}
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patterns">Sleep Patterns</TabsTrigger>
          <TabsTrigger value="breathing">Breathing Analysis</TabsTrigger>
          <TabsTrigger value="insights">Insights & Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          {renderPatterns()}
        </TabsContent>

        <TabsContent value="breathing" className="space-y-6">
          {renderBreathingAnalysis()}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {renderInsights()}
        </TabsContent>
      </Tabs>
    </div>
  );
};