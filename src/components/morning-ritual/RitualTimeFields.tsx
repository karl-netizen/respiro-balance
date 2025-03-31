
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { RitualFormValues } from "./types";

interface RitualTimeFieldsProps {
  form: UseFormReturn<RitualFormValues>;
}

const RitualTimeFields = ({ form }: RitualTimeFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="timeOfDay"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Time of Day</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                <Input type="time" {...field} />
              </div>
            </FormControl>
            <FormDescription>
              When will you start this ritual?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration (minutes)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={1} 
                max={120}
                {...field}
                onChange={e => field.onChange(Number(e.target.value))} 
              />
            </FormControl>
            <FormDescription>
              How long will this ritual take?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RitualTimeFields;
