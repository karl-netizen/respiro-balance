
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingUp, Target, AlertTriangle, Clock, Zap } from 'lucide-react';

interface Insight {
  id: string;
  type: 'achievement' | 'improvement' | 'warning' | 'tip';
  title: string;
  description: string;
  actionable: boolean;
  action?: string;
  metric?: {
    current: number;
    target: number;
    unit: string;
  };
}

interface InsightsGeneratorProps {
  insights: Insight[];
  onActionClick?: (insight: Insight) => void;
}

export const InsightsGenerator: React.FC<InsightsGeneratorProps> = ({ 
  insights, 
  onActionClick 
}) => {
  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'achievement':
        return <TrendingUp className="h-4 w-4" />;
      case 'improvement':
        return <Target className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'tip':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'achievement':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'improvement':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'tip':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (insights.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Complete more focus sessions to unlock personalized insights
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div 
              key={insight.id}
              className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm opacity-90 mb-3">{insight.description}</p>
                    
                    {insight.metric && (
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          Current: {insight.metric.current}{insight.metric.unit}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Target: {insight.metric.target}{insight.metric.unit}
                        </Badge>
                      </div>
                    )}
                    
                    {insight.actionable && insight.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onActionClick?.(insight)}
                        className="text-xs"
                      >
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
                
                <Badge 
                  variant="outline" 
                  className="ml-2 capitalize text-xs"
                >
                  {insight.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to generate insights based on user data
export const generateProductivityInsights = (
  sessions: any[], 
  metrics: any
): Insight[] => {
  const insights: Insight[] = [];

  // Achievement insights
  if (metrics.currentFocusScore >= 85) {
    insights.push({
      id: 'high-focus-score',
      type: 'achievement',
      title: 'Excellent Focus Performance!',
      description: 'Your focus score is in the top 10%. Keep up the great work!',
      actionable: false
    });
  }

  // Improvement suggestions
  if (metrics.avgDistractions > 3) {
    insights.push({
      id: 'reduce-distractions',
      type: 'improvement',
      title: 'Reduce Distractions',
      description: 'You average more than 3 distractions per session. Try using focus modes or a quieter environment.',
      actionable: true,
      action: 'Set Focus Mode',
      metric: {
        current: metrics.avgDistractions,
        target: 2,
        unit: ' distractions/session'
      }
    });
  }

  // Warning insights
  if (metrics.completionRate < 60) {
    insights.push({
      id: 'low-completion',
      type: 'warning',
      title: 'Low Session Completion Rate',
      description: 'You complete less than 60% of your focus sessions. Consider shorter initial sessions.',
      actionable: true,
      action: 'Adjust Session Length',
      metric: {
        current: metrics.completionRate,
        target: 80,
        unit: '%'
      }
    });
  }

  // Tips
  if (sessions.length > 5) {
    const morningSessionsCount = sessions.filter(s => {
      const hour = new Date(s.start_time).getHours();
      return hour >= 6 && hour <= 10;
    }).length;

    if (morningSessionsCount > sessions.length * 0.6) {
      insights.push({
        id: 'morning-focused',
        type: 'tip',
        title: 'You\'re a Morning Person!',
        description: 'Most of your productive sessions happen in the morning. Schedule important work during these hours.',
        actionable: true,
        action: 'Schedule Morning Blocks'
      });
    }
  }

  return insights;
};
