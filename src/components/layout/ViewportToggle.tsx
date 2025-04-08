
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor } from "lucide-react";
import { toast } from 'sonner';

export const ViewportToggle = () => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  // Apply viewport meta tag changes based on selected mode
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    
    if (viewport) {
      if (viewMode === 'mobile') {
        viewport.setAttribute('content', 'width=375, initial-scale=1');
        document.body.classList.add('mobile-preview-mode');
        toast({ description: "Mobile preview enabled" });
      } else {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1');
        document.body.classList.remove('mobile-preview-mode');
        toast({ description: "Desktop view enabled" });
      }
    }
    
    return () => {
      // Reset on unmount
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1');
      }
      document.body.classList.remove('mobile-preview-mode');
    };
  }, [viewMode]);
  
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'desktop' ? 'mobile' : 'desktop');
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleViewMode}
        className="bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
      >
        {viewMode === 'desktop' ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default ViewportToggle;
