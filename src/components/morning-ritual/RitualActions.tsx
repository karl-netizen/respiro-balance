
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface RitualActionsProps {
  isCompletedToday: boolean;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const RitualActions: React.FC<RitualActionsProps> = ({ 
  isCompletedToday, 
  onComplete, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="flex justify-between w-full">
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline"
          onClick={onComplete}
          className={isCompletedToday ? "bg-green-50" : ""}
        >
          {isCompletedToday ? "Undo Complete" : "Mark Complete"}
        </Button>
      </div>
      <div className="flex gap-2">
        <Button 
          size="icon" 
          variant="ghost"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button 
          size="icon" 
          variant="ghost" 
          className="text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RitualActions;
