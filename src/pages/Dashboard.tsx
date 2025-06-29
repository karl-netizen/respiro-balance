
import React from 'react';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardLayout, { DashboardTopSection } from '@/components/dashboard/DashboardLayout';
import DashboardMainContent from '@/components/dashboard/DashboardMainContent';
import MoodCheckModal from '@/components/dashboard/MoodCheckModal';
import MoodDashboardHeader from '@/components/dashboard/MoodDashboardHeader';
import { DashboardWelcome, DashboardQuickAccess } from '@/components/dashboard';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardContainer>
        {({
          user,
          currentPeriod,
          meditationStats,
          currentStreak,
          weeklyGoal,
          weeklyProgress,
          progressPercentage,
          welcomeMessage,
          userName,
          dailyMood,
          showMoodModal,
          quickStats,
          handleMoodModalSelect,
          handleMoodChange,
          handleGoBack,
          setShowMoodModal,
        }) => (
          <>
            {/* Header with Back Button */}
            <DashboardHeader onGoBack={handleGoBack} />

            <DashboardLayout>
              {/* Mood Check Modal */}
              <MoodCheckModal 
                open={showMoodModal}
                onMoodSelect={handleMoodModalSelect}
              />

              {/* Welcome Section */}
              <DashboardTopSection
                welcomeSection={
                  <DashboardWelcome 
                    welcomeMessage={welcomeMessage}
                    currentPeriod={currentPeriod as 'morning' | 'afternoon' | 'evening'}
                    quickStats={quickStats}
                  />
                }
              />

              {/* Mood Dashboard Header */}
              {dailyMood && (
                <div className="mb-6">
                  <MoodDashboardHeader 
                    currentMood={dailyMood}
                    onMoodChange={handleMoodChange}
                  />
                </div>
              )}

              {/* Progress and Actions Section */}
              <DashboardMainContent
                weeklyProgress={weeklyProgress}
                weeklyGoal={weeklyGoal}
                progressPercentage={progressPercentage}
                currentMood={dailyMood}
                onMoodSelect={handleMoodModalSelect}
                currentStreak={currentStreak}
              />

              {/* Quick Access Tabs */}
              <DashboardQuickAccess />
            </DashboardLayout>
          </>
        )}
      </DashboardContainer>
    </div>
  );
};

export default React.memo(Dashboard);
