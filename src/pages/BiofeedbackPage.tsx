
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, Brain, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { 
  BiofeedbackCard, 
  BiofeedbackDisplay, 
  DeviceSearching,
  NoDevicesView,
  ConnectedDevicesList
} from '@/components/biofeedback';
import { HeartRateTab, StressTab } from '@/components/biofeedback/tabs';
import { biofeedbackService, BluetoothDeviceInfo } from '@/services/BiofeedbackService';
import { useAuth } from '@/hooks/useAuth';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';
import { toast } from 'sonner';

const BiofeedbackPage = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<BluetoothDeviceInfo[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [biometricData, setBiometricData] = useState<BiometricData | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [bluetoothSupported, setBluetoothSupported] = useState(true);
  
  // Check if Web Bluetooth API is supported
  useEffect(() => {
    setBluetoothSupported(!!navigator.bluetooth);
  }, []);
  
  // Set user ID when authenticated
  useEffect(() => {
    if (user?.id) {
      biofeedbackService.setUserId(user.id);
    }
  }, [user]);
  
  // Set up biometric data listener
  useEffect(() => {
    const handleBiometricUpdate = (data: BiometricData) => {
      setBiometricData(data);
    };
    
    biofeedbackService.addDataUpdateListener(handleBiometricUpdate);
    
    return () => {
      biofeedbackService.removeDataUpdateListener(handleBiometricUpdate);
    };
  }, []);
  
  // Scan for devices
  const handleScanForDevices = async () => {
    setIsScanning(true);
    
    try {
      const foundDevices = await biofeedbackService.scanForDevices();
      setDevices(foundDevices);
      
      if (foundDevices.length === 0) {
        toast.info('No compatible devices found');
      }
    } catch (error: any) {
      console.error('Error scanning for devices:', error);
      if (error.name === 'NotFoundError') {
        toast.error('No devices selected');
      } else {
        toast.error('Error connecting to device', {
          description: error.message
        });
      }
    } finally {
      setIsScanning(false);
    }
  };
  
  // Connect to a device
  const handleConnectDevice = async (deviceId: string) => {
    try {
      const deviceInfo = await biofeedbackService.connectToDevice(deviceId);
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { ...d, connected: deviceInfo.connected } : d
      ));
      
      toast.success('Connected to device');
    } catch (error: any) {
      console.error('Error connecting to device:', error);
      toast.error('Failed to connect', {
        description: error.message
      });
    }
  };
  
  // Disconnect from a device
  const handleDisconnectDevice = async (deviceId: string) => {
    try {
      await biofeedbackService.disconnectFromDevice(deviceId);
      setDevices(prev => prev.map(d => 
        d.id === deviceId ? { ...d, connected: false } : d
      ));
      
      setIsMonitoring(false);
      toast.info('Disconnected from device');
    } catch (error: any) {
      console.error('Error disconnecting from device:', error);
      toast.error('Failed to disconnect', {
        description: error.message
      });
    }
  };
  
  // Start monitoring biometrics
  const handleStartMonitoring = async () => {
    try {
      await biofeedbackService.startMonitoring();
      setIsMonitoring(true);
      toast.success('Monitoring started');
    } catch (error: any) {
      console.error('Error starting monitoring:', error);
      toast.error('Failed to start monitoring', {
        description: error.message
      });
    }
  };
  
  // Stop monitoring biometrics
  const handleStopMonitoring = () => {
    biofeedbackService.stopMonitoring();
    setIsMonitoring(false);
    toast.info('Monitoring stopped');
  };
  
  // Check for connected devices
  const hasConnectedDevices = devices.some(device => device.connected);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Biofeedback</h1>
            <p className="text-muted-foreground">
              Connect to compatible devices to track your physiological responses during meditation.
            </p>
          </div>
          
          {!bluetoothSupported && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Browser not supported</AlertTitle>
              <AlertDescription>
                Your browser doesn't support Web Bluetooth. Please use Chrome, Edge, or another compatible browser.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-6">
              <BiofeedbackCard 
                title="Device Management" 
                description="Connect and manage your biometric devices"
                icon={<Activity className="h-5 w-5" />}
              >
                {isScanning ? (
                  <DeviceSearching />
                ) : !devices.length ? (
                  <NoDevicesView onScanForDevices={handleScanForDevices} disabled={!bluetoothSupported} />
                ) : (
                  <ConnectedDevicesList 
                    devices={devices}
                    onScanForDevices={handleScanForDevices}
                    onConnectDevice={handleConnectDevice}
                    onDisconnectDevice={handleDisconnectDevice}
                    disabled={!bluetoothSupported}
                  />
                )}
              </BiofeedbackCard>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    Biofeedback Training Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="border-l-2 border-primary pl-3 py-1">
                    <p className="text-sm">For accurate readings, stay still and breathe normally during measurements.</p>
                  </div>
                  <div className="border-l-2 border-primary pl-3 py-1">
                    <p className="text-sm">Heart rate variability (HRV) is higher when relaxed, lower when stressed.</p>
                  </div>
                  <div className="border-l-2 border-primary pl-3 py-1">
                    <p className="text-sm">Practice diaphragmatic breathing to improve your HRV scores.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-8">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-red-500" />
                    Biometric Monitoring
                  </CardTitle>
                  <CardDescription>
                    {hasConnectedDevices 
                      ? 'View real-time biometric data from your connected device' 
                      : 'Connect a device to view your biometric data'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {hasConnectedDevices ? (
                    <BiofeedbackDisplay 
                      data={biometricData}
                      isMonitoring={isMonitoring}
                      onStartMonitoring={handleStartMonitoring}
                      onStopMonitoring={handleStopMonitoring}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        No devices connected. Please connect a compatible device to see your biometric data.
                      </p>
                      <Button 
                        onClick={handleScanForDevices} 
                        disabled={!bluetoothSupported || isScanning}
                      >
                        Scan for Devices
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="overview">
                    <Heart className="h-4 w-4 mr-2" />
                    Heart Rate
                  </TabsTrigger>
                  <TabsTrigger value="hrv">
                    <Activity className="h-4 w-4 mr-2" />
                    HRV
                  </TabsTrigger>
                  <TabsTrigger value="stress">
                    <Brain className="h-4 w-4 mr-2" />
                    Stress Levels
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <HeartRateTab data={biometricData} hasConnectedDevices={hasConnectedDevices} />
                </TabsContent>
                
                <TabsContent value="hrv">
                  <Card>
                    <CardHeader>
                      <CardTitle>Heart Rate Variability</CardTitle>
                      <CardDescription>
                        Track the variation in time between each heartbeat
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {biometricData?.hrv ? (
                        <>
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center h-32 w-32 rounded-full bg-blue-100 dark:bg-blue-900/30">
                              <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                {biometricData.hrv}
                              </span>
                            </div>
                            <p className="mt-2 text-muted-foreground">HRV Score (ms)</p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Low</span>
                              <span>Optimal</span>
                              <span>High</span>
                            </div>
                            <Progress value={biometricData.hrv / 1.5} className="h-2" />
                          </div>
                          
                          <div className="bg-muted/20 p-4 rounded-lg">
                            <h3 className="font-medium mb-2">What is HRV?</h3>
                            <p className="text-sm text-muted-foreground">
                              Heart rate variability (HRV) measures the variation in time between heartbeats. Higher HRV generally indicates better cardiovascular fitness, resilience to stress, and overall health.
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">
                            {hasConnectedDevices ? 
                              'Start monitoring to view HRV data' : 
                              'Connect a device to view HRV data'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="stress">
                  <StressTab data={biometricData} hasConnectedDevices={hasConnectedDevices} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BiofeedbackPage;
