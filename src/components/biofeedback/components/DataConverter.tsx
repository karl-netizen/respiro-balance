
import React from 'react';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

interface DataConverterProps {
  partialData?: Partial<BiometricData>;
  children: (data: BiometricData | null) => React.ReactNode;
}

export const DataConverter: React.FC<DataConverterProps> = ({ 
  partialData, 
  children 
}) => {
  // If no partial data is provided, return null
  if (!partialData) {
    return <>{children(null)}</>;
  }

  // Create a complete BiometricData object from partial data
  const completeData: BiometricData = {
    id: partialData.id || `temp-${Date.now()}`,
    user_id: partialData.user_id || 'unknown',
    timestamp: partialData.timestamp || new Date().toISOString(),
    heart_rate: partialData.heart_rate || partialData.heartRate || 0,
    hrv: partialData.hrv || 0,
    respiratory_rate: partialData.respiratory_rate || 
                     partialData.breath_rate || 
                     partialData.breathRate || 0,
    stress_level: partialData.stress_level || partialData.stress_score || 0,
    coherence: partialData.coherence || 0,
    ...partialData
  };

  return <>{children(completeData)}</>;
};

export default DataConverter;
