
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserPreferences } from '@/context';
import { Heart, Brain, Activity, Pause, Play } from 'lucide-react';
import { useSimulationState } from './hooks/useSimulationState';
import HeartRateVariabilityTab from './biometrics/HeartRateVariabilityTab';
import BrainwavesTab from './biometrics/BrainwavesTab';
import BreathingTab from './biometrics/BreathingTab';
import { BiometricDisplayProps } from './types/BiometricTypes';

const BiometricDisplay: React.FC<BiometricDisplayProps> = ({
  biometricData,
  isInitial = false,
  showChange = false,
  change
}) => {
  const [selectedMetric, setSelectedMetric] = React.useState('hrv');
  const { simulationRunning, toggleSimulation } = useSimulationState();
  const { preferences } = useUserPreferences();
  
  // Check if the user has a wearable device or is interested in certain metrics
  const showWearableData = preferences.hasWearableDevice || 
    (preferences.metricsOfInterest && preferences.metricsOfInterest.length > 0);
  
  // If no interest is shown in biometrics, we can skip rendering
  if (!showWearableData) {
    return null;
  }

  return (
    <Card className="shadow-md">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {isInitial ? "Initial Biometrics" : showChange ? "Current Biometrics" : "Biometric Feedback"}
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
          
          <TabsContent value="hrv">
            <HeartRateVariabilityTab 
              biometricData={biometricData} 
              showChange={showChange} 
              change={change} 
            />
          </TabsContent>
          
          <TabsContent value="brain">
            <BrainwavesTab biometricData={biometricData} />
          </TabsContent>
          
          <TabsContent value="breath">
            <BreathingTab 
              biometricData={biometricData} 
              showChange={showChange} 
              change={change} 
            />
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
