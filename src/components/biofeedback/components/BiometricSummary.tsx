
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, LineChart } from 'lucide-react';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

interface BiometricSummaryProps {
  data: BiometricData;
}

const BiometricSummary: React.FC<BiometricSummaryProps> = ({ data }) => {
  return (
    <div className="space-y-3">
      {/* Heart Rate */}
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <div className="flex items-center">
            <Heart className="h-3 w-3 text-red-500 mr-1" />
            <span>Heart Rate</span>
          </div>
          <span>{data.heart_rate} bpm</span>
        </div>
        <Progress value={(data.heart_rate || 70) / 2} className="h-2" />
      </div>
      
      {/* HRV */}
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <div className="flex items-center">
            <Activity className="h-3 w-3 text-blue-500 mr-1" />
            <span>HRV</span>
          </div>
          <span>{data.hrv} ms</span>
        </div>
        <Progress value={(data.hrv || 50) / 2} className="h-2" />
      </div>
      
      {/* Stress Level */}
      <div>
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <div className="flex items-center">
            <LineChart className="h-3 w-3 text-amber-500 mr-1" />
            <span>Stress Level</span>
          </div>
          <span>{data.stress_level}/100</span>
        </div>
        <Progress value={data.stress_level || 50} className="h-2" />
      </div>
    </div>
  );
};

export default BiometricSummary;
