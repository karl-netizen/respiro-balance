
import React from 'react';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

interface ResponsiveMobileGridProps {
  children: React.ReactNode;
  className?: string;
  minCardWidth?: string;
  gap?: 'sm' | 'md' | 'lg';
  touchOptimized?: boolean;
}

export const ResponsiveMobileGrid: React.FC<ResponsiveMobileGridProps> = ({
  children,
  className,
  minCardWidth = '280px',
  gap = 'md',
  touchOptimized = true,
}) => {
  const { deviceType, touchCapable } = useDeviceDetection();

  const getGapClass = () => {
    const gapMap = {
      sm: 'gap-2 sm:gap-3',
      md: 'gap-3 sm:gap-4 md:gap-6',
      lg: 'gap-4 sm:gap-6 md:gap-8',
    };
    return gapMap[gap];
  };

  const getGridClass = () => {
    if (deviceType === 'mobile') {
      return 'grid grid-cols-1';
    }
    return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-auto-fit`;
  };

  return (
    <div
      className={cn(
        getGridClass(),
        getGapClass(),
        'w-full',
        touchOptimized && touchCapable && 'touch-manipulation',
        className
      )}
      style={{
        gridTemplateColumns: deviceType !== 'mobile' ? `repeat(auto-fit, minmax(${minCardWidth}, 1fr))` : undefined,
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={cn(
            'w-full',
            touchOptimized && touchCapable && 'min-h-[44px]'
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
