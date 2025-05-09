
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

interface TabsContainerProps {
  data: BiometricData;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('heart');

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="mt-6"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="heart">Heart Rate</TabsTrigger>
        <TabsTrigger value="hrv">HRV</TabsTrigger>
        <TabsTrigger value="breathing">Breathing</TabsTrigger>
        <TabsTrigger value="stress">Stress</TabsTrigger>
      </TabsList>
      
      <TabsContent value="heart" className="mt-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Heart Rate</h3>
          <p className="text-3xl font-bold">{data.heart_rate || data.heartRate || '--'} <span className="text-sm font-normal">BPM</span></p>
          <p className="text-muted-foreground text-sm">
            {(data.heart_rate || data.heartRate || 0) < 60 
              ? 'Below average - Relaxed state' 
              : (data.heart_rate || data.heartRate || 0) < 100 
                ? 'Normal range - Healthy heart rate'
                : 'Elevated - Consider deep breathing'}
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="hrv" className="mt-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Heart Rate Variability</h3>
          <p className="text-3xl font-bold">{data.hrv || '--'} <span className="text-sm font-normal">ms</span></p>
          <p className="text-muted-foreground text-sm">
            Higher HRV values typically indicate better cardiovascular fitness and stress resilience.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="breathing" className="mt-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Breathing Rate</h3>
          <p className="text-3xl font-bold">
            {data.respiratory_rate || data.breath_rate || data.breathRate || '--'} 
            <span className="text-sm font-normal"> breaths/min</span>
          </p>
          <p className="text-muted-foreground text-sm">
            A typical resting breathing rate is between 12-20 breaths per minute.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="stress" className="mt-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Stress Level</h3>
          <p className="text-3xl font-bold">
            {data.stress_level || data.stress_score || '--'}%
          </p>
          <p className="text-muted-foreground text-sm">
            {(data.stress_level || data.stress_score || 0) < 30 
              ? 'Low stress - You are in a relaxed state' 
              : (data.stress_level || data.stress_score || 0) < 70 
                ? 'Moderate stress - Within normal range'
                : 'High stress - Consider a mindfulness exercise'}
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TabsContainer;
