
import React, { useEffect, useRef } from 'react';

interface AriaLiveRegionProps {
  message?: string;
  politeness?: 'polite' | 'assertive';
  clearAfter?: number;
  className?: string;
}

export const AriaLiveRegion: React.FC<AriaLiveRegionProps> = ({
  message = '',
  politeness = 'polite',
  clearAfter = 5000,
  className = 'sr-only'
}) => {
  const [currentMessage, setCurrentMessage] = React.useState(message);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      
      if (clearAfter > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(() => {
          setCurrentMessage('');
        }, clearAfter);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, clearAfter]);

  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className={className}
      role="status"
    >
      {currentMessage}
    </div>
  );
};

export default AriaLiveRegion;
