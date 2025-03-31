
import React from "react";

interface RitualTimelineHeaderProps {
  ritualCount: number;
}

const RitualTimelineHeader: React.FC<RitualTimelineHeaderProps> = ({ ritualCount }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">Your Morning Timeline</h2>
      <p className="text-sm text-muted-foreground">
        {ritualCount} {ritualCount === 1 ? 'ritual' : 'rituals'}
      </p>
    </div>
  );
};

export default RitualTimelineHeader;
