
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, Brain, Bluetooth, Wifi, WifiOff } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BiometricData {
  heartRate: number;
  hrv: number;
  stressLevel: number;
  focusLevel: number;
  timestamp: string;
}

export const BiometricIntegration: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentData, setCurrentData] = useState<BiometricData>({
    heartRate: 72,
    hrv: 45,
    stressLevel: 25,
    focusLevel: 78,
    timestamp: new Date().toISOString()
  });

  const [historicalData, setHistoricalData] = useState<BiometricData[]>([
    { heartRate: 75, hrv: 42, stressLevel: 30, focusLevel: 70, timestamp: '10:00' },
    { heartRate: 73, hrv: 44, stressLevel: 28, focusLevel: 72, timestamp: '10:05' },
    { heartRate: 71, hrv: 46, stressLevel: 25, focusLevel: 75, timestamp: '10:10' },
    { heartRate: 70, hrv: 48, stressLevel: 22, focusLevel: 78, timestamp: '10:15' },
    { heartRate: 72, hrv: 45, stressLevel: 25, focusLevel: 78, timestamp: '10:20' }
  ]);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const getStressColor = (level: number) => {
    if (level < 20) return 'text-green-500';
    if (level < 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getFocusColor = (level: number) => {
    if (level > 80) return 'text-green-500';
    if (level > 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bluetooth className="h-5 w-5" />
              Device Connection
            </div>
            <Badge variant={isConnected ? "default" : "outline"}>
              {isConnected ? (
                <><Wifi className="h-3 w-3 mr-1" /> Connected</>
              ) : (
                <><WifiOff className="h-3 w-3 mr-1" /> Disconnected</>
              )}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isConnected ? 'Heart Rate Monitor' : 'No devices connected'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isConnected ? 'Polar H10 - Battery: 85%' : 'Connect a heart rate monitor for biometric feedback'}
              </p>
            </div>
            <Button onClick={handleConnect} variant={isConnected ? "outline" : "default"}>
              {isConnected ? 'Disconnect' : 'Connect Device'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      {isConnected && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Heart Rate</span>
              </div>
              <div className="text-2xl font-bold">{currentData.heartRate}</div>
              <div className="text-xs text-muted-foreground">bpm</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">HRV</span>
              </div>
              <div className="text-2xl font-bold">{currentData.hrv}</div>
              <div className="text-xs text-muted-foreground">ms</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Stress Level</span>
              </div>
              <div className={`text-2xl font-bold ${getStressColor(currentData.stressLevel)}`}>
                {currentData.stressLevel}%
              </div>
              <Progress value={currentData.stressLevel} className="h-1 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Focus Level</span>
              </div>
              <div className={`text-2xl font-bold ${getFocusColor(currentData.focusLevel)}`}>
                {currentData.focusLevel}%
              </div>
              <Progress value={currentData.focusLevel} className="h-1 mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Historical Chart */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Session Biometrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Heart Rate"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="stressLevel" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    name="Stress Level"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="focusLevel" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    name="Focus Level"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Biometric Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Heart className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Excellent Heart Rate Variability</p>
                  <p className="text-sm text-green-700">
                    Your HRV of {currentData.hrv}ms indicates good recovery and readiness for meditation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Optimal Focus State</p>
                  <p className="text-sm text-blue-700">
                    Your current focus level of {currentData.focusLevel}% is ideal for deep meditation practice.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
