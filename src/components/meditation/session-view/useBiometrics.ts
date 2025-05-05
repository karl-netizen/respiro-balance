
import { useState } from 'react';

export const useBiometrics = () => {
  const [initialBiometrics, setInitialBiometrics] = useState<any>(null);
  const [currentBiometrics, setCurrentBiometrics] = useState<any>(null);
  const [biometricChange, setBiometricChange] = useState<any>(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Generate mock biometric data when the session starts
  const getInitialBiometrics = () => {
    const mockBiometricData = {
      heart_rate: Math.floor(Math.random() * 15) + 70, // 70-85
      hrv: Math.floor(Math.random() * 20) + 40, // 40-60
      respiratory_rate: Math.floor(Math.random() * 5) + 12, // 12-17
      stress_score: Math.floor(Math.random() * 20) + 50, // 50-70
      focus_score: Math.floor(Math.random() * 30) + 60, // 60-90
      calm_score: Math.floor(Math.random() * 25) + 65, // 65-90
    };
    return mockBiometricData;
  };

  const handleSessionStart = () => {
    if (!sessionStarted) {
      const initialData = getInitialBiometrics();
      setInitialBiometrics(initialData);
      setCurrentBiometrics(initialData);
      setSessionStarted(true);
    }
  };

  const handleAudioTimeUpdate = (currentTime: number, duration: number) => {
    // Update biometrics based on session progress
    if (currentBiometrics && initialBiometrics) {
      const progress = currentTime / duration;
      
      // Simple algorithm to simulate biometric changes during meditation
      // Heart rate decreases, HRV increases, focus and calm improve
      const updatedBiometrics = {
        ...currentBiometrics,
        heart_rate: Math.max(65, initialBiometrics.heart_rate - Math.floor(10 * progress)),
        hrv: Math.min(80, initialBiometrics.hrv + Math.floor(20 * progress)),
        focus_score: Math.min(98, initialBiometrics.focus_score + Math.floor(25 * progress)),
        calm_score: Math.min(98, initialBiometrics.calm_score + Math.floor(20 * progress))
      };
      
      setCurrentBiometrics(updatedBiometrics);
      
      // Calculate changes compared to initial state
      const changes = {
        heart_rate: updatedBiometrics.heart_rate - initialBiometrics.heart_rate,
        hrv: updatedBiometrics.hrv - initialBiometrics.hrv,
        focus_score: updatedBiometrics.focus_score - initialBiometrics.focus_score,
        calm_score: updatedBiometrics.calm_score - initialBiometrics.calm_score
      };
      
      setBiometricChange(changes);
    }
  };

  return {
    initialBiometrics,
    currentBiometrics,
    biometricChange,
    sessionStarted,
    setSessionStarted,
    getInitialBiometrics,
    handleSessionStart,
    handleAudioTimeUpdate
  };
};

export default useBiometrics;
