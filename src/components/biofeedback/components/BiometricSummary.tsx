
import React from 'react';
import { Heart, Activity, Brain, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BiometricSummaryProps {
  data: {
    heartRate?: number;
    hrv?: number;
    stress?: number;
    coherence?: number;
  };
  loading?: boolean;
}

export const BiometricSummary: React.FC<BiometricSummaryProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-16 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: data.heartRate || 0,
      unit: 'BPM',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: Activity,
      label: 'HRV',
      value: data.hrv || 0,
      unit: 'ms',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Brain,
      label: 'Stress Level',
      value: data.stress || 0,
      unit: '%',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Zap,
      label: 'Coherence',
      value: data.coherence || 0,
      unit: '%',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div key={metric.label} className={`p-4 rounded-lg ${metric.bgColor}`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`h-4 w-4 ${metric.color}`} />
              <span className="text-sm font-medium text-gray-700">{metric.label}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.value}
              <span className="text-sm font-normal text-gray-500 ml-1">{metric.unit}</span>
            </div>
            {metric.label === 'Stress Level' && (
              <Progress value={metric.value} className="h-2" />
            )}
            {metric.label === 'Coherence' && (
              <Progress value={metric.value} className="h-2" />
            )}
          </div>
        );
      })}
    </div>
  );
};
