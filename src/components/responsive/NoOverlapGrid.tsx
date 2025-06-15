
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

  console.log('NoOverlapGrid - Device type:', deviceType, 'Brand spacing:', brandSpacing);

  const getColumnsClass = () => {
    // Use CSS classes that work with Tailwind's responsive design
    const mobileColumns = `grid-cols-${columns.mobile || 1}`;
    const tabletColumns = `md:grid-cols-${columns.tablet || 2}`;
    const desktopColumns = `lg:grid-cols-${columns.desktop || 3}`;
    
    console.log('Grid columns classes:', { mobileColumns, tabletColumns, desktopColumns });
    
    return `${mobileColumns} ${tabletColumns} ${desktopColumns}`;
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

    const gapClass = gapSizes[brandSpacing][gap];
    console.log('Grid gap class:', gapClass);
    return gapClass;
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
