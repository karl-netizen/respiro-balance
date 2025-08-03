import { useState, useCallback } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

export const useMobileGestures = (handlers: SwipeHandlers, minSwipeDistance = 50) => {
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touchStart.x - touch.clientX;
    const deltaY = touchStart.y - touch.clientY;
    const deltaTime = Date.now() - touchStart.time;

    // Only consider fast swipes (under 300ms)
    if (deltaTime > 300) {
      setTouchStart(null);
      return;
    }

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Horizontal swipes
    if (absX > absY && absX > minSwipeDistance) {
      if (deltaX > 0) {
        handlers.onSwipeLeft?.();
      } else {
        handlers.onSwipeRight?.();
      }
    }
    // Vertical swipes
    else if (absY > minSwipeDistance) {
      if (deltaY > 0) {
        handlers.onSwipeUp?.();
      } else {
        handlers.onSwipeDown?.();
      }
    }

    setTouchStart(null);
  }, [touchStart, handlers, minSwipeDistance]);

  const triggerHapticFeedback = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const duration = intensity === 'light' ? 10 : intensity === 'medium' ? 20 : 50;
      navigator.vibrate(duration);
    }
  }, []);

  return {
    handleTouchStart,
    handleTouchEnd,
    triggerHapticFeedback
  };
};