
import React, { useState } from "react";
import { Heart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HeartRateTab, StressTab } from "../tabs";
import BiofeedbackCard from "../cards/BiofeedbackCard";
import BiofeedbackDisplay from "../BiofeedbackDisplay";

export interface BiometricData {
  id: string;
  user_id: string;
  current: number;
  resting?: number;
  history: number[];
}

interface BiometricMonitorSectionProps {
  heartRate: number;
  restingHeartRate: number;
  stress: number;
  isSimulating: boolean;
}

const BiometricMonitorSection: React.FC<BiometricMonitorSectionProps> = ({
  heartRate,
  restingHeartRate,
  stress,
  isSimulating
}) => {
  const [activeTab, setActiveTab] = useState("heart-rate");
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Create mock biometric data for tabs
  const mockHeartRateData: BiometricData = {
    id: "hr-1",
    user_id: "user-1",
    current: heartRate,
    resting: restingHeartRate,
    history: [65, 68, 72, 70, 75, 78, 76]
  };
  
  const mockStressData: BiometricData = {
    id: "stress-1",
    user_id: "user-1",
    current: stress,
    history: [25, 30, 28, 35, 40, 32, 28]
  };

  const startMonitoring = async (): Promise<boolean> => {
    setIsMonitoring(true);
    return true;
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  return (
    <BiofeedbackCard
      title="Biofeedback Monitor"
      description={`${isSimulating ? 'Simulation Mode' : 'Live Data'}`}
      icon={<Heart className="h-5 w-5" />}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
          <TabsTrigger value="stress">Stress Level</TabsTrigger>
        </TabsList>
        
        <TabsContent value="heart-rate" className="space-y-4">
          <BiofeedbackDisplay
            partialData={mockHeartRateData}
            isMonitoring={isMonitoring}
            onStartMonitoring={startMonitoring}
            onStopMonitoring={stopMonitoring}
          />
          <HeartRateTab biometricData={mockHeartRateData} />
        </TabsContent>
        
        <TabsContent value="stress" className="space-y-4">
          <BiofeedbackDisplay
            partialData={mockStressData}
            isMonitoring={isMonitoring}
            onStartMonitoring={startMonitoring}
            onStopMonitoring={stopMonitoring}
          />
          <StressTab biometricData={mockStressData} />
        </TabsContent>
      </Tabs>
    </BiofeedbackCard>
  );
};

export default BiometricMonitorSection;
