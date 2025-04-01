
import React from "react";
import { MorningRitual } from "@/context/types";
import RitualTimelineItem from "./RitualTimelineItem";

interface RitualTimelineListProps {
  rituals: MorningRitual[];
  onComplete: (ritualId: string) => void;
  onDelete: (ritualId: string) => void;
  onUpdate: (updatedRitual: MorningRitual) => void;
}

const RitualTimelineList: React.FC<RitualTimelineListProps> = ({
  rituals,
  onComplete,
  onDelete,
  onUpdate
}) => {
  return (
    <div className="relative">
      <div className="absolute left-[19px] top-6 bottom-10 w-[2px] bg-slate-200 z-0"></div>
      
      <div className="space-y-6 relative z-10">
        {rituals.map((ritual) => (
          <RitualTimelineItem
            key={ritual.id}
            ritual={ritual}
            onComplete={onComplete}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default RitualTimelineList;
