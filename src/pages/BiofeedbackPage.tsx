import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Activity, 
  BarChart,
  Download,
  HeartPulse,
  Bluetooth
} from "lucide-react";
import { useBiofeedback } from '@/hooks/useBiofeedback';
import BiofeedbackDisplay from '@/components/biofeedback/BiofeedbackDisplay';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BiofeedbackPage = () => {
  const [activeTab, setActiveTab] = useState("monitor");
  const [biometricHistory, setBiometricHistory] = useState<Array<any>>([]);
  
  const {
    currentBiometrics,
    isSimulating,
    startSimulation,
    connectedDevices
  } = useBiofeedback();

  // Auto-start simulation if no devices connected (for demo purposes)
  useEffect(() => {
    if (!isSimulating && connectedDevices.length === 0) {
      // Wait a bit before starting simulation
      const timer = setTimeout(() => {
        startSimulation();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isSimulating, connectedDevices.length, startSimulation]);

  // Add current biometrics to history for charting
  useEffect(() => {
    if (currentBiometrics) {
      setBiometricHistory(prev => {
        // Keep last 30 data points
        const newHistory = [...prev, { 
          time: new Date().toLocaleTimeString(),
          ...currentBiometrics
        }];
        
        if (newHistory.length > 30) {
          return newHistory.slice(-30);
        }
        return newHistory;
      });
    }
  }, [currentBiometrics]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Biofeedback Center</h1>
          <p className="text-muted-foreground max-w-3xl">
            Monitor your physiological metrics in real-time. Connect a compatible device or use 
            simulation mode to see how your body responds during meditation and breathing exercises.
          </p>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
              <TabsTrigger value="monitor" className="flex items-center justify-center">
                <Heart className="mr-2 h-4 w-4" />
                Live Monitor
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center justify-center">
                <BarChart className="mr-2 h-4 w-4" />
                Insights
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Live Monitor Tab */}
          <TabsContent value="monitor">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <BiofeedbackDisplay showTabs={true} />
              </div>
              
              <div className="md:col-span-2">
                <div className="grid gap-6">
                  {/* Real-time Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <HeartPulse className="mr-2 h-5 w-5 text-rose-500" />
                        Real-time Monitoring
                      </CardTitle>
                      <CardDescription>
                        Live data from your connected devices
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      {biometricHistory.length > 1 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={biometricHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="time" 
                              tick={{ fontSize: 12 }}
                              interval="preserveStartEnd"
                              minTickGap={30}
                            />
                            <YAxis />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="heart_rate" 
                              stroke="#ef4444" 
                              name="Heart Rate" 
                              dot={false} 
                              strokeWidth={2}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="hrv" 
                              stroke="#3b82f6" 
                              name="HRV" 
                              dot={false}
                              strokeWidth={2} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="stress_score" 
                              stroke="#f97316" 
                              name="Stress" 
                              dot={false}
                              strokeWidth={2} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">
                            Waiting for biometric data...
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Device Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bluetooth className="mr-2 h-5 w-5 text-blue-500" />
                        Connected Devices
                      </CardTitle>
                      <CardDescription>
                        Information about your biofeedback devices
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {connectedDevices.length > 0 ? (
                        <div className="space-y-4">
                          {connectedDevices.map(device => (
                            <div key={device.id} className="border rounded-md p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium">{device.name}</div>
                                <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                  Connected
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {device.type === 'heart_rate' ? (
                                  'Heart rate monitor with HRV tracking'
                                ) : (
                                  'Biofeedback device'
                                )}
                              </div>
                              {device.id === 'simulated-device' && (
                                <div className="text-xs mt-2 text-amber-600 bg-amber-50 p-1 rounded">
                                  Simulation Mode Active
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">
                            No devices connected
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Insights Tab */}
          <TabsContent value="insights">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Stats Overview</CardTitle>
                    <CardDescription>
                      Your biometric trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Heart Rate Average */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Avg Heart Rate</span>
                          <span className="text-sm">
                            {biometricHistory.length > 0
                              ? Math.round(
                                  biometricHistory.reduce(
                                    (acc, data) => acc + (data.heart_rate || 0), 
                                    0
                                  ) / biometricHistory.length
                                )
                              : '--'
                            } bpm
                          </span>
                        </div>
                        <Progress 
                          value={
                            biometricHistory.length > 0
                              ? Math.round(
                                  biometricHistory.reduce(
                                    (acc, data) => acc + (data.heart_rate || 0), 
                                    0
                                  ) / biometricHistory.length / 2
                                )
                              : 0
                          } 
                          className="h-2"
                        />
                      </div>
                      
                      {/* HRV Average */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Avg HRV</span>
                          <span className="text-sm">
                            {biometricHistory.length > 0
                              ? Math.round(
                                  biometricHistory.reduce(
                                    (acc, data) => acc + (data.hrv || 0), 
                                    0
                                  ) / biometricHistory.length
                                )
                              : '--'
                            } ms
                          </span>
                        </div>
                        <Progress 
                          value={
                            biometricHistory.length > 0
                              ? Math.round(
                                  biometricHistory.reduce(
                                    (acc, data) => acc + (data.hrv || 0), 
                                    0
                                  ) / biometricHistory.length
                                )
                              : 0
                          } 
                          className="h-2"
                        />
                      </div>
                      
                      {/* Stress Score Average */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Avg Stress Score</span>
                          <span className="text-sm">
                            {biometricHistory.length > 0
                              ? Math.round(
                                  biometricHistory.reduce(
                                    (acc, data) => acc + (data.stress_score || 0), 
                                    0
                                  ) / biometricHistory.length
                                )
                              : '--'
                            }/100
                          </span>
                        </div>
                        <Progress 
                          value={
                            biometricHistory.length > 0
                              ? Math.round(
                                  biometricHistory.reduce(
                                    (acc, data) => acc + (data.stress_score || 0), 
                                    0
                                  ) / biometricHistory.length
                                )
                              : 0
                          } 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-primary" />
                      Biometric Analysis
                    </CardTitle>
                    <CardDescription>
                      Overview of your physiological patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {biometricHistory.length > 1 ? (
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={biometricHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="time" 
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Line 
                              yAxisId="left"
                              type="monotone" 
                              dataKey="heart_rate" 
                              stroke="#ef4444" 
                              name="Heart Rate" 
                              strokeWidth={2}
                            />
                            <Line 
                              yAxisId="left"
                              type="monotone" 
                              dataKey="hrv" 
                              stroke="#3b82f6" 
                              name="HRV" 
                              strokeWidth={2} 
                            />
                            <Line 
                              yAxisId="right"
                              type="monotone" 
                              dataKey="stress_score" 
                              stroke="#f97316" 
                              name="Stress" 
                              strokeWidth={2} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[400px]">
                        <div className="text-center">
                          <p className="text-muted-foreground">
                            Not enough data to display insights.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Connect a device and collect more biometric data.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      disabled={biometricHistory.length < 2}
                      className="flex items-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default BiofeedbackPage;
