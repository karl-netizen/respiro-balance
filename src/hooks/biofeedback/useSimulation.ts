
import { useState, useEffect, useCallback } from 'react';

export const useSimulation = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedData, setSimulatedData] = useState({
    heartRate: 72,
    hrv: 45,
    stress: 25,
    restingHeartRate: 65
  });

  const generateRealisticData = useCallback(() => {
    // Generate realistic variations
    const baseHR = 72;
    const hrVariation = (Math.random() - 0.5) * 8; // ±4 bpm
    const newHeartRate = Math.max(60, Math.min(100, baseHR + hrVariation));
    
    const baseHRV = 45;
    const hrvVariation = (Math.random() - 0.5) * 10; // ±5 ms
    const newHRV = Math.max(20, Math.min(80, baseHRV + hrvVariation));
    
    const baseStress = 25;
    const stressVariation = (Math.random() - 0.5) * 10; // ±5 points
    const newStress = Math.max(0, Math.min(100, baseStress + stressVariation));

    return {
      heartRate: Math.round(newHeartRate),
      hrv: Math.round(newHRV),
      stress: Math.round(newStress),
      restingHeartRate: 65
    };
  }, []);

  const startSimulation = useCallback(() => {
    setIsSimulating(true);
  }, []);

  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
  }, []);

  // Update simulated data periodically
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSimulatedData(generateRealisticData());
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isSimulating, generateRealisticData]);

  return {
    isSimulating,
    simulatedData,
    startSimulation,
    stopSimulation
  };
};
