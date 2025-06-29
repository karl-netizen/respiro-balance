
import { useRef, useEffect } from 'react';

interface UseMobileGesturesProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  enabled?: boolean;
}

export const useMobileGestures = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  enabled = true
}: UseMobileGesturesProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches.length) return;

      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const endTime = Date.now();

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;

      // Detect tap (short duration, minimal movement)
      if (deltaTime < 200 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        onTap?.();
        return;
      }

      // Detect swipes (minimum distance and reasonable speed)
      const minSwipeDistance = 50;
      const maxSwipeTime = 1000;

      if (deltaTime > maxSwipeTime) return;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap]);

  return elementRef;
};
