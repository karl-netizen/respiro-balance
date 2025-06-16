
import { useEffect, useRef, useState } from 'react';

interface UseMobileGesturesProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  enabled?: boolean;
}

export const useMobileGestures = ({
  onSwipeLeft,
  onSwipeRight,
  onTap,
  onDoubleTap,
  enabled = true
}: UseMobileGesturesProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [lastTap, setLastTap] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setStartX(touch.clientX);
      setStartY(touch.clientY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches) return;
      
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);
      
      // Minimum swipe distance
      const minSwipeDistance = 50;
      
      // Check for swipe gestures
      if (absDeltaX > minSwipeDistance && absDeltaX > absDeltaY) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
        return;
      }
      
      // Check for tap gestures
      if (absDeltaX < 10 && absDeltaY < 10) {
        const currentTime = Date.now();
        const timeSinceLastTap = currentTime - lastTap;
        
        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
          // Double tap
          onDoubleTap?.();
        } else {
          // Single tap
          setTimeout(() => {
            if (Date.now() - currentTime >= 300) {
              onTap?.();
            }
          }, 300);
        }
        
        setLastTap(currentTime);
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startX, startY, lastTap, onSwipeLeft, onSwipeRight, onTap, onDoubleTap, enabled]);

  return elementRef;
};
