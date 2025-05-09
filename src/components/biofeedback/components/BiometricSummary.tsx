
import React from 'react';
import { HeartPulse, Brain, Gauge, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

export interface BiometricSummaryProps {
  data: {
    heartRate?: number;
    hrv?: number;
    stress?: number;
    coherence?: number;
  };
  loading?: boolean;
}

export const BiometricSummary: React.FC<BiometricSummaryProps> = ({ 
  data, 
  loading = false 
}) => {
  const { heartRate, hrv, stress, coherence } = data;

  if (loading) {
    return (
      <div className="mt-4 space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HeartPulse className="h-5 w-5 text-red-500" />
          <span className="text-sm font-medium">Heart Rate</span>
        </div>
        <span className="text-xl font-bold">{heartRate || '--'} <span className="text-sm text-muted-foreground">BPM</span></span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Gauge className="h-5 w-5 text-amber-500" />
          <span className="text-sm font-medium">HRV</span>
        </div>
        <span className="text-xl font-bold">{hrv || '--'} <span className="text-sm text-muted-foreground">ms</span></span>
      </div>

      {stress !== undefined && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Stress Level</span>
            </div>
            <span className="font-medium">{Math.round(stress * 100)}%</span>
          </div>
          <Progress value={stress * 100} className="h-2" />
        </div>
      )}

      {coherence !== undefined && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Coherence</span>
            </div>
            <span className="font-medium">{Math.round(coherence * 100)}%</span>
          </div>
          <Progress value={coherence * 100} className="h-2" />
        </div>
      )}
    </div>
  );
};

export default BiometricSummary;
