
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBiofeedback } from '@/hooks/biofeedback';
import BiometricMonitorSection from '../sections/BiometricMonitorSection';
import type { BiometricData } from '@/hooks/biofeedback/types';

const HeartRateTab: React.FC = () => {
  const { 
    devices, 
    heartRate, 
    stress, 
    restingHeartRate,
    isSimulating 
  } = useBiofeedback();

  const connectedDevices = devices.filter(device => device.connected);

  if (connectedDevices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Heart Rate Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No devices connected. Please connect a device in the Devices tab to start monitoring.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Heart Rate Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <BiometricMonitorSection
            heartRate={heartRate}
            restingHeartRate={restingHeartRate}
            stress={stress}
            isSimulating={isSimulating}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default HeartRateTab;
