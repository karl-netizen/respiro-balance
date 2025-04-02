
import React from "react";
import { MorningRitual } from "@/context/types";
import RitualTimelineItem from "./RitualTimelineItem";

interface RitualTimelineListProps {
  rituals: MorningRitual[];
  onComplete: (ritualId: string) => void;
  onDelete: (ritualId: string) => void;
  onUpdate: (updatedRitual: MorningRitual) => void;
  isLoading?: boolean;
}

const RitualTimelineList: React.FC<RitualTimelineListProps> = ({
  rituals,
  onComplete,
  onDelete,
  onUpdate,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="relative">
        <div className="absolute left-[19px] top-6 bottom-10 w-[2px] bg-slate-200 z-0"></div>
        <div className="space-y-6 relative z-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-start">
              <div className="h-10 w-10 rounded-full bg-slate-200"></div>
              <div className="ml-4 flex-1">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
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
