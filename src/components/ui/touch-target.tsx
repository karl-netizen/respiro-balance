
import * as React from "react"
import { cn } from "@/lib/utils"
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

interface TouchTargetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  minSize?: number;
  hapticFeedback?: boolean;
  ripple?: boolean;
}

export const TouchTarget = React.forwardRef<HTMLDivElement, TouchTargetProps>(
  ({ 
    children, 
    className, 
    minSize = 44, 
    hapticFeedback = true, 
    ripple = true,
    onClick,
    ...props 
  }, ref) => {
    const { touchCapable } = useDeviceDetection();
    const [isPressed, setIsPressed] = React.useState(false);

    const handleTouchStart = () => {
      if (touchCapable) {
        setIsPressed(true);
        if (hapticFeedback && 'vibrate' in navigator) {
          navigator.vibrate(10);
        }
      }
    };

    const handleTouchEnd = () => {
      if (touchCapable) {
        setIsPressed(false);
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center relative cursor-pointer select-none transition-all duration-150 ease-out",
          touchCapable && "touch-manipulation",
          touchCapable && isPressed && "scale-95",
          ripple && touchCapable && "overflow-hidden",
          className
        )}
        style={{
          minHeight: touchCapable ? `${minSize}px` : undefined,
          minWidth: touchCapable ? `${minSize}px` : undefined,
        }}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {children}
        {ripple && touchCapable && isPressed && (
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
        )}
      </div>
    );
  }
);

TouchTarget.displayName = "TouchTarget";
