
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MorningRitual } from '@/context/types';
import RitualFormContent from './RitualFormContent';
import { useRitualEditForm } from './hooks/useRitualEditForm';

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
  const { form, isSubmitting, handleSubmit } = useRitualEditForm(ritual);

  const onSubmit = (data: any) => {
    const updatedRitual: MorningRitual = {
      ...ritual,
      ...data,
      updatedAt: new Date()
    };
    onSave(updatedRitual);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Ritual</DialogTitle>
        </DialogHeader>
        
        <RitualFormContent
          form={form}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
          submitLabel="Update Ritual"
        />
      </DialogContent>
    </Dialog>
  );
};

export default RitualEditDialog;
