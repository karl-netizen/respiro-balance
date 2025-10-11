
import React, { useMemo } from 'react';
import DashboardActionCards from './DashboardActionCards';
import WeeklyProgressCard, { WeeklyProgressData } from './WeeklyProgressCard';
import MoodBasedRecommendations from './MoodBasedRecommendations';

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
  // Memoize progress object to prevent WeeklyProgressCard re-renders
  const progressData: WeeklyProgressData = useMemo(() => ({
    weeklyCompleted: weeklyProgress,
    weeklyGoal: weeklyGoal,
    streak: currentStreak
  }), [weeklyProgress, weeklyGoal, currentStreak]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
      {/* Progress Card - Always first on mobile */}
      <div className="lg:col-span-1 order-1">
        <WeeklyProgressCard progress={progressData} />
      </div>

      {/* Mood Selection or Recommendations */}
      <div className="lg:col-span-1 order-2">
        {currentMood ? (
          <MoodBasedRecommendations currentMood={currentMood} />
        ) : (
          <DashboardActionCards
            currentMood={currentMood}
            onMoodSelect={onMoodSelect}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(DashboardMainContent);
