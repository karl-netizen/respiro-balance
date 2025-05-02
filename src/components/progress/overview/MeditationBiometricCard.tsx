
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface MeditationBiometricCardProps {
  title?: string;
  description?: string;
  biometricData?: {
    heartRate?: number;
    breathingRate?: number;
    stressLevel?: number;
    focusScore?: number;
  };
}

const MeditationBiometricCard: React.FC<MeditationBiometricCardProps> = ({
  title = "Biometric Insights",
  description = "Your body's response to meditation",
  biometricData
}) => {
  if (!biometricData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground">
            Connect a compatible device to see biometric data during meditation.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {biometricData.heartRate !== undefined && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Heart Rate</span>
                <span className="text-sm text-muted-foreground">
                  {biometricData.heartRate} BPM
                </span>
              </div>
              <Progress value={(biometricData.heartRate / 120) * 100} className="h-2" />
            </div>
          )}
          
          {biometricData.breathingRate !== undefined && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Breathing Rate</span>
                <span className="text-sm text-muted-foreground">
                  {biometricData.breathingRate} breaths/min
                </span>
              </div>
              <Progress value={(biometricData.breathingRate / 20) * 100} className="h-2" />
            </div>
          )}
          
          {biometricData.stressLevel !== undefined && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stress Level</span>
                <span className="text-sm text-muted-foreground">
                  {biometricData.stressLevel}%
                </span>
              </div>
              <Progress value={biometricData.stressLevel} className="h-2" />
            </div>
          )}
          
          {biometricData.focusScore !== undefined && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Focus Score</span>
                <span className="text-sm text-muted-foreground">
                  {biometricData.focusScore}/100
                </span>
              </div>
              <Progress value={biometricData.focusScore} className="h-2" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationBiometricCard;
