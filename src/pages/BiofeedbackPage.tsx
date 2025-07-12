
import React from 'react';


import { useBiofeedback } from '@/hooks/biofeedback';
import BiofeedbackLayout from '@/components/biofeedback/layout/BiofeedbackLayout';

const BiofeedbackPage: React.FC = () => {
  const { 
    devices = [],
    isScanning = false,
    isConnecting = false,
    heartRate = 0,
    stress = 0,
    restingHeartRate = 0,
    connectDevice,
    disconnectDevice,
    scanForDevices,
    isSimulating = false,
    stopScan
  } = useBiofeedback();

  // Updated to return Promise<void> explicitly
  const handleScanForDevices = async (deviceType?: string, options?: any): Promise<void> => {
    try {
      await scanForDevices(deviceType, options);
      return Promise.resolve();
    } catch (error) {
      console.error('Error scanning for devices:', error);
      return Promise.reject(error);
    }
  };

  // Updated to return Promise<void> explicitly
  const handleConnectDevice = async (deviceId: string, callback?: () => void): Promise<void> => {
    try {
      await connectDevice(deviceId, { callback });
      return Promise.resolve();
    } catch (error) {
      console.error('Error connecting device:', error);
      return Promise.reject(error);
    }
  };

  // Updated to return Promise<void> explicitly
  const handleDisconnectDevice = async (deviceId: string, callback?: () => void): Promise<void> => {
    try {
      await disconnectDevice(deviceId, { callback });
      return Promise.resolve();
    } catch (error) {
      console.error('Error disconnecting device:', error);
      return Promise.reject(error);
    }
  };
  
  // Updated to return Promise<void> explicitly
  const handleStopScan = async (deviceType?: string, callback?: () => void): Promise<void> => {
    try {
      if (stopScan) {
        await stopScan(deviceType, callback);
      }
      return Promise.resolve();
    } catch (error) {
      console.error('Error stopping scan:', error);
      return Promise.reject(error);
    }
  };
  
  return (
    <>
      
      <main className="container mx-auto py-8 px-4 space-y-8">
        <BiofeedbackLayout
          devices={devices}
          isScanning={isScanning}
          isConnecting={isConnecting}
          heartRate={heartRate}
          stress={stress}
          restingHeartRate={restingHeartRate}
          onScanForDevices={handleScanForDevices}
          onConnectDevice={handleConnectDevice}
          onDisconnectDevice={handleDisconnectDevice}
          isSimulating={isSimulating}
          onStopScan={handleStopScan}
        />
      </main>
      
    </>
  );
};

export default BiofeedbackPage;
