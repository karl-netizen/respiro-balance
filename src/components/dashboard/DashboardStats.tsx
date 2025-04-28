
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Clock, Calendar } from 'lucide-react';
import { MeditationStats } from '@/components/progress/types/meditationStats';

interface DashboardStatsProps {
  meditationStats: MeditationStats;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ meditationStats }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-primary/20 mr-3">
                <Flame className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Current Streak</p>
                <p className="text-2xl font-bold">{meditationStats.streak} days</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-primary/20 mr-3">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Meditation</p>
                <p className="text-2xl font-bold">{meditationStats.totalMinutes} mins</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-primary/20 mr-3">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Weekly Progress</p>
                <p className="text-2xl font-bold">{meditationStats.weeklyCompleted}/{meditationStats.weeklyGoal}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardStats;
