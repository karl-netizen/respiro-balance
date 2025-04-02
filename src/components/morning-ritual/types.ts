
import { z } from "zod";
import { RitualPriority, RitualReminder } from "@/context/types";

// Form validation schema
export const ritualFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  timeOfDay: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time (HH:MM)",
  }),
  duration: z.number().min(1, {
    message: "Duration must be at least 1 minute.",
  }).max(120, {
    message: "Duration cannot exceed 120 minutes."
  }),
  recurrence: z.enum(["daily", "weekdays", "weekends", "custom"]),
  daysOfWeek: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  reminders: z.array(
    z.object({
      id: z.string(),
      time: z.string(),
      enabled: z.boolean(),
      type: z.enum(["in-app", "email", "push"])
    })
  ).optional(),
  isTemplate: z.boolean().optional(),
  associatedGoals: z.array(z.string()).optional(),
});

export type RitualFormValues = z.infer<typeof ritualFormSchema>;

// Add additional exports needed by useRitualForm
export type RecurrenceType = "daily" | "weekdays" | "weekends" | "custom";
export type RitualPriority = "low" | "medium" | "high";

export interface RitualFormData {
  id: string;
  title: string;
  description?: string;
  date?: Date;
  startTime: string;
  duration: number;
  priority: RitualPriority;
  recurrence: RecurrenceType;
  reminderEnabled: boolean;
  reminderTime: number;
  tags: string[];
  complete: boolean;
  createdAt: Date;
}
