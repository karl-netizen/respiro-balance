
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RitualFormValues } from './types';
import RitualPrioritySelector from './RitualPrioritySelector';
import RitualRecurrenceSelector from './RitualRecurrenceSelector';
import RitualTagSelector from './RitualTagSelector';
import RitualTimeFields from './RitualTimeFields';

interface RitualFormContentProps {
  form: UseFormReturn<RitualFormValues>;
  onSubmit: (data: RitualFormValues) => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

const RitualFormContent: React.FC<RitualFormContentProps> = ({
  form,
  onSubmit,
  isSubmitting,
  submitLabel = "Create Ritual"
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = form;

  const reminders = watch('reminders') || [];

  const addReminder = () => {
    const newReminder = {
      enabled: true,
      time: 15,
      message: ""
    };
    setValue('reminders', [...reminders, newReminder]);
  };

  const removeReminder = (index: number) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    setValue('reminders', updatedReminders);
  };

  const updateReminder = (index: number, field: string, value: any) => {
    const updatedReminders = reminders.map((reminder, i) => 
      i === index ? { ...reminder, [field]: value } : reminder
    );
    setValue('reminders', updatedReminders);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Enter ritual title"
            className="mt-1"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Describe your ritual"
            className="mt-1"
          />
        </div>

        <RitualTimeFields form={form} />
        <RitualPrioritySelector form={form} />
        <RitualRecurrenceSelector form={form} />
        <RitualTagSelector form={form} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Reminders</Label>
            <Button type="button" variant="outline" size="sm" onClick={addReminder}>
              Add Reminder
            </Button>
          </div>

          {reminders.map((reminder, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={reminder.enabled}
                    onCheckedChange={(checked) => updateReminder(index, 'enabled', checked)}
                  />
                  <Label>Enable reminder</Label>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeReminder(index)}
                >
                  Remove
                </Button>
              </div>

              {reminder.enabled && (
                <>
                  <div>
                    <Label>Minutes before ritual</Label>
                    <Input
                      type="number"
                      min="1"
                      max="60"
                      value={reminder.time}
                      onChange={(e) => updateReminder(index, 'time', parseInt(e.target.value) || 15)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Custom message (optional)</Label>
                    <Input
                      placeholder="Time for your morning ritual!"
                      value={reminder.message || ''}
                      onChange={(e) => updateReminder(index, 'message', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default RitualFormContent;
