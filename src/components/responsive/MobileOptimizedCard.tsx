
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface MobileOptimizedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  touchFriendly?: boolean;
  compactOnMobile?: boolean;
}

export const MobileOptimizedCard: React.FC<MobileOptimizedCardProps> = ({
  children,
  className,
  touchFriendly = true,
  compactOnMobile = true,
  onClick,
  ...props
}) => {
  const { deviceType, touchCapable } = useDeviceDetection();

  const getMobileClasses = () => {
    let classes = '';
    
    if (deviceType === 'mobile') {
      classes += compactOnMobile ? 'p-3 ' : 'p-4 ';
      classes += 'rounded-lg ';
    } else {
      classes += 'p-4 sm:p-6 ';
      classes += 'rounded-lg ';
    }

    if (touchFriendly && touchCapable) {
      classes += 'min-h-[44px] ';
      if (onClick) {
        classes += 'active:scale-95 transition-transform duration-150 ';
      }
    }

    return classes;
  };

  return (
    <Card
      className={cn(
        getMobileClasses(),
        'touch-manipulation',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </Card>
  );
};
