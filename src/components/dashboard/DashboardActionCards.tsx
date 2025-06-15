
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MoodTracker from './MoodTracker';
import { useNavigate } from 'react-router-dom';

interface DashboardActionCardsProps {
  currentMood: string | null;
  onMoodSelect: (mood: string) => void;
}

const DashboardActionCards: React.FC<DashboardActionCardsProps> = ({
  currentMood,
  onMoodSelect
}) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: 'Start Meditation',
      description: 'Begin a guided session',
      action: () => navigate('/meditation?tab=guided')
    },
    {
      label: 'Breathing Exercise',
      description: 'Quick stress relief',
      action: () => navigate('/breathing?type=box')
    },
    {
      label: 'Focus Session',
      description: 'Enhance productivity',
      action: () => navigate('/focus')
    },
    {
      label: 'View Progress',
      description: 'Track your journey',
      action: () => navigate('/progress?tab=overview')
    }
  ];

  return (
    <div className="space-y-4">
      {/* Mood Tracker */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-red-500" />
            How are you feeling?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MoodTracker onMoodSelect={onMoodSelect} currentMood={currentMood} />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={action.action}
                className="flex items-center gap-2 justify-start h-auto p-3 hover:bg-accent transition-colors"
              >
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardActionCards;
