
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RitualFormValues, RitualPriority } from './types';

interface RitualPrioritySelectorProps {
  form: UseFormReturn<RitualFormValues>;
}

const RitualPrioritySelector: React.FC<RitualPrioritySelectorProps> = ({ form }) => {
  const { watch, setValue } = form;

  return (
    <div className="space-y-2">
      <Label htmlFor="priority">Priority</Label>
      <Select
        value={watch('priority')}
        onValueChange={(value: RitualPriority) => setValue('priority', value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RitualPrioritySelector;
