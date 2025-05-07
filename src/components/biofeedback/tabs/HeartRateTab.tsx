
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Heart } from 'lucide-react';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

interface HeartRateTabProps {
  biometricData: BiometricData;
}

const HeartRateTab: React.FC<HeartRateTabProps> = ({ biometricData }) => {
  // Heart rate zone calculation
  const getHeartRateZone = (heartRate: number): string => {
    if (heartRate < 60) return "Rest";
    if (heartRate < 80) return "Light";
    if (heartRate < 100) return "Moderate";
    if (heartRate < 120) return "Vigorous";
    return "Intense";
  };
  
  // Heart rate zone style
  const getHeartRateZoneStyle = (heartRate: number): string => {
    if (heartRate < 60) return "text-blue-500";
    if (heartRate < 80) return "text-green-500";
    if (heartRate < 100) return "text-yellow-500";
    if (heartRate < 120) return "text-orange-500";
    return "text-red-500";
  };
  
  // HRV classification
  const getHRVClass = (hrv: number): string => {
    if (hrv < 20) return "Poor";
    if (hrv < 40) return "Below Average";
    if (hrv < 60) return "Average";
    if (hrv < 80) return "Good";
    return "Excellent";
  };

  const heartRate = biometricData.heart_rate || biometricData.heartRate || 70;
  const hrv = biometricData.hrv || 50;

  return (
    <div className="space-y-6">
      {/* Heart Rate Meter */}
      <div className="mb-6 relative">
        <div className="flex justify-center items-center mb-4">
          <div className="bg-card p-4 rounded-full shadow-sm relative">
            <div className="relative w-32 h-32 rounded-full flex items-center justify-center border-8 border-muted">
              <Heart className="h-10 w-10 text-red-500 animate-pulse" />
              <div className="absolute inset-0 rounded-full">
                {/* Animated pulse rings */}
                <div className="animate-ping absolute inset-0 rounded-full bg-red-100 opacity-20"></div>
                <div className="animate-ping absolute inset-0 rounded-full bg-red-200 opacity-10" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
            <div className="absolute top-0 left-0 right-0 flex justify-center -mt-2">
              <span className={`text-xs font-medium px-2 py-1 rounded ${getHeartRateZoneStyle(heartRate)}`}>
                {getHeartRateZone(heartRate)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-4">
          <div className="text-4xl font-bold">{heartRate}</div>
          <div className="text-xs text-muted-foreground">BEATS PER MINUTE</div>
        </div>
        
        {/* Heart rate zones scale */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
          <div className="bg-blue-500 h-full flex-1"></div>
          <div className="bg-green-500 h-full flex-1"></div>
          <div className="bg-yellow-500 h-full flex-1"></div>
          <div className="bg-orange-500 h-full flex-1"></div>
          <div className="bg-red-500 h-full flex-1"></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Rest</span>
          <span>Light</span>
          <span>Moderate</span>
          <span>Vigorous</span>
          <span>Max</span>
        </div>
      </div>
      
      {/* HRV Section */}
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Heart Rate Variability</span>
          <span className="text-sm text-muted-foreground">{hrv} ms</span>
        </div>
        <Progress value={(hrv / 100) * 100} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0 ms</span>
          <span className="text-xs">{getHRVClass(hrv)}</span>
          <span>100 ms</span>
        </div>
      </div>
      
      {/* Explanation */}
      <div className="pt-4 border-t text-sm text-muted-foreground">
        <h4 className="font-medium text-foreground mb-1">What does this mean?</h4>
        <p className="mb-2">
          Heart rate variability (HRV) measures the variation in time between heartbeats. 
          Higher HRV generally indicates better cardiovascular health and resilience to stress.
        </p>
        <p>
          Your current HRV of {hrv} ms is {getHRVClass(hrv).toLowerCase()}, 
          which suggests {
            hrv < 40 ? "you may benefit from stress management practices" : 
            hrv > 60 ? "your body is handling stress effectively" : 
            "your stress response is normal"
          }.
        </p>
      </div>
    </div>
  );
};

export default HeartRateTab;
