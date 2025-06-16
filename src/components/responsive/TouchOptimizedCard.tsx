
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface TouchOptimizedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  minTouchTarget?: boolean;
  hapticFeedback?: boolean;
  spacing?: 'compact' | 'normal' | 'relaxed';
  ripple?: boolean;
}

export const TouchOptimizedCard: React.FC<TouchOptimizedCardProps> = ({
  children,
  className,
  minTouchTarget = true,
  hapticFeedback = true,
  spacing = 'normal',
  ripple = true,
  onClick,
  ...props
}) => {
  const { deviceType, touchCapable } = useDeviceDetection();
  const [isPressed, setIsPressed] = React.useState(false);

  const getTouchOptimizedClasses = () => {
    if (!touchCapable) return 'p-4';

    const spacingMap = {
      compact: {
        mobile: minTouchTarget ? 'min-h-[48px] p-3' : 'p-2',
        tablet: minTouchTarget ? 'min-h-[44px] p-4' : 'p-3',
        desktop: 'p-3',
      },
      normal: {
        mobile: minTouchTarget ? 'min-h-[48px] p-4' : 'p-3',
        tablet: minTouchTarget ? 'min-h-[44px] p-5' : 'p-4',
        desktop: 'p-4',
      },
      relaxed: {
        mobile: minTouchTarget ? 'min-h-[52px] p-5' : 'p-4',
        tablet: minTouchTarget ? 'min-h-[48px] p-6' : 'p-5',
        desktop: 'p-5',
      },
    };

    return spacingMap[spacing][deviceType];
  };

  const handleTouchStart = () => {
    if (touchCapable && onClick) {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = () => {
    if (touchCapable) {
      setIsPressed(false);
    }
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
        'transition-all duration-200 ease-in-out relative overflow-hidden',
        'border-respiro-default/20 bg-white/60 backdrop-blur-sm',
        touchCapable && 'touch-manipulation',
        touchCapable && onClick && isPressed && 'scale-95 shadow-sm',
        onClick && 'cursor-pointer hover:shadow-md hover:shadow-respiro-default/20 hover:border-respiro-default/40',
        onClick && 'focus-visible:ring-2 focus-visible:ring-respiro-default focus-visible:ring-offset-2',
        // Ensure adequate spacing between cards
        deviceType === 'mobile' && 'mb-3',
        className
      )}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      {...props}
    >
      {children}
      {ripple && touchCapable && isPressed && onClick && (
        <div className="absolute inset-0 bg-respiro-default/10 animate-ping rounded-lg" />
      )}
    </Card>
  );
};
