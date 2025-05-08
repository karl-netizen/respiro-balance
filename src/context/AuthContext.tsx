
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// Define the complete AuthContextType
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean; // Using isLoading instead of loading for consistency
  loading: boolean;   // For backward compatibility
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<any>;
  signOut: () => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (newPassword: string) => Promise<any>;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signOut: async () => ({}),
  forgotPassword: async () => ({}),
  resetPassword: async () => ({})
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for active session
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => {
      // Clean up subscription on unmount
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Auth methods
  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    return supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: metadata
      }
    });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  const forgotPassword = async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email);
  };

  const resetPassword = async (newPassword: string) => {
    return supabase.auth.updateUser({ password: newPassword });
  };

  const value = {
    user,
    session,
    isLoading,
    loading: isLoading, // For backward compatibility
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
