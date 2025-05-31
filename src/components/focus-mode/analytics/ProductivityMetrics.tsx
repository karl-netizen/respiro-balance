
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Clock, Zap, AlertCircle } from 'lucide-react';
import { useFocusMetrics } from '@/hooks/focus/useFocusMetrics';

export const ProductivityMetrics: React.FC = () => {
  const { metrics, isLoading, insights } = useFocusMetrics();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Focus Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Focus Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold">{metrics.currentFocusScore}/100</div>
            <Badge 
              variant={metrics.focusScoreTrend > 0 ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {metrics.focusScoreTrend > 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(metrics.focusScoreTrend)}% vs last week
            </Badge>
          </div>
          <Progress value={metrics.currentFocusScore} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">
            {metrics.currentFocusScore >= 80 ? "Excellent focus!" : 
             metrics.currentFocusScore >= 60 ? "Good concentration" : 
             "Room for improvement"}
          </p>
        </CardContent>
      </Card>

      {/* Productivity Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Peak Hours</span>
            </div>
            <div className="text-lg font-semibold">{metrics.peakHours}</div>
            <p className="text-xs text-muted-foreground">Your most productive time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Completion Rate</span>
            </div>
            <div className="text-lg font-semibold">{metrics.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Sessions finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">Avg. Distractions</span>
            </div>
            <div className="text-lg font-semibold">{metrics.avgDistractions}</div>
            <p className="text-xs text-muted-foreground">Per session</p>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Productivity Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`p-1 rounded ${
                    insight.type === 'positive' ? 'bg-green-100 text-green-600' :
                    insight.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {insight.type === 'positive' ? <TrendingUp className="h-4 w-4" /> :
                     insight.type === 'warning' ? <AlertCircle className="h-4 w-4" /> :
                     <Target className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{insight.title}</p>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
