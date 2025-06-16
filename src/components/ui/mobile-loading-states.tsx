
import React from 'react';
import { MobileSkeleton } from './mobile-skeleton';
import { Card, CardContent, CardHeader } from './card';
import { Loader2 } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface MobileLoadingStateProps {
  variant?: 'dashboard' | 'chart' | 'list' | 'card' | 'form' | 'spinner';
  itemCount?: number;
  title?: string;
  description?: string;
}

export const MobileLoadingState: React.FC<MobileLoadingStateProps> = ({
  variant = 'card',
  itemCount = 3,
  title,
  description
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

export default MobileLoadingState;
