
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Wind, Target, Sunrise, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MoodBasedRecommendationsProps {
  currentMood: string | null;
}

const MoodBasedRecommendations: React.FC<MoodBasedRecommendationsProps> = ({ currentMood }) => {
  const navigate = useNavigate();

  const getMoodRecommendations = (mood: string | null) => {
    switch (mood) {
      case 'stressed':
        return [
          {
            title: 'Calming Breathwork',
            description: '4-7-8 technique to reduce stress',
            icon: <Wind className="h-5 w-5 text-blue-500" />,
            action: () => navigate('/breathe?tab=exercises&technique=478'),
            priority: 'high'
          },
          {
            title: 'Stress Relief Meditation',
            description: 'Guided session for relaxation',
            icon: <Brain className="h-5 w-5 text-purple-500" />,
            action: () => navigate('/meditation?tab=guided&filter=stress'),
            priority: 'high'
          },
          {
            title: 'Short Break',
            description: '5-minute reset session',
            icon: <Sparkles className="h-5 w-5 text-green-500" />,
            action: () => navigate('/meditation?tab=quick'),
            priority: 'medium'
          }
        ];
      
      case 'tired':
        return [
          {
            title: 'Energizing Breathwork',
            description: 'Box breathing for alertness',
            icon: <Wind className="h-5 w-5 text-orange-500" />,
            action: () => navigate('/breathe?tab=exercises&technique=box'),
            priority: 'high'
          },
          {
            title: 'Quick Energy Boost',
            description: '10-minute focus meditation',
            icon: <Target className="h-5 w-5 text-red-500" />,
            action: () => navigate('/meditation?tab=quick'),
            priority: 'high'
          },
          {
            title: 'Morning Ritual',
            description: 'Start your day right',
            icon: <Sunrise className="h-5 w-5 text-yellow-500" />,
            action: () => navigate('/morning-ritual'),
            priority: 'medium'
          }
        ];
      
      case 'happy':
        return [
          {
            title: 'Gratitude Meditation',
            description: 'Enhance your positive mood',
            icon: <Brain className="h-5 w-5 text-green-500" />,
            action: () => navigate('/meditation?tab=guided&filter=gratitude'),
            priority: 'high'
          },
          {
            title: 'Social Challenges',
            description: 'Share your positivity',
            icon: <Users className="h-5 w-5 text-blue-500" />,
            action: () => navigate('/social?tab=challenges'),
            priority: 'medium'
          },
          {
            title: 'Focus Session',
            description: 'Channel your energy productively',
            icon: <Target className="h-5 w-5 text-purple-500" />,
            action: () => navigate('/focus'),
            priority: 'medium'
          }
        ];
      
      case 'energetic':
        return [
          {
            title: 'Focus Mode',
            description: 'Use your energy for deep work',
            icon: <Target className="h-5 w-5 text-orange-500" />,
            action: () => navigate('/focus'),
            priority: 'high'
          },
          {
            title: 'Productivity Session',
            description: 'Channel energy into tasks',
            icon: <Brain className="h-5 w-5 text-red-500" />,
            action: () => navigate('/meditation?tab=guided&filter=focus'),
            priority: 'high'
          },
          {
            title: 'Morning Ritual',
            description: 'Build momentum for the day',
            icon: <Sunrise className="h-5 w-5 text-yellow-500" />,
            action: () => navigate('/morning-ritual'),
            priority: 'medium'
          }
        ];
      
      case 'calm':
        return [
          {
            title: 'Deep Meditation',
            description: 'Deepen your peaceful state',
            icon: <Brain className="h-5 w-5 text-blue-500" />,
            action: () => navigate('/meditation?tab=guided&filter=deep'),
            priority: 'high'
          },
          {
            title: 'Progress Review',
            description: 'Reflect on your journey',
            icon: <Sparkles className="h-5 w-5 text-purple-500" />,
            action: () => navigate('/progress?tab=overview'),
            priority: 'medium'
          },
          {
            title: 'Mindful Breathing',
            description: 'Maintain your tranquility',
            icon: <Wind className="h-5 w-5 text-green-500" />,
            action: () => navigate('/breathe?tab=exercises'),
            priority: 'medium'
          }
        ];
      
      default:
        return [
          {
            title: 'Explore Meditation',
            description: 'Discover new techniques',
            icon: <Brain className="h-5 w-5 text-blue-500" />,
            action: () => navigate('/meditation?tab=guided'),
            priority: 'high'
          },
          {
            title: 'Breathing Exercises',
            description: 'Start with simple breathwork',
            icon: <Wind className="h-5 w-5 text-green-500" />,
            action: () => navigate('/breathe?tab=exercises'),
            priority: 'high'
          },
          {
            title: 'Morning Ritual',
            description: 'Create a daily routine',
            icon: <Sunrise className="h-5 w-5 text-orange-500" />,
            action: () => navigate('/morning-ritual'),
            priority: 'medium'
          }
        ];
    }
  };

  const recommendations = getMoodRecommendations(currentMood);
  const moodLabels: { [key: string]: string } = {
    'stressed': 'stressed',
    'tired': 'tired',
    'happy': 'happy',
    'energetic': 'energetic',
    'calm': 'calm',
    'neutral': 'neutral'
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          {currentMood 
            ? `Perfect for when you're feeling ${moodLabels[currentMood] || 'neutral'}`
            : 'Recommended for You'
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {recommendations.map((rec, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={rec.action}
              className={`flex items-center gap-2 justify-start h-auto p-3 hover:bg-accent transition-colors ${
                rec.priority === 'high' ? 'border-primary/20 bg-primary/5' : ''
              }`}
            >
              {rec.icon}
              <div className="text-left flex-1">
                <div className="font-medium text-sm">{rec.title}</div>
                <div className="text-xs text-muted-foreground">{rec.description}</div>
              </div>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodBasedRecommendations;
