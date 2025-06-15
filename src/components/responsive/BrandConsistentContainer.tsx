
import React from 'react';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface BrandConsistentContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  spacing?: 'tight' | 'normal' | 'loose';
  noOverlap?: boolean;
}

export const BrandConsistentContainer: React.FC<BrandConsistentContainerProps> = ({
  children,
  className,
  maxWidth = 'xl',
  spacing = 'normal',
  noOverlap = true,
}) => {
  const { deviceType, brandSpacing } = useDeviceDetection();

  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case '2xl': return 'max-w-2xl';
      case 'full': return 'max-w-full';
      default: return 'max-w-xl';
    }
  };

  const getSpacingClass = () => {
    const baseSpacing = {
      mobile: {
        tight: 'p-2 gap-2',
        normal: 'p-4 gap-4',
        loose: 'p-6 gap-6',
      },
      tablet: {
        tight: 'p-3 gap-3',
        normal: 'p-6 gap-6',
        loose: 'p-8 gap-8',
      },
      desktop: {
        tight: 'p-4 gap-4',
        normal: 'p-8 gap-8',
        loose: 'p-12 gap-12',
      },
    };

    return baseSpacing[brandSpacing][spacing];
  };

  const getLayoutClass = () => {
    if (deviceType === 'mobile') {
      return 'flex flex-col w-full';
    }
    return 'flex flex-col w-full mx-auto';
  };

  return (
    <div
      className={cn(
        getLayoutClass(),
        getMaxWidthClass(),
        getSpacingClass(),
        noOverlap && 'relative',
        'transition-all duration-300 ease-in-out',
        className
      )}
    >
      {children}
    </div>
  );
};
