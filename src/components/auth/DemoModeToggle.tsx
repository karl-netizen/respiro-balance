import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Zap, User } from 'lucide-react';
import { useDemoMode } from '@/hooks/useDemoMode';
import { toast } from 'sonner';

const DemoModeToggle = () => {
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  const handleToggle = () => {
    const newMode = isDemoMode ? 'Live' : 'Demo';
    toast.success(`Switching to ${newMode} Mode`, {
      description: "Page will refresh automatically",
      duration: 2000
    });
    
    setTimeout(() => {
      toggleDemoMode();
    }, 500);
  };

  return (
    <Card className="p-4 border-2 border-dashed border-primary/30 bg-primary/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isDemoMode ? (
              <Zap className="h-5 w-5 text-amber-500" />
            ) : (
              <User className="h-5 w-5 text-blue-500" />
            )}
            <div>
              <div className="font-semibold text-sm">Authentication Mode</div>
              <div className="text-xs text-muted-foreground">
                {isDemoMode ? 'Demo mode with sample data' : 'Live mode with real authentication'}
              </div>
            </div>
          </div>
          
          <Badge 
            variant={isDemoMode ? "secondary" : "default"} 
            className={isDemoMode ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}
          >
            {isDemoMode ? 'DEMO' : 'LIVE'}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-right">
            <div className="font-medium">{isDemoMode ? 'Demo' : 'Live'}</div>
            <div className="text-muted-foreground">
              {isDemoMode ? 'Sample data' : 'Real users'}
            </div>
          </div>
          
          <Switch
            checked={!isDemoMode} // Switch is ON for Live mode
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-blue-500"
          />
        </div>
      </div>
      
      {isDemoMode && (
        <div className="mt-3 p-2 rounded bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-2 text-xs text-amber-800">
            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Demo Mode:</strong> Instant access with premium features, sample meditation history, 
              7-day streak, and rich analytics. Perfect for testing and presentations.
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DemoModeToggle;