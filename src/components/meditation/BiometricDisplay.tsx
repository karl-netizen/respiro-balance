
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Heart, ZapOff, LineChart } from 'lucide-react';
import { BiometricData } from '@/types/supabase';

interface BiometricDisplayProps {
  biometricData: BiometricData | null;
  sessionId: string;
}

const BiometricDisplay: React.FC<BiometricDisplayProps> = ({ biometricData, sessionId }) => {
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Heart className="mr-2 h-4 w-4 text-red-500" />
            Heart Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="text-3xl font-bold">
              {biometricData.heart_rate || "N/A"}
              <span className="text-sm ml-1 text-muted-foreground">bpm</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Activity className="mr-2 h-4 w-4 text-primary" />
            HRV (Heart Rate Variability)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="text-3xl font-bold">
              {biometricData.hrv || "N/A"}
              <span className="text-sm ml-1 text-muted-foreground">ms</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <LineChart className="mr-2 h-4 w-4 text-amber-500" />
            Stress Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="text-3xl font-bold">
              {biometricData.stress_score || "N/A"}
              <span className="text-sm ml-1 text-muted-foreground">/100</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiometricDisplay;
