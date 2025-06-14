import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

interface BiometricReading {
  heartRate?: number;
  hrv?: number;
  stress?: number;
  focus?: number;
  calm?: number;
  timestamp: string;
}

interface OptimizedBiometricsReturn {
  currentData: BiometricReading | null;
  historicalData: BiometricReading[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  startMonitoring: () => Promise<boolean>;
  stopMonitoring: () => void;
  getAverages: (minutes: number) => BiometricReading | null;
}

export const useOptimizedBiometrics = (): OptimizedBiometricsReturn => {
  const [currentData, setCurrentData] = useState<BiometricReading | null>(null);
  const [historicalData, setHistoricalData] = useState<BiometricReading[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced function to update biometric data to prevent excessive re-renders
  const debouncedUpdateData = useCallback(
    debounce((newData: BiometricReading) => {
      setCurrentData(newData);
      setHistoricalData(prev => {
        const updated = [...prev, newData];
        // Keep only last 100 readings for performance
        return updated.slice(-100);
      });
    }, 100),
    []
  );

  // Memoized function to generate mock biometric data
  const generateMockData = useCallback((): BiometricReading => {
    const baseHeartRate = 70;
    const baseHRV = 45;
    const baseStress = 50;
    const baseFocus = 70;
    const baseCalm = 70;

    return {
      heartRate: Math.floor(baseHeartRate + (Math.random() - 0.5) * 10),
      hrv: Math.floor(baseHRV + (Math.random() - 0.5) * 15),
      stress: Math.max(0, Math.min(100, Math.floor(baseStress + (Math.random() - 0.5) * 20))),
      focus: Math.max(0, Math.min(100, Math.floor(baseFocus + (Math.random() - 0.5) * 25))),
      calm: Math.max(0, Math.min(100, Math.floor(baseCalm + (Math.random() - 0.5) * 25))),
      timestamp: new Date().toISOString()
    };
  }, []);

  // Memoized calculation of averages
  const getAverages = useCallback((minutes: number): BiometricReading | null => {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    const recentData = historicalData.filter(
      reading => new Date(reading.timestamp) > cutoffTime
    );

    if (recentData.length === 0) return null;

    const averages = recentData.reduce(
      (acc, reading) => ({
        heartRate: (acc.heartRate || 0) + (reading.heartRate || 0),
        hrv: (acc.hrv || 0) + (reading.hrv || 0),
        stress: (acc.stress || 0) + (reading.stress || 0),
        focus: (acc.focus || 0) + (reading.focus || 0),
        calm: (acc.calm || 0) + (reading.calm || 0),
      }),
      { heartRate: 0, hrv: 0, stress: 0, focus: 0, calm: 0 }
    );

    const count = recentData.length;
    return {
      heartRate: Math.round(averages.heartRate / count),
      hrv: Math.round(averages.hrv / count),
      stress: Math.round(averages.stress / count),
      focus: Math.round(averages.focus / count),
      calm: Math.round(averages.calm / count),
      timestamp: new Date().toISOString()
    };
  }, [historicalData]);

  const startMonitoring = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate device connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsConnected(true);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('Failed to connect to biometric device');
      setIsLoading(false);
      return false;
    }
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsConnected(false);
    setCurrentData(null);
  }, []);

  // Effect to simulate real-time biometric data updates
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      const newData = generateMockData();
      debouncedUpdateData(newData);
    }, 2000); // Update every 2 seconds

    return () => {
      clearInterval(interval);
      debouncedUpdateData.cancel();
    };
  }, [isConnected, generateMockData, debouncedUpdateData]);

  return useMemo(() => ({
    currentData,
    historicalData,
    isConnected,
    isLoading,
    error,
    startMonitoring,
    stopMonitoring,
    getAverages
  }), [
    currentData,
    historicalData,
    isConnected,
    isLoading,
    error,
    startMonitoring,
    stopMonitoring,
    getAverages
  ]);
};
