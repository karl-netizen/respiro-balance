
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

export const calculateBiometricChange = (before: BiometricData, after: BiometricData): number => {
  const heartRateBefore = before.heartRate || before.heart_rate || 0;
  const heartRateAfter = after.heartRate || after.heart_rate || 0;
  
  return heartRateAfter - heartRateBefore;
};

export const getBiometricDataFromDevices = async (): Promise<BiometricData[]> => {
  // Mock implementation - would connect to actual devices
  return [];
};
