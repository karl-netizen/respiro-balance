
import React from "react";
import { useUserPreferences } from "@/context";
import { RitualStatus } from "@/context/types";
import RitualTimelineItem from "./RitualTimelineItem";
import EmptyRitualState from "./EmptyRitualState";
import RitualTimelineHeader from "./RitualTimelineHeader";
import { useToast } from "@/hooks/use-toast";

const RitualTimeline = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const rituals = preferences.morningRituals || [];
  
  const sortedRituals = [...rituals].sort((a, b) => {
    const timeA = a.timeOfDay.split(':').map(Number);
    const timeB = b.timeOfDay.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });
  
  const completeRitual = (ritualId: string) => {
    const updatedRituals = rituals.map(ritual => {
      if (ritual.id === ritualId) {
        const wasCompleted = ritual.status === "completed";
        return { 
          ...ritual, 
          status: wasCompleted ? "planned" as RitualStatus : "completed" as RitualStatus,
          lastCompleted: wasCompleted ? undefined : new Date().toISOString(),
          streak: wasCompleted ? ritual.streak - 1 : ritual.streak + 1
        };
      }
      return ritual;
    });
    
    updatePreferences({ morningRituals: updatedRituals });
    toast({
      title: "Ritual updated",
      description: "Your morning ritual status has been updated",
    });
  };
  
  const deleteRitual = (ritualId: string) => {
    const updatedRituals = rituals.filter(ritual => ritual.id !== ritualId);
    updatePreferences({ morningRituals: updatedRituals });
    toast({
      title: "Ritual deleted",
      description: "Your morning ritual has been removed",
    });
  };
  
  if (rituals.length === 0) {
    return <EmptyRitualState />;
  }

  return (
    <div className="space-y-8">
      <RitualTimelineHeader ritualCount={rituals.length} />
      
      <div className="relative">
        <div className="absolute left-[19px] top-6 bottom-10 w-[2px] bg-slate-200 z-0"></div>
        
        <div className="space-y-6 relative z-10">
          {sortedRituals.map((ritual) => (
            <RitualTimelineItem
              key={ritual.id}
              ritual={ritual}
              onComplete={completeRitual}
              onDelete={deleteRitual}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RitualTimeline;
