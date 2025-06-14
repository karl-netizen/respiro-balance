
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RitualFormValues } from './types';

interface RitualTimeFieldsProps {
  form: UseFormReturn<RitualFormValues>;
}

const RitualTimeFields: React.FC<RitualTimeFieldsProps> = ({ form }) => {
  const { register, watch, setValue } = form;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="timeOfDay">Time</Label>
        <Input
          id="timeOfDay"
          type="time"
          {...register('timeOfDay')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Select
          value={watch('duration')?.toString()}
          onValueChange={(value) => setValue('duration', Number(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 minutes</SelectItem>
            <SelectItem value="10">10 minutes</SelectItem>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="20">20 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="45">45 minutes</SelectItem>
            <SelectItem value="60">60 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RitualTimeFields;
