
import React from 'react';
import { CheckCircle, Clock, AlertCircle, Play, X } from 'lucide-react';
import { RitualStatus } from '@/context/types';

interface RitualStatusIconProps {
  status: RitualStatus;
  className?: string;
}

const RitualStatusIcon: React.FC<RitualStatusIconProps> = ({ status, className = "h-5 w-5" }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className={`${className} text-green-500`} />;
    case 'in_progress':
      return <Play className={`${className} text-blue-500`} />;
    case 'skipped':
      return <X className={`${className} text-gray-500`} />;
    case 'missed':
      return <AlertCircle className={`${className} text-red-500`} />;
    default:
      return <Clock className={`${className} text-orange-500`} />;
  }
};

export default RitualStatusIcon;
