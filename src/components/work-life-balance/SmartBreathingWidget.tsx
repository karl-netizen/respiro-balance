import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, Zap, Play, AlertCircle } from 'lucide-react';
import { useUserPreferences } from '@/context';
import { toast } from 'sonner';
import { BreathingRecommendationEngine } from '@/services/BreathingRecommendationEngine';
import { migrateToEnhancedWorkLife } from '@/utils/workLifeBalanceMigration';
import {
  BreakRecommendation,
  BreathingTechnique,
  WorkBreathingSession
} from '@/types/workLifeBalance';

interface SmartBreathingWidgetProps {
  className?: string;
  onStartSession?: (recommendation: BreakRecommendation) => void;
}

// Technique descriptions for user education
const TECHNIQUE_DESCRIPTIONS: Partial<Record<BreathingTechnique, {
  name: string;
  description: string;
  pattern: string;
  benefits: string[]
}>> = {
  'box-breathing': {
    name: 'Box Breathing',
    description: 'Equal duration inhale, hold, exhale, hold',
    pattern: 'In-4, Hold-4, Out-4, Hold-4',
    benefits: ['Improves focus', 'Reduces anxiety', 'Enhances decision-making']
  },
  'coherent-breathing': {
    name: 'Coherent Breathing',
    description: 'Smooth, rhythmic breathing for heart-brain coherence',
    pattern: 'In-5, Out-5',
    benefits: ['Balances nervous system', 'Increases energy', 'Improves emotional regulation']
  },
  'four-seven-eight': {
    name: '4-7-8 Breathing',
    description: 'Calming technique with extended exhale',
    pattern: 'In-4, Hold-7, Out-8',
    benefits: ['Promotes relaxation', 'Reduces stress', 'Helps with transitions']
  },
  'physiological-sigh': {
    name: 'Physiological Sigh',
    description: 'Double inhale followed by long exhale',
    pattern: 'In-In, Long Out',
    benefits: ['Quick stress relief', 'Resets nervous system', 'Increases alertness']
  },
  'quick-coherence': {
    name: 'Quick Coherence',
    description: 'HeartMath technique combining breath and appreciation',
    pattern: 'In-5, Out-5 + positive emotion',
    benefits: ['Improves performance', 'Enhances clarity', 'Builds resilience']
  },
  'tactical-breathing': {
    name: 'Tactical Breathing',
    description: 'Military technique for staying calm under pressure',
    pattern: 'In-4, Hold-4, Out-4, Hold-4',
    benefits: ['Maintains composure', 'Enhances focus', 'Reduces reaction time']
  },
  'belly-breathing': {
    name: 'Belly Breathing',
    description: 'Deep diaphragmatic breathing',
    pattern: 'Slow, deep breaths to belly',
    benefits: ['Activates relaxation response', 'Improves oxygen flow', 'Reduces muscle tension']
  },
  'triangular-breathing': {
    name: 'Triangular Breathing',
    description: 'Three-part breathing pattern',
    pattern: 'In-4, Hold-4, Out-8',
    benefits: ['Balances energy', 'Improves concentration', 'Calms mind']
  },
  'alternate-nostril': {
    name: 'Alternate Nostril',
    description: 'Traditional yogic breathing technique',
    pattern: 'Alternate nostrils with finger control',
    benefits: ['Balances brain hemispheres', 'Reduces anxiety', 'Improves focus']
  }
};

export const SmartBreathingWidget: React.FC<SmartBreathingWidgetProps> = ({
  className,
  onStartSession
}) => {
  const { preferences } = useUserPreferences();
  const [recommendations, setRecommendations] = useState<BreakRecommendation[]>([]);
  const [activeSession, setActiveSession] = useState<BreakRecommendation | null>(null);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionHistory, setSessionHistory] = useState<WorkBreathingSession[]>([]);
  const [engine, setEngine] = useState<BreathingRecommendationEngine | null>(null);

  // Initialize recommendation engine
  useEffect(() => {
    const enhancedPrefs = migrateToEnhancedWorkLife(preferences);
    const newEngine = new BreathingRecommendationEngine(enhancedPrefs, sessionHistory);
    setEngine(newEngine);
  }, [preferences, sessionHistory]);

  // Get fresh recommendations every minute
  useEffect(() => {
    if (!engine) return;

    const updateRecommendations = () => {
      const currentContext = {
        currentTime: new Date(),
        // In a real app, these could come from:
        // - Calendar integration for meetings
        // - Activity detection for stress levels
        // - Time tracking for workload
      };

      const newRecommendations = engine.getRecommendations(currentContext);
      setRecommendations(newRecommendations);
    };

    updateRecommendations();
    const interval = setInterval(updateRecommendations, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [engine]);

  const startBreathingSession = (recommendation: BreakRecommendation) => {
    setActiveSession(recommendation);
    setIsSessionActive(true);
    setSessionProgress(0);

    // Simulate session progress
    const duration = recommendation.duration * 60; // Convert to seconds
    const progressInterval = setInterval(() => {
      setSessionProgress(prev => {
        const newProgress = prev + (100 / duration);
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          completeSession(recommendation);
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    // Call parent handler if provided
    onStartSession?.(recommendation);

    toast.success(`Starting ${TECHNIQUE_DESCRIPTIONS[recommendation.suggestedTechnique].name}`, {
      description: `${recommendation.duration} minute session`,
    });
  };

  const completeSession = (recommendation: BreakRecommendation) => {
    setIsSessionActive(false);
    setActiveSession(null);

    // Create session record
    const session: WorkBreathingSession = {
      id: `session-${Date.now()}`,
      userId: 'current-user', // Would come from auth context
      technique: recommendation.suggestedTechnique,
      duration: recommendation.duration * 60,
      scheduledDuration: recommendation.duration * 60,
      startTime: new Date(Date.now() - recommendation.duration * 60 * 1000).toISOString(),
      endTime: new Date().toISOString(),
      trigger: {
        type: recommendation.triggerType as any,
        stressor: recommendation.context?.currentStressor,
      },
      completed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to history and update engine
    const newHistory = [...sessionHistory, session];
    setSessionHistory(newHistory);

    if (engine) {
      engine.recordSession(session);
    }

    toast.success('Breathing session completed!', {
      description: 'How did that feel? Your feedback helps improve recommendations.',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="h-4 w-4" />;
      case 'high': return <Zap className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <Brain className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (isSessionActive && activeSession) {
    // Session in progress view
    const technique = TECHNIQUE_DESCRIPTIONS[activeSession.suggestedTechnique];

    return (
      <Card className={`bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 ${className}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Brain className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{technique.name} in Progress</CardTitle>
              <CardDescription>{technique.pattern}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.ceil((100 - sessionProgress) * activeSession.duration / 100)}
            </div>
            <div className="text-sm text-muted-foreground">seconds remaining</div>
          </div>

          <Progress value={sessionProgress} className="h-3" />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">{activeSession.reasoning}</p>
          </div>

          <div className="flex flex-wrap gap-1 justify-center">
            {technique.benefits.map((benefit, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {benefit}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Smart Breathing</CardTitle>
          </div>
          {sessionHistory.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {sessionHistory.length} sessions completed
            </Badge>
          )}
        </div>
        <CardDescription>
          Personalized breathing recommendations based on your work patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No recommendations right now</p>
            <p className="text-xs">We'll suggest breathing techniques when helpful</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((recommendation) => {
              const technique = TECHNIQUE_DESCRIPTIONS[recommendation.suggestedTechnique];

              return (
                <div
                  key={recommendation.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-full text-white ${getPriorityColor(recommendation.priority)}`}>
                        {getPriorityIcon(recommendation.priority)}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{technique.name}</h4>
                        <p className="text-xs text-muted-foreground">{technique.pattern}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{recommendation.duration}m</div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getPriorityColor(recommendation.priority)} text-white border-transparent`}
                      >
                        {recommendation.priority}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">
                    {recommendation.reasoning}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {technique.benefits.slice(0, 2).map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => startBreathingSession(recommendation)}
                      className="h-8 px-3"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick stats */}
        {engine && sessionHistory.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-primary">
                  {engine.getEffectivenessAnalytics().totalSessions}
                </div>
                <div className="text-xs text-muted-foreground">Sessions</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-primary">
                  {Math.round(engine.getEffectivenessAnalytics().averageEffectiveness * 10) / 10}
                </div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-primary">
                  {engine.getEffectivenessAnalytics().improvementTrend === 'improving' ? '↗️' :
                   engine.getEffectivenessAnalytics().improvementTrend === 'declining' ? '↘️' : '➡️'}
                </div>
                <div className="text-xs text-muted-foreground">Trend</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};