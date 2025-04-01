
import { UseFormReturn } from "react-hook-form";
import { RitualFormValues } from "../types";
import { WorkDay } from "@/context/types";

export interface UseRitualRecurrenceProps {
  form: UseFormReturn<RitualFormValues>;
}

export const useRitualRecurrence = ({ form }: UseRitualRecurrenceProps) => {
  const recurrence = form.watch("recurrence");
  
  const handleDayToggle = (day: WorkDay, checked: boolean) => {
    const currentDays = form.getValues("daysOfWeek") || [];
    const updatedDays = checked
      ? [...currentDays, day]
      : currentDays.filter(d => d !== day);
    form.setValue("daysOfWeek", updatedDays, { shouldValidate: true });
  };

  const availableDays: WorkDay[] = [
    "monday", "tuesday", "wednesday", 
    "thursday", "friday", "saturday", "sunday"
  ];
  
  return {
    recurrence,
    availableDays,
    handleDayToggle
  };
};
