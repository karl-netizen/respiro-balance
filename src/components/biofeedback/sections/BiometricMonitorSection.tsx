
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Activity, Brain, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BiometricMonitorSectionProps {
  heartRate?: number;
  restingHeartRate?: number;
  stress?: number;
  isSimulating?: boolean;
}

const BiometricMonitorSection: React.FC<BiometricMonitorSectionProps> = ({
  heartRate = 0,
  restingHeartRate = 60,
  stress = 0,
  isSimulating = false
}) => {
  const getHeartRateStatus = () => {
    if (heartRate < 60) return { color: 'blue', label: 'Low' };
    if (heartRate > 100) return { color: 'red', label: 'High' };
    return { color: 'green', label: 'Normal' };
  };

  const getStressStatus = () => {
    if (stress < 30) return { color: 'green', label: 'Low' };
    if (stress > 70) return { color: 'red', label: 'High' };
    return { color: 'yellow', label: 'Moderate' };
  };

  const heartRateStatus = getHeartRateStatus();
  const stressStatus = getStressStatus();

  return (
    <div className="space-y-4">
      {isSimulating && (
        <div className="flex items-center justify-center mb-4">
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <Activity className="h-3 w-3 mr-1" />
            Simulation Mode
          </Badge>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Heart Rate</span>
              </div>
              <Badge variant={heartRateStatus.color === 'green' ? 'default' : 'destructive'}>
                {heartRateStatus.label}
              </Badge>
            </div>
            <div className="text-2xl font-bold">{heartRate}</div>
            <div className="text-xs text-muted-foreground">bpm</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Resting HR</span>
            </div>
            <div className="text-2xl font-bold">{restingHeartRate}</div>
            <div className="text-xs text-muted-foreground">bpm</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Stress</span>
              </div>
              <Badge variant={stressStatus.color === 'green' ? 'default' : 'destructive'}>
                {stressStatus.label}
              </Badge>
            </div>
            <div className="text-2xl font-bold">{stress}%</div>
            <Progress value={stress} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">HRV Zone</span>
            </div>
            <div className="text-2xl font-bold">
              {heartRate > restingHeartRate ? 'Active' : 'Recovery'}
            </div>
            <div className="text-xs text-muted-foreground">
              {heartRate > restingHeartRate ? 'In training zone' : 'Optimal for recovery'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BiometricMonitorSection;
