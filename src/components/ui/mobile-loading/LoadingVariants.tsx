
import React from 'react';
import { MobileSkeleton } from '../mobile-skeleton';
import { Card, CardContent, CardHeader } from '../card';
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

interface LoadingVariantProps {
  itemCount?: number;
}

export const DashboardLoading: React.FC<LoadingVariantProps> = () => {
  const { deviceType } = useDeviceDetection();
  const isMobile = deviceType === 'mobile';
  const getPadding = () => isMobile ? 'p-3' : 'p-4';
  const getSpacing = () => isMobile ? 'space-y-3' : 'space-y-4';

  return (
    <div className={getSpacing()}>
      <div className={getPadding()}>
        <MobileSkeleton variant="text" className="w-1/3 mb-2" />
        <MobileSkeleton variant="text" className="w-1/2" />
      </div>
      
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
      
      <Card>
        <CardContent className={getPadding()}>
          <MobileSkeleton variant="chart" />
        </CardContent>
      </Card>
    </div>
  );
};

export const ChartLoading: React.FC = () => {
  const { deviceType } = useDeviceDetection();
  const getPadding = () => deviceType === 'mobile' ? 'p-3' : 'p-4';

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
};

export const ListLoading: React.FC<LoadingVariantProps> = ({ itemCount = 3 }) => {
  const { deviceType } = useDeviceDetection();
  const isMobile = deviceType === 'mobile';
  const getPadding = () => isMobile ? 'p-3' : 'p-4';
  const getSpacing = () => isMobile ? 'space-y-3' : 'space-y-4';

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
};

export const FormLoading: React.FC<{ title?: string; description?: string }> = ({ title, description }) => {
  const { deviceType } = useDeviceDetection();
  const isMobile = deviceType === 'mobile';
  const getPadding = () => isMobile ? 'p-3' : 'p-4';
  const getSpacing = () => isMobile ? 'space-y-3' : 'space-y-4';

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
};
