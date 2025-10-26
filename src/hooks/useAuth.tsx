import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useDemoMode } from '@/hooks/useDemoMode';
import { DEMO_USER } from '@/lib/demoData';
import { toast } from 'sonner';
import { analytics, trackUserSignUp, trackUserLogin } from '@/lib/analytics/analytics';

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
  const { isDemoMode, getDemoSession } = useDemoMode();

  useEffect(() => {
    // Check for demo mode first
    if (isDemoMode) {
      const demoSession = getDemoSession();
      if (demoSession) {
        setUser(DEMO_USER as ExtendedUser);
        setSession({
          user: DEMO_USER as User,
          access_token: 'demo-token',
          refresh_token: 'demo-refresh',
          expires_in: 3600,
          expires_at: Date.now() / 1000 + 3600,
          token_type: 'bearer'
        } as Session);
      }
      setIsLoading(false);
      return;
    }
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
        
        // Load user profile data when signed in
        if (session?.user && event === 'SIGNED_IN') {
          // Set analytics user ID
          analytics.setUserId(session.user.id);
          
          setTimeout(async () => {
            await loadUserProfile(session.user.id);
          }, 0);
        }
        
        // Clear analytics user ID when signed out
        if (event === 'SIGNED_OUT') {
          analytics.setUserId(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [isDemoMode]); // Re-run when demo mode changes

  // Load user profile data from database
  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error);
        return;
      }

      if (profile) {
        setUser(prev => prev ? {
          ...prev,
          subscription_tier: profile.subscription_tier,
          user_metadata: {
            ...prev.user_metadata,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url
          }
        } : null);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

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

    // Track successful login
    trackUserLogin('email');
    toast.success('Signed in successfully');
  };

  const signUp = async (email: string, password: string, options?: any): Promise<void> => {
    const redirectUrl = options?.redirectTo || `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: options?.data?.full_name || ''
        }
      }
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    // Track successful signup
    if (data.user) {
      trackUserSignUp('email', 'free');
      await new Promise(resolve => setTimeout(resolve, 500));
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

  const resetPassword = async (password: string, _token?: string) => {
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

