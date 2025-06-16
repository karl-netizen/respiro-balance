
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface TouchFriendlyButtonProps extends ButtonProps {
  noOverlap?: boolean;
  hapticFeedback?: boolean;
  spacing?: 'compact' | 'normal' | 'relaxed';
}

export const TouchFriendlyButton: React.FC<TouchFriendlyButtonProps> = ({
  children,
  className,
  noOverlap = true,
  hapticFeedback = true,
  spacing = 'normal',
  onClick,
  ...props
}) => {
  const { touchCapable, deviceType } = useDeviceDetection();

  const getTouchOptimizedClasses = () => {
    if (!touchCapable) return '';

    const touchClasses = {
      mobile: 'min-h-[48px] min-w-[48px] px-6 py-3 text-base',
      tablet: 'min-h-[44px] min-w-[44px] px-5 py-2.5 text-base',
      desktop: 'min-h-[40px] min-w-[40px] px-4 py-2 text-sm',
    };

    return touchClasses[deviceType];
  };

  const getSpacingClasses = () => {
    if (!noOverlap) return '';

    const spacingMap = {
      compact: {
        mobile: 'm-1',
        tablet: 'm-1.5',
        desktop: 'm-1',
      },
      normal: {
        mobile: 'm-2',
        tablet: 'm-2',
        desktop: 'm-1',
      },
      relaxed: {
        mobile: 'm-3',
        tablet: 'm-2.5',
        desktop: 'm-1.5',
      },
    };

    return spacingMap[spacing][deviceType];
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
        'transition-all duration-200 ease-in-out touch-manipulation',
        touchCapable && 'active:scale-95 active:shadow-sm', // Enhanced touch feedback
        'focus-visible:ring-2 focus-visible:ring-offset-2', // Better focus states
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
};
