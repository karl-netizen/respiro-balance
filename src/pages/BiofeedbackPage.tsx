
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

  const handleScanForDevices = async (deviceType?: string, options?: any): Promise<void> => {
    try {
      await scanForDevices(deviceType, options);
    } catch (error) {
      console.error('Error scanning for devices:', error);
    }
  };

  const handleConnectDevice = async (deviceId: string, callback?: () => void): Promise<void> => {
    try {
      // Ensure deviceId is valid
      const id = typeof deviceId === "string" ? deviceId : deviceId.id;
      await connectDevice(id, { callback });
    } catch (error) {
      console.error('Error connecting device:', error);
    }
  };

  const handleDisconnectDevice = async (deviceId: string, callback?: () => void): Promise<void> => {
    try {
      // Ensure deviceId is valid
      const id = typeof deviceId === "string" ? deviceId : deviceId.id;
      await disconnectDevice(id, { callback });
    } catch (error) {
      console.error('Error disconnecting device:', error);
    }
  };
  
  const handleStopScan = async (deviceType?: string, callback?: () => void): Promise<void> => {
    try {
      if (stopScan) {
        await stopScan(deviceType, callback);
      }
    } catch (error) {
      console.error('Error stopping scan:', error);
    }
  };
  
  return (
    <>
      <Header />
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
      <Footer />
    </>
  );
};

export default BiofeedbackPage;
