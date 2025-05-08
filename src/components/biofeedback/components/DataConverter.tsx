
import React, { useState, useEffect } from 'react';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

interface DataConverterProps {
  biometricData?: BiometricData | Partial<BiometricData>;
  currentBiometrics: Partial<BiometricData> | null;
  children: (data: BiometricData | null) => React.ReactNode;
}

const DataConverter: React.FC<DataConverterProps> = ({ 
  biometricData, 
  currentBiometrics, 
  children 
}) => {
  const [completeData, setCompleteData] = useState<BiometricData | null>(null);
  
  useEffect(() => {
    if (biometricData) {
      // Create a complete BiometricData object with default values for required fields
      const complete: BiometricData = {
        id: biometricData.id || `temp-${Date.now()}`,
        user_id: biometricData.user_id || 'unknown',
        timestamp: biometricData.timestamp || new Date().toISOString(),
        heart_rate: biometricData.heart_rate || (biometricData as any).heartRate || 0,
        hrv: biometricData.hrv || 0,
        breath_rate: biometricData.breath_rate || (biometricData as any).breathRate || 0,
        ...(biometricData as any) // Include any other fields
      };
      
      setCompleteData(complete);
    } else if (currentBiometrics) {
      // If no provided data, use current biometrics
      const complete: BiometricData = {
        id: currentBiometrics.id || `temp-${Date.now()}`,
        user_id: currentBiometrics.user_id || 'unknown',
        timestamp: currentBiometrics.timestamp || new Date().toISOString(),
        heart_rate: currentBiometrics.heart_rate || (currentBiometrics as any).heartRate || 0,
        hrv: currentBiometrics.hrv || 0,
        breath_rate: currentBiometrics.breath_rate || (currentBiometrics as any).breathRate || 0,
        ...(currentBiometrics as any)
      };
      
      setCompleteData(complete);
    } else {
      setCompleteData(null);
    }
  }, [biometricData, currentBiometrics]);

  return <>{children(completeData)}</>;
};

export default DataConverter;
