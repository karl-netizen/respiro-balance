
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Heart, ZapOff, LineChart, TrendingUp, TrendingDown } from 'lucide-react';
import { BiometricData } from '@/types/supabase';

interface BiometricDisplayProps {
  biometricData: BiometricData | null;
  sessionId: string;
  isInitial?: boolean;
  showChange?: boolean;
  change?: {
    heart_rate?: number;
    hrv?: number;
    stress_score?: number;
  };
}

const BiometricDisplay: React.FC<BiometricDisplayProps> = ({ 
  biometricData, 
  isInitial = false, 
  showChange = false,
  change = {}
}) => {
  if (!biometricData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ZapOff className="mr-2 h-4 w-4" />
            No Biometric Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No biometric data is available for this meditation session.
            Connect a wearable device in settings to track your heart rate and other metrics.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Helper function to render change indicator if needed
  const renderChangeIndicator = (value: number | undefined) => {
    if (!showChange || value === undefined) return null;
    
    return value > 0 ? (
      <span className="text-green-500 flex items-center text-xs ml-1">
        <TrendingUp className="h-3 w-3 mr-1" />
        +{value}
      </span>
    ) : (
      <span className="text-blue-500 flex items-center text-xs ml-1">
        <TrendingDown className="h-3 w-3 mr-1" />
        {value}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Heart className="mr-2 h-4 w-4 text-red-500" />
            Heart Rate {isInitial ? "(Initial)" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="text-3xl font-bold flex items-center">
              {biometricData.heart_rate || "N/A"}
              <span className="text-sm ml-1 text-muted-foreground">bpm</span>
              {renderChangeIndicator(change.heart_rate)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Activity className="mr-2 h-4 w-4 text-primary" />
            HRV {isInitial ? "(Initial)" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="text-3xl font-bold flex items-center">
              {biometricData.hrv || "N/A"}
              <span className="text-sm ml-1 text-muted-foreground">ms</span>
              {renderChangeIndicator(change.hrv)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <LineChart className="mr-2 h-4 w-4 text-amber-500" />
            Stress Level {isInitial ? "(Initial)" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="text-3xl font-bold flex items-center">
              {biometricData.stress_score || "N/A"}
              <span className="text-sm ml-1 text-muted-foreground">/100</span>
              {renderChangeIndicator(change.stress_score)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiometricDisplay;
