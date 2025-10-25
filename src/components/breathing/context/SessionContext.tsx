
import React, { createContext, useState, useRef, useEffect, useContext } from 'react';

interface SessionContextType {
  sessionDuration: number;
  sessionElapsed: number;
  sessionStartTime: React.MutableRefObject<Date | null>;
  formatTime: (seconds: number) => string;
  isActive: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  isActive: boolean;
  onSessionComplete?: (techniqueId: string, durationMinutes: number) => void;
  currentTechnique: string;
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ 
  isActive, 
  onSessionComplete, 
  currentTechnique, 
  children 
}) => {
  const [sessionDuration, setSessionDuration] = useState(0); // in seconds
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const sessionStartTime = useRef<Date | null>(null);
  const sessionInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start timing when breathing exercise begins
  useEffect(() => {
    if (isActive && !sessionStartTime.current) {
      sessionStartTime.current = new Date();
      sessionInterval.current = setInterval(() => {
        if (sessionStartTime.current) {
          const elapsed = Math.floor((new Date().getTime() - sessionStartTime.current.getTime()) / 1000);
          setSessionElapsed(elapsed);
          setSessionDuration(elapsed);
        }
      }, 1000);
    } else if (!isActive && sessionStartTime.current) {
      // Calculate final duration when stopped
      const finalDuration = Math.floor((new Date().getTime() - sessionStartTime.current.getTime()) / 1000);
      setSessionDuration(finalDuration);
      
      // Reset timing mechanism
      if (sessionInterval.current) {
        clearInterval(sessionInterval.current);
        sessionInterval.current = null;
      }
      
      // Call the session complete callback
      if (onSessionComplete && finalDuration >= 30) { // Only count sessions at least 30 seconds
        const minutesCompleted = Math.ceil(finalDuration / 60);
        onSessionComplete(currentTechnique, minutesCompleted);
      }
      
      sessionStartTime.current = null;
    }
    
    return () => {
      if (sessionInterval.current) {
        clearInterval(sessionInterval.current);
      }
    };
  }, [isActive, currentTechnique, onSessionComplete]);

  const value = {
    sessionDuration,
    sessionElapsed,
    sessionStartTime,
    formatTime,
    isActive
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
