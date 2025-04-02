
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { RitualFormValues } from "./types";
import { RitualPriority } from "@/context/types";

interface RitualPrioritySelectorProps {
  form: UseFormReturn<RitualFormValues>;
}

const RitualPrioritySelector: React.FC<RitualPrioritySelectorProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="priority"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Priority</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => field.onChange(value as RitualPriority)}
              value={field.value || "medium"}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="priority-low" />
                <Label htmlFor="priority-low">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="priority-medium" />
                <Label htmlFor="priority-medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="priority-high" />
                <Label htmlFor="priority-high">High</Label>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default RitualPrioritySelector;
