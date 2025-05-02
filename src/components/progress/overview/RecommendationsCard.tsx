
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Sparkles, Activity, Brain, Heart, Flame, Clock, Zap, BarChart3 } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMeditationFeedback } from '@/hooks/useMeditationFeedback';

interface RecommendationProps {
  currentMood?: string;
  focusLevel?: number;
  stressLevel?: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  recentSessions?: number;
  preferredDuration?: number;
  preferredCategories?: string[];
}

const RecommendationsCard: React.FC<RecommendationProps> = ({ 
  currentMood,
  focusLevel,
  stressLevel,
  timeOfDay = 'morning',
  recentSessions = 0,
  preferredDuration,
  preferredCategories
}) => {
  const navigate = useNavigate();
  const { getFeedbackInsights } = useMeditationFeedback();
  
  const insights = getFeedbackInsights();
  
  // Generate time-based greeting
  const getTimeBasedGreeting = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) return "morning";
    if (currentTime < 18) return "afternoon";
    return "evening";
  };
  
  const actualTimeOfDay = timeOfDay || getTimeBasedGreeting();
  
  // Generate title based on user context
  const generateTitle = () => {
    if (recentSessions === 0) return "Start Your Meditation Journey";
    if (currentMood === 'stressed') return "Reduce Your Stress";
    if (currentMood === 'tired') return "Boost Your Energy";
    if (currentMood === 'anxious') return "Find Your Center";
    
    switch (actualTimeOfDay) {
      case 'morning': return "Morning Meditation";
      case 'afternoon': return "Afternoon Reset";
      case 'evening': return "Evening Wind Down";
      default: return "Personalized For You";
    }
  };
  
  // Generate recommendations based on context
  const recommendations = useMemo(() => {
    let rec = [];
    
    // Base recommendations on mood if available
    if (currentMood) {
      switch (currentMood) {
        case 'happy':
          rec.push({
            id: 'gratitude-1',
            title: 'Gratitude Practice',
            duration: 10,
            icon: <Sparkles className="h-5 w-5" />,
            benefit: 'Amplify your positive mood'
          });
          rec.push({
            id: 'joy-1',
            title: 'Joy Meditation',
            duration: 15,
            icon: <Heart className="h-5 w-5" />,
            benefit: 'Spread positivity to others'
          });
          break;
        case 'stressed':
          rec.push({
            id: 'calm-1',
            title: 'Quick Calm',
            duration: 5,
            icon: <Brain className="h-5 w-5" />,
            benefit: 'Immediate stress relief'
          });
          rec.push({
            id: 'breathe-1',
            title: 'Deep Breathing',
            duration: 8,
            icon: <Flame className="h-5 w-5" />,
            benefit: 'Lower cortisol levels'
          });
          break;
        case 'tired':
          rec.push({
            id: 'energy-1',
            title: 'Energy Boost',
            duration: 7,
            icon: <Flame className="h-5 w-5" />,
            benefit: 'Natural energy without caffeine'
          });
          rec.push({
            id: 'focus-1',
            title: 'Quick Focus',
            duration: 5,
            icon: <Brain className="h-5 w-5" />,
            benefit: 'Sharpen your mental clarity'
          });
          break;
        case 'anxious':
          rec.push({
            id: 'ground-1',
            title: 'Grounding Exercise',
            duration: 10,
            icon: <Brain className="h-5 w-5" />,
            benefit: 'Feel more secure in the present moment'
          });
          rec.push({
            id: 'calm-2',
            title: 'Anxiety Relief',
            duration: 12,
            icon: <Heart className="h-5 w-5" />,
            benefit: 'Reduce nervous system activation'
          });
          break;
        default:
          // Add some fallbacks
          break;
      }
    }
    
    // Add time of day recommendations if we don't have enough
    if (rec.length < 3) {
      switch (actualTimeOfDay) {
        case 'morning':
          rec.push({
            id: 'morning-clarity',
            title: 'Morning Clarity',
            duration: 10,
            icon: <Zap className="h-5 w-5" />,
            benefit: 'Start your day with clear intentions'
          });
          break;
        case 'afternoon':
          rec.push({
            id: 'midday-reset',
            title: 'Midday Reset',
            duration: 7,
            icon: <Clock className="h-5 w-5" />,
            benefit: 'Break through the afternoon slump'
          });
          break;
        case 'evening':
          rec.push({
            id: 'evening-unwind',
            title: 'Evening Unwind',
            duration: 15,
            icon: <Brain className="h-5 w-5" />,
            benefit: 'Prepare your mind for restful sleep'
          });
          break;
      }
    }
    
    // Add data-driven recommendation based on insights
    if (insights && insights.avgStressReduction) {
      rec.push({
        id: 'data-driven-1',
        title: 'Stress Management',
        duration: 12,
        icon: <BarChart3 className="h-5 w-5" />,
        benefit: 'Scientifically proven to reduce your stress levels'
      });
    }
    
    // Ensure we have at least 3 recommendations
    if (rec.length < 3) {
      rec.push({
        id: 'daily-calm',
        title: 'Daily Calm',
        duration: 10,
        icon: <Sparkles className="h-5 w-5" />,
        benefit: 'A perfect meditation for any time of day'
      });
    }
    
    // Return only the top 3
    return rec.slice(0, 3);
  }, [currentMood, actualTimeOfDay, insights]);
  
  const handleSessionClick = (sessionId: string) => {
    navigate(`/meditate/session/${sessionId}`);
  };
  
  const title = generateTitle();
  const description = 
    currentMood ? `Based on your ${currentMood} mood` :
    recentSessions === 0 ? "Great sessions to start with" :
    "Personalized recommendations based on your usage patterns";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((session) => (
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
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">{session.duration} min</p>
                  </div>
                  <p className="text-xs text-primary mt-1">{session.benefit}</p>
                </div>
              </div>
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

export default RecommendationsCard;
