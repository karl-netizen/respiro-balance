
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { BiometricData } from '@/hooks/biofeedback/biofeedbackTypes';

export const useBiometricData = () => {
  const { user } = useAuth();
  const [biometricData, setBiometricData] = useState<BiometricData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBiometricData = async (limit: number = 100) => {
    if (!user || !supabase) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('biometric_data')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      setBiometricData(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBiometricData = async (data: Partial<BiometricData>) => {
    if (!user || !supabase) return;
    
    try {
      const { error } = await supabase
        .from('biometric_data')
        .insert({
          ...data,
          user_id: user.id,
          timestamp: data.timestamp || new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Refresh data
      await fetchBiometricData();
    } catch (err) {
      setError(err as Error);
    }
  };

  const refreshBiometricData = () => {
    fetchBiometricData();
  };

  useEffect(() => {
    if (user) {
      fetchBiometricData();
    }
  }, [user]);

  return {
    biometricData,
    isLoading,
    error,
    addBiometricData,
    refreshBiometricData,
    fetchBiometricData
  };
};
