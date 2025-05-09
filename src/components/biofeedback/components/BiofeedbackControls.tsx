
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

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
  const [isStarting, setIsStarting] = React.useState(false);

  const handleStartMonitoring = async () => {
    setIsStarting(true);
    try {
      await onStartMonitoring();
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="flex justify-center my-4">
      {isMonitoring ? (
        <Button 
          variant="outline" 
          onClick={onStopMonitoring}
          className="flex items-center gap-2"
        >
          <Pause className="h-4 w-4" />
          Stop Monitoring
        </Button>
      ) : (
        <Button 
          onClick={handleStartMonitoring}
          disabled={isStarting}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          {isStarting ? 'Starting...' : 'Start Monitoring'}
        </Button>
      )}
    </div>
  );
};

export default BiofeedbackControls;
