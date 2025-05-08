
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { BiometricData } from '../types/BiometricTypes';

interface BrainwavesTabProps {
  biometricData: BiometricData;
}

const BrainwavesTab: React.FC<BrainwavesTabProps> = ({ biometricData }) => {
  // Convert brainwaves to percentage (for demo purposes)
  const brainwaveToPercentage = (value: number, type: string) => {
    // Different types of brainwaves have different typical ranges
    const ranges = {
      alpha: { min: 0, max: 10 },
      beta: { min: 0, max: 20 },
      theta: { min: 0, max: 8 },
      delta: { min: 0, max: 4 },
      gamma: { min: 0, max: 2 }
    };
    
    const { min, max } = ranges[type as keyof typeof ranges] || { min: 0, max: 100 };
    const percentage = ((value - min) / (max - min)) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  // Safely access brainwave values
  const alphaValue = biometricData.brainwaves?.alpha || 0;
  const thetaValue = biometricData.brainwaves?.theta || 0;
  const betaValue = biometricData.brainwaves?.beta || 0;
  const deltaValue = biometricData.brainwaves?.delta || 0;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Alpha Waves (Relaxation)</span>
          <span>{`${alphaValue.toFixed(1)} μV`}</span>
        </div>
        <Progress 
          value={brainwaveToPercentage(alphaValue, 'alpha')}
          className="h-2"
        />
      </div>
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Theta Waves (Meditation)</span>
          <span>{`${thetaValue.toFixed(1)} μV`}</span>
        </div>
        <Progress 
          value={brainwaveToPercentage(thetaValue, 'theta')}
          className="h-2"
        />
      </div>
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Beta Waves (Focus)</span>
          <span>{`${betaValue.toFixed(1)} μV`}</span>
        </div>
        <Progress 
          value={brainwaveToPercentage(betaValue, 'beta')}
          className="h-2"
        />
      </div>
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Delta Waves (Deep Sleep)</span>
          <span>{`${deltaValue.toFixed(1)} μV`}</span>
        </div>
        <Progress 
          value={brainwaveToPercentage(deltaValue, 'delta')}
          className="h-2"
        />
      </div>
    </div>
  );
};

export default BrainwavesTab;
