
import React, { useState } from "react";
import { Heart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HeartRateTab, StressTab } from "../tabs";
import BiofeedbackCard from "../cards/BiofeedbackCard";
import BiofeedbackDisplay from "../BiofeedbackDisplay";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

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
  const { deviceType } = useDeviceDetection();

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

  // Mobile-optimized spacing and layout
  const getMobileSpacing = () => {
    switch (deviceType) {
      case 'mobile':
        return 'space-y-3';
      case 'tablet':
        return 'space-y-4';
      default:
        return 'space-y-6';
    }
  };

  return (
    <BiofeedbackCard
      title="Biofeedback Monitor"
      description={`${isSimulating ? 'Simulation Mode' : 'Live Data'}`}
      icon={<Heart className="h-5 w-5" />}
    >
      <div className={getMobileSpacing()}>
        {/* Mobile-optimized tabs with touch-friendly design */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="w-full overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 min-w-[280px] sm:min-w-0">
              <TabsTrigger 
                value="heart-rate" 
                className="text-xs sm:text-sm py-2 sm:py-3 min-h-[44px] sm:min-h-auto"
              >
                Heart Rate
              </TabsTrigger>
              <TabsTrigger 
                value="stress"
                className="text-xs sm:text-sm py-2 sm:py-3 min-h-[44px] sm:min-h-auto"
              >
                Stress Level
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="heart-rate" className={getMobileSpacing()}>
            <div className="w-full overflow-hidden">
              <BiofeedbackDisplay
                partialData={mockHeartRateData}
                isMonitoring={isMonitoring}
                onStartMonitoring={startMonitoring}
                onStopMonitoring={stopMonitoring}
              />
            </div>
            <div className="w-full overflow-x-auto">
              <div className="min-w-[320px] sm:min-w-0">
                <HeartRateTab biometricData={mockHeartRateData} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stress" className={getMobileSpacing()}>
            <div className="w-full overflow-hidden">
              <BiofeedbackDisplay
                partialData={mockStressData}
                isMonitoring={isMonitoring}
                onStartMonitoring={startMonitoring}
                onStopMonitoring={stopMonitoring}
              />
            </div>
            <div className="w-full overflow-x-auto">
              <div className="min-w-[320px] sm:min-w-0">
                <StressTab biometricData={mockStressData} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </BiofeedbackCard>
  );
};

export default BiometricMonitorSection;
