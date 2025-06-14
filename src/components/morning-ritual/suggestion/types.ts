
export interface RitualSuggestion {
  id: string;
  title: string;
  description: string;
  timeOfDay: string;
  duration: number;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  category: string;
  recurrence?: string;
}

export interface RitualSuggestionsState {
  suggestions: RitualSuggestion[];
  isLoading: boolean;
  error?: string;
}
