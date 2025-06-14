
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { RitualStatus } from '@/context/types';

interface RitualStatusBadgeProps {
  status: RitualStatus;
}

const RitualStatusBadge: React.FC<RitualStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: RitualStatus) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', variant: 'default' as const, className: 'bg-green-100 text-green-800' };
      case 'in_progress':
        return { label: 'In Progress', variant: 'default' as const, className: 'bg-blue-100 text-blue-800' };
      case 'skipped':
        return { label: 'Skipped', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' };
      case 'missed':
        return { label: 'Missed', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Planned', variant: 'outline' as const, className: 'bg-orange-100 text-orange-800' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export default RitualStatusBadge;
