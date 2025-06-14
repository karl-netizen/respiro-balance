
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain } from 'lucide-react';
import MoodTracker from './MoodTracker';
import CrossModuleActions from '@/components/shared/CrossModuleActions';

interface DashboardActionCardsProps {
  currentMood: string | null;
  onMoodSelect: (mood: string) => void;
}

const DashboardActionCards: React.FC<DashboardActionCardsProps> = ({
  currentMood,
  onMoodSelect
}) => {
  return (
    <>
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

      {/* Cross-Module Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-blue-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CrossModuleActions 
            currentModule="dashboard"
            className="space-y-2"
          />
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardActionCards;
