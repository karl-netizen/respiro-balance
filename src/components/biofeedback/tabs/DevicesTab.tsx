
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBiofeedback } from '@/hooks/biofeedback';
import DeviceSection from '../sections/DeviceSection';

const DevicesTab: React.FC = () => {
  const { 
    devices, 
    isScanning, 
    isConnecting, 
    scanForDevices, 
    connectDevice, 
    disconnectDevice,
    stopScan,
    isSimulating 
  } = useBiofeedback();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Device Discovery & Management</CardTitle>
        </CardHeader>
        <CardContent>
          <DeviceSection
            devices={devices}
            isScanning={isScanning}
            isConnecting={isConnecting}
            onScanForDevices={scanForDevices}
            onConnectDevice={connectDevice}
            onDisconnectDevice={disconnectDevice}
            isSimulating={isSimulating}
            onStopScan={stopScan}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DevicesTab;
