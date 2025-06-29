
import React from 'react';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

interface DataConverterProps {
  partialData?: Partial<BiometricData>;
  children: (completeData: BiometricData | null) => React.ReactNode;
}

export const DataConverter: React.FC<DataConverterProps> = ({ partialData, children }) => {
  // Convert partial data to complete BiometricData or return null if insufficient data
  const completeData: BiometricData | null = partialData ? {
    id: partialData.id || `temp-${Date.now()}`,
    user_id: partialData.user_id || 'temp-user',
    timestamp: partialData.timestamp || new Date().toISOString(),
    recorded_at: partialData.recorded_at || new Date().toISOString(),
    heart_rate: partialData.heart_rate || partialData.heartRate || 70,
    heartRate: partialData.heartRate || partialData.heart_rate || 70,
    hrv: partialData.hrv || 45,
    respiratory_rate: partialData.respiratory_rate || partialData.breath_rate || partialData.breathRate || 14,
    breath_rate: partialData.breath_rate || partialData.respiratory_rate || partialData.breathRate || 14,
    breathRate: partialData.breathRate || partialData.breath_rate || partialData.respiratory_rate || 14,
    stress_score: partialData.stress_score || partialData.stress_level || partialData.stress || 25,
    stress_level: partialData.stress_level || partialData.stress_score || partialData.stress || 25,
    stress: partialData.stress || partialData.stress_level || partialData.stress_score || 25,
    focus_score: partialData.focus_score || 70,
    calm_score: partialData.calm_score || 70,
    coherence: partialData.coherence || 60,
    device_source: partialData.device_source || 'simulator',
    session_id: partialData.session_id,
    brainwaves: partialData.brainwaves || {
      alpha: 5,
      beta: 10,
      delta: 2,
      gamma: 1,
      theta: 4
    }
  } : null;

  return <>{children(completeData)}</>;
};
