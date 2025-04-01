
import React, { useState, useEffect } from 'react';
import { useBiometricData } from '@/hooks/useBiometricData';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserPreferences } from '@/context';
import { Heart, Brain, Activity, Pause, Play } from 'lucide-react';
import { BiometricData } from '@/types/supabase';

interface BiometricDisplayProps {
  biometricData?: any;
  isInitial?: boolean;
  showChange?: boolean;
  change?: any;
}

const BiometricDisplay: React.FC<BiometricDisplayProps> = (props) => {
  const { biometricData, isLoading } = useBiometricData();
  const [selectedMetric, setSelectedMetric] = useState('hrv');
  const [simulationRunning, setSimulationRunning] = useState(true);
  const { preferences } = useUserPreferences();
  
  // Use props if provided, otherwise use data from hook
  const data = props.biometricData || biometricData[0] || {};
  
  // Check if the user has a wearable device or is interested in certain metrics
  const showWearableData = preferences.hasWearableDevice || 
    (preferences.metricsOfInterest && preferences.metricsOfInterest.length > 0);
  
  // If no interest is shown in biometrics, we can skip rendering
  if (!showWearableData) {
    return null;
  }

  // Convert HRV to a percentage scale for visualization (50-150 ms → 0-100%)
  const hrvToPercentage = (hrv) => {
    const min = 50;
    const max = 150;
    const percentage = ((hrv - min) / (max - min)) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  // Convert brainwaves to percentage (for demo purposes)
  const brainwaveToPercentage = (value, type) => {
    // Different types of brainwaves have different typical ranges
    const ranges = {
      alpha: { min: 0, max: 10 },
      beta: { min: 0, max: 20 },
      theta: { min: 0, max: 8 },
      delta: { min: 0, max: 4 }
    };
    
    const { min, max } = ranges[type] || { min: 0, max: 100 };
    const percentage = ((value - min) / (max - min)) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  const toggleSimulation = () => {
    setSimulationRunning(!simulationRunning);
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {props.isInitial ? "Initial Biometrics" : props.showChange ? "Current Biometrics" : "Biometric Feedback"}
          </h3>
          <button 
            className="p-1 rounded-full bg-secondary/50 hover:bg-secondary"
            onClick={toggleSimulation}
          >
            {simulationRunning ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
        
        <Tabs defaultValue={selectedMetric} onValueChange={setSelectedMetric}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="hrv" className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>HRV</span>
            </TabsTrigger>
            <TabsTrigger value="brain" className="flex items-center space-x-1">
              <Brain className="h-4 w-4" />
              <span>Brain</span>
            </TabsTrigger>
            <TabsTrigger value="breath" className="flex items-center space-x-1">
              <Activity className="h-4 w-4" />
              <span>Breath</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hrv" className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Heart Rate Variability</span>
                <span>{isLoading ? '...' : `${data.hrv || 0} ms`}</span>
              </div>
              <Progress 
                value={isLoading ? 0 : hrvToPercentage(data.hrv || 0)}
                className="h-2"
              />
              {props.showChange && props.change && (
                <div className="text-xs text-right mt-1">
                  <span className={props.change.hrv > 0 ? "text-green-500" : "text-red-500"}>
                    {props.change.hrv > 0 ? "+" : ""}{props.change.hrv}ms
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Heart Rate</span>
                <span>{isLoading ? '...' : `${data.heartRate || data.heart_rate || 0} bpm`}</span>
              </div>
              <Progress 
                value={isLoading ? 0 : ((data.heartRate || data.heart_rate || 0) - 50) / 100 * 100}
                className="h-2"
              />
              {props.showChange && props.change && (
                <div className="text-xs text-right mt-1">
                  <span className={props.change.heart_rate < 0 ? "text-green-500" : "text-red-500"}>
                    {props.change.heart_rate > 0 ? "+" : ""}{props.change.heart_rate}bpm
                  </span>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="brain" className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Alpha Waves (Relaxation)</span>
                <span>{isLoading ? '...' : `${(data.brainwaves?.alpha || 0).toFixed(1)} μV`}</span>
              </div>
              <Progress 
                value={isLoading ? 0 : brainwaveToPercentage(data.brainwaves?.alpha || 0, 'alpha')}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Theta Waves (Meditation)</span>
                <span>{isLoading ? '...' : `${(data.brainwaves?.theta || 0).toFixed(1)} μV`}</span>
              </div>
              <Progress 
                value={isLoading ? 0 : brainwaveToPercentage(data.brainwaves?.theta || 0, 'theta')}
                className="h-2"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="breath" className="space-y-3">
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Breath Rate</span>
                <span>{isLoading ? '...' : `${(data.breathRate || data.respiratory_rate || 0).toFixed(1)} bpm`}</span>
              </div>
              <Progress 
                value={isLoading ? 0 : ((data.breathRate || data.respiratory_rate || 0) / 20) * 100}
                className="h-2"
              />
              {props.showChange && props.change && (
                <div className="text-xs text-right mt-1">
                  <span className={props.change.respiratory_rate < 0 ? "text-green-500" : "text-red-500"}>
                    {props.change.respiratory_rate > 0 ? "+" : ""}{props.change.respiratory_rate}/min
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Coherence Score</span>
                <span>{isLoading ? '...' : `${((data.coherence || 0) * 100).toFixed(0)}%`}</span>
              </div>
              <Progress 
                value={isLoading ? 0 : (data.coherence || 0) * 100}
                className="h-2"
              />
            </div>
          </TabsContent>
        </Tabs>
        
        {simulationRunning ? (
          <p className="text-xs text-muted-foreground mt-4">Displaying live biometric data</p>
        ) : (
          <p className="text-xs text-muted-foreground mt-4">Simulation paused</p>
        )}
      </CardContent>
    </Card>
  );
};

export default BiometricDisplay;
