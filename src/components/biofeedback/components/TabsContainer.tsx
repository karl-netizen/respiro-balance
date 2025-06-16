
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TabsContainerProps {
  data: any;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({ data }) => {
  // Generate mock historical data for demonstration
  const generateHistoricalData = () => {
    const now = Date.now();
    return Array.from({ length: 20 }, (_, i) => ({
      time: new Date(now - (19 - i) * 60000).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      heartRate: (data?.heartRate || 72) + Math.sin(i * 0.5) * 8 + (Math.random() - 0.5) * 4,
      stress: (data?.stress || 25) + Math.cos(i * 0.3) * 15 + (Math.random() - 0.5) * 8,
      coherence: ((data?.coherence || 0.8) + Math.sin(i * 0.4) * 0.2) * 100
    }));
  };

  const chartData = generateHistoricalData();

  return (
    <Tabs defaultValue="realtime" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="realtime">Real-time</TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
        <TabsTrigger value="insights">Insights</TabsTrigger>
      </TabsList>
      
      <TabsContent value="realtime" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Live Heart Rate Variability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="trends" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Stress & Coherence Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="stress" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    name="Stress Level"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="coherence" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    name="Coherence"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="insights" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Biometric Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800">Optimal Recovery State</h4>
                <p className="text-sm text-green-700">
                  Your current heart rate variability indicates excellent recovery readiness.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800">Stress Management</h4>
                <p className="text-sm text-blue-700">
                  Low stress levels detected. Great time for focused work or meditation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
