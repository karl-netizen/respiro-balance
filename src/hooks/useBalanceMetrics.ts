
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BalanceMetric } from '@/types/supabase';
import { useAuth } from './useAuth';

export function useBalanceMetrics() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch balance metrics for a date range
  const fetchBalanceMetrics = async (
    startDate: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days by default
    endDate: Date = new Date()
  ): Promise<BalanceMetric[]> => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('balance_metrics')
      .select('*')
      .eq('user_id', user.id)
      .gte('recorded_at', startDate.toISOString())
      .lte('recorded_at', endDate.toISOString())
      .order('recorded_at', { ascending: true });

    if (error) {
      console.error('Error fetching balance metrics:', error);
      throw error;
    }

    return data as BalanceMetric[];
  };

  // Record new balance metric
  const recordBalanceMetric = async (
    workLifeRatio: number,
    stressLevel: number,
    notes?: string
  ): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const newMetric = {
      user_id: user.id,
      work_life_ratio: workLifeRatio,
      stress_level: stressLevel,
      notes: notes,
      recorded_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('balance_metrics')
      .insert(newMetric);

    if (error) {
      console.error('Error recording balance metric:', error);
      throw error;
    }
  };

  // React Query hook for fetching
  const metricsQuery = useQuery({
    queryKey: ['balanceMetrics', user?.id],
    queryFn: () => fetchBalanceMetrics(),
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // React Query mutation for recording
  const recordMetricMutation = useMutation({
    mutationFn: (params: { workLifeRatio: number; stressLevel: number; notes?: string }) => 
      recordBalanceMetric(params.workLifeRatio, params.stressLevel, params.notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balanceMetrics', user?.id] });
    },
  });

  return {
    metrics: metricsQuery.data || [],
    isLoading: metricsQuery.isLoading,
    isError: metricsQuery.isError,
    error: metricsQuery.error,
    recordMetric: recordMetricMutation.mutate,
    isRecording: recordMetricMutation.isPending,
    fetchForDateRange: fetchBalanceMetrics,
  };
}
