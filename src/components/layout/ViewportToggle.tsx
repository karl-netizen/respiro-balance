
import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ViewportToggle: React.FC = () => {
  const [isMobileView, setIsMobileView] = useState(false);

  // Check if actually on mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      return window.innerWidth <= 768;
    };
    
    const handleResize = () => {
      const isActuallyMobile = checkIfMobile();
      document.body.classList.toggle('mobile-view', isActuallyMobile);
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleViewport = () => {
    setIsMobileView(!isMobileView);
    
    if (!isMobileView) {
      // Switch to mobile view
      document.body.classList.add('mobile-preview-mode', 'mobile-view');
    } else {
      // Switch to desktop view
      document.body.classList.remove('mobile-preview-mode', 'mobile-view');
    }
    
    // Dispatch a custom event to notify other components about the viewport change
    const event = new CustomEvent('viewport-change', { 
      detail: { isMobile: !isMobileView } 
    });
    window.dispatchEvent(event);
  };

  return (
    <Button 
      variant="secondary" 
      size="icon" 
      onClick={toggleViewport}
      className="fixed bottom-4 right-4 z-50 shadow-md"
      aria-label={isMobileView ? "Switch to Desktop View" : "Switch to Mobile View"}
    >
      {isMobileView ? <Monitor className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
    </Button>
  );
};

export default ViewportToggle;
