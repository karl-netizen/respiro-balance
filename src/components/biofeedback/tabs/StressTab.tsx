
import React from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BiometricData } from '../sections/BiometricMonitorSection';

interface StressTabProps {
  biometricData: BiometricData;
}

const mockData = [
  { time: '9:00', stress: 15 },
  { time: '10:00', stress: 25 },
  { time: '11:00', stress: 40 },
  { time: '12:00', stress: 30 },
  { time: '13:00', stress: 45 },
  { time: '14:00', stress: 35 },
  { time: '15:00', stress: 20 }
];

export const StressTab: React.FC<StressTabProps> = ({ biometricData }) => {
  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-3 rounded-md shadow">
          <p className="font-medium">{`Time: ${payload[0].payload.time}`}</p>
          <p className="text-purple-500">{`Stress Level: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Stress Level Over Time</CardTitle>
          <CardDescription>
            Monitoring stress response patterns throughout your session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={mockData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(124, 58, 237)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="rgb(124, 58, 237)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip content={renderCustomTooltip} />
                <Area
                  type="monotone"
                  dataKey="stress"
                  stroke="rgb(124, 58, 237)"
                  fillOpacity={1}
                  fill="url(#stressGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Stress Insights</CardTitle>
          <CardDescription>
            Analysis of your stress response patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Current Stress Level</h4>
              <p className="text-3xl font-bold mt-1">{biometricData.current}%</p>
              <p className="text-muted-foreground text-sm">
                {biometricData.current < 30 
                  ? 'Low stress - You are in a relaxed state' 
                  : biometricData.current < 70 
                    ? 'Moderate stress - Within normal range'
                    : 'High stress - Consider a mindfulness exercise'}
              </p>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium">Recommendations</h4>
              <ul className="mt-2 space-y-2 text-sm">
                <li>• Practice deep breathing exercises during elevated stress periods</li>
                <li>• Consider scheduling regular short meditation breaks</li>
                <li>• Stay hydrated to help maintain lower stress levels</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StressTab;
