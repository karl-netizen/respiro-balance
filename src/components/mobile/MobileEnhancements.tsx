
import React from 'react';
import { cn } from '@/lib/utils';
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

interface TouchOptimizedProps {
  children: React.ReactNode;
  className?: string;
  onTap?: () => void;
  hapticFeedback?: boolean;
  doubleTab?: boolean;
  onDoubleTab?: () => void;
}

export const TouchOptimized: React.FC<TouchOptimizedProps> = ({
  children,
  className,
  onTap,
  hapticFeedback = true,
  doubleTab = false,
  onDoubleTab
}) => {
  const { touchCapable } = useDeviceDetection();
  const [tapCount, setTapCount] = React.useState(0);
  const tapTimeout = React.useRef<NodeJS.Timeout>();

  const handleTouch = () => {
    if (hapticFeedback && touchCapable && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }

    if (doubleTab && onDoubleTab) {
      setTapCount(prev => prev + 1);
      
      if (tapTimeout.current) {
        clearTimeout(tapTimeout.current);
      }

      tapTimeout.current = setTimeout(() => {
        if (tapCount === 0 && onTap) {
          onTap();
        } else if (tapCount === 1 && onDoubleTab) {
          onDoubleTab();
        }
        setTapCount(0);
      }, 300);
    } else if (onTap) {
      onTap();
    }
  };

  React.useEffect(() => {
    return () => {
      if (tapTimeout.current) {
        clearTimeout(tapTimeout.current);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        touchCapable && 'touch-manipulation select-none',
        touchCapable && 'active:scale-95 transition-transform duration-150',
        className
      )}
      onClick={handleTouch}
      style={{
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      {children}
    </div>
  );
};

export const SwipeGesture: React.FC<{
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50
}) => {
  const startX = React.useRef(0);
  const startY = React.useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const deltaX = endX - startX.current;
    const deltaY = endY - startY.current;
    
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > threshold || absY > threshold) {
      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="touch-none"
    >
      {children}
    </div>
  );
};

export const PullToRefresh: React.FC<{
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
}> = ({ children, onRefresh, threshold = 80 }) => {
  const [pullDistance, setPullDistance] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const startY = React.useRef(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startY.current);
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {pullDistance > 0 && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-primary/10 transition-all duration-300"
          style={{ height: pullDistance }}
        >
          {isRefreshing ? (
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
          ) : (
            <div className="text-primary text-sm font-medium">
              {pullDistance >= threshold ? 'Release to refresh' : 'Pull to refresh'}
            </div>
          )}
        </div>
      )}
      <div style={{ transform: `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  );
};
