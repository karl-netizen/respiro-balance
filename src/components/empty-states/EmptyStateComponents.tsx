
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
  title = "No data available",
  description = "There's no data to display yet. Start using the app to see your progress here.",
  action
}) => (
  <EmptyState
    icon={<div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">📊</div>}
    title={title}
    description={description}
    action={action}
  />
);

export const NoDevicesEmpty: React.FC<{
  onScanDevices?: () => void;
}> = ({ onScanDevices }) => (
  <EmptyState
    icon={<div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">📱</div>}
    title="No devices found"
    description="Connect a biofeedback device to start monitoring your health metrics in real-time."
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
    icon={<div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">🧘</div>}
    title="No meditation sessions yet"
    description="Start your mindfulness journey by beginning your first meditation session."
    action={onStartSession ? {
      label: "Start Meditating",
      onClick: onStartSession
    } : undefined}
  />
);
