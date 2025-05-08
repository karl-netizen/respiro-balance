
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeartRateTab from '../tabs/HeartRateTab';
import BreathingTab from '../../meditation/biometrics/BreathingTab';
import StressTab from '../tabs/StressTab';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

interface TabsContainerProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  biometricData: BiometricData;
}

const TabsContainer: React.FC<TabsContainerProps> = ({ 
  activeTab, 
  onTabChange,
  biometricData
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="heart-rate" className="flex-1">Heart</TabsTrigger>
        <TabsTrigger value="breathing" className="flex-1">Breathing</TabsTrigger>
        <TabsTrigger value="stress" className="flex-1">Stress</TabsTrigger>
      </TabsList>
      
      <TabsContent value="heart-rate" className="pt-4">
        <HeartRateTab biometricData={biometricData} />
      </TabsContent>
      
      <TabsContent value="breathing" className="pt-4">
        <BreathingTab biometricData={biometricData} />
      </TabsContent>
      
      <TabsContent value="stress" className="pt-4">
        <StressTab biometricData={biometricData} />
      </TabsContent>
    </Tabs>
  );
};

export default TabsContainer;
