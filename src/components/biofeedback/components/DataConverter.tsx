
import React from 'react';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

interface DataConverterProps {
  partialData?: Partial<BiometricData>;
  children: (completeData: BiometricData | null) => React.ReactNode;
}

export const DataConverter: React.FC<DataConverterProps> = ({ partialData, children }) => {
  const convertToCompleteData = (partial?: Partial<BiometricData>): BiometricData | null => {
    if (!partial) return null;
    
    return {
      id: partial.id || `temp-${Date.now()}`,
      user_id: partial.user_id || 'temp-user',
      timestamp: partial.timestamp || new Date().toISOString(),
      heart_rate: partial.heart_rate || partial.heartRate,
      hrv: partial.hrv,
      respiratory_rate: partial.respiratory_rate || partial.breath_rate || partial.breathRate,
      stress_score: partial.stress_score || partial.stress_level || partial.stress,
      focus_score: partial.focus_score,
      calm_score: partial.calm_score,
      coherence: partial.coherence,
      brainwaves: partial.brainwaves,
      ...partial
    };
  };

  const completeData = convertToCompleteData(partialData);
  return <>{children(completeData)}</>;
};
