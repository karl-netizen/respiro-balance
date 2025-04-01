
import { UseFormReturn } from "react-hook-form";
import { RitualFormValues } from "../types";

export interface UseRitualTimeFieldsProps {
  form: UseFormReturn<RitualFormValues>;
}

export const useRitualTimeFields = ({ form }: UseRitualTimeFieldsProps) => {
  const handleDurationChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      form.setValue("duration", numValue, { shouldValidate: true });
    }
  };

  return {
    handleDurationChange
  };
};
