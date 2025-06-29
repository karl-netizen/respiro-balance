
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, Brain, Thermometer, Droplets, Search, Wifi } from 'lucide-react';
import { useAdvancedBiofeedback } from '@/hooks/biofeedback/useAdvancedBiofeedback';

export const AdvancedBiofeedbackDashboard: React.FC = () => {
  const {
    devices,
    liveData,
    insights,
    isScanning,
    isConnected,
    scanForDevices,
    connectDevice,
    disconnectDevice
  } = useAdvancedBiofeedback();

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'apple_watch': return '⌚';
      case 'fitbit': return '🏃';
      case 'garmin': return '🏔️';
      default: return '📱';
    }
  };

  const getInsightColor = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      case 'optimal': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Advanced Biofeedback</h2>
        <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          Premium Pro
        </Badge>
      </div>

      {/* Device Connection Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Device Connection
          </CardTitle>
          <CardDescription>
            Connect your wearable device for real-time biometric monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected && (
            <div className="flex gap-2">
              <Button 
                onClick={scanForDevices} 
                disabled={isScanning}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                {isScanning ? 'Scanning...' : 'Scan for Devices'}
              </Button>
            </div>
          )}

          {devices.length > 0 && (
            <div className="grid gap-3">
              {devices.map(device => (
                <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getDeviceIcon(device.type)}</span>
                    <div>
                      <div className="font-medium">{device.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Battery: {device.batteryLevel}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {device.connected ? (
                      <>
                        <Badge variant="default" className="bg-green-500">Connected</Badge>
                        <Button size="sm" variant="outline" onClick={disconnectDevice}>
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => connectDevice(device.id)}>
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Data Display */}
      {isConnected && liveData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Heart Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(liveData.heartRate)} BPM</div>
              <Progress value={(liveData.heartRate / 120) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                HRV
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(liveData.hrv)} ms</div>
              <Progress value={(liveData.hrv / 70) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" />
                Stress Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(liveData.stressLevel)}%</div>
              <Progress value={liveData.stressLevel} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Droplets className="h-4 w-4 text-cyan-500" />
                Breathing Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(liveData.breathingRate)} /min</div>
              <Progress value={(liveData.breathingRate / 20) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                Skin Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{liveData.skinTemperature?.toFixed(1)}°C</div>
              <Progress value={((liveData.skinTemperature || 36) / 38) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                SpO2
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{liveData.oxygenSaturation?.toFixed(1)}%</div>
              <Progress value={liveData.oxygenSaturation} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>AI Insights & Recommendations</CardTitle>
            <CardDescription>
              Smart analysis of your biometric data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={getInsightColor(insight.level)}>
                    {insight.type.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(insight.confidence * 100)}% confidence
                  </span>
                </div>
                <h4 className="font-medium">{insight.message}</h4>
                <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
