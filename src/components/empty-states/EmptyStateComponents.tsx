
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {icon && (
          <div className="mb-4 text-muted-foreground">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export const NoDataEmpty: React.FC<{
  title?: string;
  description?: string;
  action?: EmptyStateProps['action'];
}> = ({
  title = "Your journey starts here",
  description = "Complete your first activity to see your progress and insights appear here.",
  action
}) => (
  <EmptyState
    icon={<div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-3xl">📊</div>}
    title={title}
    description={description}
    action={action}
  />
);

export const NoDevicesEmpty: React.FC<{
  onScanDevices?: () => void;
}> = ({ onScanDevices }) => (
  <EmptyState
    icon={<div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center text-3xl">📱</div>}
    title="Ready to connect"
    description="Connect a biofeedback device to track heart rate, HRV, and other health metrics during your sessions."
    action={onScanDevices ? {
      label: "Scan for Devices",
      onClick: onScanDevices
    } : undefined}
  />
);

export const NoSessionsEmpty: React.FC<{
  onStartSession?: () => void;
}> = ({ onStartSession }) => (
  <EmptyState
    icon={<div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center text-3xl">🧘</div>}
    title="Begin your practice"
    description="Take a moment for yourself. Choose a meditation session below to start your mindfulness journey."
    action={onStartSession ? {
      label: "Browse Sessions",
      onClick: onStartSession
    } : undefined}
  />
);
