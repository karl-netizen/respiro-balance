
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Activity } from 'lucide-react';
import { AIInsight } from '@/types/advancedBiofeedback';
import { advancedBiofeedbackService } from '@/services/AdvancedBiofeedbackService';

export const AIInsightsPanel: React.FC = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = async () => {
    setIsLoading(true);
    
    // Mock sensor data for demonstration
    const mockSensorData = [
      {
        heartRate: 72,
        hrv: 45,
        stressLevel: 35,
        environmentalFactors: {
          lightExposure: 150,
          soundLevel: 25,
          soundFrequency: [440, 880]
        },
        timestamp: new Date().toISOString()
      },
      {
        heartRate: 68,
        hrv: 48,
        stressLevel: 28,
        timestamp: new Date(Date.now() - 300000).toISOString()
      }
    ];
    
    const generatedInsights = advancedBiofeedbackService.generateAIInsights(mockSensorData);
    setInsights(generatedInsights);
    setIsLoading(false);
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'pattern': return <TrendingUp className="h-4 w-4" />;
      case 'prediction': return <Brain className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: AIInsight['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-500" />
          AI-Powered Insights
          <Badge variant="outline" className="ml-auto">Beta</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Analyzing your biometric patterns...</p>
          </div>
        ) : insights.length > 0 ? (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(insight.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm">{insight.description}</p>
                    
                    {insight.recommendations && insight.recommendations.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Recommendations:</p>
                        <ul className="text-xs space-y-1">
                          {insight.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-blue-500">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">No Insights Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete a few biofeedback sessions to receive AI-powered insights.
            </p>
            <Button onClick={generateInsights} size="sm">
              Generate Sample Insights
            </Button>
          </div>
        )}
        
        <div className="pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full">
            View Detailed Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
