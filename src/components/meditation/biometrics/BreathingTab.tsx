
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { BiometricData, BiometricChangeData } from '../types/BiometricTypes';

interface BreathingTabProps {
  biometricData: BiometricData;
  showChange?: boolean;
  change?: BiometricChangeData;
}

const BreathingTab: React.FC<BreathingTabProps> = ({ 
  biometricData, 
  showChange = false, 
  change 
}) => {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Breath Rate</span>
          <span>{`${(biometricData.breathRate || biometricData.respiratory_rate || 0).toFixed(1)} bpm`}</span>
        </div>
        <Progress 
          value={((biometricData.breathRate || biometricData.respiratory_rate || 0) / 20) * 100}
          className="h-2"
        />
        {showChange && change && (
          <div className="text-xs text-right mt-1">
            <span className={change.respiratory_rate && change.respiratory_rate < 0 ? "text-green-500" : "text-red-500"}>
              {change.respiratory_rate && change.respiratory_rate > 0 ? "+" : ""}{change.respiratory_rate}/min
            </span>
          </div>
        )}
      </div>
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Coherence Score</span>
          <span>{`${((biometricData.coherence || 0) * 100).toFixed(0)}%`}</span>
        </div>
        <Progress 
          value={(biometricData.coherence || 0) * 100}
          className="h-2"
        />
      </div>
    </div>
  );
};

export default BreathingTab;
