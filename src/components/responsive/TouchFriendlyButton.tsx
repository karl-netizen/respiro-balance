
import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

interface TouchFriendlyButtonProps extends ButtonProps {
  hapticFeedback?: boolean;
  minTouchTarget?: number;
  rippleEffect?: boolean;
}

export const TouchFriendlyButton: React.FC<TouchFriendlyButtonProps> = ({
  children,
  className,
  hapticFeedback = true,
  minTouchTarget = 44,
  rippleEffect = true,
  onClick,
  ...props
}) => {
  const { vibrate, isMobile } = useMobileFeatures();
  const { touchCapable } = useDeviceDetection();
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (touchCapable) {
      setIsPressed(true);
      if (hapticFeedback) {
        vibrate(10);
      }
      
      if (rippleEffect) {
        const rect = e.currentTarget.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        const newRipple = { id: Date.now(), x, y };
        setRipples(prev => [...prev, newRipple]);
        
        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchCapable) {
      setIsPressed(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      className={cn(
        'relative overflow-hidden transition-all duration-150 ease-out',
        touchCapable && 'touch-manipulation select-none',
        touchCapable && isPressed && 'scale-95',
        className
      )}
      style={{
        minHeight: touchCapable ? `${minTouchTarget}px` : undefined,
        minWidth: touchCapable ? `${minTouchTarget}px` : undefined,
        WebkitTapHighlightColor: 'transparent',
      }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      {...props}
    >
      {children}
      
      {/* Ripple effects */}
      {rippleEffect && ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
    </Button>
  );
};
