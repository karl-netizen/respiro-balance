
import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Activity, Brain, Zap } from 'lucide-react';

interface BiometricData {
  heartRate?: number;
  hrv?: number;
  stress?: number;
  focus?: number;
  calm?: number;
  timestamp?: string;
}

interface OptimizedBiofeedbackDisplayProps {
  data: BiometricData;
  isLoading?: boolean;
  showTrends?: boolean;
}

// Memoized metric card to prevent unnecessary re-renders
const MetricCard = memo<{
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  trend?: string;
  color: string;
}>(({ icon, label, value, unit, trend, color }) => (
  <Card className="touch-manipulation">
    <CardContent className="p-3 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`p-1.5 sm:p-2 rounded-lg ${color} flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{label}</p>
          <p className="text-lg sm:text-xl font-bold">
            {value}
            {unit && <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
          </p>
          {trend && (
            <p className="text-xs text-green-600 truncate">{trend}</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
));

MetricCard.displayName = 'MetricCard';

const OptimizedBiofeedbackDisplay: React.FC<OptimizedBiofeedbackDisplayProps> = memo(({
  data,
  isLoading = false,
  showTrends = false
}) => {
  // Memoize the metrics calculation to avoid recalculation on every render
  const metrics = useMemo(() => [
    {
      icon: <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />,
      label: 'Heart Rate',
      value: data.heartRate?.toString() || '--',
      unit: 'BPM',
      trend: showTrends ? '↓ 5 BPM' : undefined,
      color: 'bg-red-500'
    },
    {
      icon: <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />,
      label: 'HRV',
      value: data.hrv?.toString() || '--',
      unit: 'ms',
      trend: showTrends ? '↑ 8ms' : undefined,
      color: 'bg-blue-500'
    },
    {
      icon: <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-white" />,
      label: 'Stress Level',
      value: data.stress?.toString() || '--',
      unit: '/100',
      trend: showTrends ? '↓ 15%' : undefined,
      color: 'bg-orange-500'
    },
    {
      icon: <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />,
      label: 'Focus Score',
      value: data.focus?.toString() || '--',
      unit: '%',
      trend: showTrends ? '↑ 12%' : undefined,
      color: 'bg-green-500'
    }
  ], [data, showTrends]);

  if (isLoading) {
    return (
      <Card className="touch-manipulation">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-sm sm:text-base">Biometric Data</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-16 sm:h-20 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="touch-manipulation">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-sm sm:text-base">Real-time Biometric Data</CardTitle>
        {data.timestamp && (
          <p className="text-xs sm:text-sm text-muted-foreground">
            Last updated: {new Date(data.timestamp).toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedBiofeedbackDisplay.displayName = 'OptimizedBiofeedbackDisplay';

export default OptimizedBiofeedbackDisplay;
