
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface ProductivityInsight {
  type: 'positive' | 'warning' | 'suggestion';
  title: string;
  description: string;
  action?: string;
}

interface InsightsGeneratorProps {
  insights: ProductivityInsight[];
  onActionClick?: (insight: ProductivityInsight) => void;
}

export const InsightsGenerator: React.FC<InsightsGeneratorProps> = ({ 
  insights, 
  onActionClick 
}) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'suggestion':
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-primary" />;
    }
  };

  const getInsightVariant = (type: string) => {
    switch (type) {
      case 'positive':
        return 'default';
      case 'warning':
        return 'destructive';
      case 'suggestion':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Productivity Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Complete more focus sessions to get personalized insights</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge variant={getInsightVariant(insight.type) as any}>
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                    {insight.action && onActionClick && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onActionClick(insight)}
                      >
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const generateProductivityInsights = (
  sessions: any[], 
  metrics: { currentFocusScore: number; avgDistractions: number; completionRate: number }
): ProductivityInsight[] => {
  const insights: ProductivityInsight[] = [];

  // High focus score
  if (metrics.currentFocusScore >= 85) {
    insights.push({
      type: 'positive',
      title: 'Excellent Focus Performance',
      description: `Your focus score of ${metrics.currentFocusScore} is outstanding! You're maintaining excellent concentration.`
    });
  }

  // Low completion rate
  if (metrics.completionRate < 70) {
    insights.push({
      type: 'warning',
      title: 'Low Session Completion Rate',
      description: `Only ${Math.round(metrics.completionRate)}% of your sessions are completed. Try shorter intervals to build momentum.`,
      action: 'Adjust Timer Settings'
    });
  }

  // High distractions
  if (metrics.avgDistractions > 3) {
    insights.push({
      type: 'suggestion',
      title: 'Reduce Distractions',
      description: `You average ${metrics.avgDistractions} distractions per session. Consider using focus mode or finding a quieter environment.`,
      action: 'Enable Focus Mode'
    });
  }

  // Consistent sessions
  if (sessions.length >= 5) {
    insights.push({
      type: 'positive',
      title: 'Great Consistency',
      description: `You've completed ${sessions.length} sessions recently. Consistency is key to building focus habits.`
    });
  }

  // Suggestion for improvement
  if (metrics.currentFocusScore < 70) {
    insights.push({
      type: 'suggestion',
      title: 'Improve Focus Techniques',
      description: 'Try the Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break.',
      action: 'Learn More'
    });
  }

  return insights;
};
