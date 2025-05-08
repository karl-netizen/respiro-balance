
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { BiometricData, BiometricChangeData } from '../types/BiometricTypes';

interface HeartRateVariabilityTabProps {
  biometricData: BiometricData;
  showChange?: boolean;
  change?: BiometricChangeData;
}

const HeartRateVariabilityTab: React.FC<HeartRateVariabilityTabProps> = ({ 
  biometricData, 
  showChange = false, 
  change 
}) => {
  // Convert HRV to a percentage scale for visualization (50-150 ms → 0-100%)
  const hrvToPercentage = (hrv: number) => {
    const min = 50;
    const max = 150;
    const percentage = ((hrv - min) / (max - min)) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Heart Rate Variability</span>
          <span>{`${biometricData.hrv || 0} ms`}</span>
        </div>
        <Progress 
          value={hrvToPercentage(biometricData.hrv || 0)}
          className="h-2"
        />
        {showChange && change && (
          <div className="text-xs text-right mt-1">
            <span className={change.hrv && change.hrv > 0 ? "text-green-500" : "text-red-500"}>
              {change.hrv && change.hrv > 0 ? "+" : ""}{change.hrv}ms
            </span>
          </div>
        )}
      </div>
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Heart Rate</span>
          <span>{`${biometricData.heart_rate || biometricData.heartRate || 0} bpm`}</span>
        </div>
        <Progress 
          value={((biometricData.heart_rate || biometricData.heartRate || 0) - 50) / 100 * 100}
          className="h-2"
        />
        {showChange && change && (
          <div className="text-xs text-right mt-1">
            <span className={change.heart_rate && change.heart_rate < 0 ? "text-green-500" : "text-red-500"}>
              {change.heart_rate && change.heart_rate > 0 ? "+" : ""}{change.heart_rate}bpm
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeartRateVariabilityTab;
