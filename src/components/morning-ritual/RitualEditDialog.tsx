
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MorningRitual } from '@/context/types';
import RitualFormContent from './RitualFormContent';
import { useRitualEditForm } from './hooks/useRitualEditForm';
import { RitualFormValues } from './types';

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
  const { form, isSubmitting } = useRitualEditForm(ritual);

  const handleSubmit = (data: RitualFormValues) => {
    const reminders = data.reminders.map(r => ({
      enabled: r.enabled ?? true,
      time: r.time ?? 15,
      message: r.message
    }));

    const updatedRitual: MorningRitual = {
      ...ritual,
      title: data.title,
      description: data.description || '',
      timeOfDay: data.timeOfDay,
      startTime: data.timeOfDay,
      duration: data.duration,
      priority: data.priority,
      recurrence: data.recurrence,
      tags: data.tags,
      daysOfWeek: data.daysOfWeek,
      reminders: reminders,
      complete: false,
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
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Update Ritual"
        />
      </DialogContent>
    </Dialog>
  );
};

export default RitualEditDialog;
