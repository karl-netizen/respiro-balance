
import React from "react";
import { MorningRitual } from "@/context/types";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Trophy } from "lucide-react";
import { formatTimeDisplay } from "./utils";

interface RitualMetadataProps {
  ritual: MorningRitual;
  isToday: boolean;
  isCompletedToday: boolean;
}

const RitualMetadata: React.FC<RitualMetadataProps> = ({ ritual, isToday, isCompletedToday }) => {
  const getRecurrenceText = (ritual: MorningRitual) => {
    switch (ritual.recurrence) {
      case "daily":
        return "Every day";
      case "weekdays":
        return "Monday-Friday";
      case "weekends":
        return "Saturday-Sunday";
      case "custom":
        return ritual.daysOfWeek?.map(day => day.slice(0, 3)).join(', ') || "Custom";
      default:
        return "Custom";
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{formatTimeDisplay(ritual.timeOfDay)} • {ritual.duration} min</span>
        </div>
        
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{getRecurrenceText(ritual)}</span>
          {isToday && !isCompletedToday && (
            <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200">Today</Badge>
          )}
        </div>
        
        <div className="flex items-center">
          <Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">{ritual.streak} day streak</span>
        </div>
      </div>
      
      {ritual.tags && ritual.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ritual.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default RitualMetadata;
