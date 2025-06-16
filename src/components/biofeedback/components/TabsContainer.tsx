
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface TabsContainerProps {
  data: BiometricData;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('heart');
  const { deviceType } = useDeviceDetection();

  // Mobile-optimized tab styling
  const getTabsListClasses = () => {
    return deviceType === 'mobile' 
      ? 'grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto p-1' 
      : 'grid w-full grid-cols-4';
  };

  const getTabTriggerClasses = () => {
    return deviceType === 'mobile' 
      ? 'text-xs sm:text-sm px-2 py-2 h-auto min-h-[44px] whitespace-nowrap' 
      : 'text-sm';
  };

  const getContentClasses = () => {
    return deviceType === 'mobile' ? 'mt-3 px-1' : 'mt-4';
  };

  const getValueClasses = () => {
    return deviceType === 'mobile' 
      ? 'text-xl sm:text-2xl md:text-3xl font-bold' 
      : 'text-3xl font-bold';
  };

  const getUnitClasses = () => {
    return deviceType === 'mobile' 
      ? 'text-xs sm:text-sm font-normal' 
      : 'text-sm font-normal';
  };

  const getDescriptionClasses = () => {
    return deviceType === 'mobile' 
      ? 'text-xs sm:text-sm' 
      : 'text-sm';
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="mt-4 sm:mt-6"
    >
      <TabsList className={getTabsListClasses()}>
        <TabsTrigger value="heart" className={getTabTriggerClasses()}>
          Heart Rate
        </TabsTrigger>
        <TabsTrigger value="hrv" className={getTabTriggerClasses()}>
          HRV
        </TabsTrigger>
        <TabsTrigger value="breathing" className={getTabTriggerClasses()}>
          Breathing
        </TabsTrigger>
        <TabsTrigger value="stress" className={getTabTriggerClasses()}>
          Stress
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="heart" className={getContentClasses()}>
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-medium">Heart Rate</h3>
          <p className={getValueClasses()}>
            {data.heart_rate || data.heartRate || '--'} 
            <span className={getUnitClasses()}> BPM</span>
          </p>
          <p className={`text-muted-foreground ${getDescriptionClasses()}`}>
            {(data.heart_rate || data.heartRate || 0) < 60 
              ? 'Below average - Relaxed state' 
              : (data.heart_rate || data.heartRate || 0) < 100 
                ? 'Normal range - Healthy heart rate'
                : 'Elevated - Consider deep breathing'}
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="hrv" className={getContentClasses()}>
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-medium">Heart Rate Variability</h3>
          <p className={getValueClasses()}>
            {data.hrv || '--'} 
            <span className={getUnitClasses()}> ms</span>
          </p>
          <p className={`text-muted-foreground ${getDescriptionClasses()}`}>
            Higher HRV values typically indicate better cardiovascular fitness and stress resilience.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="breathing" className={getContentClasses()}>
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-medium">Breathing Rate</h3>
          <p className={getValueClasses()}>
            {data.respiratory_rate || data.breath_rate || data.breathRate || '--'} 
            <span className={getUnitClasses()}> breaths/min</span>
          </p>
          <p className={`text-muted-foreground ${getDescriptionClasses()}`}>
            A typical resting breathing rate is between 12-20 breaths per minute.
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="stress" className={getContentClasses()}>
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-medium">Stress Level</h3>
          <p className={getValueClasses()}>
            {data.stress_level || data.stress_score || '--'}%
          </p>
          <p className={`text-muted-foreground ${getDescriptionClasses()}`}>
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
