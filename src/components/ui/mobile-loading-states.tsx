
import React from 'react';
import { MobileSkeleton } from './mobile-skeleton';
import { Card, CardContent, CardHeader } from './card';
import { Loader2 } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface MobileLoadingStateProps {
  variant?: 'dashboard' | 'chart' | 'list' | 'card' | 'form' | 'spinner' | 'progressive';
  itemCount?: number;
  title?: string;
  description?: string;
  progress?: number;
}

export const MobileLoadingState: React.FC<MobileLoadingStateProps> = ({
  variant = 'card',
  itemCount = 3,
  title,
  description,
  progress = 0
}) => {
  const { deviceType } = useDeviceDetection();
  const isMobile = deviceType === 'mobile';

  const getSpacing = () => isMobile ? 'space-y-3' : 'space-y-4';
  const getPadding = () => isMobile ? 'p-3' : 'p-4';

  switch (variant) {
    case 'dashboard':
      return (
        <div className={getSpacing()}>
          {/* Header skeleton */}
          <div className={getPadding()}>
            <MobileSkeleton variant="text" className="w-1/3 mb-2" />
            <MobileSkeleton variant="text" className="w-1/2" />
          </div>
          
          {/* Stats cards skeleton */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-${isMobile ? '3' : '4'} ${getPadding()}`}>
            {Array.from({ length: 3 }, (_, i) => (
              <Card key={i}>
                <CardContent className={getPadding()}>
                  <MobileSkeleton variant="text" className="w-1/2 mb-2" />
                  <MobileSkeleton variant="text" className="w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Chart skeleton */}
          <Card>
            <CardContent className={getPadding()}>
              <MobileSkeleton variant="chart" />
            </CardContent>
          </Card>
        </div>
      );

    case 'chart':
      return (
        <Card>
          <CardHeader className={getPadding()}>
            <MobileSkeleton variant="text" className="w-1/3 mb-2" />
            <MobileSkeleton variant="text" className="w-1/2" />
          </CardHeader>
          <CardContent className={getPadding()}>
            <MobileSkeleton variant="chart" />
          </CardContent>
        </Card>
      );

    case 'list':
      return (
        <div className={getSpacing()}>
          {Array.from({ length: itemCount }, (_, i) => (
            <Card key={i}>
              <CardContent className={`${getPadding()} flex items-center gap-${isMobile ? '3' : '4'}`}>
                <MobileSkeleton variant="avatar" />
                <div className="flex-1 space-y-2">
                  <MobileSkeleton variant="text" className="w-3/4" />
                  <MobileSkeleton variant="text" className="w-1/2" />
                </div>
                <MobileSkeleton variant="button" />
              </CardContent>
            </Card>
          ))}
        </div>
      );

    case 'form':
      return (
        <Card>
          <CardHeader className={getPadding()}>
            {title && <MobileSkeleton variant="text" className="w-1/3 mb-2" />}
            {description && <MobileSkeleton variant="text" className="w-1/2" />}
          </CardHeader>
          <CardContent className={getPadding()}>
            <div className={getSpacing()}>
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i}>
                  <MobileSkeleton variant="text" className="w-1/4 mb-2" />
                  <MobileSkeleton 
                    variant="default" 
                    className={isMobile ? 'h-12 w-full' : 'h-10 w-full'} 
                  />
                </div>
              ))}
              <div className="flex gap-2 pt-4">
                <MobileSkeleton variant="button" className="flex-1" />
                <MobileSkeleton variant="button" />
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'progressive':
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

    case 'spinner':
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

    default:
      return (
        <div className={getSpacing()}>
          {Array.from({ length: itemCount }, (_, i) => (
            <MobileSkeleton key={i} variant="card" />
          ))}
        </div>
      );
  }
};

// Offline state component
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

// Error state component
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

export default MobileLoadingState;
