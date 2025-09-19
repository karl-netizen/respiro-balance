import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  Activity,
  Lightbulb,
  BarChart3
} from 'lucide-react';

interface AIInsightsPanelProps {
  userContext: {
    currentMood: number;
    stressLevel: number;
    energyLevel: number;
    availableTime: number;
    timeOfDay: string;
  };
  personalityProfile?: {
    preferredSessions: string[];
    optimalTimes: string[];
    averageCompletion: number;
    stressPatterns: string[];
  };
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  userContext,
  personalityProfile
}) => {
  const getMoodColor = (mood: number) => {
    if (mood >= 7) return 'text-green-600';
    if (mood >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStressColor = (stress: number) => {
    if (stress >= 7) return 'text-red-600';
    if (stress >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 7) return 'text-green-600';
    if (energy >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const generateInsights = () => {
    const insights = [];

    // Mood-based insights
    if (userContext.currentMood < 5) {
      insights.push({
        type: 'mood',
        icon: Activity,
        title: 'Mood Boost Needed',
        description: 'Your current mood indicates you might benefit from uplifting sessions',
        recommendation: 'Try a guided meditation or breathing exercise to improve your mood',
        priority: 'high'
      });
    }

    // Stress-based insights
    if (userContext.stressLevel > 6) {
      insights.push({
        type: 'stress',
        icon: Target,
        title: 'High Stress Detected',
        description: 'Your stress level is elevated - time for some relaxation',
        recommendation: 'Focus on stress-relief techniques and calming sessions',
        priority: 'urgent'
      });
    }

    // Energy-based insights
    if (userContext.energyLevel < 4) {
      insights.push({
        type: 'energy',
        icon: TrendingUp,
        title: 'Low Energy Alert',
        description: 'Your energy is low - gentle sessions might be most effective',
        recommendation: 'Consider shorter, restorative practices to rebuild energy',
        priority: 'medium'
      });
    }

    // Time-based insights
    if (userContext.availableTime < 10) {
      insights.push({
        type: 'time',
        icon: Clock,
        title: 'Quick Session Optimal',
        description: 'Limited time available - micro-sessions can still be effective',
        recommendation: 'Try focused breathing exercises or short mindfulness moments',
        priority: 'medium'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current State Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Current Wellbeing Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className={`text-2xl font-bold ${getMoodColor(userContext.currentMood)}`}>
                {userContext.currentMood}/10
              </div>
              <div className="text-sm text-muted-foreground">Current Mood</div>
              <Progress 
                value={(userContext.currentMood / 10) * 100} 
                className="mt-2"
              />
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className={`text-2xl font-bold ${getStressColor(userContext.stressLevel)}`}>
                {userContext.stressLevel}/10
              </div>
              <div className="text-sm text-muted-foreground">Stress Level</div>
              <Progress 
                value={(userContext.stressLevel / 10) * 100} 
                className="mt-2"
              />
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className={`text-2xl font-bold ${getEnergyColor(userContext.energyLevel)}`}>
                {userContext.energyLevel}/10
              </div>
              <div className="text-sm text-muted-foreground">Energy Level</div>
              <Progress 
                value={(userContext.energyLevel / 10) * 100} 
                className="mt-2"
              />
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {userContext.availableTime}min
              </div>
              <div className="text-sm text-muted-foreground">Available Time</div>
              <div className="text-xs text-muted-foreground mt-1 capitalize">
                {userContext.timeOfDay} session
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Wellness Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => {
                const IconComponent = insight.icon;
                return (
                  <div key={index} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {insight.description}
                      </p>
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-foreground">
                          {insight.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personality Profile */}
      {personalityProfile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Your Wellness Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Preferred Sessions</h4>
                <div className="flex flex-wrap gap-2">
                  {personalityProfile.preferredSessions.map(session => (
                    <Badge key={session} variant="secondary">
                      {session}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Optimal Times</h4>
                <div className="flex flex-wrap gap-2">
                  {personalityProfile.optimalTimes.map(time => (
                    <Badge key={time} variant="outline">
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Completion Rate</h4>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={personalityProfile.averageCompletion * 100} 
                    className="flex-1"
                  />
                  <span className="text-sm font-medium">
                    {Math.round(personalityProfile.averageCompletion * 100)}%
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Stress Patterns</h4>
                <div className="space-y-1">
                  {personalityProfile.stressPatterns.map((pattern, index) => (
                    <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary rounded-full" />
                      {pattern}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};