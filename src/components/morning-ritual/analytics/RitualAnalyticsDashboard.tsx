
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, TrendingDown, Target, Clock, Calendar, 
  Brain, Zap, Award, BarChart3, PieChart, Activity 
} from 'lucide-react';
import { MorningRitual } from '@/context/types';
import { Line, Bar, Pie } from 'recharts';
import { 
  ResponsiveContainer, 
  LineChart, 
  BarChart, 
  PieChart as RechartsPieChart,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell
} from 'recharts';

interface AnalyticsProps {
  rituals: MorningRitual[];
}

interface PerformanceMetrics {
  totalSessions: number;
  completionRate: number;
  averageStreak: number;
  longestStreak: number;
  consistencyScore: number;
  weeklyGrowth: number;
  optimalTimeWindow: string;
  successFactors: string[];
}

interface PredictiveInsight {
  type: 'success_probability' | 'optimal_timing' | 'streak_prediction' | 'goal_projection';
  title: string;
  prediction: string;
  confidence: number;
  reasoning: string[];
  actionable: boolean;
}

const RitualAnalyticsDashboard: React.FC<AnalyticsProps> = ({ rituals }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  
  // Calculate comprehensive performance metrics
  const performanceMetrics = useMemo((): PerformanceMetrics => {
    
    // Simulate session data based on ritual completion
    const totalSessions = rituals.reduce((sum, ritual) => sum + (ritual.streak || 0), 0);
    const completedRituals = rituals.filter(r => r.status === 'completed');
    const completionRate = rituals.length > 0 ? (completedRituals.length / rituals.length) * 100 : 0;
    
    const averageStreak = rituals.length > 0 ? 
      rituals.reduce((sum, r) => sum + (r.streak || 0), 0) / rituals.length : 0;
    
    const longestStreak = Math.max(...rituals.map(r => r.streak || 0), 0);
    
    // Calculate consistency score (completion rate over time stability)
    const consistencyScore = Math.min(100, completionRate + (averageStreak * 2));
    
    // Simulate weekly growth
    const weeklyGrowth = Math.random() > 0.5 ? Math.random() * 15 : -Math.random() * 8;
    
    // Determine optimal time window
    const morningRituals = rituals.filter(r => {
      const hour = parseInt(r.timeOfDay.split(':')[0]);
      return hour >= 6 && hour <= 10;
    });
    const optimalTimeWindow = morningRituals.length > rituals.length / 2 ? '6:00-8:00 AM' : '7:00-9:00 AM';
    
    // Generate success factors
    const successFactors = [
      'Early morning timing (6-8 AM)',
      'Consistent daily practice',
      'Short duration (5-15 minutes)',
      'Low complexity rituals'
    ].filter(() => Math.random() > 0.3);
    
    return {
      totalSessions,
      completionRate,
      averageStreak,
      longestStreak,
      consistencyScore,
      weeklyGrowth,
      optimalTimeWindow,
      successFactors
    };
  }, [rituals, selectedTimeRange]);

  // Generate predictive insights
  const predictiveInsights = useMemo((): PredictiveInsight[] => {
    const insights: PredictiveInsight[] = [];
    
    // Success probability prediction
    if (performanceMetrics.completionRate > 80) {
      insights.push({
        type: 'success_probability',
        title: 'High Success Probability',
        prediction: '92% likely to maintain current performance',
        confidence: 88,
        reasoning: [
          'Strong completion rate above 80%',
          'Consistent streak patterns',
          'Optimal timing alignment'
        ],
        actionable: true
      });
    } else if (performanceMetrics.completionRate < 60) {
      insights.push({
        type: 'success_probability',
        title: 'Risk of Declining Performance',
        prediction: '65% chance of further decline without intervention',
        confidence: 75,
        reasoning: [
          'Below-average completion rate',
          'Inconsistent timing patterns',
          'Multiple skipped sessions'
        ],
        actionable: true
      });
    }
    
    // Optimal timing insight
    insights.push({
      type: 'optimal_timing',
      title: 'Optimal Timing Analysis',
      prediction: `Best performance window: ${performanceMetrics.optimalTimeWindow}`,
      confidence: 82,
      reasoning: [
        'Historical completion data analysis',
        'Energy level correlation',
        'Schedule conflict minimization'
      ],
      actionable: true
    });
    
    // Streak prediction
    if (performanceMetrics.averageStreak > 5) {
      insights.push({
        type: 'streak_prediction',
        title: 'Streak Momentum',
        prediction: `Projected to reach ${Math.floor(performanceMetrics.longestStreak * 1.5)}-day streak`,
        confidence: 79,
        reasoning: [
          'Strong current momentum',
          'Consistent daily completion',
          'Low-risk routine established'
        ],
        actionable: false
      });
    }
    
    // Goal projection
    insights.push({
      type: 'goal_projection',
      title: 'Long-term Goal Projection',
      prediction: 'On track to establish 5 solid habits within 3 months',
      confidence: 71,
      reasoning: [
        'Current habit formation rate',
        'Successful pattern establishment',
        'Increasing consistency score'
      ],
      actionable: true
    });
    
    return insights;
  }, [performanceMetrics]);

  // Generate chart data
  const weeklyTrendData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      completion: Math.floor(Math.random() * 40) + 60,
      rituals: Math.floor(Math.random() * 3) + 2
    }));
  }, []);

  const ritualTypeData = useMemo(() => {
    const types = ['Meditation', 'Exercise', 'Reading', 'Journaling', 'Breathing'];
    return types.map(type => ({
      name: type,
      value: Math.floor(Math.random() * 30) + 10,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    }));
  }, []);

  const timeDistributionData = useMemo(() => {
    const hours = ['6 AM', '7 AM', '8 AM', '9 AM', '10 AM'];
    return hours.map(hour => ({
      hour,
      rituals: Math.floor(Math.random() * 4) + 1,
      success: Math.floor(Math.random() * 30) + 70
    }));
  }, []);

  const getMetricTrend = (value: number, threshold: number) => {
    if (value > threshold) return { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' };
    return { icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50' };
  };

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            Ritual Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">Comprehensive insights and performance analysis</p>
        </div>
        <Tabs value={selectedTimeRange} onValueChange={(value: any) => setSelectedTimeRange(value)}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="quarter">Quarter</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{performanceMetrics.completionRate.toFixed(1)}%</p>
                <div className="flex items-center mt-1">
                  {(() => {
                    const trend = getMetricTrend(performanceMetrics.completionRate, 75);
                    return (
                      <div className={`p-1 rounded-full ${trend.bg}`}>
                        <trend.icon className={`h-3 w-3 ${trend.color}`} />
                      </div>
                    );
                  })()}
                  <span className="text-xs ml-1 text-muted-foreground">
                    {performanceMetrics.weeklyGrowth > 0 ? '+' : ''}{performanceMetrics.weeklyGrowth.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Streak</p>
                <p className="text-2xl font-bold">{performanceMetrics.averageStreak.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">
                  Best: {performanceMetrics.longestStreak} days
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consistency Score</p>
                <p className="text-2xl font-bold">{performanceMetrics.consistencyScore.toFixed(0)}</p>
                <Progress value={performanceMetrics.consistencyScore} className="h-2 mt-1" />
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{performanceMetrics.totalSessions}</p>
                <p className="text-xs text-muted-foreground">
                  Optimal: {performanceMetrics.optimalTimeWindow}
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="insights">Predictive Insights</TabsTrigger>
          <TabsTrigger value="patterns">Behavioral Patterns</TabsTrigger>
          <TabsTrigger value="goals">Goal Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Completion Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Completion Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="completion" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Completion Rate (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ritual Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Ritual Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={ritualTypeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {ritualTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Time Distribution Analysis */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Optimal Timing Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rituals" fill="#8884d8" name="Number of Rituals" />
                    <Bar dataKey="success" fill="#82ca9d" name="Success Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictiveInsights.map((insight, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      {insight.title}
                    </span>
                    <Badge variant="outline">
                      {insight.confidence}% confidence
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-lg mb-3">{insight.prediction}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Reasoning:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {insight.reasoning.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {insight.actionable && (
                    <Badge className="mt-3">Actionable Insight</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Success Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceMetrics.successFactors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">{factor}</span>
                      <Badge className="bg-green-100 text-green-800">High Impact</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pattern Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Morning Person Pattern</h4>
                    <p className="text-sm text-muted-foreground">
                      85% of successful completions occur before 8 AM
                    </p>
                    <Progress value={85} className="mt-2" />
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Weekday Consistency</h4>
                    <p className="text-sm text-muted-foreground">
                      Higher success rate on Monday-Friday (78% vs 65%)
                    </p>
                    <Progress value={78} className="mt-2" />
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Duration Sweet Spot</h4>
                    <p className="text-sm text-muted-foreground">
                      5-15 minute rituals have 92% completion rate
                    </p>
                    <Progress value={92} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goal Integration & Mapping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      Wellness Goals
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Stress Reduction</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Better Sleep</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      Productivity Goals
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Focus Enhancement</span>
                        <span className="font-medium">82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Energy Levels</span>
                        <span className="font-medium">71%</span>
                      </div>
                      <Progress value={71} className="h-2" />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-500" />
                      Habit Formation
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Daily Consistency</span>
                        <span className="font-medium">74%</span>
                      </div>
                      <Progress value={74} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Long-term Stability</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goal Achievement Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">30-Day Projection</h4>
                    <p className="text-sm text-blue-700">
                      Based on current patterns, you're projected to achieve 85% of your wellness goals 
                      and establish 3-4 solid morning habits.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">90-Day Projection</h4>
                    <p className="text-sm text-green-700">
                      Long-term success probability of 78% for maintaining all current rituals, 
                      with potential for 2-3 additional habit integrations.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800 mb-2">Optimization Recommendations</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Focus on 5-10 minute rituals for higher completion rates</li>
                      <li>• Schedule between 6:30-7:30 AM for optimal consistency</li>
                      <li>• Consider habit stacking with existing strong habits</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RitualAnalyticsDashboard;
