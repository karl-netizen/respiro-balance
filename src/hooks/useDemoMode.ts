import { useState, useEffect } from 'react';
import { 
  DEMO_USER, 
  DEMO_USER_PREFERENCES, 
  DEMO_MEDITATION_SESSIONS,
  DEMO_FOCUS_SESSIONS,
  DEMO_ACHIEVEMENTS,
  DEMO_SOCIAL_PROFILE,
  DEMO_REWARDS,
  DEMO_MORNING_RITUALS,
  DEMO_BIOMETRIC_DATA,
  DEMO_STATS,
  DEMO_WEEKLY_PROGRESS,
  DEMO_MOOD_TRACKING
} from '@/lib/demoData';

export const useDemoMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const mode = localStorage.getItem('respiro-auth-mode');
    return mode === 'demo' || !mode; // Default to demo if not set
  });

  const toggleDemoMode = () => {
    const newMode = isDemoMode ? 'real' : 'demo';
    localStorage.setItem('respiro-auth-mode', newMode);
    setIsDemoMode(!isDemoMode);
    
    // Refresh the page to apply mode changes
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const getDemoData = () => {
    if (!isDemoMode) return null;

    return {
      user: DEMO_USER,
      preferences: DEMO_USER_PREFERENCES,
      meditationSessions: DEMO_MEDITATION_SESSIONS,
      focusSessions: DEMO_FOCUS_SESSIONS,
      achievements: DEMO_ACHIEVEMENTS,
      socialProfile: DEMO_SOCIAL_PROFILE,
      rewards: DEMO_REWARDS,
      morningRituals: DEMO_MORNING_RITUALS,
      biometricData: DEMO_BIOMETRIC_DATA,
      stats: DEMO_STATS,
      weeklyProgress: DEMO_WEEKLY_PROGRESS,
      moodTracking: DEMO_MOOD_TRACKING
    };
  };

  const loginDemo = () => {
    if (isDemoMode) {
      localStorage.setItem('demo-session', JSON.stringify({
        user: DEMO_USER,
        loginTime: new Date().toISOString()
      }));
      return DEMO_USER;
    }
    return null;
  };

  const logoutDemo = () => {
    localStorage.removeItem('demo-session');
  };

  const getDemoSession = () => {
    if (!isDemoMode) return null;
    
    const session = localStorage.getItem('demo-session');
    return session ? JSON.parse(session) : null;
  };

  const isLoggedInDemo = () => {
    if (!isDemoMode) return false;
    return getDemoSession() !== null;
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const mode = localStorage.getItem('respiro-auth-mode');
      setIsDemoMode(mode === 'demo' || !mode);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    isDemoMode,
    toggleDemoMode,
    getDemoData,
    loginDemo,
    logoutDemo,
    getDemoSession,
    isLoggedInDemo
  };
};