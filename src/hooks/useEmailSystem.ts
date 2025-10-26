
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EmailSystemHook {
  sendEmail: (to: string, template: string, variables?: Record<string, any>) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const useEmailSystem = (): EmailSystemHook => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (
    to: string, 
    template: string, 
    variables: Record<string, any> = {}
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('send-email', {
        body: {
          to,
          template,
          variables,
        },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (!data.success) {
        throw new Error('Email sending failed');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send email';
      setError(errorMessage);
      console.error('Email sending error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendEmail,
    isLoading,
    error,
  };
};
