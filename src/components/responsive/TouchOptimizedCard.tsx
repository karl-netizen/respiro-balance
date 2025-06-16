
import React from 'react';
import { Card, CardProps } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface TouchOptimizedCardProps extends CardProps {
  children: React.ReactNode;
  minTouchTarget?: boolean;
  hapticFeedback?: boolean;
}

export const TouchOptimizedCard: React.FC<TouchOptimizedCardProps> = ({
  children,
  className,
  minTouchTarget = true,
  hapticFeedback = true,
  onClick,
  ...props
}) => {
  const { deviceType, touchCapable } = useDeviceDetection();

  const getTouchOptimizedClasses = () => {
    if (!touchCapable) return '';

    const touchClasses = {
      mobile: minTouchTarget ? 'min-h-[44px] p-4' : 'p-3',
      tablet: minTouchTarget ? 'min-h-[40px] p-5' : 'p-4',
      desktop: 'p-4',
    };

    return touchClasses[deviceType];
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Add haptic feedback for mobile devices
    if (hapticFeedback && touchCapable && 'vibrate' in navigator && onClick) {
      navigator.vibrate(10); // Short vibration
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Card
      className={cn(
        getTouchOptimizedClasses(),
        'transition-all duration-200 ease-in-out',
        touchCapable && onClick && 'active:scale-95',
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Card>
  );
};
