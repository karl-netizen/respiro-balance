
import React from "react";
import { MorningRitual } from "@/context/types";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import RitualEditDialog from "./RitualEditDialog";
import RitualStatusIcon from "./RitualStatusIcon";
import RitualStatusBadge from "./RitualStatusBadge";
import RitualMetadata from "./RitualMetadata";
import RitualActions from "./RitualActions";
import { useRitualItem } from "./hooks/useRitualItem";

interface RitualTimelineItemProps {
  ritual: MorningRitual;
  onComplete: (ritualId: string) => void;
  onDelete: (ritualId: string) => void;
  onUpdate: (updatedRitual: MorningRitual) => void;
}

const RitualTimelineItem: React.FC<RitualTimelineItemProps> = ({ 
  ritual, 
  onComplete, 
  onDelete,
  onUpdate
}) => {
  const {
    editDialogOpen,
    setEditDialogOpen,
    isToday,
    isCompletedToday,
    handleComplete,
    handleDelete
  } = useRitualItem({ ritual, onComplete, onDelete });

  return (
    <>
      <div className="flex gap-4">
        <div className="mt-1.5">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isCompletedToday ? "bg-green-100" : 
            ritual.status === "missed" ? "bg-red-100" :
            "bg-primary/10"
          }`}>
            <RitualStatusIcon status={ritual.status} />
          </div>
        </div>
        
        <Card className={`flex-1 shadow-sm hover:shadow transition-shadow ${
          isCompletedToday ? "border-green-200" : 
          ritual.status === "missed" ? "border-red-200" : ""
        }`}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{ritual.title}</CardTitle>
                <CardDescription>{ritual.description || "No description"}</CardDescription>
              </div>
              <div>
                <RitualStatusBadge status={ritual.status} />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pb-3">
            <RitualMetadata 
              ritual={ritual}
              isToday={isToday}
              isCompletedToday={isCompletedToday}
            />
          </CardContent>
          
          <CardFooter>
            <RitualActions 
              isCompletedToday={isCompletedToday}
              onComplete={handleComplete}
              onEdit={() => setEditDialogOpen(true)}
              onDelete={handleDelete}
            />
          </CardFooter>
        </Card>
      </div>

      <RitualEditDialog 
        ritual={ritual}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={onUpdate}
      />
    </>
  );
};

export default RitualTimelineItem;
