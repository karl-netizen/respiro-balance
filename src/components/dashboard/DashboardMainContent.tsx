
import React from 'react';
import DashboardActionCards from './DashboardActionCards';
import WeeklyProgressCard from './WeeklyProgressCard';
import { SmartRecommendations } from '@/components/shared/smart-recommendations/SmartRecommendations';

interface DashboardMainContentProps {
  weeklyProgress: number;
  weeklyGoal: number;
  progressPercentage: number;
  currentMood: string | null;
  onMoodSelect: (mood: string) => void;
}

const DashboardMainContent: React.FC<DashboardMainContentProps> = ({
  weeklyProgress,
  weeklyGoal,
  progressPercentage,
  currentMood,
  onMoodSelect
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Left Column - Progress */}
      <div className="lg:col-span-1">
        <WeeklyProgressCard
          weeklyProgress={weeklyProgress}
          weeklyGoal={weeklyGoal}
          progressPercentage={progressPercentage}
        />
      </div>

      {/* Middle Column - Actions */}
      <div className="lg:col-span-1 space-y-6">
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
