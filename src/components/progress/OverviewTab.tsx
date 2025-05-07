
import React from 'react';
import { 
  StatsCards, 
  WeeklyProgressCard, 
  LastSessionCard, 
  RecommendationsCard,
  MeditationStreakCard,
  MeditationProgressChart,
  MeditationInsightCard
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
    // Adding new fields for enhanced visualizations
    longestStreak?: number;
    dailyMinutes?: Array<{
      day: string;
      minutes: number;
      sessions: number;
    }>;
  };
  sessions: {
    day: string;
    completed: boolean;
    today?: boolean;
  }[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ meditationStats, sessions }) => {
  // Default values if not provided
  const longestStreak = meditationStats.longestStreak || Math.max(meditationStats.streak, 7);
  
  // Generate sample daily data if not provided
  const dailyData = meditationStats.dailyMinutes || [
    { day: "Mon", minutes: 15, sessions: 1 },
    { day: "Tue", minutes: 10, sessions: 1 },
    { day: "Wed", minutes: 20, sessions: 2 },
    { day: "Thu", minutes: 0, sessions: 0 },
    { day: "Fri", minutes: 15, sessions: 1 },
    { day: "Sat", minutes: 25, sessions: 2 },
    { day: "Sun", minutes: 15, sessions: 1 }
  ];
  
  // Calculate current time of day for recommendations
  const getCurrentTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };
  
  return (
    <div className="mt-0 space-y-6">
      <StatsCards meditationStats={meditationStats} />
      
      <div className="grid md:grid-cols-2 gap-6">
        <MeditationStreakCard 
          streak={meditationStats.streak}
          longestStreak={longestStreak}
          weeklyGoal={meditationStats.weeklyGoal}
          weeklyCompleted={meditationStats.weeklyCompleted}
        />
        
        <WeeklyProgressCard 
          meditationStats={meditationStats} 
          sessions={sessions} 
        />
      </div>
      
      <MeditationProgressChart dailyData={dailyData} />
      
      <div className="grid md:grid-cols-2 gap-6">
        <MeditationInsightCard />
        
        <RecommendationsCard 
          timeOfDay={getCurrentTimeOfDay()}
          recentSessions={meditationStats.totalSessions}
          preferredDuration={15}
        />
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div>
            <h3 className="text-xl font-bold mb-4">Continue Your Practice</h3>
            <div className="bg-muted/30 p-6 rounded-lg text-center">
              <p className="text-lg mb-2">Choose a meditation session</p>
              <p className="text-muted-foreground">Select from recommended or favorite sessions</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <LastSessionCard 
            lastSession={meditationStats.lastSession} 
            lastSessionDate={meditationStats.lastSessionDate} 
          />
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
