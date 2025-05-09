
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useBiofeedback } from '@/hooks/biofeedback';
import BiofeedbackLayout from '@/components/biofeedback/layout/BiofeedbackLayout';
import { Activity } from 'lucide-react';

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
    isSimulating = false
  } = useBiofeedback();

  const handleScanForDevices = async (): Promise<void> => {
    try {
      await scanForDevices();
    } catch (error) {
      console.error('Error scanning for devices:', error);
    }
  };

  const handleConnectDevice = async (deviceId: string): Promise<void> => {
    try {
      await connectDevice(deviceId);
    } catch (error) {
      console.error('Error connecting device:', error);
    }
  };

  const handleDisconnectDevice = async (deviceId: string): Promise<void> => {
    try {
      await disconnectDevice(deviceId);
    } catch (error) {
      console.error('Error disconnecting device:', error);
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
        />
      </main>
      <Footer />
    </>
  );
};

export default BiofeedbackPage;
