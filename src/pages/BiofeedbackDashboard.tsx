
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Monitor, Settings, Activity, Heart } from 'lucide-react';
import { useUserPreferences } from '@/context';
import { useBiofeedback } from '@/hooks/biofeedback';

// Tab Components
import DevicesTab from '@/components/biofeedback/tabs/DevicesTab';
import MonitorTab from '@/components/biofeedback/tabs/MonitorTab';
import AnalyticsTab from '@/components/biofeedback/tabs/AnalyticsTab';
import BiofeedbackSettingsTab from '@/components/biofeedback/tabs/BiofeedbackSettingsTab';

const BiofeedbackDashboard: React.FC = () => {
  const { preferences } = useUserPreferences();
  const { devices, isScanning, heartRate, stress, isSimulating } = useBiofeedback();
  
  // Smart default logic based on device status
  const getDefaultTab = () => {
    if (devices.length === 0) return 'devices';
    return 'monitor';
  };
  
  const [activeTab, setActiveTab] = useState(getDefaultTab());
  
  // Connection status logic
  const connectedDevices = devices.filter(device => device.connected);
  const connectionStatus = connectedDevices.length > 0 ? 'connected' : 'disconnected';
  
  const getStatusBadge = () => {
    if (connectionStatus === 'connected') {
      return <Badge className="bg-green-500">{connectedDevices.length} devices connected and ready</Badge>;
    }
    return <Badge variant="outline">Connect your first device to get started</Badge>;
  };
  
  const getStatusAlert = () => {
    if (connectionStatus === 'connected') {
      return (
        <Alert className="border-green-200 bg-green-50">
          <Heart className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Devices connected successfully. Live biometric monitoring is active.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (isScanning) {
      return (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Activity className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Scanning for devices... Make sure your device is in pairing mode.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <Alert className="border-blue-200 bg-blue-50">
        <Monitor className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          No devices connected. Go to the Devices tab to connect your first biofeedback device.
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <>
      <Header />
      <main className="container mx-auto py-8 px-4 space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Biofeedback Integration</h1>
              <p className="text-muted-foreground">
                Enhance your wellness practice with real-time physiological data from compatible devices
              </p>
            </div>
            {getStatusBadge()}
          </div>
          
          {/* System Status Alert */}
          {getStatusAlert()}
          
          {/* Live Biometrics - Only show when connected */}
          {connectionStatus === 'connected' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Heart Rate</span>
                  </div>
                  <div className="text-2xl font-bold">{heartRate || '--'} BPM</div>
                  {isSimulating && (
                    <div className="text-xs text-muted-foreground">Simulation Mode</div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Stress Level</span>
                  </div>
                  <div className="text-2xl font-bold">{stress || '--'}%</div>
                  <div className="text-xs text-muted-foreground">
                    {stress < 30 ? 'Low' : stress < 60 ? 'Moderate' : 'High'}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Device Status</span>
                  </div>
                  <div className="text-sm font-bold text-green-600">Connected</div>
                  <div className="text-xs text-muted-foreground">Battery: 85%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Data Quality</span>
                  </div>
                  <div className="text-sm font-bold text-green-600">Excellent</div>
                  <div className="text-xs text-muted-foreground">98% accuracy</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Four-Tab Navigation System */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Devices
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Monitor
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="mt-6">
            <DevicesTab />
          </TabsContent>

          <TabsContent value="monitor" className="mt-6">
            <MonitorTab />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsTab />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <BiofeedbackSettingsTab />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  );
};

export default BiofeedbackDashboard;
