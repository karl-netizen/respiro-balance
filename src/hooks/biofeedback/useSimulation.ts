
import { useState, useEffect } from 'react';
import { BiometricReadings } from './types';

export function useSimulation(): {
  isSimulating: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
  simulatedData: BiometricReadings;
} {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedData, setSimulatedData] = useState<BiometricReadings>({
    heartRate: 72,
    stress: 35,
    restingHeartRate: 62,
    heartRateHistory: []
  });
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);

  const startSimulation = () => {
    setIsSimulating(true);
    
    // Initial mock data
    setSimulatedData({
      heartRate: 72,
      stress: 35,
      restingHeartRate: 62,
      heartRateHistory: []
    });
    
    // Update heart rate every 3 seconds with small variations
    const interval = setInterval(() => {
      setSimulatedData(prev => {
        const baseRate = 72;
        const randomVariation = Math.floor(Math.random() * 10) - 5; // -5 to +5 variation
        const newHeartRate = baseRate + randomVariation;
        
        const newHistory = [...prev.heartRateHistory.slice(-19), newHeartRate];
        
        // Calculate resting heart rate based on the lowest values
        let newRestingHr = prev.restingHeartRate;
        if (newHistory.length > 10) {
          const lowestRates = [...newHistory].sort((a, b) => a - b).slice(0, 5);
          newRestingHr = Math.floor(lowestRates.reduce((sum, val) => sum + val, 0) / lowestRates.length);
        }
        
        // Simulate stress level changes
        const baseStress = 35;
        const stressVariation = Math.floor(Math.random() * 16) - 8; // -8 to +8 variation
        const newStress = Math.max(0, Math.min(100, baseStress + stressVariation));
        
        return {
          heartRate: newHeartRate,
          stress: newStress,
          restingHeartRate: newRestingHr,
          heartRateHistory: newHistory
        };
      });
    }, 3000);
    
    setSimulationInterval(interval);
  };
  
  const stopSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setIsSimulating(false);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);

  return {
    isSimulating,
    startSimulation,
    stopSimulation,
    simulatedData
  };
}
