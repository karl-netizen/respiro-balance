
import { useState, useEffect } from "react";
import { MorningRitual } from "@/context/types";
import { toast } from "sonner";
import { shouldDoRitualToday, wasCompletedToday } from "../utils";

export interface UseRitualItemProps {
  ritual: MorningRitual;
  onComplete: (ritual: MorningRitual) => void;
  onDelete: (ritual: MorningRitual) => void;
}

export const useRitualItem = ({ ritual, onComplete, onDelete }: UseRitualItemProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isToday, setIsToday] = useState(false);

  // Check if ritual should be completed today
  useEffect(() => {
    setIsToday(shouldDoRitualToday(ritual));
  }, [ritual]);

  const handleComplete = () => {
    if (!isToday && ritual.status !== "completed") {
      toast("Not scheduled for today", {
        description: "This ritual is not scheduled for today based on its recurrence pattern.",
      });
      return;
    }
    
    onComplete(ritual);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this ritual?")) {
      onDelete(ritual);
    }
  };

  const isCompletedToday = ritual.status === "completed" && wasCompletedToday(ritual);

  return {
    editDialogOpen,
    setEditDialogOpen,
    isToday,
    isCompletedToday,
    handleComplete,
    handleDelete
  };
};
