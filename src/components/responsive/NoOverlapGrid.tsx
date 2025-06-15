
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
  console.log('NoOverlapGrid render - columns config:', columns);

  // Use standard Tailwind responsive classes - no custom logic
  const getGridClasses = () => {
    const mobileCol = `grid-cols-${columns.mobile || 1}`;
    const tabletCol = `md:grid-cols-${columns.tablet || 2}`;
    const desktopCol = `lg:grid-cols-${columns.desktop || 3}`;
    
    console.log('Grid classes:', { mobileCol, tabletCol, desktopCol });
    
    return `${mobileCol} ${tabletCol} ${desktopCol}`;
  };

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
        getGridClasses(),
        getGapClass(),
        'auto-rows-fr',
        className
      )}
      style={{
        gridAutoRows: minItemHeight || 'minmax(min-content, 1fr)',
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="relative overflow-hidden"
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
