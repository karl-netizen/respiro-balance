import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Clock, TrendingUp, BarChart3 } from 'lucide-react';

interface FocusOverviewCardsProps {
  todaysFocus?: string;
  totalSessions?: number;
  currentStreak?: number;
  efficiency?: number;
}

export const FocusOverviewCards: React.FC<FocusOverviewCardsProps> = ({
  todaysFocus = "2h 45m",
  totalSessions = 6,
  currentStreak = 12,
  efficiency = 87
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Today's Focus</p>
              <p className="text-2xl font-bold">{todaysFocus}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Sessions</p>
              <p className="text-2xl font-bold">{totalSessions}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Streak</p>
              <p className="text-2xl font-bold">{currentStreak} days</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Efficiency</p>
              <p className="text-2xl font-bold">{efficiency}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};