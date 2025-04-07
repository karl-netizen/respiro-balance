
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BiometricData } from './types/BiometricTypes';
import { Heart, Activity, Wind, Brain } from 'lucide-react';

interface BiometricDisplayProps {
  biometricData: BiometricData;
  sessionId: string;
}

export const BiometricDisplay: React.FC<BiometricDisplayProps> = ({ 
  biometricData, 
  sessionId 
}) => {
  const hasData = biometricData && Object.keys(biometricData).length > 0;
  
  if (!hasData) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Biometric Data</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center h-60">
            <p className="text-muted-foreground text-center">
              No biometric data available for this session.
              <br />
              Connect a wearable device to track your metrics during meditation.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Helper to safely get biometric values
  const getBiometricValue = (key: keyof BiometricData): number | undefined => {
    if (!biometricData) return undefined;
    
    // Handle different property names
    if (key === 'heart_rate' && biometricData.heartRate) {
      return biometricData.heartRate;
    }
    if (key === 'respiratory_rate' && biometricData.breathRate) {
      return biometricData.breathRate;
    }
    
    return biometricData[key] as number | undefined;
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Biometric Data</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/30 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              <h3 className="text-sm font-medium">Heart Rate</h3>
            </div>
            <p className="text-2xl font-semibold">
              {getBiometricValue('heart_rate') || getBiometricValue('heartRate') || '??'} <span className="text-sm font-normal text-muted-foreground">bpm</span>
            </p>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Activity className="h-5 w-5 mr-2 text-purple-500" />
              <h3 className="text-sm font-medium">HRV</h3>
            </div>
            <p className="text-2xl font-semibold">
              {getBiometricValue('hrv') || '??'} <span className="text-sm font-normal text-muted-foreground">ms</span>
            </p>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Wind className="h-5 w-5 mr-2 text-blue-500" />
              <h3 className="text-sm font-medium">Breathing</h3>
            </div>
            <p className="text-2xl font-semibold">
              {getBiometricValue('respiratory_rate') || getBiometricValue('breathRate') || '??'} <span className="text-sm font-normal text-muted-foreground">br/min</span>
            </p>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Brain className="h-5 w-5 mr-2 text-amber-500" />
              <h3 className="text-sm font-medium">Stress Level</h3>
            </div>
            <p className="text-2xl font-semibold">
              {getBiometricValue('stress_score') || '??'} <span className="text-sm font-normal text-muted-foreground">score</span>
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-center text-muted-foreground">
            Regular meditation has been shown to reduce stress and improve heart rate variability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiometricDisplay;
