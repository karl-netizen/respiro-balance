
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

interface TabsContainerProps {
  data: BiometricData;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({ data }) => {
  // Generate mock historical data for charts
  const historicalData = Array.from({ length: 20 }, (_, i) => ({
    time: `${9 + Math.floor(i / 4)}:${(i % 4) * 15}`.padStart(2, '0'),
    heartRate: (data.heart_rate || 70) + Math.random() * 10 - 5,
    hrv: (data.hrv || 45) + Math.random() * 8 - 4,
    stress: (data.stress || 25) + Math.random() * 15 - 7,
    coherence: (data.coherence || 60) + Math.random() * 20 - 10
  }));

  return (
    <Tabs defaultValue="trends" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="trends">Trends</TabsTrigger>
        <TabsTrigger value="insights">Insights</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="trends" className="space-y-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} name="Heart Rate" />
              <Line type="monotone" dataKey="hrv" stroke="#3b82f6" strokeWidth={2} name="HRV" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="insights" className="space-y-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="stress" stackId="1" stroke="#f97316" fill="#fed7aa" name="Stress" />
              <Area type="monotone" dataKey="coherence" stackId="1" stroke="#10b981" fill="#bbf7d0" name="Coherence" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="history" className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Recent Sessions</div>
          {historicalData.slice(-5).map((session, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium">{session.time}</span>
              <div className="flex gap-4 text-xs">
                <span>HR: {Math.round(session.heartRate)}</span>
                <span>HRV: {Math.round(session.hrv)}</span>
                <span>Stress: {Math.round(session.stress)}%</span>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};
