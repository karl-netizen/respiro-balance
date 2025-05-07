
import React from 'react';
import { TrendingUp } from "lucide-react";
import { MeditationStats } from '../../types/meditationStats';

interface StatsSectionProps {
  meditationStats: MeditationStats;
}

const StatsSection: React.FC<StatsSectionProps> = ({ meditationStats }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
        <p className="text-sm text-muted-foreground">Sessions</p>
        <h3 className="text-2xl font-bold">{meditationStats.totalSessions}</h3>
        <p className="text-xs text-primary flex items-center mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          +12% from last month
        </p>
      </div>
      
      <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
        <p className="text-sm text-muted-foreground">Minutes</p>
        <h3 className="text-2xl font-bold">{meditationStats.totalMinutes}</h3>
        <p className="text-xs text-primary flex items-center mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          +8% from last month
        </p>
      </div>
      
      <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
        <p className="text-sm text-muted-foreground">Avg Duration</p>
        <h3 className="text-2xl font-bold">
          {meditationStats.totalSessions > 0 
            ? Math.round(meditationStats.totalMinutes / meditationStats.totalSessions) 
            : 0} min
        </h3>
        <p className="text-xs text-primary flex items-center mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          +2 min from last month
        </p>
      </div>
    </div>
  );
};

export default StatsSection;
