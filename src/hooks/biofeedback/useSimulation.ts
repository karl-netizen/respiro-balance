
import { useState, useEffect, useRef } from 'react';
import { BiometricReadings } from './types';

export const useSimulation = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedData, setSimulatedData] = useState<BiometricReadings>({
    heartRate: 72,
    hrv: 45,
    stress: 25,
    coherence: 0.8,
    focusScore: 75,
    calmScore: 70,
    timestamp: new Date().toISOString()
  });
  
  const intervalRef = useRef<NodeJS.Timeout>();

  const generateRealisticData = (): BiometricReadings => {
    const baseHeartRate = 72;
    const heartRateVariation = Math.sin(Date.now() / 10000) * 8;
    const heartRate = Math.round(baseHeartRate + heartRateVariation + (Math.random() - 0.5) * 4);
    
    const hrv = Math.round(45 + Math.sin(Date.now() / 15000) * 15 + (Math.random() - 0.5) * 8);
    const stress = Math.max(0, Math.min(100, Math.round(30 - heartRateVariation + (Math.random() - 0.5) * 20)));
    const coherence = Math.max(0.1, Math.min(1.0, 0.8 + Math.sin(Date.now() / 8000) * 0.3));
    const focusScore = Math.round(75 + Math.sin(Date.now() / 12000) * 20);
    const calmScore = Math.round(70 + Math.cos(Date.now() / 14000) * 25);

    return {
      heartRate,
      hrv,
      stress,
      coherence: Math.round(coherence * 100) / 100,
      focusScore: Math.max(0, Math.min(100, focusScore)),
      calmScore: Math.max(0, Math.min(100, calmScore)),
      timestamp: new Date().toISOString()
    };
  };

  const startSimulation = () => {
    setIsSimulating(true);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      setSimulatedData(generateRealisticData());
    }, 1000);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isSimulating,
    simulatedData,
    startSimulation,
    stopSimulation
  };
};
