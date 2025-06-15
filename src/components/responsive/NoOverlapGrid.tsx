
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
  console.log('NoOverlapGrid render - screen width:', window.innerWidth);
  console.log('NoOverlapGrid render - columns config:', columns);

  const getGapClass = () => {
    const gapMap = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-12',
    };
    return gapMap[gap];
  };

  // Use explicit Tailwind classes for better reliability
  const gridCols = `grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`;
  
  console.log('Grid classes applied:', gridCols, getGapClass());

  return (
    <div
      className={cn(
        'grid w-full',
        // Explicit grid column classes
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
