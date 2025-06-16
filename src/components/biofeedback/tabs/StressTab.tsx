
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
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

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
  const { deviceType } = useDeviceDetection();
  
  // Mobile-specific chart configuration
  const getChartConfig = () => {
    const isMobile = deviceType === 'mobile';
    return {
      height: isMobile ? 200 : 256,
      margin: isMobile 
        ? { top: 5, right: 5, left: 0, bottom: 0 }
        : { top: 10, right: 10, left: 0, bottom: 0 },
      fontSize: isMobile ? 10 : 12
    };
  };

  const chartConfig = getChartConfig();

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-2 sm:p-3 rounded-md shadow text-xs sm:text-sm">
          <p className="font-medium">{`Time: ${payload[0].payload.time}`}</p>
          <p className="text-purple-500">{`Stress Level: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Mobile-optimized spacing
  const getMobileSpacing = () => {
    switch (deviceType) {
      case 'mobile':
        return 'space-y-4';
      case 'tablet':
        return 'space-y-5';
      default:
        return 'space-y-6';
    }
  };

  return (
    <div className={getMobileSpacing()}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Stress Level Over Time</CardTitle>
          <CardDescription className="text-sm">
            Monitoring stress response patterns throughout your session
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="w-full overflow-x-auto">
            <div className={`h-[${chartConfig.height}px] min-w-[300px] sm:min-w-0`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mockData}
                  margin={chartConfig.margin}
                >
                  <defs>
                    <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(124, 58, 237)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="rgb(124, 58, 237)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    fontSize={chartConfig.fontSize}
                  />
                  <YAxis 
                    fontSize={chartConfig.fontSize}
                    width={deviceType === 'mobile' ? 35 : 40}
                  />
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Stress Insights</CardTitle>
          <CardDescription className="text-sm">
            Analysis of your stress response patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className={getMobileSpacing()}>
            <div>
              <h4 className="font-medium text-sm sm:text-base">Current Stress Level</h4>
              <p className="text-2xl sm:text-3xl font-bold mt-1">{biometricData.current}%</p>
              <p className="text-muted-foreground text-sm">
                {biometricData.current < 30 
                  ? 'Low stress - You are in a relaxed state' 
                  : biometricData.current < 70 
                    ? 'Moderate stress - Within normal range'
                    : 'High stress - Consider a mindfulness exercise'}
              </p>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-sm sm:text-base">Recommendations</h4>
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
