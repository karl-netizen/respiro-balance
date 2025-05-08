
import React from 'react';

interface BiofeedbackControlsProps {
  isMonitoring: boolean;
  onStartMonitoring: () => Promise<boolean>;
  onStopMonitoring: () => void;
}

export const BiofeedbackControls: React.FC<BiofeedbackControlsProps> = ({
  isMonitoring,
  onStartMonitoring,
  onStopMonitoring
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Biofeedback Data</h2>
      <div>
        {isMonitoring ? (
          <button 
            onClick={onStopMonitoring}
            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md"
          >
            Stop Monitoring
          </button>
        ) : (
          <button 
            onClick={async () => {
              await onStartMonitoring();
            }}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            Start Monitoring
          </button>
        )}
      </div>
    </div>
  );
};
