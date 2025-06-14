import { BiometricData } from '../types/BiometricTypes';

export const generateMockBiometricData = (): BiometricData => {
  return {
    heartRate: 60 + Math.floor(Math.random() * 40),
    hrv: 20 + Math.floor(Math.random() * 60),
    stress: Math.floor(Math.random() * 100),
    coherence: Math.floor(Math.random() * 100),
    timestamp: Date.now()
  };
};

export const calculateAverage = (data: number[]): number => {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, value) => acc + value, 0);
  return sum / data.length;
};
