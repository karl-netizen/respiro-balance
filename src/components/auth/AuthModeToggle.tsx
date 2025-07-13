import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const AuthModeToggle = () => {
  const currentMode = localStorage.getItem('respiro-auth-mode') || 'demo';
  
  const toggleAuthMode = () => {
    const newMode = currentMode === 'demo' ? 'real' : 'demo';
    localStorage.setItem('respiro-auth-mode', newMode);
    toast.success(`Switched to ${newMode === 'demo' ? 'Demo' : 'Real'} Auth Mode`, {
      description: "Please refresh the page for changes to take effect"
    });
    
    // Auto-refresh after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <Card className="fixed bottom-4 right-4 p-4 bg-background/90 backdrop-blur-sm border shadow-lg z-50">
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <div className="font-medium">Auth Mode</div>
          <div className="text-muted-foreground">
            Current: <span className="font-medium">{currentMode === 'demo' ? 'Demo' : 'Real'}</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAuthMode}
          className="whitespace-nowrap"
        >
          Switch to {currentMode === 'demo' ? 'Real' : 'Demo'}
        </Button>
      </div>
    </Card>
  );
};

export default AuthModeToggle;