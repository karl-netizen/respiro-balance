
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
import { HeartRateTab, StressTab } from '@/components/biofeedback/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useBiofeedback } from '@/hooks/biofeedback';
import { Heart, Activity, Search, Settings } from 'lucide-react';

// Define the prop types for the components that were causing errors
interface NoDevicesViewProps {
  onScanForDevices: () => Promise<boolean | void>;
  disabled: boolean;
}

interface ConnectedDevicesListProps {
  devices: any[];
  onScanForDevices: () => Promise<boolean | void>;
  onConnectDevice: (deviceId: string) => Promise<void>;
  onDisconnectDevice: (deviceId: string) => Promise<void>;
  disabled: boolean;
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
    devices,
    isScanning,
    isConnecting,
    heartRate,
    stress,
    restingHeartRate,
    connectDevice, 
    disconnectDevice,
    scanForDevices,
    isSimulating
  } = useBiofeedback();

  // Fix the return type issue by adapting this function to return boolean or void
  const handleScanForDevices = async (): Promise<boolean | void> => {
    try {
      await scanForDevices();
      return true; // Return true on success
    } catch (error) {
      console.error('Error scanning for devices:', error);
      return false; // Return false on error
    }
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
                    onScanForDevices={handleScanForDevices}
                    disabled={isScanning || isConnecting}
                  />
                ) : (
                  <ConnectedDevicesList
                    devices={devices}
                    onScanForDevices={handleScanForDevices}
                    onConnectDevice={connectDevice}
                    onDisconnectDevice={disconnectDevice}
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
                      value={heartRate}
                      label="BPM"
                      restingValue={restingHeartRate}
                      type="heart-rate"
                    />
                    <HeartRateTab />
                  </TabsContent>
                  
                  <TabsContent value="stress" className="space-y-4">
                    <BiofeedbackDisplay
                      value={stress}
                      label="Level"
                      type="stress"
                    />
                    <StressTab />
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
