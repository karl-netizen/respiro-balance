
import React, { useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter, 
  CardDescription 
} from "@/components/ui/card";
import { Activity, Bluetooth } from "lucide-react";
import { useBiofeedback } from '@/hooks/useBiofeedback';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';
import { 
  ConnectionPrompt, 
  BiofeedbackControls,
  BiometricSummary,
  TabsContainer,
  DataConverter
} from './components';

interface BiofeedbackDisplayProps {
  showControls?: boolean;
  showTabs?: boolean;
  initialTab?: string;
  biometricData?: BiometricData | Partial<BiometricData>;
  isSessionActive?: boolean;
}

const BiofeedbackDisplay: React.FC<BiofeedbackDisplayProps> = ({
  showControls = true,
  showTabs = true,
  initialTab = "heart-rate",
  biometricData,
  isSessionActive = false
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  
  const {
    connectDevice,
    disconnectDevice,
    connectedDevices,
    isConnecting,
    currentBiometrics,
    startSimulation,
    stopSimulation,
    isSimulating
  } = useBiofeedback();

  // Handle connecting a device
  const handleConnectDevice = async () => {
    await connectDevice();
  };

  // Handle disconnecting all devices
  const handleDisconnectAll = async () => {
    for (const device of connectedDevices) {
      await disconnectDevice(device.id);
    }
  };

  // Handle toggling simulation
  const handleToggleSimulation = () => {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };

  // If no data and not in session, show connection prompt
  if (!biometricData && !currentBiometrics && !isSessionActive && showControls) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            Biofeedback Monitor
          </CardTitle>
          <CardDescription>
            Connect a device to see your biometric data
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <ConnectionPrompt 
            isConnecting={isConnecting}
            connectedDevices={connectedDevices}
            onConnectDevice={handleConnectDevice}
            onDisconnectDevice={disconnectDevice}
            onToggleSimulation={handleToggleSimulation}
            isSimulating={isSimulating}
          />
        </CardContent>
      </Card>
    );
  }

  // Render the biometric data display
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            Biofeedback Monitor
          </div>
          {connectedDevices.length > 0 && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
              <Bluetooth className="h-3 w-3 mr-1" />
              Connected
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <DataConverter 
          biometricData={biometricData} 
          currentBiometrics={currentBiometrics}
        >
          {(completeData) => (
            <>
              {showTabs && completeData ? (
                <TabsContainer 
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  biometricData={completeData}
                />
              ) : completeData ? (
                <BiometricSummary data={completeData} />
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">
                    {isSessionActive ? "Waiting for biometric data..." : "No biometric data available"}
                  </p>
                </div>
              )}
            </>
          )}
        </DataConverter>
      </CardContent>
      
      {showControls && (
        <CardFooter>
          <div className="w-full flex flex-col gap-2">
            <BiofeedbackControls 
              connectedDevicesCount={connectedDevices.length}
              onDisconnectAll={handleDisconnectAll}
              onToggleSimulation={handleToggleSimulation}
              isSimulating={isSimulating}
              onConnectDevice={handleConnectDevice}
            />
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default BiofeedbackDisplay;
