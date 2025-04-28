
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Trophy, Activity, Brain, Moon } from 'lucide-react';
import { useMeditationLibrary } from '@/hooks/useMeditationLibrary';

interface RecommendationCardProps {
  currentMood: string | null;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ currentMood }) => {
  const navigate = useNavigate();
  const { meditationSessions } = useMeditationLibrary();
  
  // Determine recommendation based on mood
  const getRecommendation = () => {
    if (!currentMood || !meditationSessions?.length) {
      // Default recommendation
      return {
        title: 'Morning Focus',
        description: 'Start your day with clarity and intention.',
        icon: <Brain className="h-5 w-5 text-primary" />,
        duration: '10 min',
        navigateTo: '/meditate?tab=guided'
      };
    }
    
    // Mood-based recommendations
    switch (currentMood) {
      case 'anxious':
      case 'stressed':
        return {
          title: 'Anxiety Relief',
          description: 'Calm your mind and reduce stress with this guided practice.',
          icon: <Activity className="h-5 w-5 text-primary" />,
          duration: '15 min',
          navigateTo: '/meditate?tab=guided'
        };
        
      case 'meh':
      case 'okay':
        return {
          title: 'Energy Boost',
          description: 'Revitalize your mind and increase your energy level.',
          icon: <Trophy className="h-5 w-5 text-primary" />,
          duration: '10 min',
          navigateTo: '/meditate?tab=quick'
        };
        
      case 'good':
      case 'amazing':
        return {
          title: 'Deep Focus',
          description: 'Enhance your productivity and concentration.',
          icon: <Brain className="h-5 w-5 text-primary" />,
          duration: '20 min',
          navigateTo: '/meditate?tab=deep'
        };
        
      default:
        return {
          title: 'Evening Wind Down',
          description: 'Prepare your mind and body for restful sleep.',
          icon: <Moon className="h-5 w-5 text-primary" />,
          duration: '10 min',
          navigateTo: '/meditate?tab=sleep'
        };
    }
  };
  
  const recommendation = getRecommendation();
  
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center">
          {recommendation.icon}
          <span className="ml-2">Recommended for You</span>
        </CardTitle>
        <CardDescription>
          Based on {currentMood ? `your ${currentMood} mood` : 'your past activity'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{recommendation.title}</h3>
            <p className="text-sm text-muted-foreground">{recommendation.description}</p>
          </div>
          <div className="bg-primary/20 rounded-full px-3 py-1 text-xs font-medium text-primary mt-2 md:mt-0">
            {recommendation.duration}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate(recommendation.navigateTo)}
          className="w-full"
        >
          Start Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecommendationCard;
