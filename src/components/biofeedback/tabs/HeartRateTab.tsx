
import React from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BiometricData } from '../sections/BiometricMonitorSection';

interface HeartRateTabProps {
  biometricData: BiometricData;
}

const mockData = [
  { time: '9:00', heartRate: 75 },
  { time: '10:00', heartRate: 72 },
  { time: '11:00', heartRate: 80 },
  { time: '12:00', heartRate: 85 },
  { time: '13:00', heartRate: 78 },
  { time: '14:00', heartRate: 76 },
  { time: '15:00', heartRate: 72 }
];

export const HeartRateTab: React.FC<HeartRateTabProps> = ({ biometricData }) => {
  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-3 rounded-md shadow">
          <p className="font-medium">{`Time: ${payload[0].payload.time}`}</p>
          <p className="text-red-500">{`Heart Rate: ${payload[0].value} BPM`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Heart Rate Monitoring</CardTitle>
          <CardDescription>
            Track your heart rate fluctuations over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="time" />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip content={renderCustomTooltip} />
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Heart Rate Analysis</CardTitle>
          <CardDescription>
            Insights into your cardiac activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Current</h4>
                <p className="text-3xl font-bold mt-1">{biometricData.current} <span className="text-lg font-normal">BPM</span></p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Resting</h4>
                <p className="text-3xl font-bold mt-1">{biometricData.resting || '--'} <span className="text-lg font-normal">BPM</span></p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium">Heart Rate Zone</h4>
              <p className="mt-1 text-muted-foreground">
                {biometricData.current < 60 
                  ? 'Rest zone - Your heart rate indicates you are relaxed or at rest' 
                  : biometricData.current < 100 
                    ? 'Normal zone - Your heart rate is within the typical range'
                    : 'Active zone - Your heart rate is elevated, possibly due to activity or stress'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeartRateTab;
