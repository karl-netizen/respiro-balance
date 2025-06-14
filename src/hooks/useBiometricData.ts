
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { BiometricData } from '@/components/meditation/types/BiometricTypes';

export const useBiometricData = () => {
  const { user } = useAuth();
  const [biometricData, setBiometricData] = useState<BiometricData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshBiometricData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('biometric_data')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setBiometricData(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshBiometricData();
    }
  }, [user]);

  return {
    biometricData,
    isLoading,
    error: error as Error,
    refreshBiometricData
  };
};
