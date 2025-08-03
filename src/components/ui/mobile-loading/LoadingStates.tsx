
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

interface ProgressiveLoadingProps {
  title?: string;
  description?: string;
  progress?: number;
}

export const ProgressiveLoading: React.FC<ProgressiveLoadingProps> = ({
  title,
  description,
  progress = 0
}) => {
  const { deviceType } = useDeviceDetection();
  const isMobile = deviceType === 'mobile';

  return (
    <div className={`flex items-center justify-center ${isMobile ? 'py-8' : 'py-12'}`}>
      <div className="text-center max-w-sm">
        <Loader2 className={`animate-spin mx-auto mb-4 text-primary ${isMobile ? 'h-8 w-8' : 'h-12 w-12'}`} />
        {title && (
          <p className={`font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>
            {title}
          </p>
        )}
        {description && (
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'} mt-2`}>
            {description}
          </p>
        )}
        {progress > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}% loaded</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const SpinnerLoading: React.FC<{ title?: string; description?: string }> = ({
  title,
  description
}) => {
  const { deviceType } = useDeviceDetection();
  const isMobile = deviceType === 'mobile';

  return (
    <div className={`flex items-center justify-center ${isMobile ? 'py-8' : 'py-12'}`}>
      <div className="text-center">
        <Loader2 className={`animate-spin mx-auto mb-4 text-primary ${isMobile ? 'h-8 w-8' : 'h-12 w-12'}`} />
        {title && (
          <p className={`font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>
            {title}
          </p>
        )}
        {description && (
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'} mt-2`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
