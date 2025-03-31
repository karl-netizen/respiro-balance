
import React from 'react';
import MeditationPlayer from "@/components/MeditationPlayer";
import { 
  StatsCards, 
  WeeklyProgressCard, 
  LastSessionCard, 
  RecommendationsCard 
} from './overview';

interface OverviewTabProps {
  meditationStats: {
    totalSessions: number;
    totalMinutes: number;
    streak: number;
    weeklyGoal: number;
    weeklyCompleted: number;
    lastSession: string;
    lastSessionDate: string;
  };
  sessions: {
    day: string;
    completed: boolean;
    today?: boolean;
  }[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ meditationStats, sessions }) => {
  return (
    <div className="mt-0">
      <StatsCards meditationStats={meditationStats} />
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <WeeklyProgressCard meditationStats={meditationStats} sessions={sessions} />
          
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Continue Your Practice</h3>
            <MeditationPlayer />
          </div>
        </div>
        
        <div>
          <LastSessionCard 
            lastSession={meditationStats.lastSession} 
            lastSessionDate={meditationStats.lastSessionDate} 
          />
          
          <RecommendationsCard />
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
