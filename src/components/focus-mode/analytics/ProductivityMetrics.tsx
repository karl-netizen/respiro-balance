
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Clock, Zap } from 'lucide-react';
import { useFocusMetrics } from '@/hooks/focus/useFocusMetrics';

export const ProductivityMetrics: React.FC = () => {
  const { metrics, isLoading } = useFocusMetrics();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Productivity Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Productivity Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Focus Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="font-medium">Focus Score</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{metrics.currentFocusScore}</span>
              <Badge variant={metrics.focusScoreTrend >= 0 ? "default" : "destructive"}>
                {metrics.focusScoreTrend >= 0 ? '+' : ''}{metrics.focusScoreTrend}
              </Badge>
            </div>
          </div>
          <Progress value={metrics.currentFocusScore} className="h-2" />
        </div>

        {/* Weekly Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Weekly Goal</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {metrics.weeklyProgress}/{metrics.weeklyGoal} sessions
            </span>
          </div>
          <Progress value={(metrics.weeklyProgress / metrics.weeklyGoal) * 100} className="h-2" />
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-semibold">{metrics.peakHours}</div>
            <div className="text-xs text-muted-foreground">Peak Hours</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-semibold">{metrics.completionRate}%</div>
            <div className="text-xs text-muted-foreground">Completion Rate</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-semibold">{metrics.avgDistractions}</div>
            <div className="text-xs text-muted-foreground">Avg Distractions</div>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="text-lg font-semibold">25m</span>
            </div>
            <div className="text-xs text-muted-foreground">Avg Session</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
