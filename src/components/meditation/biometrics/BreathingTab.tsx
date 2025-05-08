
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
  // Get the breath rate from any of the possible property names
  const breathRate = biometricData.breath_rate || 
                     biometricData.breathRate || 
                     biometricData.respiratory_rate || 
                     0;
  
  // Calculate the coherence value (or use default if not available)
  const coherence = biometricData.coherence || 0;
  
  // Format the respiratory rate change value if available
  const respiratoryRateChange = change?.respiratory_rate || 
                               change?.breath_rate || 
                               0;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Breath Rate</span>
          <span>{`${breathRate.toFixed(1)} bpm`}</span>
        </div>
        <Progress 
          value={(breathRate / 20) * 100}
          className="h-2"
        />
        {showChange && change && (
          <div className="text-xs text-right mt-1">
            <span className={respiratoryRateChange < 0 ? "text-green-500" : "text-red-500"}>
              {respiratoryRateChange > 0 ? "+" : ""}{respiratoryRateChange}/min
            </span>
          </div>
        )}
      </div>
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Coherence Score</span>
          <span>{`${(coherence * 100).toFixed(0)}%`}</span>
        </div>
        <Progress 
          value={coherence * 100}
          className="h-2"
        />
      </div>
    </div>
  );
};

export default BreathingTab;
