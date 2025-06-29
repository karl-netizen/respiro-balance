
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDashboardData } from './hooks/useDashboardData';
import { generateQuickStats } from './utils/dashboardUtils';
import { getMoodCheckForToday, setMoodCheckForToday } from '@/utils/moodCheckUtils';
import { BreadcrumbNavigation } from '@/components/navigation/BreadcrumbNavigation';
import { EnhancedLoadingState } from '@/components/ui/enhanced-loading-states';
import { ErrorDisplay } from '@/components/error/ErrorDisplay';

interface DashboardContainerProps {
  children: (props: {
    user: any;
    currentPeriod: string;
    meditationStats: any;
    currentStreak: number;
    weeklyGoal: number;
    weeklyProgress: number;
    progressPercentage: number;
    welcomeMessage: string;
    userName: string;
    dailyMood: string | null;
    showMoodModal: boolean;
    quickStats: any[];
    handleMoodModalSelect: (mood: string) => void;
    handleMoodChange: () => void;
    handleGoBack: () => void;
    setShowMoodModal: (show: boolean) => void;
  }) => React.ReactNode;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [dailyMood, setDailyMood] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
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

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Check for daily mood on component mount
  useEffect(() => {
    if (user) {
      const todayMood = getMoodCheckForToday();
      if (todayMood) {
        console.log('Setting daily mood from storage:', todayMood);
        setDailyMood(todayMood);
        handleMoodSelect(todayMood);
      } else {
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

  // Smart back navigation that prevents circular loops
  const handleGoBack = useCallback(() => {
    const from = location.state?.from;
    const referrer = document.referrer;
    
    console.log('Dashboard navigation - from:', from, 'referrer:', referrer);
    
    // Prevent going back to dashboard itself
    if (from === '/dashboard' || referrer.includes('/dashboard')) {
      console.log('Preventing dashboard loop, going to landing');
      navigate('/landing', { replace: true });
      return;
    }
    
    // If we have a valid previous location that's not dashboard
    if (from && from !== '/dashboard' && from !== window.location.pathname) {
      navigate(from, { replace: true });
      return;
    }
    
    // Safe fallback to landing page
    navigate('/landing', { replace: true });
  }, [navigate, location.state]);

  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    // Simulate retry
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  console.log('Dashboard render - dailyMood:', dailyMood, 'user:', user);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <EnhancedLoadingState variant="dashboard" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <ErrorDisplay
          title="Dashboard Error"
          message="Unable to load your dashboard. Please try again."
          onRetry={handleRetry}
          error={error}
          showDetails={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 pt-6">
        <BreadcrumbNavigation />
      </div>
      
      {children({
        user: user || { email: 'demo@respiro.com', id: 'demo-user' },
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
      })}
    </div>
  );
};

export default DashboardContainer;
