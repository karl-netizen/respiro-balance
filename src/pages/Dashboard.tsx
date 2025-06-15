
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DashboardWelcome, 
  DashboardQuickAccess 
} from '@/components/dashboard';
import DashboardLayout, { DashboardTopSection } from '@/components/dashboard/DashboardLayout';
import DashboardMainContent from '@/components/dashboard/DashboardMainContent';
import { useDashboardData } from '@/components/dashboard/hooks/useDashboardData';
import { generateQuickStats } from '@/components/dashboard/utils/dashboardUtils';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    currentPeriod,
    currentMood,
    meditationStats,
    currentStreak,
    weeklyGoal,
    weeklyProgress,
    progressPercentage,
    welcomeMessage,
    userName,
    handleMoodSelect
  } = useDashboardData();

  if (!user) {
    navigate('/login');
    return null;
  }

  const quickStats = generateQuickStats(
    currentStreak,
    weeklyProgress,
    weeklyGoal,
    meditationStats
  );

  return (
    <DashboardLayout>
      {/* Welcome Section with Smart Context */}
      <DashboardTopSection
        welcomeSection={
          <DashboardWelcome 
            welcomeMessage={welcomeMessage}
            currentPeriod={currentPeriod}
            quickStats={quickStats}
          />
        }
      />

      {/* Progress and Actions Section */}
      <DashboardMainContent
        weeklyProgress={weeklyProgress}
        weeklyGoal={weeklyGoal}
        progressPercentage={progressPercentage}
        currentMood={currentMood}
        onMoodSelect={handleMoodSelect}
      />

      {/* Quick Access Tabs */}
      <DashboardQuickAccess />
    </DashboardLayout>
  );
};

export default Dashboard;
