
import React from 'react';

interface ChartSummaryProps {
  average: number;
  totalMinutes: number;
}

export const ChartSummary: React.FC<ChartSummaryProps> = ({ average, totalMinutes }) => {
  return (
    <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center text-xs text-muted-foreground mt-3 space-y-1 xs:space-y-0 gap-2">
      <span className="flex-shrink-0">
        Avg: {average.toFixed(1)} min/day
      </span>
      <span className="flex-shrink-0">
        Total: {totalMinutes} minutes
      </span>
    </div>
  );
};
