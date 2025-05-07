
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface BiometricData {
  id: string;
  user_id: string;
  heart_rate?: number;
  hrv?: number;
  respiratory_rate?: number;
  stress_score?: number;
  coherence?: number;
  recorded_at: string;
  device_source?: string;
}

export const useBiometricData = () => {
  const { user } = useAuth();
  const [biometricData, setBiometricData] = useState<BiometricData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBiometricData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Using type assertion for supabase
        const { data, error } = await (supabase as any)
          .from('biometric_data')
          .select('*')
          .eq('user_id', user.id)
          .order('recorded_at', { ascending: false })
          .limit(100);
          
        if (error) throw error;
        
        setBiometricData(data || []);
      } catch (err: any) {
        console.error('Error fetching biometric data:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBiometricData();
  }, [user]);

  return { biometricData, isLoading, error };
};
