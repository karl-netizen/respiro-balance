
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChartContainer,
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from "recharts";
import { Activity } from "lucide-react";

interface BiometricData {
  date: string;
  heartRate: number;
  hrv: number;
  stress: number;
  meditation?: boolean;
}

interface RealtimeDataTabProps {
  biometricTrends: BiometricData[];
}

const RealtimeDataTab: React.FC<RealtimeDataTabProps> = ({ biometricTrends }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  // Fixed calculation functions
  const calculateAvgHeartRate = () => {
    return Math.round(
      biometricTrends.reduce((acc, data) => acc + data.heartRate, 0) / biometricTrends.length
    );
  };

  const calculateAvgHRV = () => {
    return Math.round(
      biometricTrends.reduce((acc, data) => acc + data.hrv, 0) / biometricTrends.length
    );
  };

  const calculateAvgStress = () => {
    return Math.round(
      biometricTrends.reduce((acc, data) => acc + data.stress, 0) / biometricTrends.length
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Biometric Trends
            </CardTitle>
            <CardDescription>
              Track your biometrics against meditation practice
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={timeRange === 'week' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('week')}
            >
              Week
            </Button>
            <Button 
              variant={timeRange === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('month')}
            >
              Month
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer 
            className="w-full h-full" 
            config={{
              heartRate: { 
                label: "Heart Rate",
                theme: { light: "#ef4444", dark: "#f87171" } 
              },
              hrv: { 
                label: "HRV", 
                theme: { light: "#3b82f6", dark: "#60a5fa" } 
              },
              stress: { 
                label: "Stress", 
                theme: { light: "#f97316", dark: "#fb923c" } 
              }
            }}
          >
            <ResponsiveContainer>
              <AreaChart
                data={biometricTrends}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-heartRate)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-heartRate)" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorHrv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-hrv)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-hrv)" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-stress)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-stress)" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend content={<ChartLegendContent />} />
                <Area type="monotone" dataKey="heartRate" stroke="var(--color-heartRate)" fillOpacity={1} fill="url(#colorHeartRate)" />
                <Area type="monotone" dataKey="hrv" stroke="var(--color-hrv)" fillOpacity={1} fill="url(#colorHrv)" />
                <Area type="monotone" dataKey="stress" stroke="var(--color-stress)" fillOpacity={1} fill="url(#colorStress)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-6 border-t pt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Avg. Heart Rate</p>
            <p className="text-2xl font-bold">
              {calculateAvgHeartRate()}
              <span className="text-sm font-normal ml-1">bpm</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Avg. HRV</p>
            <p className="text-2xl font-bold">
              {calculateAvgHRV()}
              <span className="text-sm font-normal ml-1">ms</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Avg. Stress</p>
            <p className="text-2xl font-bold">
              {calculateAvgStress()}
              <span className="text-sm font-normal ml-1">/100</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeDataTab;
