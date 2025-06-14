
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

  // Wrapper functions to match expected signatures
  const handleScanForDevices = async (deviceType?: string, options?: any): Promise<void> => {
    await scanForDevices(deviceType, options);
  };

  const handleConnectDevice = async (deviceId: string, callback?: () => void): Promise<void> => {
    await connectDevice(deviceId);
    if (callback) callback();
  };

  const handleDisconnectDevice = async (deviceId: string, callback?: () => void): Promise<void> => {
    await disconnectDevice(deviceId);
    if (callback) callback();
  };

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
            onScanForDevices={handleScanForDevices}
            onConnectDevice={handleConnectDevice}
            onDisconnectDevice={handleDisconnectDevice}
            isSimulating={isSimulating}
            onStopScan={stopScan}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DevicesTab;
