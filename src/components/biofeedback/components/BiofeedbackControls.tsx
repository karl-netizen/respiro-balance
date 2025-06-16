
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
    await onStartMonitoring();
  };

  return (
    <div className="flex items-center gap-3 mb-4">
      {!isMonitoring ? (
        <Button onClick={handleStart} className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          Start Monitoring
        </Button>
      ) : (
        <Button onClick={onStopMonitoring} variant="outline" className="flex items-center gap-2">
          <Square className="h-4 w-4" />
          Stop Monitoring
        </Button>
      )}
      
      {isMonitoring && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Activity className="h-4 w-4 animate-pulse" />
          Live monitoring active
        </div>
      )}
    </div>
  );
};
