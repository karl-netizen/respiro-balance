import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface LoadingMonitorProps {
  threshold?: number; // milliseconds
}

export const LoadingMonitor: React.FC<LoadingMonitorProps> = ({ threshold = 3000 }) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    
    const checkLoadingTime = () => {
      const loadTime = performance.now() - startTime;
      if (loadTime > threshold) {
        setShowAlert(true);
        console.warn(`⚠️ Slow loading detected: ${Math.round(loadTime)}ms`);
      }
    };

    // Check after the threshold
    const timer = setTimeout(checkLoadingTime, threshold);

    // Hide alert after 5 seconds
    const hideTimer = setTimeout(() => {
      setShowAlert(false);
    }, threshold + 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [threshold]);

  if (!showAlert) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Slow loading detected. Optimizing...
        </AlertDescription>
      </Alert>
    </div>
  );
};