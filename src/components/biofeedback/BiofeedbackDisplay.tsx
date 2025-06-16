
import React from 'react';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';
import { ConnectionPrompt } from './components/ConnectionPrompt';
import { BiofeedbackControls } from './components/BiofeedbackControls';
import { BiometricSummary } from './components/BiometricSummary';
import { TabsContainer } from './components/TabsContainer';
import { DataConverter } from './components/DataConverter';

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
  // Use the DataConverter component to handle the data conversion
  return (
    <DataConverter partialData={partialData}>
      {(completeData) => (
        <div className="bg-background rounded-lg p-3 sm:p-4 shadow-md space-y-4 sm:space-y-6">
          <BiofeedbackControls 
            isMonitoring={isMonitoring} 
            onStartMonitoring={async () => {
              const result = await onStartMonitoring();
              return result;
            }}
            onStopMonitoring={onStopMonitoring}
          />
          
          {completeData ? (
            <div className="space-y-4 sm:space-y-6">
              <BiometricSummary data={completeData} />
              <div className="w-full overflow-x-auto">
                <TabsContainer data={completeData} />
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
