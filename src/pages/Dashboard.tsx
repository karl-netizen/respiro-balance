
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DashboardWelcome, 
  DashboardQuickAccess 
} from '@/components/dashboard';
import DashboardLayout, { DashboardTopSection } from '@/components/dashboard/DashboardLayout';
import DashboardMainContent from '@/components/dashboard/DashboardMainContent';
import MoodCheckModal from '@/components/dashboard/MoodCheckModal';
import MoodDashboardHeader from '@/components/dashboard/MoodDashboardHeader';
import { useDashboardData } from '@/components/dashboard/hooks/useDashboardData';
import { generateQuickStats } from '@/components/dashboard/utils/dashboardUtils';
import { getMoodCheckForToday, setMoodCheckForToday, hasMoodCheckForToday } from '@/utils/moodCheckUtils';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [dailyMood, setDailyMood] = useState<string | null>(null);
  
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

  // Check for daily mood on component mount
  useEffect(() => {
    if (user) {
      const todayMood = getMoodCheckForToday();
      if (todayMood) {
        setDailyMood(todayMood);
        handleMoodSelect(todayMood);
      } else {
        // Show modal if no mood check for today
        setShowMoodModal(true);
      }
    }
  }, [user, handleMoodSelect]);

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

  const handleMoodModalSelect = (mood: string) => {
    setMoodCheckForToday(mood);
    setDailyMood(mood);
    handleMoodSelect(mood);
    setShowMoodModal(false);
  };

  const handleMoodChange = () => {
    setShowMoodModal(true);
  };

  const effectiveMood = dailyMood || currentMood;

  return (
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
            currentPeriod={currentPeriod}
            quickStats={quickStats}
          />
        }
      />

      {/* Mood Dashboard Header */}
      {effectiveMood && (
        <div className="mb-6">
          <MoodDashboardHeader 
            currentMood={effectiveMood}
            onMoodChange={handleMoodChange}
          />
        </div>
      )}

      {/* Progress and Actions Section */}
      <DashboardMainContent
        weeklyProgress={weeklyProgress}
        weeklyGoal={weeklyGoal}
        progressPercentage={progressPercentage}
        currentMood={effectiveMood}
        onMoodSelect={handleMoodSelect}
        currentStreak={currentStreak}
      />

      {/* Quick Access Tabs */}
      <DashboardQuickAccess />
    </DashboardLayout>
  );
};

export default Dashboard;
