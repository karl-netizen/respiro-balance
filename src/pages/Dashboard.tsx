
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  DashboardWelcome, 
  DashboardQuickAccess 
} from '@/components/dashboard';
import DashboardLayout, { DashboardTopSection } from '@/components/dashboard/DashboardLayout';
import DashboardMainContent from '@/components/dashboard/DashboardMainContent';
import MoodCheckModal from '@/components/dashboard/MoodCheckModal';
import MoodDashboardHeader from '@/components/dashboard/MoodDashboardHeader';
import { ArrowLeft } from 'lucide-react';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';
import { useDashboardData } from '@/components/dashboard/hooks/useDashboardData';
import { generateQuickStats } from '@/components/dashboard/utils/dashboardUtils';
import { getMoodCheckForToday, setMoodCheckForToday } from '@/utils/moodCheckUtils';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [dailyMood, setDailyMood] = useState<string | null>(null);
  
  const {
    user,
    currentPeriod,
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
        console.log('Setting daily mood from storage:', todayMood);
        setDailyMood(todayMood);
        handleMoodSelect(todayMood);
      } else {
        // Show modal if no mood check for today
        setShowMoodModal(true);
      }
    }
  }, [user, handleMoodSelect]);

  // Memoize quick stats to prevent recalculation
  const quickStats = useMemo(() => 
    generateQuickStats(currentStreak, weeklyProgress, weeklyGoal, meditationStats),
    [currentStreak, weeklyProgress, weeklyGoal, meditationStats]
  );

  // Use useCallback for event handlers
  const handleMoodModalSelect = useCallback((mood: string) => {
    console.log('Mood selected from modal:', mood);
    setMoodCheckForToday(mood);
    setDailyMood(mood);
    handleMoodSelect(mood);
    setShowMoodModal(false);
  }, [handleMoodSelect]);

  const handleMoodChange = useCallback(() => {
    setShowMoodModal(true);
  }, []);

  const handleGoBack = useCallback(() => {
    // Check if we came from a specific page
    const from = location.state?.from;
    
    if (from && from !== '/dashboard') {
      navigate(from);
    } else {
      // Default fallback routes that make sense
      navigate('/landing');
    }
  }, [navigate, location.state]);

  if (!user) {
    navigate('/login');
    return null;
  }

  // Use dailyMood as the primary source of truth
  const effectiveMood = dailyMood;

  console.log('Dashboard render - dailyMood:', dailyMood, 'effectiveMood:', effectiveMood);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="container mx-auto px-6 pt-6">
        <TouchFriendlyButton
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          hapticFeedback={true}
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Previous Page</span>
          <span className="sm:hidden">Back</span>
        </TouchFriendlyButton>
      </div>

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
          onMoodSelect={handleMoodModalSelect}
          currentStreak={currentStreak}
        />

        {/* Quick Access Tabs */}
        <DashboardQuickAccess />
      </DashboardLayout>
    </div>
  );
};

export default React.memo(Dashboard);
