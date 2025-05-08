
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter, 
  CardDescription 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Activity, 
  LineChart, 
  Bluetooth, 
  BluetoothOff,
  BluetoothSearching 
} from "lucide-react";
import { useBiofeedback } from '@/hooks/useBiofeedback'; 
import { BiometricData } from '@/components/meditation/types/BiometricTypes';
import HeartRateTab from './tabs/HeartRateTab';
import BreathingTab from '../meditation/biometrics/BreathingTab';
import StressTab from './tabs/StressTab';
import { ConnectedDevicesList } from './';

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
  const [completeData, setCompleteData] = useState<BiometricData | null>(null);
  
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

  // Convert partial data to complete data with defaults
  useEffect(() => {
    if (biometricData) {
      // Create a complete BiometricData object with default values for required fields
      const complete: BiometricData = {
        id: biometricData.id || `temp-${Date.now()}`,
        user_id: biometricData.user_id || 'unknown',
        timestamp: biometricData.timestamp || new Date().toISOString(),
        heart_rate: biometricData.heart_rate || (biometricData as any).heartRate || 0,
        hrv: biometricData.hrv || 0,
        breath_rate: biometricData.breath_rate || (biometricData as any).breathRate || 0,
        ...biometricData as any // Include any other fields
      };
      
      setCompleteData(complete);
    } else if (currentBiometrics) {
      // If no provided data, use current biometrics from hook
      const complete: BiometricData = {
        id: currentBiometrics.id || `temp-${Date.now()}`,
        user_id: currentBiometrics.user_id || 'unknown',
        timestamp: currentBiometrics.timestamp || new Date().toISOString(),
        heart_rate: currentBiometrics.heart_rate || (currentBiometrics as any).heartRate || 0,
        hrv: currentBiometrics.hrv || 0,
        breath_rate: currentBiometrics.breath_rate || (currentBiometrics as any).breathRate || 0,
        ...currentBiometrics as any
      };
      
      setCompleteData(complete);
    } else {
      setCompleteData(null);
    }
  }, [biometricData, currentBiometrics]);
  
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

  // Helper functions to safely convert partial data to complete data
  const getHeartRateData = (): BiometricData => {
    return completeData as BiometricData;
  };
  
  const getBreathingData = (): BiometricData => {
    return completeData as BiometricData;
  };
  
  const getBrainwaveData = (): BiometricData | null => {
    if (!completeData || !completeData.brainwaves) return null;
    return completeData;
  };

  // If no data and not in session, show connection prompt
  if (!completeData && !isSessionActive && showControls) {
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
          {isConnecting ? (
            <div className="text-center">
              <BluetoothSearching className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Searching for devices</p>
              <p className="text-muted-foreground text-sm">
                Make sure your device is nearby and in pairing mode
              </p>
            </div>
          ) : connectedDevices.length > 0 ? (
            <div className="w-full">
              <div className="mb-6 flex items-center justify-center">
                <Bluetooth className="h-10 w-10 text-green-500 mr-2" />
                <div>
                  <h3 className="text-lg font-medium">Devices Connected</h3>
                  <p className="text-sm text-muted-foreground">{connectedDevices.length} device(s) ready</p>
                </div>
              </div>
              <ConnectedDevicesList 
                devices={connectedDevices}
                isTeamOrEnterprise={false}
                onDisconnect={disconnectDevice}
              />
            </div>
          ) : (
            <div className="text-center">
              <BluetoothOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No Device Connected</p>
              <p className="text-muted-foreground text-sm mb-6">
                Connect a compatible biofeedback device to see your metrics
              </p>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <Button onClick={handleConnectDevice} className="w-full">
                  Connect Device
                </Button>
                <Button 
                  onClick={handleToggleSimulation} 
                  variant="outline"
                  className="w-full"
                >
                  Simulate Data
                </Button>
              </div>
            </div>
          )}
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
        {showTabs && completeData ? (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="heart-rate" className="flex-1">Heart</TabsTrigger>
              <TabsTrigger value="breathing" className="flex-1">Breathing</TabsTrigger>
              <TabsTrigger value="stress" className="flex-1">Stress</TabsTrigger>
            </TabsList>
            
            <TabsContent value="heart-rate" className="pt-4">
              <HeartRateTab biometricData={getHeartRateData()} />
            </TabsContent>
            
            <TabsContent value="breathing" className="pt-4">
              <BreathingTab biometricData={getBreathingData()} />
            </TabsContent>
            
            <TabsContent value="stress" className="pt-4">
              <StressTab biometricData={getHeartRateData()} />
            </TabsContent>
          </Tabs>
        ) : completeData ? (
          <div className="space-y-3">
            {/* Heart Rate */}
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <div className="flex items-center">
                  <Heart className="h-3 w-3 text-red-500 mr-1" />
                  <span>Heart Rate</span>
                </div>
                <span>{completeData.heart_rate} bpm</span>
              </div>
              <Progress value={(completeData.heart_rate || 70) / 2} className="h-2" />
            </div>
            
            {/* HRV */}
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <div className="flex items-center">
                  <Activity className="h-3 w-3 text-blue-500 mr-1" />
                  <span>HRV</span>
                </div>
                <span>{completeData.hrv} ms</span>
              </div>
              <Progress value={(completeData.hrv || 50) / 2} className="h-2" />
            </div>
            
            {/* Stress Level */}
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <div className="flex items-center">
                  <LineChart className="h-3 w-3 text-amber-500 mr-1" />
                  <span>Stress Level</span>
                </div>
                <span>{completeData.stress_level}/100</span>
              </div>
              <Progress value={completeData.stress_level || 50} className="h-2" />
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              {isSessionActive ? "Waiting for biometric data..." : "No biometric data available"}
            </p>
          </div>
        )}
      </CardContent>
      
      {showControls && (
        <CardFooter>
          <div className="w-full flex flex-col gap-2">
            {connectedDevices.length > 0 ? (
              <div className="flex gap-2">
                <Button 
                  onClick={handleDisconnectAll} 
                  variant="outline" 
                  className="flex-1"
                >
                  Disconnect
                </Button>
                <Button 
                  onClick={handleToggleSimulation} 
                  variant={isSimulating ? "destructive" : "secondary"}
                  className="flex-1"
                >
                  {isSimulating ? "Stop Simulation" : "Simulate Data"}
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleConnectDevice} className="flex-1">
                  Connect Device
                </Button>
                <Button 
                  onClick={handleToggleSimulation} 
                  variant="outline"
                  className="flex-1"
                >
                  Simulate Data
                </Button>
              </div>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default BiofeedbackDisplay;
