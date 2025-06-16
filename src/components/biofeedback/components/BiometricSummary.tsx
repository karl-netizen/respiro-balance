
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Activity, Zap } from 'lucide-react';

interface BiometricSummaryProps {
  data?: {
    heartRate?: number;
    hrv?: number;
    stress?: number;
    coherence?: number;
    focusScore?: number;
    calmScore?: number;
  };
  loading?: boolean;
}

export const BiometricSummary: React.FC<BiometricSummaryProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const metrics = [
    {
      label: 'Heart Rate',
      value: data.heartRate || 0,
      unit: 'bpm',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      label: 'HRV',
      value: data.hrv || 0,
      unit: 'ms',
      icon: Activity,
      color: 'text-blue-500'
    },
    {
      label: 'Stress',
      value: data.stress || 0,
      unit: '%',
      icon: Brain,
      color: 'text-orange-500',
      showProgress: true
    },
    {
      label: 'Coherence',
      value: data.coherence ? Math.round(data.coherence * 100) : 0,
      unit: '%',
      icon: Zap,
      color: 'text-green-500',
      showProgress: true
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${metric.color}`} />
                <span className="text-sm font-medium">{metric.label}</span>
              </div>
              <div className="text-2xl font-bold">
                {metric.value}{metric.unit}
              </div>
              {metric.showProgress && (
                <Progress value={metric.value} className="h-2 mt-2" />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
