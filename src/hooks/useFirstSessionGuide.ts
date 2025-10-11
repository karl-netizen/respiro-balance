import { useState, useEffect } from 'react';

const FIRST_SESSION_KEY = 'respiro_has_completed_first_session';

export function useFirstSessionGuide() {
  const [showGuide, setShowGuide] = useState(false);
  const [isFirstSession, setIsFirstSession] = useState(false);

  useEffect(() => {
    // Check if user has completed their first session
    const hasCompletedFirstSession = localStorage.getItem(FIRST_SESSION_KEY) === 'true';
    setIsFirstSession(!hasCompletedFirstSession);
  }, []);

  const triggerGuide = () => {
    const hasCompletedFirstSession = localStorage.getItem(FIRST_SESSION_KEY) === 'true';
    if (!hasCompletedFirstSession) {
      setShowGuide(true);
    }
  };

  const closeGuide = () => {
    setShowGuide(false);
  };

  const startFirstSession = () => {
    setShowGuide(false);
    // Mark as completed so guide doesn't show again
    localStorage.setItem(FIRST_SESSION_KEY, 'true');
    setIsFirstSession(false);
  };

  return {
    showGuide,
    isFirstSession,
    triggerGuide,
    closeGuide,
    startFirstSession
  };
}
