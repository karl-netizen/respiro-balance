
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Extend User interface to include user_metadata and app_metadata
interface ExtendedUser extends User {
  user_metadata: Record<string, any>;
  app_metadata: Record<string, any>;
  subscription_tier?: string;
  email_confirmed_at?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user as ExtendedUser ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Welcome back!');
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Account created! Please check your email to verify your account.');
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

  const resetPassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: password
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
      email: email
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
    loading: isLoading,
    isLoading,
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
