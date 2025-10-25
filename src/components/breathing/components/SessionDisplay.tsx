
import React from 'react';
import SessionTimer from '../SessionTimer';
import SessionSummary from '../SessionSummary';
import { useSession } from '../context/SessionContext';

const SessionDisplay: React.FC = () => {
  const { sessionDuration, sessionElapsed, formatTime, isActive } = useSession();

  return (
    <>
      {sessionDuration > 0 && !isActive && (
        <SessionSummary 
          duration={sessionDuration} 
          formatTime={formatTime} 
        />
      )}
      
      {isActive && (
        <SessionTimer
          sessionElapsed={sessionElapsed}
          formatTime={formatTime}
        />
      )}
    </>
  );
};

export default SessionDisplay;
