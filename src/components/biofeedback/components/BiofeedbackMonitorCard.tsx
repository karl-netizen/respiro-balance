
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BiofeedbackControls } from './BiofeedbackControls';
import { ConnectionPrompt } from './ConnectionPrompt';
import { BiometricSummary } from './BiometricSummary';
import { DeviceInfo } from '@/hooks/biofeedback/biofeedbackTypes';

interface BiofeedbackMonitorCardProps {
  isMonitoring: boolean;
  onStartMonitoring: () => Promise<boolean>;
  onStopMonitoring: () => void;
  connectedDevice: DeviceInfo | null;
  biometricData: {
    heartRate?: number;
    hrv?: number;
    stress?: number;
    coherence?: number;
  };
}

const BiofeedbackMonitorCard: React.FC<BiofeedbackMonitorCardProps> = ({
  isMonitoring,
  onStartMonitoring,
  onStopMonitoring,
  connectedDevice,
  biometricData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Biofeedback Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <BiofeedbackControls 
          isMonitoring={isMonitoring}
          onStartMonitoring={onStartMonitoring}
          onStopMonitoring={onStopMonitoring}
        />
        
        {!connectedDevice ? (
          <ConnectionPrompt isMonitoring={isMonitoring} />
        ) : (
          <BiometricSummary 
            data={{
              heartRate: biometricData.heartRate,
              hrv: biometricData.hrv,
              stress: biometricData.stress,
              coherence: biometricData.coherence
            }}
            loading={isMonitoring && !biometricData.heartRate}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default BiofeedbackMonitorCard;
