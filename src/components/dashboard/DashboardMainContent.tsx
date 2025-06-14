
import React from 'react';
import { DashboardStats, DashboardActionCards } from '@/components/dashboard';

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Weekly Progress */}
      <DashboardStats 
        weeklyProgress={weeklyProgress}
        weeklyGoal={weeklyGoal}
        progressPercentage={progressPercentage}
      />

      {/* Mood Tracker and Quick Actions */}
      <DashboardActionCards 
        currentMood={currentMood}
        onMoodSelect={onMoodSelect}
      />
    </div>
  );
};

export default DashboardMainContent;
