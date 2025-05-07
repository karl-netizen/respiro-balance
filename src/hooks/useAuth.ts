
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      setIsLoading(true);
      try {
        // Using type assertion for supabase
        const { data: { session }, error } = await (supabase.auth as any).getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          return;
        }
        
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange(
      (_event: string, session: any) => {
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await (supabase.auth as any).signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setIsLoading(true);
    try {
      const { data, error } = await (supabase.auth as any).signUp({
        email,
        password,
        options: { data: metadata }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await (supabase.auth as any).signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    user,
    isLoading,
    signIn,
    signUp,
    signOut
  };
}
