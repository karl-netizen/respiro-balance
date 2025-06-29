
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, Activity } from 'lucide-react';

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
  const handleStart = async () => {
    try {
      await onStartMonitoring();
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    }
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      {!isMonitoring ? (
        <Button
          onClick={handleStart}
          className="flex items-center gap-2"
          size="sm"
        >
          <Play className="h-4 w-4" />
          Start Monitoring
        </Button>
      ) : (
        <Button
          onClick={onStopMonitoring}
          variant="outline"
          className="flex items-center gap-2"
          size="sm"
        >
          <Square className="h-4 w-4" />
          Stop Monitoring
        </Button>
      )}
      
      {isMonitoring && (
        <div className="flex items-center gap-1 text-green-600 text-sm">
          <Activity className="h-4 w-4 animate-pulse" />
          Monitoring...
        </div>
      )}
    </div>
  );
};
