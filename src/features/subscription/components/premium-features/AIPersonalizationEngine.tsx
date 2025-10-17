
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Calendar, Target, Zap, Clock } from 'lucide-react';

interface PersonalizationInsight {
  type: 'schedule' | 'technique' | 'duration' | 'goal';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
}

interface SmartRecommendation {
  id: string;
  type: 'meditation' | 'breathing' | 'focus';
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reason: string;
  confidence: number;
}

export const AIPersonalizationEngine: React.FC = () => {
  const [insights, setInsights] = useState<PersonalizationInsight[]>([]);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [learningProgress, setLearningProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Simulate AI analysis
    const analyzeUserData = async () => {
      setIsAnalyzing(true);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockInsights: PersonalizationInsight[] = [
        {
          type: 'schedule',
          title: 'Optimal Meditation Time',
          description: 'Based on your activity patterns, 7:30 AM shows 85% higher focus scores',
          confidence: 0.85,
          actionable: true
        },
        {
          type: 'technique',
          title: 'Breathing Pattern Preference',
          description: 'Box breathing (4-4-4-4) reduces your stress levels by 40% more than other patterns',
          confidence: 0.92,
          actionable: true
        },
        {
          type: 'duration',
          title: 'Session Length Optimization',
          description: '12-minute sessions maximize your completion rate while maintaining effectiveness',
          confidence: 0.78,
          actionable: true
        },
        {
          type: 'goal',
          title: 'Progress Prediction',
          description: 'Continuing current pattern, you\'ll achieve stress reduction goal in 3 weeks',
          confidence: 0.73,
          actionable: false
        }
      ];

      const mockRecommendations: SmartRecommendation[] = [
        {
          id: '1',
          type: 'meditation',
          title: 'Morning Clarity Session',
          description: 'Focused attention meditation optimized for your morning routine',
          duration: 12,
          difficulty: 'intermediate',
          reason: 'Your biometric data shows optimal receptivity to focused attention at 7:30 AM',
          confidence: 0.89
        },
        {
          id: '2',
          type: 'breathing',
          title: 'Stress Relief Breathing',
          description: 'Box breathing pattern with extended exhale phase',
          duration: 8,
          difficulty: 'beginner',
          reason: 'This pattern reduced your stress levels by 40% in previous sessions',
          confidence: 0.94
        },
        {
          id: '3',
          type: 'focus',
          title: 'Afternoon Focus Boost',
          description: 'Pomodoro session with guided transitions',
          duration: 25,
          difficulty: 'intermediate',
          reason: 'Your productivity peaks when meditation precedes focus work by 15 minutes',
          confidence: 0.81
        }
      ];

      setInsights(mockInsights);
      setRecommendations(mockRecommendations);
      setLearningProgress(75);
      setIsAnalyzing(false);
    };

    analyzeUserData();
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'schedule': return Calendar;
      case 'technique': return Zap;
      case 'duration': return Clock;
      case 'goal': return Target;
      default: return Brain;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meditation': return 'bg-blue-500';
      case 'breathing': return 'bg-green-500';
      case 'focus': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6" />
          AI Personalization Engine
        </h2>
        <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          Premium Plus
        </Badge>
      </div>

      {/* Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AI Learning Progress
          </CardTitle>
          <CardDescription>
            How well our AI understands your meditation patterns and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Personalization Accuracy</span>
              <span>{learningProgress}%</span>
            </div>
            <Progress value={learningProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {isAnalyzing ? 'Analyzing your meditation patterns...' : 
               `Based on ${23} completed sessions and ${156} data points`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Insights</CardTitle>
          <CardDescription>
            AI-powered analysis of your meditation journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => {
            const IconComponent = getInsightIcon(insight.type);
            return (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-blue-500" />
                    <h4 className="font-medium">{insight.title}</h4>
                  </div>
                  <Badge variant="outline">
                    {Math.round(insight.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
                {insight.actionable && (
                  <Button size="sm" variant="outline">
                    Apply Recommendation
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Smart Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
          <CardDescription>
            AI-curated sessions optimized for your goals and patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map(rec => (
            <div key={rec.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getTypeColor(rec.type)}`} />
                  <h4 className="font-medium">{rec.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {rec.duration} min
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {rec.difficulty}
                  </Badge>
                </div>
                <Badge variant="outline">
                  {Math.round(rec.confidence * 100)}% match
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Why this works for you:</strong> {rec.reason}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm">Start Session</Button>
                <Button size="sm" variant="outline">Save for Later</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Predictive Analytics</CardTitle>
          <CardDescription>
            AI predictions for your wellness journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm mb-2">Stress Reduction Goal</h4>
              <div className="text-2xl font-bold text-green-600">3 weeks</div>
              <p className="text-xs text-muted-foreground">
                Predicted completion based on current progress
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm mb-2">Optimal Session Time</h4>
              <div className="text-2xl font-bold text-blue-600">7:30 AM</div>
              <p className="text-xs text-muted-foreground">
                85% higher focus scores at this time
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm mb-2">Streak Potential</h4>
              <div className="text-2xl font-bold text-purple-600">28 days</div>
              <p className="text-xs text-muted-foreground">
                Predicted streak length with current pattern
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm mb-2">Progress Rate</h4>
              <div className="text-2xl font-bold text-orange-600">+12%</div>
              <p className="text-xs text-muted-foreground">
                Weekly improvement in mindfulness scores
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
