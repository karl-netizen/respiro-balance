
import React, { useState, useEffect, ReactNode } from 'react';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

interface DataConverterProps {
  partialData?: Partial<BiometricData>;
  children: (data: BiometricData | null) => ReactNode;
}

export const DataConverter: React.FC<DataConverterProps> = ({ partialData, children }) => {
  const [completeData, setCompleteData] = useState<BiometricData | null>(null);
  
  // Use effect to convert partial data to complete data with defaults
  useEffect(() => {
    if (partialData) {
      // Create a complete BiometricData object with default values for required fields
      const complete: BiometricData = {
        id: partialData.id || `temp-${Date.now()}`, // Generate a temporary ID if not provided
        user_id: partialData.user_id || 'unknown',
        timestamp: partialData.timestamp || new Date().toISOString(),
        heart_rate: partialData.heart_rate || partialData.heartRate || 0,
        hrv: partialData.hrv || 0,
        breath_rate: partialData.breath_rate || partialData.breathRate || 0,
        ...partialData // Include any other fields from partial data
      };
      
      setCompleteData(complete);
    } else {
      setCompleteData(null);
    }
  }, [partialData]);

  return <>{children(completeData)}</>;
};
