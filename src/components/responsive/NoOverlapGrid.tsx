
import React from 'react';
import { cn } from '@/lib/utils';

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
  const getGapClass = () => {
    const gapMap = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-12',
    };
    return gapMap[gap];
  };

  return (
    <div
      className={cn(
        'grid w-full',
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        getGapClass(),
        'items-stretch',
        className
      )}
      style={{
        gridAutoRows: minItemHeight || 'minmax(min-content, 1fr)',
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="w-full h-full"
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
