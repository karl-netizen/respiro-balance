
import { useEffect, useState } from 'react';
import TooltipSystem from './TooltipSystem';
import GuidedTourEngine from './GuidedTourEngine';
import { UserProfileAnalysis } from './types';
import { useUserGuideProgress } from './hooks/useUserGuideProgress';
import { useAuth } from '@/hooks/useAuth';
import { tourSequences } from './config/tourSequences';
import { tooltipConfigs } from './config/tooltipConfigs';

interface OnboardingOrchestratorProps {
  children: React.ReactNode;
}

// Extend window interface for custom tooltip trigger
declare global {
  interface Window {
    triggerTooltip?: (tooltipId: string) => void;
  }
}

const OnboardingOrchestrator: React.FC<OnboardingOrchestratorProps> = ({ children }) => {
  const [activeTourId, setActiveTourId] = useState<string | undefined>();
  const [userProfile, setUserProfile] = useState<UserProfileAnalysis | null>(null);
  const { user } = useAuth();
  const { hasTourCompleted, userPreferences } = useUserGuideProgress();

  // Analyze user profile for adaptive onboarding
  useEffect(() => {
    if (!user) return;

    // Analyze user behavior and preferences
    const profile: UserProfileAnalysis = {
      experienceLevel: 'complete-beginner', // Default for new users
      usagePattern: 'sporadic',
      deviceUsage: window.innerWidth < 768 ? 'mobile-primary' : 'desktop-primary',
      featureInterest: ['meditation', 'breathing'],
      timeConstraints: 'moderate-time'
    };

    setUserProfile(profile);
  }, [user]);

  // Determine which tour to show based on user state and behavior
  useEffect(() => {
    if (!user || !userProfile || !userPreferences.enableTooltips) return;

    // Check for new user welcome tour
    if (!hasTourCompleted('welcome-tour')) {
      setActiveTourId('welcome-tour');
      return;
    }

    // Check for feature-specific tours based on usage patterns
    const sessionCount = parseInt(localStorage.getItem('user-session-count') || '0');
    
    if (sessionCount >= 3 && !hasTourCompleted('meditation-basics')) {
      setActiveTourId('meditation-basics');
      return;
    }

    if (sessionCount >= 5 && !hasTourCompleted('offline-features')) {
      setActiveTourId('offline-features');
      return;
    }

  }, [user, userProfile, hasTourCompleted, userPreferences.enableTooltips]);

  const handleTourComplete = (tourId: string) => {
    console.log(`Tour completed: ${tourId}`);
    setActiveTourId(undefined);
    
    // Trigger celebration or rewards
    if (tourId === 'welcome-tour') {
      // Show welcome completion celebration
      setTimeout(() => {
        if (window.triggerTooltip) {
          window.triggerTooltip('first-session-encouragement');
        }
      }, 1000);
    }
  };

  const handleTourSkip = (tourId: string) => {
    console.log(`Tour skipped: ${tourId}`);
    setActiveTourId(undefined);
  };

  // Filter tooltips based on user profile
  const adaptiveTooltips = tooltipConfigs.filter(tooltip => {
    // Show beginner tooltips for new users
    if (userProfile?.experienceLevel === 'complete-beginner') {
      return !tooltip.id.includes('advanced');
    }
    
    // Show mobile-specific tooltips for mobile users
    if (userProfile?.deviceUsage === 'mobile-primary') {
      return !tooltip.id.includes('desktop');
    }
    
    return true;
  });

  // Filter tours based on user profile
  const adaptiveTours = tourSequences.filter(tour => {
    return !tour.userType || tour.userType === 'all' || 
           (userProfile?.experienceLevel === 'complete-beginner' && tour.userType === 'new');
  });

  return (
    <>
      {children}
      
      <TooltipSystem tooltips={adaptiveTooltips} />
      
      <GuidedTourEngine
        tours={adaptiveTours}
        activeTourId={activeTourId}
        onTourComplete={handleTourComplete}
        onTourSkip={handleTourSkip}
      />
    </>
  );
};

export default OnboardingOrchestrator;
