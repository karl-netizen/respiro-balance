
import React from 'react';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';
import { ConnectionPrompt } from './components/ConnectionPrompt';
import { BiofeedbackControls } from './components/BiofeedbackControls';
import { BiometricSummary } from './components/BiometricSummary';
import { TabsContainer } from './components/TabsContainer';
import { DataConverter } from './components/DataConverter';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

// Define the props interface
export interface BiofeedbackDisplayProps {
  partialData?: Partial<BiometricData>; // Change to accept partial data
  isMonitoring: boolean;
  onStartMonitoring: () => Promise<boolean>;
  onStopMonitoring: () => void;
}

export const BiofeedbackDisplay: React.FC<BiofeedbackDisplayProps> = ({
  partialData,
  isMonitoring,
  onStartMonitoring,
  onStopMonitoring
}) => {
  const { deviceType } = useDeviceDetection();
  
  // Mobile-optimized padding and spacing
  const getContainerPadding = () => {
    switch (deviceType) {
      case 'mobile':
        return 'p-3 sm:p-4';
      case 'tablet':
        return 'p-4 sm:p-5';
      default:
        return 'p-4 sm:p-6';
    }
  };

  const getSpacing = () => {
    return deviceType === 'mobile' ? 'space-y-3 sm:space-y-4' : 'space-y-4 sm:space-y-6';
  };

  // Use the DataConverter component to handle the data conversion
  return (
    <DataConverter partialData={partialData}>
      {(completeData) => (
        <div className={`bg-background rounded-lg ${getContainerPadding()} shadow-md ${getSpacing()}`}>
          <BiofeedbackControls 
            isMonitoring={isMonitoring} 
            onStartMonitoring={async () => {
              const result = await onStartMonitoring();
              return result;
            }}
            onStopMonitoring={onStopMonitoring}
          />
          
          {completeData ? (
            <div className={getSpacing()}>
              <BiometricSummary data={completeData} />
              <div className="w-full">
                <div className="overflow-x-auto -mx-1 sm:mx-0">
                  <div className="min-w-[280px] px-1 sm:px-0">
                    <TabsContainer data={completeData} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ConnectionPrompt isMonitoring={isMonitoring} />
          )}
        </div>
      )}
    </DataConverter>
  );
};

export default BiofeedbackDisplay;
