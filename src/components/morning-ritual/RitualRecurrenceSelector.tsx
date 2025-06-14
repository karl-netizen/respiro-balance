
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RitualFormValues } from './types';

interface RitualRecurrenceSelectorProps {
  form: UseFormReturn<RitualFormValues>;
}

const RitualRecurrenceSelector: React.FC<RitualRecurrenceSelectorProps> = ({ form }) => {
  const { watch, setValue } = form;

  return (
    <div className="space-y-2">
      <Label htmlFor="recurrence">Frequency</Label>
      <Select
        value={watch('recurrence')}
        onValueChange={(value) => setValue('recurrence', value as any)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="weekdays">Weekdays</SelectItem>
          <SelectItem value="weekends">Weekends</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RitualRecurrenceSelector;
