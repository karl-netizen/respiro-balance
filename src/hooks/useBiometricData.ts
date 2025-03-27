
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { BiometricData } from '@/types/supabase';
import { useAuth } from './useAuth';

export function useBiometricData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch recent biometric data
  const fetchRecentBiometricData = async (): Promise<BiometricData[]> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('biometric_data')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching biometric data:', error);
      throw error;
    }

    return data as BiometricData[];
  };

  // Add new biometric data
  const addBiometricData = async (biometricData: Partial<BiometricData>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const newRecord = {
      ...biometricData,
      user_id: user.id,
      recorded_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('biometric_data')
      .insert(newRecord);

    if (error) {
      console.error('Error adding biometric data:', error);
      throw error;
    }
  };

  // React Query hook for fetching
  const biometricDataQuery = useQuery({
    queryKey: ['biometricData', user?.id],
    queryFn: fetchRecentBiometricData,
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minute
  });

  // React Query mutation for adding
  const addBiometricMutation = useMutation({
    mutationFn: addBiometricData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biometricData', user?.id] });
    },
  });

  return {
    biometricData: biometricDataQuery.data || [],
    isLoading: biometricDataQuery.isLoading,
    isError: biometricDataQuery.isError,
    error: biometricDataQuery.error,
    addBiometricData: addBiometricMutation.mutate,
    isAdding: addBiometricMutation.isPending,
  };
}
