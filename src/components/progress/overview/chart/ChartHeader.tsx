
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartControls } from './ChartControls';

interface ChartHeaderProps {
  view: 'daily' | 'weekly';
  onViewChange: (view: 'daily' | 'weekly') => void;
}

export const ChartHeader: React.FC<ChartHeaderProps> = ({ view, onViewChange }) => {
  return (
    <CardHeader className="flex flex-col space-y-3 pb-2 px-3 sm:px-6 pt-4 sm:pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base sm:text-lg lg:text-xl truncate">
            Meditation Activity
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            Your meditation minutes over time
          </CardDescription>
        </div>
        
        <ChartControls view={view} onViewChange={onViewChange} />
      </div>
    </CardHeader>
  );
};
