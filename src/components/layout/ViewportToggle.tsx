
import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ViewportToggle: React.FC = () => {
  const [isMobileView, setIsMobileView] = useState(false);

  const toggleViewport = () => {
    setIsMobileView(!isMobileView);
    
    // Dispatch a custom event to notify other components about the viewport change
    const event = new CustomEvent('viewport-change', { 
      detail: { isMobile: !isMobileView } 
    });
    window.dispatchEvent(event);
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleViewport}
      className="fixed bottom-4 right-4 z-50"
      aria-label={isMobileView ? "Switch to Desktop View" : "Switch to Mobile View"}
    >
      {isMobileView ? <Monitor className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
    </Button>
  );
};

export default ViewportToggle;
