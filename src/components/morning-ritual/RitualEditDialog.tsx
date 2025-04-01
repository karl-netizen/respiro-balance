
import React from "react";
import { MorningRitual } from "@/context/types";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRitualEditForm } from "./hooks/useRitualEditForm";
import RitualEditFormContent from "./RitualEditFormContent";

interface RitualEditDialogProps {
  ritual: MorningRitual;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedRitual: MorningRitual) => void;
}

const RitualEditDialog: React.FC<RitualEditDialogProps> = ({
  ritual,
  open,
  onOpenChange,
  onSave
}) => {
  const formProps = useRitualEditForm({ ritual, onSave, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Morning Ritual</DialogTitle>
          <DialogDescription>
            Update your morning ritual to better fit your routine.
          </DialogDescription>
        </DialogHeader>
        
        <RitualEditFormContent 
          {...formProps}
          onOpenChange={onOpenChange} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default RitualEditDialog;
