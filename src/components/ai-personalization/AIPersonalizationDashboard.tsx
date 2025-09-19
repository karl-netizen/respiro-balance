import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAIPersonalization } from '@/hooks/useAIPersonalization';
import { SessionRecommendation } from '@/lib/ai-personalization/types';
import { 
  Brain, 
  Target, 
  Clock, 
  TrendingUp, 
  Star, 
  Play,
  RefreshCw,
  User,
  Heart,
  Zap
} from 'lucide-react';

interface AIPersonalizationDashboardProps {
  onSessionStart?: (recommendation: SessionRecommendation) => void;
}

export const AIPersonalizationDashboard: React.FC<AIPersonalizationDashboardProps> = ({
  onSessionStart
}) => {
  const { 
    recommendations, 
    isLoading, 
    error, 
    isProfileLoaded, 
    generateRecommendations,
    refreshRecommendations 
  } = useAIPersonalization();

  const [contextualInputs, setContextualInputs] = useState({
    currentMood: 5,
    availableTime: 15,
    currentStress: 5,
    immediateGoal: ''
  });

  const handleGeneratePersonalized = () => {
    generateRecommendations(contextualInputs);
  };

  const getSessionTypeIcon = (type: SessionRecommendation['sessionType']) => {
    const icons = {
      meditation: Brain,
      breathing: Heart,
      focus: Target,
      sleep: Clock,
      stress_relief: Zap
    };
    return icons[type] || Brain;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  if (!isProfileLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Personalization Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Loading your personalization profile...
            </p>
            {error && (
              <p className="text-destructive mb-4">
                {error}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contextual Input Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Tell AI About Your Current State
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Current Mood (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={contextualInputs.currentMood}
                onChange={(e) => setContextualInputs(prev => ({
                  ...prev,
                  currentMood: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="text-center text-sm text-muted-foreground">
                {contextualInputs.currentMood}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Available Time (minutes)</label>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={contextualInputs.availableTime}
                onChange={(e) => setContextualInputs(prev => ({
                  ...prev,
                  availableTime: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="text-center text-sm text-muted-foreground">
                {contextualInputs.availableTime} min
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Stress Level (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={contextualInputs.currentStress}
                onChange={(e) => setContextualInputs(prev => ({
                  ...prev,
                  currentStress: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="text-center text-sm text-muted-foreground">
                {contextualInputs.currentStress}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Immediate Goal</label>
              <select
                value={contextualInputs.immediateGoal}
                onChange={(e) => setContextualInputs(prev => ({
                  ...prev,
                  immediateGoal: e.target.value
                }))}
                className="w-full p-2 border border-border rounded"
              >
                <option value="">Auto-detect</option>
                <option value="reduce_stress">Reduce Stress</option>
                <option value="improve_focus">Improve Focus</option>
                <option value="better_mood">Better Mood</option>
                <option value="prepare_sleep">Prepare for Sleep</option>
                <option value="increase_energy">Increase Energy</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleGeneratePersonalized}
              disabled={isLoading}
              className="flex-1"
            >
              <Brain className="w-4 h-4 mr-2" />
              Generate AI Recommendations
            </Button>
            <Button 
              variant="outline" 
              onClick={refreshRecommendations}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                AI is analyzing your data to create personalized recommendations...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="space-y-4">
              {recommendations.map((recommendation) => {
                const IconComponent = getSessionTypeIcon(recommendation.sessionType);
                
                return (
                  <div key={recommendation.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{recommendation.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {recommendation.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-3 h-3 rounded-full ${getConfidenceColor(recommendation.confidence)}`}
                          title={`${Math.round(recommendation.confidence * 100)}% confidence`}
                        />
                        <Badge variant="secondary">
                          {recommendation.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{recommendation.duration} minutes</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {Math.round(recommendation.confidence * 100)}% match
                        </span>
                      </div>
                      
                      <div className="flex gap-1">
                        {recommendation.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <h5 className="text-sm font-medium mb-2">Expected Benefits:</h5>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Mood:</span>
                          <span className="ml-1 font-medium">
                            +{recommendation.expectedBenefit.moodImprovement}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stress:</span>
                          <span className="ml-1 font-medium">
                            -{recommendation.expectedBenefit.stressReduction}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Focus:</span>
                          <span className="ml-1 font-medium">
                            +{recommendation.expectedBenefit.focusImprovement}
                          </span>
                        </div>
                      </div>
                    </div>

                    {recommendation.reasoning.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-sm font-medium mb-2">Why this recommendation?</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {recommendation.reasoning.slice(0, 3).map((reason, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Separator className="my-3" />

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Personalized for you
                      </div>
                      <Button
                        onClick={() => onSessionStart?.(recommendation)}
                        className="flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Start Session
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && !error && recommendations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No recommendations yet. Click "Generate AI Recommendations" to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};