import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAIPersonalization } from '@/hooks/useAIPersonalization';
import { SessionRecommendation } from '@/lib/ai-personalization/types';
import { PersonalizedSessionCard } from './PersonalizedSessionCard';
import { AIInsightsPanel } from './AIInsightsPanel';
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
  Zap,
  Sparkles
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

  if (!isProfileLoaded && isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 animate-pulse" />
            AI Personalization Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 text-muted-foreground mb-4">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Loading your personalization profile...
            </div>
            {error && (
              <p className="text-sm text-muted-foreground">
                {error}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Show component even if profile failed to load (fallback mode)
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
              Unable to load personalization profile. Using fallback recommendations.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contextual Input Panel */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Tell AI About Your Current State
            <Sparkles className="w-4 h-4 text-primary" />
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

      {/* AI Insights Panel */}
      <AIInsightsPanel 
        userContext={{
          currentMood: contextualInputs.currentMood,
          stressLevel: contextualInputs.currentStress,
          energyLevel: Math.max(1, Math.min(10, 10 - contextualInputs.currentStress + contextualInputs.currentMood - 5)),
          availableTime: contextualInputs.availableTime,
          timeOfDay: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'
        }}
        personalityProfile={{
          preferredSessions: ['meditation', 'breathing', 'focus'],
          optimalTimes: ['morning', 'evening'],
          averageCompletion: 0.85,
          stressPatterns: ['Work deadlines increase stress', 'Evening sessions most effective', 'Prefers shorter sessions when stressed']
        }}
      />

      {/* Recommendations Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Personalized Recommendations
            <Badge className="ml-2 bg-primary/10 text-primary">
              AI Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <Brain className="w-5 h-5 animate-pulse" />
                AI is analyzing your data to create personalized recommendations...
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="space-y-4">
              {recommendations.map((recommendation) => (
                <PersonalizedSessionCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onStartSession={onSessionStart || (() => {})}
                />
              ))}
            </div>
          )}

          {!isLoading && !error && recommendations.length === 0 && (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
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