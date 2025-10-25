
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Award, Target, Brain, Calendar } from 'lucide-react';

export const ProgressInsights: React.FC = () => {
  const insights = [
    {
      type: 'achievement',
      title: 'Consistency Master',
      description: 'You\'ve maintained a 12-day meditation streak!',
      icon: Award,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      type: 'improvement',
      title: 'Focus Enhancement',
      description: 'Your focus scores have improved by 15% this month.',
      icon: Brain,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      type: 'goal',
      title: 'Weekly Goal Progress',
      description: 'You\'re 80% towards your weekly meditation goal.',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const weeklyStats = {
    sessionsCompleted: 12,
    totalMinutes: 180,
    avgSessionLength: 15,
    focusImprovement: 15,
    stressReduction: 23,
    goalProgress: 80
  };

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="grid gap-4">
        {insights.map((insight, index) => {
          const IconComponent = insight.icon;
          return (
            <Card key={index} className={`${insight.bgColor} ${insight.borderColor}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full bg-white ${insight.borderColor} border`}>
                    <IconComponent className={`h-4 w-4 ${insight.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                  {insight.type === 'achievement' && (
                    <Badge variant="outline" className="bg-white">
                      New!
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            This Week's Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{weeklyStats.sessionsCompleted}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{weeklyStats.totalMinutes}</div>
              <div className="text-xs text-muted-foreground">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{weeklyStats.avgSessionLength}</div>
              <div className="text-xs text-muted-foreground">Avg Length</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">+{weeklyStats.focusImprovement}%</div>
              <div className="text-xs text-muted-foreground">Focus Gain</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Weekly Goal Progress</span>
                <span className="text-sm text-muted-foreground">{weeklyStats.goalProgress}%</span>
              </div>
              <Progress value={weeklyStats.goalProgress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Try Longer Sessions</h4>
                <p className="text-sm text-muted-foreground">
                  Your consistency is excellent! Consider 20-minute sessions.
                </p>
              </div>
              <Button size="sm" variant="outline">Try It</Button>
            </div>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Morning Meditation</h4>
                <p className="text-sm text-muted-foreground">
                  Your focus scores are highest in the morning.
                </p>
              </div>
              <Button size="sm" variant="outline">Schedule</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
