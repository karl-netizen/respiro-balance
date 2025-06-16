
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
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

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
          <p className="text-red-500">{`Heart Rate: ${payload[0].value} BPM`}</p>
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
          <CardTitle className="text-base sm:text-lg">Heart Rate Monitoring</CardTitle>
          <CardDescription className="text-sm">
            Track your heart rate fluctuations over time
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="w-full overflow-x-auto">
            <div className={`h-[${chartConfig.height}px] min-w-[300px] sm:min-w-0`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockData}
                  margin={chartConfig.margin}
                >
                  <XAxis 
                    dataKey="time" 
                    fontSize={chartConfig.fontSize}
                  />
                  <YAxis 
                    domain={['dataMin - 10', 'dataMax + 10']} 
                    fontSize={chartConfig.fontSize}
                    width={deviceType === 'mobile' ? 35 : 40}
                  />
                  <Tooltip content={renderCustomTooltip} />
                  <Line
                    type="monotone"
                    dataKey="heartRate"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: deviceType === 'mobile' ? 3 : 4 }}
                    activeDot={{ r: deviceType === 'mobile' ? 5 : 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Heart Rate Analysis</CardTitle>
          <CardDescription className="text-sm">
            Insights into your cardiac activity
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className={getMobileSpacing()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center sm:text-left">
                <h4 className="font-medium text-sm text-muted-foreground">Current</h4>
                <p className="text-2xl sm:text-3xl font-bold mt-1">
                  {biometricData.current} 
                  <span className="text-sm sm:text-lg font-normal ml-1">BPM</span>
                </p>
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-medium text-sm text-muted-foreground">Resting</h4>
                <p className="text-2xl sm:text-3xl font-bold mt-1">
                  {biometricData.resting || '--'} 
                  <span className="text-sm sm:text-lg font-normal ml-1">BPM</span>
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-sm sm:text-base">Heart Rate Zone</h4>
              <p className="mt-1 text-muted-foreground text-sm">
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
