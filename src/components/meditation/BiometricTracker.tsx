
import React, { useEffect } from 'react';
import { useUserPreferences } from '@/context';
import BiometricDisplay from './BiometricDisplay';
import { calculateBiometricChange } from '@/components/morning-ritual/utils';

interface BiometricTrackerProps {
  isPlaying: boolean;
  sessionStarted: boolean;
  timeRemaining: number;
  sessionDuration: number;
  initialBiometrics: any;
  setInitialBiometrics: (data: any) => void;
  currentBiometrics: any; 
  setCurrentBiometrics: (data: any) => void;
  biometricChange: any;
  setBiometricChange: (data: any) => void;
  getInitialBiometrics: () => any;
  sessionId: string; // Adding the sessionId prop
}

const BiometricTracker: React.FC<BiometricTrackerProps> = ({
  isPlaying,
  sessionStarted,
  timeRemaining,
  sessionDuration,
  initialBiometrics,
  currentBiometrics,
  setCurrentBiometrics,
  biometricChange,
  setBiometricChange,
  sessionId // Use the sessionId prop
}) => {
  useUserPreferences();

  useEffect(() => {
    if (isPlaying && sessionStarted && initialBiometrics) {
      const interval = setInterval(() => {
        const newBiometrics = { ...initialBiometrics };
        
        const progress = 1 - (timeRemaining / (sessionDuration * 60));
        
        newBiometrics.heart_rate = Math.max(
          initialBiometrics.heart_rate - Math.floor(initialBiometrics.heart_rate * 0.15 * progress),
          60
        );
        
        newBiometrics.hrv = Math.min(
          initialBiometrics.hrv + Math.floor(initialBiometrics.hrv * 0.3 * progress),
          100
        );
        
        newBiometrics.respiratory_rate = Math.max(
          initialBiometrics.respiratory_rate - Math.floor(initialBiometrics.respiratory_rate * 0.25 * progress),
          8
        );
        
        newBiometrics.stress_score = Math.max(
          initialBiometrics.stress_score - Math.floor(initialBiometrics.stress_score * 0.4 * progress),
          20
        );
        
        setCurrentBiometrics(newBiometrics);
        
        const changes = calculateBiometricChange(initialBiometrics, newBiometrics);
        setBiometricChange(changes);
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [
    isPlaying, 
    sessionStarted, 
    initialBiometrics, 
    timeRemaining, 
    sessionDuration, 
    setCurrentBiometrics, 
    setBiometricChange
  ]);

  if (!sessionStarted) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {initialBiometrics && (
        <BiometricDisplay 
          biometricData={initialBiometrics} 
          isInitial={true} 
          showChange={false}
          sessionId={sessionId}
        />
      )}
      
      {currentBiometrics && (
        <BiometricDisplay 
          biometricData={currentBiometrics}
          showChange={true}
          change={biometricChange}
          isInitial={false}
          sessionId={sessionId}
        />
      )}
    </div>
  );
};

export default BiometricTracker;
