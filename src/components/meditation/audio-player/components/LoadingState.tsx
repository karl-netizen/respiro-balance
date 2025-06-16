
import React from 'react';
import { MobileLoadingState } from '@/components/ui/mobile-loading-states';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

const LoadingState: React.FC = () => {
  const { deviceType } = useDeviceDetection();
  
  return (
    <div className={`flex justify-center items-center ${deviceType === 'mobile' ? 'h-20' : 'h-24'}`}>
      <MobileLoadingState 
        variant="spinner" 
        title="Loading audio..." 
      />
    </div>
  );
};

export default LoadingState;
