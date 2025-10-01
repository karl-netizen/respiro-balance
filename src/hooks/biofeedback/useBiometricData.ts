
import { useState } from 'react';
import * as DeviceService from './deviceService';

export function useBiometricData() {
  const [heartRate, setHeartRate] = useState(0);
  const [stress, setStress] = useState(0);
  const [restingHeartRate, setRestingHeartRate] = useState(0);
  const [heartRateHistory, setHeartRateHistory] = useState<number[]>([]);

  // Start reading data from connected device
  const startDataReading = (deviceId: string) => {
    // Try to use real-time notifications first
    const unsubscribe = DeviceService.subscribeToHeartRate(deviceId, (heartRateValue) => {
      setHeartRate(heartRateValue);
      setHeartRateHistory(prev => [...prev.slice(-19), heartRateValue]);
      
      // Update resting heart rate calculation
      if (heartRateHistory.length > 10) {
        const restingHr = DeviceService.calculateRestingHeartRate(heartRateHistory);
        setRestingHeartRate(restingHr);
      }
    });

    // Fallback to polling if notifications not available
    let heartRateInterval: NodeJS.Timeout | null = null;
    if (!unsubscribe) {
      heartRateInterval = setInterval(async () => {
        try {
          const heartRateValue = await DeviceService.getHeartRateData(deviceId);
          setHeartRate(heartRateValue);
          setHeartRateHistory(prev => [...prev.slice(-19), heartRateValue]);
          
          if (heartRateHistory.length > 10) {
            const restingHr = DeviceService.calculateRestingHeartRate(heartRateHistory);
            setRestingHeartRate(restingHr);
          }
        } catch (error) {
          console.error('Error reading heart rate:', error);
        }
      }, 1000);
    }
    
    // For stress level (always polled)
    const stressInterval = setInterval(async () => {
      try {
        const stressValue = await DeviceService.getStressLevelData(deviceId);
        setStress(stressValue);
      } catch (error) {
        console.error('Error reading stress level:', error);
      }
    }, 5000);
    
    return () => {
      if (unsubscribe) unsubscribe();
      if (heartRateInterval) clearInterval(heartRateInterval);
      clearInterval(stressInterval);
    };
  };

  return {
    heartRate,
    stress,
    restingHeartRate,
    heartRateHistory,
    startDataReading
  };
}
