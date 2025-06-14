import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Bluetooth, 
  Wifi, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Info,
  Smartphone,
  Watch,
  Activity,
  Brain,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Stethoscope
} from 'lucide-react';
import { AIInsightsPanel } from '@/components/biofeedback/AIInsightsPanel';
import { PredictiveAnalytics } from '@/components/biofeedback/PredictiveAnalytics';

const BiofeedbackPreferences: React.FC = () => {
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState(true);
  const [predictiveAnalytics, setPredictiveAnalytics] = useState(true);
  const [clinicalMode, setClinicalMode] = useState(false);
  const [dataCollection, setDataCollection] = useState({
    heartRate: true,
    hrv: true,
    stress: false,
    breathingRate: true,
    // Future sensors
    bloodOxygen: false,
    bodyTemperature: false,
    environmentalData: false,
    postureDetection: false
  });

  // Device compatibility matrix with future devices
  const supportedDevices = [
    {
      name: 'Apple Watch',
      icon: Watch,
      compatibility: 'full',
      metrics: ['Heart Rate', 'HRV', 'Breathing Rate'],
      status: 'recommended',
      connection: 'bluetooth',
      available: true
    },
    {
      name: 'Polar H10',
      icon: Heart,
      compatibility: 'full',
      metrics: ['Heart Rate', 'HRV'],
      status: 'excellent',
      connection: 'bluetooth',
      available: true
    },
    {
      name: 'Garmin Devices',
      icon: Watch,
      compatibility: 'partial',
      metrics: ['Heart Rate', 'Stress'],
      status: 'supported',
      connection: 'bluetooth',
      available: true
    },
    {
      name: 'Fitbit',
      icon: Activity,
      compatibility: 'limited',
      metrics: ['Heart Rate'],
      status: 'basic',
      connection: 'wifi',
      available: true
    },
    {
      name: 'Smartphone Camera',
      icon: Smartphone,
      compatibility: 'basic',
      metrics: ['Heart Rate (PPG)'],
      status: 'fallback',
      connection: 'built-in',
      available: true
    },
    // Future devices
    {
      name: 'Continuous Glucose Monitor',
      icon: Droplets,
      compatibility: 'full',
      metrics: ['Blood Glucose', 'Metabolic Health'],
      status: 'coming-soon',
      connection: 'bluetooth',
      available: false
    },
    {
      name: 'Environmental Sensor',
      icon: Wind,
      compatibility: 'full',
      metrics: ['Air Quality', 'Light', 'Sound'],
      status: 'coming-soon',
      connection: 'wifi',
      available: false
    },
    {
      name: 'Posture Monitor',
      icon: Activity,
      compatibility: 'full',
      metrics: ['Spine Alignment', 'Form Analysis'],
      status: 'coming-soon',
      connection: 'bluetooth',
      available: false
    },
    {
      name: 'Smart Pulse Oximeter',
      icon: Stethoscope,
      compatibility: 'full',
      metrics: ['Blood Oxygen', 'Pulse Quality'],
      status: 'coming-soon',
      connection: 'bluetooth',
      available: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'recommended': return 'bg-blue-100 text-blue-800';
      case 'supported': return 'bg-yellow-100 text-yellow-800';
      case 'basic': return 'bg-orange-100 text-orange-800';
      case 'fallback': return 'bg-gray-100 text-gray-800';
      case 'coming-soon': return 'bg-gray-200 text-gray-500';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'recommended':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'supported':
        return <CheckCircle className="h-4 w-4 text-yellow-500" />;
      case 'basic':
      case 'fallback':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'coming-soon':
        return <Info className="h-4 w-4 text-gray-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConnectionIcon = (connection: string) => {
    switch (connection) {
      case 'bluetooth': return <Bluetooth className="h-4 w-4" />;
      case 'wifi': return <Wifi className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Biofeedback Integration Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Biofeedback Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Biofeedback Sync</h3>
              <p className="text-sm text-muted-foreground">
                Connect wearable devices to enhance your meditation and focus sessions with real-time biometric data
              </p>
            </div>
            <Switch
              checked={syncEnabled}
              onCheckedChange={setSyncEnabled}
            />
          </div>

          {syncEnabled && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Biofeedback Enhancement</p>
                  <p className="text-blue-700">
                    Real-time biometric data will provide insights into your stress levels, 
                    heart rate variability, and meditation effectiveness.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Features Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI-Powered Features
            <Badge variant="outline" className="ml-2">New</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">AI Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get intelligent pattern recognition and personalized recommendations
                </p>
              </div>
              <Switch
                checked={aiInsightsEnabled}
                onCheckedChange={setAiInsightsEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Predictive Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Forecast optimal timing and health trends
                </p>
              </div>
              <Switch
                checked={predictiveAnalytics}
                onCheckedChange={setPredictiveAnalytics}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Clinical Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Medical-grade tracking and professional integration
                </p>
              </div>
              <Switch
                checked={clinicalMode}
                onCheckedChange={setClinicalMode}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Data Collection Preferences */}
      {syncEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Data Collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current sensors */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Heart Rate</h4>
                  <p className="text-sm text-muted-foreground">Monitor beats per minute</p>
                </div>
                <Switch
                  checked={dataCollection.heartRate}
                  onCheckedChange={(checked) => 
                    setDataCollection(prev => ({ ...prev, heartRate: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Heart Rate Variability</h4>
                  <p className="text-sm text-muted-foreground">Measure stress and recovery</p>
                </div>
                <Switch
                  checked={dataCollection.hrv}
                  onCheckedChange={(checked) => 
                    setDataCollection(prev => ({ ...prev, hrv: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Stress Level</h4>
                  <p className="text-sm text-muted-foreground">Automated stress detection</p>
                </div>
                <Switch
                  checked={dataCollection.stress}
                  onCheckedChange={(checked) => 
                    setDataCollection(prev => ({ ...prev, stress: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Breathing Rate</h4>
                  <p className="text-sm text-muted-foreground">Respiratory monitoring</p>
                </div>
                <Switch
                  checked={dataCollection.breathingRate}
                  onCheckedChange={(checked) => 
                    setDataCollection(prev => ({ ...prev, breathingRate: checked }))
                  }
                />
              </div>

              {/* Future sensors */}
              <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    Blood Oxygen
                    <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground">SpO2 monitoring</p>
                </div>
                <Switch
                  checked={dataCollection.bloodOxygen}
                  onCheckedChange={(checked) => 
                    setDataCollection(prev => ({ ...prev, bloodOxygen: checked }))
                  }
                  disabled
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <Wind className="h-4 w-4" />
                    Environmental Data
                    <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground">Air quality, light, sound</p>
                </div>
                <Switch
                  checked={dataCollection.environmentalData}
                  onCheckedChange={(checked) => 
                    setDataCollection(prev => ({ ...prev, environmentalData: checked }))
                  }
                  disabled
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Posture Detection
                    <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground">Meditation form analysis</p>
                </div>
                <Switch
                  checked={dataCollection.postureDetection}
                  onCheckedChange={(checked) => 
                    setDataCollection(prev => ({ ...prev, postureDetection: checked }))
                  }
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live AI Features */}
      {aiInsightsEnabled && (
        <>
          <Separator />
          <AIInsightsPanel />
        </>
      )}

      {predictiveAnalytics && (
        <>
          <Separator />
          <PredictiveAnalytics />
        </>
      )}

      {/* Device Compatibility Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Device Compatibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supportedDevices.map((device, index) => {
              const IconComponent = device.icon;
              return (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-8 w-8 text-gray-600" />
                      <div>
                        <h3 className="font-medium">{device.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getConnectionIcon(device.connection)}
                          <span className="text-sm text-muted-foreground capitalize">
                            {device.connection}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(device.status)}
                          <Badge className={getStatusColor(device.status)}>
                            {device.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {device.metrics.join(', ')}
                        </p>
                      </div>
                      {syncEnabled && device.available && (
                        <Button 
                          variant={selectedDevice === device.name ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDevice(device.name)}
                        >
                          {selectedDevice === device.name ? 'Connected' : 'Connect'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data Settings */}
      {syncEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Data Retention Period</h4>
                  <p className="text-sm text-muted-foreground">How long to keep biometric data</p>
                </div>
                <Select defaultValue="90">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Export Data</h4>
                  <p className="text-sm text-muted-foreground">Download your biometric data</p>
                </div>
                <Button variant="outline" size="sm">
                  Export CSV
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Clear All Data</h4>
                  <p className="text-sm text-muted-foreground">Permanently delete biometric data</p>
                </div>
                <Button variant="destructive" size="sm">
                  Clear Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BiofeedbackPreferences;
