
/**
 * Biometric data utility functions for Morning Ritual
 */

/**
 * Calculate biometric change during a meditation session
 * @param before Initial biometric data
 * @param after Final biometric data
 * @returns Object with percentage changes
 */
export const calculateBiometricChange = (
  before: { 
    heart_rate?: number;
    hrv?: number;
    respiratory_rate?: number;
    stress_score?: number;
  } | undefined,
  after: {
    heart_rate?: number;
    hrv?: number;
    respiratory_rate?: number;
    stress_score?: number;
  } | undefined
): {
  heart_rate: number;
  hrv: number;
  respiratory_rate: number;
  stress_score: number;
} => {
  // If no data, return zeros
  if (!before || !after) {
    return {
      heart_rate: 0,
      hrv: 0,
      respiratory_rate: 0,
      stress_score: 0
    };
  }

  // Calculate percentage changes
  const getPercentChange = (start?: number, end?: number): number => {
    if (start === undefined || end === undefined || start === 0) return 0;
    return Math.round(((end - start) / start) * 100);
  };

  return {
    heart_rate: getPercentChange(before.heart_rate, after.heart_rate),
    hrv: getPercentChange(before.hrv, after.hrv),
    respiratory_rate: getPercentChange(before.respiratory_rate, after.respiratory_rate),
    stress_score: getPercentChange(before.stress_score, after.stress_score)
  };
};

/**
 * Extract biometric data from devices for session start
 * @param connectedDevices Array of connected devices
 * @returns Simulated biometric data
 */
export const getBiometricDataFromDevices = (
  connectedDevices: Array<{id: string; name: string; type: string}> = []
): {
  heart_rate: number;
  hrv: number;
  respiratory_rate: number;
  stress_score: number;
} => {
  // If no devices connected, return default values
  if (!connectedDevices.length) {
    return {
      heart_rate: 75,
      hrv: 55,
      respiratory_rate: 16,
      stress_score: 65
    };
  }

  // Simulate different readings based on device types
  const hasHeartRateMonitor = connectedDevices.some(device => 
    device.type === 'heart_rate' || device.name.toLowerCase().includes('hr')
  );

  return {
    heart_rate: hasHeartRateMonitor ? Math.floor(70 + Math.random() * 15) : 75,
    hrv: hasHeartRateMonitor ? Math.floor(45 + Math.random() * 20) : 55,
    respiratory_rate: Math.floor(14 + Math.random() * 4),
    stress_score: Math.floor(60 + Math.random() * 20)
  };
};
