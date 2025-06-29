
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface TouchFriendlyButtonProps extends ButtonProps {
  hapticFeedback?: boolean;
}

export const TouchFriendlyButton: React.FC<TouchFriendlyButtonProps> = ({
  children,
  className,
  hapticFeedback = true,
  onClick,
  ...props
}) => {
  const { touchCapable, deviceType } = useDeviceDetection();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Haptic feedback for touch devices
    if (hapticFeedback && touchCapable && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }

    onClick?.(e);
  };

  const touchOptimizedClasses = touchCapable ? {
    'min-h-[44px]': deviceType === 'mobile',
    'min-h-[40px]': deviceType === 'tablet',
    'active:scale-95': true,
    'transition-transform': true,
    'duration-150': true,
    'touch-manipulation': true
  } : {};

  return (
    <Button
      {...props}
      className={cn(
        touchOptimizedClasses,
        className
      )}
      onClick={handleClick}
      style={{
        WebkitTapHighlightColor: 'transparent',
        ...props.style
      }}
    >
      {children}
    </Button>
  );
};
