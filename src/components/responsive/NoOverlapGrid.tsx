
import React from 'react';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface NoOverlapGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  minItemHeight?: string;
}

export const NoOverlapGrid: React.FC<NoOverlapGridProps> = ({
  children,
  className,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  minItemHeight,
}) => {
  const { deviceType, brandSpacing } = useDeviceDetection();

  const getColumnsClass = () => {
    switch (deviceType) {
      case 'mobile':
        return `grid-cols-${columns.mobile || 1}`;
      case 'tablet':
        return `md:grid-cols-${columns.tablet || 2}`;
      case 'desktop':
        return `lg:grid-cols-${columns.desktop || 3}`;
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const getGapClass = () => {
    const gapSizes = {
      mobile: {
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
      },
      tablet: {
        sm: 'gap-3',
        md: 'gap-6',
        lg: 'gap-8',
        xl: 'gap-10',
      },
      desktop: {
        sm: 'gap-4',
        md: 'gap-8',
        lg: 'gap-12',
        xl: 'gap-16',
      },
    };

    return gapSizes[brandSpacing][gap];
  };

  return (
    <div
      className={cn(
        'grid w-full',
        getColumnsClass(),
        getGapClass(),
        'auto-rows-fr', // Ensures equal height rows
        className
      )}
      style={{
        gridAutoRows: minItemHeight || 'minmax(min-content, 1fr)',
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="relative overflow-hidden" // Prevents content overflow
          style={{
            minHeight: minItemHeight || 'auto',
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
