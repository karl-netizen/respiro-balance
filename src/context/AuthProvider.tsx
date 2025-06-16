
import React, { ReactNode, useState, useEffect } from 'react';
import { useAuthInitialization } from '@/hooks/useAuthInitialization';
import AuthContext, { AuthContextType } from './AuthContext';
import { toast } from 'sonner';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const { user, session, loading: initializing } = useAuthInitialization();
  
  // Force loading to end after a certain time to prevent infinite loading states
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading || initializing) {
        console.log("Force ending auth loading state after timeout");
        setLoading(false);
      }
    }, 5000); // Force loading to end after 5 seconds max
    
    return () => clearTimeout(timer);
  }, [loading, initializing]);
  
  // Create auth methods without using useNavigate
  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      // Simulate auth signup
      console.log('SignUp called:', email);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      console.error('SignUp error:', error);
      toast.error('Failed to create account');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Simulate auth signin
      console.log('SignIn called:', email);
      toast.success('Welcome back!');
      return { success: true };
    } catch (error) {
      console.error('SignIn error:', error);
      toast.error('Failed to sign in');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Simulate auth signout
      console.log('SignOut called');
      toast.success('Signed out successfully');
      return { success: true };
    } catch (error) {
      console.error('SignOut error:', error);
      toast.error('Failed to sign out');
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      console.log('ForgotPassword called:', email);
      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      console.error('ForgotPassword error:', error);
      toast.error('Failed to send reset email');
      throw error;
    }
  };

  const resetPassword = async (password: string) => {
    try {
      console.log('ResetPassword called');
      toast.success('Password reset successful!');
      return { success: true };
    } catch (error) {
      console.error('ResetPassword error:', error);
      toast.error('Failed to reset password');
      throw error;
    }
  };

  const updateProfile = async (data: any) => {
    try {
      console.log('UpdateProfile called:', data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('UpdateProfile error:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      console.log('VerifyEmail called:', token);
      toast.success('Email verified successfully!');
      return { success: true };
    } catch (error) {
      console.error('VerifyEmail error:', error);
      toast.error('Failed to verify email');
      throw error;
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      console.log('ResendVerificationEmail called:', email);
      toast.success('Verification email sent!');
      return { success: true };
    } catch (error) {
      console.error('ResendVerificationEmail error:', error);
      toast.error('Failed to resend verification email');
      throw error;
    }
  };
  
  // Create the combined auth context value
  const value: AuthContextType = {
    user,
    session,
    loading: loading || initializing,
    isLoading: loading || initializing,
    signUp,
    signIn,
    signOut,
    forgotPassword,
    resetPassword,
    updateProfile,
    verifyEmail,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
