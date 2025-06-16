
import React from 'react';
import { TouchFriendlyButton } from '@/components/responsive/TouchFriendlyButton';
import { Play, Pause } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

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
  const { deviceType } = useDeviceDetection();

  const handleStartMonitoring = async () => {
    setIsStarting(true);
    try {
      await onStartMonitoring();
    } finally {
      setIsStarting(false);
    }
  };

  // Mobile-optimized button sizing
  const getButtonSize = () => {
    switch (deviceType) {
      case 'mobile':
        return 'default';
      case 'tablet':
        return 'lg';
      default:
        return 'default';
    }
  };

  const getButtonClasses = () => {
    return deviceType === 'mobile' 
      ? 'w-full sm:w-auto px-6 py-3 text-base' 
      : 'px-4 py-2';
  };

  return (
    <div className="flex justify-center my-4">
      {isMonitoring ? (
        <TouchFriendlyButton 
          variant="outline" 
          onClick={onStopMonitoring}
          size={getButtonSize()}
          className={`flex items-center gap-2 ${getButtonClasses()}`}
        >
          <Pause className="h-4 w-4" />
          Stop Monitoring
        </TouchFriendlyButton>
      ) : (
        <TouchFriendlyButton 
          onClick={handleStartMonitoring}
          disabled={isStarting}
          size={getButtonSize()}
          className={`flex items-center gap-2 ${getButtonClasses()}`}
        >
          <Play className="h-4 w-4" />
          {isStarting ? 'Starting...' : 'Start Monitoring'}
        </TouchFriendlyButton>
      )}
    </div>
  );
};

export default BiofeedbackControls;
