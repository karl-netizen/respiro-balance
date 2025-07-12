import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Extend User interface to include user_metadata and app_metadata
interface ExtendedUser extends User {
  user_metadata: Record<string, any>;
  app_metadata: Record<string, any>;
  subscription_tier?: string; // Add subscription_tier property
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  isLoading: boolean;
  loading: boolean; // Alias for backward compatibility
  signIn: (email: string, password: string, options?: any) => Promise<void>;
  signUp: (email: string, password: string, options?: any) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token?: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user as ExtendedUser ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user as ExtendedUser ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, options?: any) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      ...options
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Signed in successfully');
  };

  const signUp = async (email: string, password: string, options?: any) => {
    const redirectUrl = options?.redirectTo || `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        ...options
      }
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Account created! Please check your email to verify.');
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Signed out successfully');
  };

  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Password reset email sent!');
  };

  const resetPassword = async (password: string, token?: string) => {
    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Password updated successfully!');
  };

  const updateProfile = async (data: any) => {
    const { error } = await supabase.auth.updateUser({
      data: data
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Profile updated successfully!');
  };

  const verifyEmail = async (token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Email verified successfully!');
  };

  const resendVerificationEmail = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Verification email sent!');
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    loading: isLoading, // Backward compatibility alias
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
    updateProfile,
    verifyEmail,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

