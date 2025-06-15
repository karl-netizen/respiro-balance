
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface TouchFriendlyButtonProps extends ButtonProps {
  noOverlap?: boolean;
  hapticFeedback?: boolean;
}

export const TouchFriendlyButton: React.FC<TouchFriendlyButtonProps> = ({
  children,
  className,
  noOverlap = true,
  hapticFeedback = true,
  onClick,
  ...props
}) => {
  const { touchCapable, deviceType, brandSpacing } = useDeviceDetection();

  const getTouchOptimizedClasses = () => {
    if (!touchCapable) return '';

    const touchClasses = {
      mobile: 'min-h-[44px] min-w-[44px] px-6 py-3 text-base',
      tablet: 'min-h-[40px] min-w-[40px] px-5 py-2.5 text-base',
      desktop: 'min-h-[36px] min-w-[36px] px-4 py-2 text-sm',
    };

    return touchClasses[deviceType];
  };

  const getSpacingClasses = () => {
    if (!noOverlap) return '';

    const spacingClasses = {
      mobile: 'm-2',
      tablet: 'm-3',
      desktop: 'm-1',
    };

    return spacingClasses[brandSpacing];
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add haptic feedback for mobile devices
    if (hapticFeedback && touchCapable && 'vibrate' in navigator) {
      navigator.vibrate(10); // Short vibration
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      className={cn(
        getTouchOptimizedClasses(),
        getSpacingClasses(),
        'transition-all duration-200 ease-in-out',
        touchCapable && 'active:scale-95', // Touch feedback
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
};
