
import { MorningRitual, RitualPriority, RitualRecurrence, RitualStatus } from '@/context/types';

export interface RitualSuggestion {
  id: string;
  title: string;
  description?: string;
  timeOfDay?: string;
  duration: number;
  tags: string[];
  priority?: RitualPriority;
  recurrence?: RitualRecurrence;
}

export interface RitualSuggestionsState {
  suggestions: RitualSuggestion[];
  isLoading: boolean;
  error: Error | null;
}
