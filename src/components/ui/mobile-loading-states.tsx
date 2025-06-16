
import React from 'react';
import { MobileSkeleton } from './mobile-skeleton';
import { 
  DashboardLoading, 
  ChartLoading, 
  ListLoading, 
  FormLoading,
  ProgressiveLoading,
  SpinnerLoading
} from './mobile-loading';

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
  switch (variant) {
    case 'dashboard':
      return <DashboardLoading />;
    case 'chart':
      return <ChartLoading />;
    case 'list':
      return <ListLoading itemCount={itemCount} />;
    case 'form':
      return <FormLoading title={title} description={description} />;
    case 'progressive':
      return <ProgressiveLoading title={title} description={description} progress={progress} />;
    case 'spinner':
      return <SpinnerLoading title={title} description={description} />;
    default:
      return (
        <div className="space-y-3">
          {Array.from({ length: itemCount }, (_, i) => (
            <MobileSkeleton key={i} variant="card" />
          ))}
        </div>
      );
  }
};

// Re-export the error states for backward compatibility
export { MobileOfflineState, MobileErrorState } from './mobile-loading';

export default MobileLoadingState;
