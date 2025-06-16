
import React from 'react';
import { TouchFriendlyButton } from "@/components/responsive/TouchFriendlyButton";
import { Calendar } from "lucide-react";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

interface ChartControlsProps {
  view: 'daily' | 'weekly';
  onViewChange: (view: 'daily' | 'weekly') => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({ view, onViewChange }) => {
  const { deviceType } = useDeviceDetection();

  return (
    <div className="flex gap-1 shrink-0">
      <TouchFriendlyButton
        variant={view === 'daily' ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange('daily')}
        className="h-7 px-2 text-xs sm:h-8 sm:px-3 sm:text-sm min-w-0"
        hapticFeedback={true}
      >
        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        <span className="hidden xs:inline">Daily</span>
        <span className="xs:hidden">D</span>
      </TouchFriendlyButton>
      <TouchFriendlyButton
        variant={view === 'weekly' ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange('weekly')}
        className="h-7 px-2 text-xs sm:h-8 sm:px-3 sm:text-sm min-w-0"
        hapticFeedback={true}
      >
        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        <span className="hidden xs:inline">Weekly</span>
        <span className="xs:hidden">W</span>
      </TouchFriendlyButton>
    </div>
  );
};
