
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { UserPreferences } from '@/context/types';
import defaultPreferences from '@/context/defaultPreferences';
import { fetchUserPreferences, updateUserPreferences, processOfflineSync } from './preferences/preferencesApi';

export function useSupabaseUserPreferences() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // React Query hook for fetching
  const preferencesQuery = useQuery({
    queryKey: ['userPreferences', user?.id],
    queryFn: () => fetchUserPreferences(user?.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: async (data) => {
      // Process any pending offline changes after successful fetch
      if (user?.id) {
        await processOfflineSync(user.id);
      }
    }
  });

  // React Query mutation for updating
  const updatePreferencesMutation = useMutation({
    mutationFn: (preferences: UserPreferences) => updateUserPreferences(preferences, user?.id),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['userPreferences', user?.id] });
    },
  });

  return {
    preferences: preferencesQuery.data || defaultPreferences,
    isLoading: preferencesQuery.isLoading,
    isError: preferencesQuery.isError,
    error: preferencesQuery.error,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdating: updatePreferencesMutation.isPending,
  };
}
