
import React from 'react';
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

interface OfflineStateProps {
  onRetry?: () => void;
  message?: string;
}

export const MobileOfflineState: React.FC<OfflineStateProps> = ({
  onRetry,
  message = "You're currently offline. Check your connection and try again."
}) => {
  const { deviceType } = useDeviceDetection();
  const isMobile = deviceType === 'mobile';

  return (
    <div className={`flex flex-col items-center justify-center text-center ${isMobile ? 'py-8 px-4' : 'py-12 px-6'}`}>
      <div className={`rounded-full bg-gray-100 p-4 mb-4 ${isMobile ? 'w-16 h-16' : 'w-20 h-20'}`}>
        <svg 
          className="w-full h-full text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" 
          />
        </svg>
      </div>
      <h3 className={`font-medium text-gray-900 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
        Connection Lost
      </h3>
      <p className={`text-gray-500 mb-6 max-w-sm ${isMobile ? 'text-sm' : 'text-base'}`}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors ${
            isMobile ? 'min-h-[44px] text-base' : 'min-h-[40px] text-sm'
          }`}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

interface ErrorStateProps {
  error?: string;
  onRetry?: () => void;
  title?: string;
}

export const MobileErrorState: React.FC<ErrorStateProps> = ({
  error = "Something went wrong. Please try again.",
  onRetry,
  title = "Oops!"
}) => {
  const { deviceType } = useDeviceDetection();
  const isMobile = deviceType === 'mobile';

  return (
    <div className={`flex flex-col items-center justify-center text-center ${isMobile ? 'py-8 px-4' : 'py-12 px-6'}`}>
      <div className={`rounded-full bg-red-100 p-4 mb-4 ${isMobile ? 'w-16 h-16' : 'w-20 h-20'}`}>
        <svg 
          className="w-full h-full text-red-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
      </div>
      <h3 className={`font-medium text-gray-900 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
        {title}
      </h3>
      <p className={`text-gray-500 mb-6 max-w-sm ${isMobile ? 'text-sm' : 'text-base'}`}>
        {error}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors ${
            isMobile ? 'min-h-[44px] text-base' : 'min-h-[40px] text-sm'
          }`}
        >
          Try Again
        </button>
      )}
    </div>
  );
};
