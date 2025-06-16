
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Download, Brain, Target, Calendar } from 'lucide-react';
import { analyticsService, ProgressData, AnalyticsInsight } from '@/services/analytics/AnalyticsService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const AdvancedAnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user, timeRange]);

  const loadAnalyticsData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [progress, userInsights] = await Promise.all([
        analyticsService.getProgressData(user.id, parseInt(timeRange)),
        analyticsService.generateInsights(user.id)
      ]);
      
      setProgressData(progress);
      setInsights(userInsights);
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async () => {
    if (!user) return;
    
    try {
      const reportData = await analyticsService.exportProgressReport(user.id);
      const blob = new Blob([reportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meditation-progress-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Progress report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
          <div className="animate-pulse h-8 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const chartData = progressData ? progressData.dates.map((date, index) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    meditation: progressData.meditationMinutes[index],
    stress: progressData.stressLevels[index],
    focus: progressData.focusScores[index],
    streak: progressData.streakData[index]
  })) : [];

  const summaryStats = progressData ? {
    totalMinutes: progressData.meditationMinutes.reduce((a, b) => a + b, 0),
    avgStress: Math.round(progressData.stressLevels.reduce((a, b) => a + b, 0) / progressData.stressLevels.length),
    avgFocus: Math.round(progressData.focusScores.reduce((a, b) => a + b, 0) / progressData.focusScores.length),
    maxStreak: Math.max(...progressData.streakData)
  } : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Advanced Analytics</h2>
        <div className="flex items-center gap-3">
          <Tabs value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <TabsList>
              <TabsTrigger value="7">7 Days</TabsTrigger>
              <TabsTrigger value="30">30 Days</TabsTrigger>
              <TabsTrigger value="90">90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={handleExportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summaryStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Total Minutes</span>
              </div>
              <div className="text-2xl font-bold">{summaryStats.totalMinutes}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Avg Stress</span>
              </div>
              <div className="text-2xl font-bold">{summaryStats.avgStress}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Avg Focus</span>
              </div>
              <div className="text-2xl font-bold">{summaryStats.avgFocus}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Max Streak</span>
              </div>
              <div className="text-2xl font-bold">{summaryStats.maxStreak}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="progress">Progress Trends</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meditation Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="meditation" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Minutes Meditated"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="streak" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      name="Daily Streak"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stress vs Focus Correlation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="stress" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      name="Stress Level"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="focus" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name="Focus Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg capitalize">
                    {insight.insight_data?.message?.split('.')[0] || 'Insight'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {insight.insight_data?.message}
                  </p>
                  {insight.insight_data?.recommendation && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 text-sm">Recommendation</h4>
                      <p className="text-sm text-blue-700">{insight.insight_data.recommendation}</p>
                    </div>
                  )}
                  <div className="mt-2 text-xs text-muted-foreground">
                    Confidence: {Math.round((insight.confidence_score || 0) * 100)}%
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {insights.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="p-8 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Insights Available</h3>
                  <p className="text-muted-foreground">
                    Complete more meditation sessions to generate personalized insights.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
