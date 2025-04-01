
import { useState, useEffect } from "react";
import { MorningRitual } from "@/context/types";
import { useToast } from "@/hooks/use-toast";
import { shouldDoRitualToday, wasCompletedToday } from "../utils";

export interface UseRitualItemProps {
  ritual: MorningRitual;
  onComplete: (ritualId: string) => void;
  onDelete: (ritualId: string) => void;
}

export const useRitualItem = ({ ritual, onComplete, onDelete }: UseRitualItemProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isToday, setIsToday] = useState(false);
  const { toast } = useToast();

  // Check if ritual should be completed today
  useEffect(() => {
    setIsToday(shouldDoRitualToday(ritual.recurrence, ritual.daysOfWeek));
  }, [ritual]);

  const handleComplete = () => {
    if (!isToday && ritual.status !== "completed") {
      toast({
        title: "Not scheduled for today",
        description: "This ritual is not scheduled for today based on its recurrence pattern.",
        variant: "default"
      });
      return;
    }
    
    onComplete(ritual.id);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this ritual?")) {
      onDelete(ritual.id);
    }
  };

  const isCompletedToday = ritual.status === "completed" && wasCompletedToday(ritual.lastCompleted);

  return {
    editDialogOpen,
    setEditDialogOpen,
    isToday,
    isCompletedToday,
    handleComplete,
    handleDelete
  };
};
