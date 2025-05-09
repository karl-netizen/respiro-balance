
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Flame, Heart, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTimeAwareness } from '@/hooks/useTimeAwareness';
import { TimePeriod } from '@/services/TimeAwarenessService';

export interface RecommendationCardProps {
  currentMood?: string | null;
  timeOfDay?: TimePeriod;
  recentSessions?: number;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ currentMood, timeOfDay, recentSessions }) => {
  const navigate = useNavigate();
  const { recommendations } = useTimeAwareness();
  
  // Determine recommendations based on mood and time of day
  const getRecommendations = () => {
    switch (currentMood) {
      case 'happy':
        return {
          title: 'Amplify Your Positive Energy',
          description: 'Channel your positive mood into focused productivity',
          sessions: [
            { id: 'gratitude-1', title: 'Gratitude Practice', duration: 10, icon: <Sparkles className="h-5 w-5" /> },
            { id: 'joy-1', title: 'Joy Meditation', duration: 15, icon: <Heart className="h-5 w-5" /> }
          ]
        };
      case 'stressed':
        return {
          title: 'Reduce Your Stress',
          description: 'These sessions can help calm your mind and body',
          sessions: [
            { id: 'calm-1', title: 'Quick Calm', duration: 5, icon: <Brain className="h-5 w-5" /> },
            { id: 'breathe-1', title: 'Deep Breathing', duration: 8, icon: <Flame className="h-5 w-5" /> }
          ]
        };
      case 'tired':
        return {
          title: 'Boost Your Energy',
          description: 'Revitalize your mind and body with these sessions',
          sessions: [
            { id: 'energy-1', title: 'Energy Boost', duration: 7, icon: <Flame className="h-5 w-5" /> },
            { id: 'focus-1', title: 'Quick Focus', duration: 5, icon: <Brain className="h-5 w-5" /> }
          ]
        };
      case 'anxious':
        return {
          title: 'Find Your Center',
          description: 'Ground yourself and reduce anxiety with these practices',
          sessions: [
            { id: 'ground-1', title: 'Grounding Exercise', duration: 10, icon: <Brain className="h-5 w-5" /> },
            { id: 'calm-2', title: 'Anxiety Relief', duration: 12, icon: <Heart className="h-5 w-5" /> }
          ]
        };
      default:
        // If no mood is selected, use time-based recommendations
        if (timeOfDay === 'morning') {
          return {
            title: 'Morning Recommendations',
            description: 'Start your day with these mindful practices',
            sessions: [
              { 
                id: 'morning-med-1', 
                title: recommendations.meditation.title, 
                duration: recommendations.meditation.duration, 
                icon: <Sparkles className="h-5 w-5" /> 
              },
              { 
                id: 'morning-breath-1', 
                title: recommendations.breathing.title, 
                duration: recommendations.breathing.duration, 
                icon: <Flame className="h-5 w-5" /> 
              }
            ]
          };
        } else if (timeOfDay === 'afternoon') {
          return {
            title: 'Afternoon Recommendations',
            description: 'Reset and refocus with these midday practices',
            sessions: [
              { 
                id: 'afternoon-med-1', 
                title: recommendations.meditation.title, 
                duration: recommendations.meditation.duration, 
                icon: <Brain className="h-5 w-5" /> 
              },
              { 
                id: 'afternoon-breath-1', 
                title: recommendations.breathing.title, 
                duration: recommendations.breathing.duration, 
                icon: <Heart className="h-5 w-5" /> 
              }
            ]
          };
        } else if (timeOfDay === 'evening') {
          return {
            title: 'Evening Recommendations',
            description: 'Wind down and transition from your workday',
            sessions: [
              { 
                id: 'evening-med-1', 
                title: recommendations.meditation.title, 
                duration: recommendations.meditation.duration, 
                icon: <Heart className="h-5 w-5" /> 
              },
              { 
                id: 'evening-breath-1', 
                title: recommendations.breathing.title, 
                duration: recommendations.breathing.duration, 
                icon: <Brain className="h-5 w-5" /> 
              }
            ]
          };
        } else {
          return {
            title: 'Night Recommendations',
            description: 'Prepare your mind and body for restful sleep',
            sessions: [
              { 
                id: 'night-med-1', 
                title: recommendations.meditation.title, 
                duration: recommendations.meditation.duration, 
                icon: <Heart className="h-5 w-5" /> 
              },
              { 
                id: 'night-breath-1', 
                title: recommendations.breathing.title, 
                duration: recommendations.breathing.duration, 
                icon: <Flame className="h-5 w-5" /> 
              }
            ]
          };
        }
    }
  };
  
  const recommendationsData = getRecommendations();
  
  const handleSessionClick = (sessionId: string) => {
    navigate(`/meditate/session/${sessionId}`);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{recommendationsData.title}</CardTitle>
        <CardDescription>
          {recommendationsData.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendationsData.sessions.map((session) => (
            <div 
              key={session.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer"
              onClick={() => handleSessionClick(session.id)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  {session.icon}
                </div>
                <div>
                  <h4 className="font-medium">{session.title}</h4>
                  <p className="text-sm text-muted-foreground">{session.duration} min</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
          
          <Button 
            variant="ghost" 
            className="w-full mt-2"
            onClick={() => navigate('/meditate')}
          >
            View All Sessions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
