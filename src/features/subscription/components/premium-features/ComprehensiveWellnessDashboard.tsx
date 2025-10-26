
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Heart, 
  Activity, 
  Brain, 
  Moon, 
  TrendingUp, 
  TrendingDown,
  Download,
  Target,
  Award
} from 'lucide-react';
import { FeatureGate } from '../management/FeatureGate';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadialBarChart, RadialBar } from 'recharts';

const ComprehensiveWellnessDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Mock data for wellness metrics
  const wellnessData = [
    { date: '2024-01-01', stress: 65, sleep: 7.5, meditation: 20, mood: 8, heartRate: 72, steps: 8500 },
    { date: '2024-01-02', stress: 58, sleep: 8.0, meditation: 25, mood: 9, heartRate: 68, steps: 9200 },
    { date: '2024-01-03', stress: 45, sleep: 7.8, meditation: 30, mood: 8, heartRate: 70, steps: 7800 },
    { date: '2024-01-04', stress: 52, sleep: 6.5, meditation: 15, mood: 6, heartRate: 75, steps: 6500 },
    { date: '2024-01-05', stress: 38, sleep: 8.2, meditation: 35, mood: 9, heartRate: 67, steps: 10200 },
    { date: '2024-01-06', stress: 42, sleep: 7.9, meditation: 28, mood: 8, heartRate: 69, steps: 8900 },
    { date: '2024-01-07', stress: 35, sleep: 8.5, meditation: 40, mood: 10, heartRate: 65, steps: 11000 }
  ];

  // Calculate wellness score
  const calculateWellnessScore = () => {
    const latest = wellnessData[wellnessData.length - 1];
    const stressScore = (100 - latest.stress) * 0.3;
    const sleepScore = (latest.sleep / 8) * 100 * 0.25;
    const meditationScore = Math.min(latest.meditation / 30 * 100, 100) * 0.25;
    const moodScore = (latest.mood / 10) * 100 * 0.2;
    
    return Math.round(stressScore + sleepScore + meditationScore + moodScore);
  };

  const wellnessScore = calculateWellnessScore();

  // Health integrations data
  const integrations = [
    { name: 'Apple Health', connected: true, lastSync: '2 hours ago', metrics: ['Heart Rate', 'Steps', 'Sleep'] },
    { name: 'Google Fit', connected: true, lastSync: '1 hour ago', metrics: ['Activity', 'Weight'] },
    { name: 'Fitbit', connected: false, lastSync: null, metrics: ['Heart Rate', 'Sleep', 'Activity'] },
    { name: 'Oura Ring', connected: false, lastSync: null, metrics: ['Sleep', 'HRV', 'Temperature'] }
  ];

  const goals = [
    { title: 'Daily Meditation', current: 25, target: 30, unit: 'min', progress: 83 },
    { title: 'Sleep Quality', current: 8.2, target: 8.0, unit: 'hrs', progress: 100 },
    { title: 'Stress Level', current: 35, target: 40, unit: '%', progress: 88 },
    { title: 'Weekly Sessions', current: 5, target: 7, unit: 'sessions', progress: 71 }
  ];

  const insights = [
    {
      type: 'positive',
      title: 'Excellent Sleep Improvement',
      description: 'Your sleep quality has improved by 23% this week, likely connected to your consistent evening meditation practice.',
      impact: 'High'
    },
    {
      type: 'warning',
      title: 'Stress Spike on Weekdays',
      description: 'Your stress levels tend to increase on Tuesday and Wednesday. Consider scheduling mid-week meditation sessions.',
      impact: 'Medium'
    },
    {
      type: 'info',
      title: 'Heart Rate Correlation',
      description: 'Your resting heart rate decreases by an average of 5 BPM after 20+ minute meditation sessions.',
      impact: 'Medium'
    }
  ];

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-muted-foreground">{title}</div>
            <div className={`flex items-center text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(change)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <FeatureGate
      requiredTier="premium"
      featureName="Comprehensive Wellness Dashboard"
      featureDescription="Unified health data visualization and advanced wellness insights"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Wellness Dashboard</h2>
            <p className="text-muted-foreground">
              Comprehensive view of your health and meditation progress
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overall Wellness Score */}
        <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Overall Wellness Score</h3>
                <div className="text-4xl font-bold text-teal-600">{wellnessScore}/100</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {wellnessScore >= 80 ? 'Excellent' : wellnessScore >= 60 ? 'Good' : 'Needs Improvement'}
                </p>
              </div>
              
              <div className="w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart data={[{ score: wellnessScore }]}>
                    <RadialBar
                      dataKey="score"
                      startAngle={90}
                      endAngle={-270}
                      fill="#14B8A6"
                      cornerRadius={10}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Stress Level"
            value="35%"
            change={-12}
            icon={<Brain className="w-5 h-5 text-purple-600" />}
            color="bg-purple-100"
          />
          <MetricCard
            title="Sleep Quality"
            value="8.2h"
            change={8}
            icon={<Moon className="w-5 h-5 text-blue-600" />}
            color="bg-blue-100"
          />
          <MetricCard
            title="Heart Rate"
            value="65 BPM"
            change={-5}
            icon={<Heart className="w-5 h-5 text-red-600" />}
            color="bg-red-100"
          />
          <MetricCard
            title="Meditation"
            value="40min"
            change={15}
            icon={<Activity className="w-5 h-5 text-green-600" />}
            color="bg-green-100"
          />
        </div>

        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wellness Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={wellnessData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="stress" stroke="#8884d8" name="Stress Level" />
                      <Line type="monotone" dataKey="mood" stroke="#82ca9d" name="Mood (1-10)" />
                      <Line type="monotone" dataKey="meditation" stroke="#ffc658" name="Meditation (min)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sleep Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={wellnessData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sleep" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Heart Rate Variability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={wellnessData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="heartRate" stroke="#EF4444" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {goals.map((goal, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{goal.title}</h3>
                      <Badge variant={goal.progress >= 100 ? 'default' : goal.progress >= 75 ? 'secondary' : 'outline'}>
                        {goal.progress}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current: {goal.current} {goal.unit}</span>
                        <span>Target: {goal.target} {goal.unit}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(goal.progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Goal Progress Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={goals}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="progress" fill="#14B8A6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <Card key={index} className={`border-l-4 ${
                  insight.type === 'positive' ? 'border-l-green-500 bg-green-50' :
                  insight.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                  'border-l-blue-500 bg-blue-50'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {insight.impact} Impact
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{insight.description}</p>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Weekly Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">7</div>
                    <div className="text-sm text-green-700">Meditation Streak</div>
                  </div>
                  <div className="text-center p-3 bg-blue-100 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">180</div>
                    <div className="text-sm text-blue-700">Minutes Meditated</div>
                  </div>
                  <div className="text-center p-3 bg-purple-100 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">-15%</div>
                    <div className="text-sm text-purple-700">Stress Reduction</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-100 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">8.2</div>
                    <div className="text-sm text-yellow-700">Avg Sleep Hours</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {integrations.map((integration, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{integration.name}</h3>
                      <Badge variant={integration.connected ? 'default' : 'outline'}>
                        {integration.connected ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {integration.metrics.map((metric) => (
                          <Badge key={metric} variant="secondary" className="text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                      
                      {integration.connected ? (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Last sync: {integration.lastSync}
                          </span>
                          <Button variant="outline" size="sm">
                            Sync Now
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full">
                          Connect {integration.name}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Data Export & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Weekly Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Monthly Analysis
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Raw Data Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </FeatureGate>
  );
};

export default ComprehensiveWellnessDashboard;
