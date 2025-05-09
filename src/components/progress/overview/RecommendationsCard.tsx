
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { SunMedium, Moon, Sunset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTimeAwareness } from '@/hooks/useTimeAwareness';
import { TimePeriod } from '@/services/TimeAwarenessService';

interface RecommendationsCardProps {
  timeOfDay: TimePeriod;
  recentSessions: number;
  preferredDuration?: number;
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ 
  timeOfDay, 
  recentSessions,
  preferredDuration = 10
}) => {
  const { recommendations } = useTimeAwareness();
  
  // Get time-of-day specific recommendations
  const getRecommendations = () => {
    switch(timeOfDay) {
      case 'morning':
        return {
          icon: <SunMedium className="h-5 w-5 text-amber-500" />,
          title: "Morning Meditation",
          sessions: [
            { name: "Energizing Breath", duration: 5, type: "Breathing" },
            { name: recommendations.meditation.title, duration: recommendations.meditation.duration, type: "Guided" },
            { name: "Rise and Shine", duration: 15, type: "Music" }
          ]
        };
      case 'afternoon':
        return {
          icon: <Sunset className="h-5 w-5 text-orange-500" />,
          title: "Afternoon Reset",
          sessions: [
            { name: recommendations.breathing.title, duration: recommendations.breathing.duration, type: "Breathing" },
            { name: recommendations.meditation.title, duration: recommendations.meditation.duration, type: "Guided" },
            { name: "Afternoon Calm", duration: 15, type: "Music" }
          ]
        };
      case 'evening':
        return {
          icon: <Moon className="h-5 w-5 text-blue-500" />,
          title: "Evening Wind Down",
          sessions: [
            { name: "Deep Relaxation", duration: 5, type: "Breathing" },
            { name: recommendations.meditation.title, duration: recommendations.meditation.duration, type: "Guided" },
            { name: "Night Peace", duration: 20, type: "Music" }
          ]
        };
      case 'night':
        return {
          icon: <Moon className="h-5 w-5 text-indigo-500" />,
          title: "Before Sleep",
          sessions: [
            { name: recommendations.breathing.title, duration: recommendations.breathing.duration, type: "Breathing" },
            { name: recommendations.meditation.title, duration: recommendations.meditation.duration, type: "Guided" },
            { name: "Sleep Sounds", duration: 30, type: "Music" }
          ]
        };
      default:
        return {
          icon: <SunMedium className="h-5 w-5 text-amber-500" />,
          title: "Recommended For You",
          sessions: [
            { name: "Quick Focus", duration: 5, type: "Breathing" },
            { name: "Mindfulness", duration: 10, type: "Guided" },
            { name: "Deep Calm", duration: 15, type: "Music" }
          ]
        };
    }
  };
  
  const recommendationsData = getRecommendations();
  
  // Filter to get sessions close to preferred duration
  const filteredSessions = recommendationsData.sessions.filter(
    session => Math.abs(session.duration - preferredDuration) <= 10
  );
  
  // Use filtered or all if none match
  const sessionsToShow = filteredSessions.length > 0 ? filteredSessions : recommendationsData.sessions;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          {recommendationsData.icon}
          <span className="ml-2">{recommendationsData.title}</span>
        </CardTitle>
        <CardDescription>Recommended sessions for this time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessionsToShow.map((session, i) => (
            <div key={i} className="flex justify-between items-center p-2 bg-secondary/20 rounded-lg">
              <div>
                <p className="font-medium">{session.name}</p>
                <p className="text-xs text-muted-foreground">{session.type} • {session.duration} min</p>
              </div>
              <Button size="sm" variant="outline">Start</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationsCard;
