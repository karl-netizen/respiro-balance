import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SessionRecommendation } from '@/lib/ai-personalization/types';
import { 
  Play, 
  Clock, 
  Star, 
  TrendingUp, 
  Brain,
  Heart,
  Target,
  Moon,
  Zap
} from 'lucide-react';

interface PersonalizedSessionCardProps {
  recommendation: SessionRecommendation;
  onStartSession: (recommendation: SessionRecommendation) => void;
  compact?: boolean;
}

export const PersonalizedSessionCard: React.FC<PersonalizedSessionCardProps> = ({
  recommendation,
  onStartSession,
  compact = false
}) => {
  const getSessionIcon = (type: SessionRecommendation['sessionType']) => {
    const icons = {
      meditation: Brain,
      breathing: Heart,
      focus: Target,
      sleep: Moon,
      stress_relief: Zap
    };
    return icons[type] || Brain;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const IconComponent = getSessionIcon(recommendation.sessionType);

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-primary/10 rounded-lg">
                <IconComponent className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium truncate">{recommendation.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{recommendation.duration}min</span>
                  <Badge className={`text-xs ${getDifficultyColor(recommendation.difficulty)}`}>
                    {recommendation.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              size="sm"
              onClick={() => onStartSession(recommendation)}
              className="shrink-0"
            >
              <Play className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/30">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <IconComponent className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{recommendation.title}</h3>
              <p className="text-muted-foreground">{recommendation.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Star className={`w-4 h-4 ${getConfidenceColor(recommendation.confidence)}`} />
            <span className={`text-sm font-medium ${getConfidenceColor(recommendation.confidence)}`}>
              {Math.round(recommendation.confidence * 100)}%
            </span>
          </div>
        </div>

        {/* Session Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="font-medium">{recommendation.duration}</span> minutes
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <Badge className={getDifficultyColor(recommendation.difficulty)}>
              {recommendation.difficulty}
            </Badge>
          </div>
          
          <div className="flex gap-1 flex-wrap">
            {recommendation.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Expected Benefits */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Expected Benefits
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Mood</span>
                <span className="font-medium">+{recommendation.expectedBenefit.moodImprovement}</span>
              </div>
              <Progress 
                value={(recommendation.expectedBenefit.moodImprovement / 10) * 100} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Stress</span>
                <span className="font-medium">-{recommendation.expectedBenefit.stressReduction}</span>
              </div>
              <Progress 
                value={(recommendation.expectedBenefit.stressReduction / 10) * 100} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Focus</span>
                <span className="font-medium">+{recommendation.expectedBenefit.focusImprovement}</span>
              </div>
              <Progress 
                value={(recommendation.expectedBenefit.focusImprovement / 10) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </div>

        {/* AI Reasoning */}
        {recommendation.reasoning.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Insights
            </h4>
            <ul className="space-y-1">
              {recommendation.reasoning.slice(0, 3).map((reason, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5 text-xs">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Personalized Elements */}
        {recommendation.personalizedElements.length > 0 && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Personalized For You</h4>
            <div className="space-y-1">
              {recommendation.personalizedElements.slice(0, 2).map((element, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  <span className="capitalize font-medium">{element.type.replace('_', ' ')}: </span>
                  {element.reason}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Confidence: {Math.round(recommendation.confidence * 100)}% match
          </div>
          
          <Button 
            onClick={() => onStartSession(recommendation)}
            className="flex items-center gap-2"
            size="lg"
          >
            <Play className="w-4 h-4" />
            Start Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};