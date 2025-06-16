
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface ResponsiveChartProps {
  children: React.ReactElement;
  width?: string | number;
  height?: number;
  className?: string;
  enableTouch?: boolean;
}

export const ResponsiveChart: React.FC<ResponsiveChartProps> = ({
  children,
  width = "100%",
  height = 300,
  className = "",
  enableTouch = true
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile-optimized height
  const responsiveHeight = isMobile ? Math.min(height, 250) : height;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableTouch) return;
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!enableTouch || touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Swipe threshold
    if (Math.abs(diff) > 50) {
      // Emit custom swipe event for parent components to handle
      const swipeEvent = new CustomEvent('chartSwipe', {
        detail: { direction: diff > 0 ? 'left' : 'right' }
      });
      e.currentTarget.dispatchEvent(swipeEvent);
    }
    
    setTouchStart(null);
  };

  return (
    <div 
      className={`w-full touch-manipulation ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ 
        touchAction: enableTouch ? 'pan-x pan-y' : 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <ResponsiveContainer width={width} height={responsiveHeight}>
        {React.cloneElement(children, {
          margin: {
            top: 5,
            right: isMobile ? 5 : 30,
            left: isMobile ? 5 : 20,
            bottom: isMobile ? 20 : 5,
            ...children.props.margin
          }
        })}
      </ResponsiveContainer>
    </div>
  );
};

// Export the recharts components for use in other files
export const ResponsiveXAxis = XAxis;
export const ResponsiveYAxis = YAxis;
export const ResponsiveTooltip = Tooltip;

export default ResponsiveChart;
