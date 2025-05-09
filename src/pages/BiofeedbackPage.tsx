
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  BiofeedbackDisplay,
  NoDevicesView,
  ConnectedDevicesList,
  DeviceSearching,
  TeamFeatures
} from '@/components/biofeedback';
import { HeartRateTab, StressTab, HeartRateTabProps, StressTabProps } from '@/components/biofeedback/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useBiofeedback } from '@/hooks/biofeedback/useBiofeedback';
import { Heart, Activity, Search, Settings } from 'lucide-react';
import { BluetoothDevice } from '@/types/supabase';

// Define the biometric data interface
interface BiometricData {
  id: string;
  user_id: string;
  current: number;
  resting?: number;
  history: number[];
}

// Modified Component prop types to match the actual implementations
interface NoDevicesViewProps {
  onScan: () => Promise<boolean | void>;
  disabled: boolean;
}

interface ConnectedDevicesListProps {
  devices: BluetoothDevice[];
  onScan: () => Promise<boolean | void>;
  onConnect: (deviceId: string) => Promise<boolean>;
  onDisconnect: (deviceId: string) => Promise<boolean>;
  disabled: boolean;
}

// Updated BiofeedbackDisplayProps to match the actual component
interface BiofeedbackDisplayProps {
  partialData?: Partial<BiometricData>;
  isMonitoring: boolean;
  onStartMonitoring: () => Promise<boolean>;
  onStopMonitoring: () => void;
}

interface BiofeedbackCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const BiofeedbackCard: React.FC<BiofeedbackCardProps> = ({ 
  children, 
  title, 
  description, 
  icon 
}) => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="bg-primary/10 p-2.5 rounded-full text-primary">
          {icon}
        </div>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const BiofeedbackPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('heart-rate');
  const { 
    devices = [],
    isScanning = false,
    isConnecting = false,
    heartRate = 0,
    stress = 0,
    restingHeartRate = 0,
    connectDevice = async () => false,
    disconnectDevice = async () => false,
    scanForDevices = async () => false,
    isSimulating = false
  } = useBiofeedback();

  const [isMonitoring, setIsMonitoring] = useState(false);
  
  // Create mock biometric data for tabs
  const mockHeartRateData: BiometricData = {
    id: 'hr-1',
    user_id: 'user-1',
    current: heartRate,
    resting: restingHeartRate,
    history: [65, 68, 72, 70, 75, 78, 76]
  };
  
  const mockStressData: BiometricData = {
    id: 'stress-1',
    user_id: 'user-1',
    current: stress,
    history: [25, 30, 28, 35, 40, 32, 28]
  };

  // Fix the return type issue by adapting this function to return boolean or void
  const handleScanForDevices = async (): Promise<boolean | void> => {
    try {
      const result = await scanForDevices();
      return result;
    } catch (error) {
      console.error('Error scanning for devices:', error);
      return false;
    }
  };

  const startMonitoring = async (): Promise<boolean> => {
    setIsMonitoring(true);
    return true;
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };
  
  return (
    <>
      <Header />
      <main className="container mx-auto py-8 px-4 space-y-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Biofeedback</h1>
          <p className="text-muted-foreground mb-8">
            Monitor your heart rate and stress levels in real-time
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Device Connection Panel */}
            <div className="lg:col-span-1 space-y-6">
              <BiofeedbackCard
                title="Devices"
                description="Connect your biofeedback devices"
                icon={<Settings className="h-5 w-5" />}
              >
                {isScanning ? (
                  <DeviceSearching />
                ) : devices.length === 0 ? (
                  <NoDevicesView
                    onScan={handleScanForDevices}
                    disabled={isScanning || isConnecting}
                  />
                ) : (
                  <ConnectedDevicesList
                    devices={devices}
                    onScan={handleScanForDevices}
                    onConnect={connectDevice}
                    onDisconnect={disconnectDevice}
                    disabled={isScanning || isConnecting}
                  />
                )}
              </BiofeedbackCard>
              
              <BiofeedbackCard
                title="Team Features"
                description="Share data with your wellness team"
                icon={<Activity className="h-5 w-5" />}
              >
                <TeamFeatures />
              </BiofeedbackCard>
            </div>
            
            {/* Biofeedback Data Display */}
            <div className="lg:col-span-2 space-y-6">
              <BiofeedbackCard
                title="Biofeedback Monitor"
                description={`${isSimulating ? 'Simulation Mode' : devices.length > 0 ? 'Live Data' : 'No Device Connected'}`}
                icon={<Heart className="h-5 w-5" />}
              >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
                    <TabsTrigger value="stress">Stress Level</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="heart-rate" className="space-y-4">
                    <BiofeedbackDisplay
                      partialData={mockHeartRateData}
                      isMonitoring={isMonitoring}
                      onStartMonitoring={startMonitoring}
                      onStopMonitoring={stopMonitoring}
                    />
                    <HeartRateTab biometricData={mockHeartRateData} />
                  </TabsContent>
                  
                  <TabsContent value="stress" className="space-y-4">
                    <BiofeedbackDisplay
                      partialData={mockStressData}
                      isMonitoring={isMonitoring}
                      onStartMonitoring={startMonitoring}
                      onStopMonitoring={stopMonitoring}
                    />
                    <StressTab biometricData={mockStressData} />
                  </TabsContent>
                </Tabs>
              </BiofeedbackCard>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BiofeedbackPage;
