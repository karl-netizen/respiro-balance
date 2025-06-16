
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bluetooth, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConnectionPromptProps {
  isMonitoring: boolean;
}

export const ConnectionPrompt: React.FC<ConnectionPromptProps> = ({ isMonitoring }) => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Bluetooth className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Device Connected</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          Connect a compatible heart rate monitor or use your smartphone camera for basic biometric tracking.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Smartphone className="h-4 w-4 mr-2" />
            Use Camera
          </Button>
          <Button size="sm">
            <Bluetooth className="h-4 w-4 mr-2" />
            Scan Devices
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
