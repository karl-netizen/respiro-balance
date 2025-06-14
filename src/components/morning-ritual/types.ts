
import { z } from 'zod';

export type RecurrenceType = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type RitualPriority = 'low' | 'medium' | 'high';
export type RitualStatus = 'planned' | 'completed' | 'skipped' | 'in_progress' | 'missed';

export interface RitualReminder {
  enabled: boolean;
  time: number;
  message?: string;
}

export interface RitualFilters {
  status: string;
  priority: string;
  tags: string[];
  timeRange?: string;
}

export interface MorningRitual {
  id: string;
  title: string;
  description: string;
  date?: Date;
  startTime: string;
  timeOfDay: string;
  duration: number;
  priority: RitualPriority;
  recurrence: RecurrenceType;
  daysOfWeek: string[];
  reminderEnabled: boolean;
  reminderTime: number;
  reminders: RitualReminder[];
  tags: string[];
  complete: boolean;
  completed?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  status: RitualStatus;
  lastCompleted?: string;
  streak?: number;
}

export const ritualFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  timeOfDay: z.string().default("08:00"),
  duration: z.number().min(1).max(120).default(15),
  recurrence: z.enum(['daily', 'weekdays', 'weekends', 'custom']).default('daily'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  tags: z.array(z.string()).default([]),
  daysOfWeek: z.array(z.string()).default([]),
  reminders: z.array(z.object({
    enabled: z.boolean(),
    time: z.number(),
    message: z.string().optional(),
  })).default([]),
});

export type RitualFormValues = z.infer<typeof ritualFormSchema>;
