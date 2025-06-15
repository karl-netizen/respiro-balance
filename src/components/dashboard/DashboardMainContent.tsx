
import React from 'react';
import DashboardActionCards from './DashboardActionCards';
import WeeklyProgressCard, { WeeklyProgressData } from './WeeklyProgressCard';
import { SmartRecommendations } from '@/components/shared/smart-recommendations/SmartRecommendations';

interface DashboardMainContentProps {
  weeklyProgress: number;
  weeklyGoal: number;
  progressPercentage: number;
  currentMood: string | null;
  onMoodSelect: (mood: string) => void;
  currentStreak: number;
}

const DashboardMainContent: React.FC<DashboardMainContentProps> = ({
  weeklyProgress,
  weeklyGoal,
  progressPercentage,
  currentMood,
  onMoodSelect,
  currentStreak
}) => {
  // Create progress object to match WeeklyProgressCard interface
  const progressData: WeeklyProgressData = {
    weeklyCompleted: weeklyProgress,
    weeklyGoal: weeklyGoal,
    streak: currentStreak
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Left Column - Progress */}
      <div className="lg:col-span-1">
        <WeeklyProgressCard progress={progressData} />
      </div>

      {/* Middle Column - Actions */}
      <div className="lg:col-span-1">
        <DashboardActionCards
          currentMood={currentMood}
          onMoodSelect={onMoodSelect}
        />
      </div>

      {/* Right Column - Smart Recommendations */}
      <div className="lg:col-span-1">
        <SmartRecommendations 
          maxRecommendations={3}
          showOnlyHighPriority={false}
          compact={false}
        />
      </div>
    </div>
  );
};

export default DashboardMainContent;
