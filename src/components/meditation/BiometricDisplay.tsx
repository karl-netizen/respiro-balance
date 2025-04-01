
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Heart, Activity, Wind, Brain } from 'lucide-react';
import { useUserPreferences } from '@/context';
import { Progress } from '@/components/ui/progress';

interface BiometricDisplayProps {
  biometricData?: {
    heart_rate?: number;
    hrv?: number;
    respiratory_rate?: number;
    stress_score?: number;
  };
  isInitial?: boolean;
  showChange?: boolean;
  change?: {
    heart_rate: number;
    hrv: number;
    respiratory_rate: number;
    stress_score: number;
  };
}

const BiometricDisplay: React.FC<BiometricDisplayProps> = ({ 
  biometricData,
  isInitial = false,
  showChange = false,
  change
}) => {
  const { preferences } = useUserPreferences();
  const hasWearable = preferences.hasWearableDevice && Array.isArray(preferences.connectedDevices) && preferences.connectedDevices.length > 0;

  if (!hasWearable && !biometricData) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          {isInitial ? 'Initial Biometrics' : 'Current Biometrics'}
        </CardTitle>
        <CardDescription>
          {hasWearable 
            ? 'Live data from your connected devices' 
            : 'Estimated values based on typical meditation patterns'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <BiometricItem 
            icon={<Heart className="h-4 w-4 text-rose-500" />}
            label="Heart Rate"
            value={biometricData?.heart_rate || 75}
            unit="bpm"
            change={showChange ? change?.heart_rate : undefined}
          />
          
          <BiometricItem 
            icon={<Activity className="h-4 w-4 text-blue-500" />}
            label="HRV"
            value={biometricData?.hrv || 55}
            unit="ms"
            change={showChange ? change?.hrv : undefined}
            inverted={true}
          />
          
          <BiometricItem 
            icon={<Wind className="h-4 w-4 text-emerald-500" />}
            label="Breathing"
            value={biometricData?.respiratory_rate || 16}
            unit="bpm"
            change={showChange ? change?.respiratory_rate : undefined}
          />
          
          <BiometricItem 
            icon={<Brain className="h-4 w-4 text-amber-500" />}
            label="Stress"
            value={biometricData?.stress_score || 65}
            unit="/100"
            change={showChange ? change?.stress_score : undefined}
            inverted={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};

interface BiometricItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  change?: number;
  inverted?: boolean;
}

const BiometricItem: React.FC<BiometricItemProps> = ({ 
  icon, 
  label, 
  value, 
  unit,
  change,
  inverted = false
}) => {
  // For inverted metrics (where a decrease is positive), we flip the sign for display
  const displayChange = inverted && change ? -change : change;
  const isPositiveChange = displayChange && displayChange > 0;
  const isNegativeChange = displayChange && displayChange < 0;
  
  // Determine progress color based on value and whether metric is inverted
  const getProgressColor = () => {
    if (inverted) {
      return value < 50 ? "bg-emerald-500" : value > 75 ? "bg-rose-500" : "bg-amber-500";
    } else {
      return value > 75 ? "bg-emerald-500" : value < 50 ? "bg-rose-500" : "bg-amber-500";
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon}
          <span className="text-sm ml-2">{label}</span>
        </div>
        <div className="text-xl font-medium">
          {value}<span className="text-xs font-normal">{unit}</span>
        </div>
      </div>
      
      {change !== undefined && (
        <>
          <Progress 
            value={value} 
            className={`h-1.5 ${getProgressColor()}`}
          />
          <div className="text-xs text-right">
            {change === 0 ? (
              <span className="text-muted-foreground">No change</span>
            ) : (
              <span 
                className={
                  isPositiveChange 
                    ? "text-emerald-500"
                    : isNegativeChange 
                      ? "text-rose-500" 
                      : "text-muted-foreground"
                }
              >
                {displayChange > 0 ? "+" : ""}{displayChange}% 
                {inverted 
                  ? (isPositiveChange ? " improved" : isNegativeChange ? " increased" : "")
                  : (isPositiveChange ? " increased" : isNegativeChange ? " decreased" : "")
                }
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BiometricDisplay;
