
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { RitualFormValues } from "./types";
import { WorkDay } from "@/context/types";
import { useRitualRecurrence } from "./hooks/useRitualRecurrence";

interface RitualRecurrenceSelectorProps {
  form: UseFormReturn<RitualFormValues>;
}

const RitualRecurrenceSelector = ({ form }: RitualRecurrenceSelectorProps) => {
  const { recurrence, availableDays, handleDayToggle } = useRitualRecurrence({ form });
  
  return (
    <div>
      <FormField
        control={form.control}
        name="recurrence"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recurrence</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="r-daily" />
                  <Label htmlFor="r-daily">Daily</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekdays" id="r-weekdays" />
                  <Label htmlFor="r-weekdays">Weekdays (Mon-Fri)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekends" id="r-weekends" />
                  <Label htmlFor="r-weekends">Weekends (Sat-Sun)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="r-custom" />
                  <Label htmlFor="r-custom">Custom</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {recurrence === "custom" && (
        <FormField
          control={form.control}
          name="daysOfWeek"
          render={({ field }) => (
            <FormItem className="mt-4 ml-7">
              <FormLabel>Select Days</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2">
                  {availableDays.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`day-${day}`}
                        checked={field.value?.includes(day)}
                        onCheckedChange={(checked) => {
                          handleDayToggle(day, checked === true);
                        }}
                      />
                      <label
                        htmlFor={`day-${day}`}
                        className="text-sm capitalize"
                      >
                        {day.substring(0, 3)}
                      </label>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default RitualRecurrenceSelector;
