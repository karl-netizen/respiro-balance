
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Clock, Target, Zap } from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'meditation' | 'breathing' | 'focus' | 'break';
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reason: string;
  confidence: number;
}

interface SmartRecommendationsProps {
  recommendations: Recommendation[];
  onSelectRecommendation: (recommendation: Recommendation) => void;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  recommendations,
  onSelectRecommendation
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'meditation': return <Brain className="h-5 w-5" />;
      case 'breathing': return <Zap className="h-5 w-5" />;
      case 'focus': return <Target className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meditation': return 'text-purple-600 bg-purple-50';
      case 'breathing': return 'text-blue-600 bg-blue-50';
      case 'focus': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          AI-Powered Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(recommendation.type)}`}>
                    {getIcon(recommendation.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{recommendation.title}</h4>
                    <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(recommendation.difficulty)}`}>
                    {recommendation.difficulty}
                  </span>
                  <span className="text-sm text-muted-foreground">{recommendation.duration} min</span>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                  <strong>Why this works for you:</strong> {recommendation.reason}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Confidence:</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${recommendation.confidence}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{recommendation.confidence}%</span>
                </div>
                
                <Button 
                  size="sm"
                  onClick={() => onSelectRecommendation(recommendation)}
                  className="ml-auto"
                >
                  Start Session
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
