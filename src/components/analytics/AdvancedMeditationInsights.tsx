
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Brain, Heart, Clock } from 'lucide-react';

interface MeditationInsight {
  date: string;
  duration: number;
  stressReduction: number;
  focusScore: number;
  mood: number;
}

interface AdvancedMeditationInsightsProps {
  data: MeditationInsight[];
}

export const AdvancedMeditationInsights: React.FC<AdvancedMeditationInsightsProps> = ({ data }) => {
  const weeklyProgress = data.slice(-7);
  const avgStressReduction = data.reduce((sum, item) => sum + item.stressReduction, 0) / data.length;
  const avgFocusScore = data.reduce((sum, item) => sum + item.focusScore, 0) / data.length;
  const totalMinutes = data.reduce((sum, item) => sum + item.duration, 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Minutes</p>
                <p className="text-2xl font-bold">{totalMinutes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Stress Reduction</p>
                <p className="text-2xl font-bold">{avgStressReduction.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Focus Score</p>
                <p className="text-2xl font-bold">{avgFocusScore.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Sessions</p>
                <p className="text-2xl font-bold">{data.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="focusScore" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="stressReduction" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="duration" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Optimal Meditation Time</h4>
              <p className="text-sm text-blue-700">
                Your focus scores are highest during morning sessions (7-9 AM). Consider scheduling more sessions during this time.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Stress Management</h4>
              <p className="text-sm text-green-700">
                You show 23% better stress reduction with breathing exercises compared to guided meditation. Mix both for optimal results.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900">Progress Milestone</h4>
              <p className="text-sm text-purple-700">
                You're approaching a 30-day streak! Maintain consistency to unlock advanced meditation techniques.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
