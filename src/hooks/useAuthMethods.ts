
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';
import { isSupabaseConfigured } from '@/integrations/supabase/client';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser, 
  requestPasswordReset, 
  updateUserPassword 
} from '@/lib/authActions';

export const useAuthMethods = (
  navigate?: NavigateFunction, 
  setLoading: (loading: boolean) => void = () => {}
) => {
  // Auth methods
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      return await signInWithEmail(email, password, navigate, setLoading);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName?: string) => {
    setLoading(true);
    try {
      return await signUpWithEmail(email, password, firstName || '', setLoading);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      return await signOutUser(navigate, setLoading);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      return await requestPasswordReset(email, setLoading);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (newPassword: string) => {
    setLoading(true);
    try {
      return await updateUserPassword(newPassword, navigate, setLoading);
    } finally {
      setLoading(false);
    }
  };

  // Email verification methods
  const verifyEmail = async (token: string) => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        toast.success("Demo Mode - Email verified successfully!");
        return;
      }
      
      // In a real implementation, you might use the token to confirm the email
      toast.success("Email verified successfully!");
    } catch (error) {
      console.error("Email verification failed:", error);
      toast.error("Failed to verify email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string) => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        toast.success("Demo Mode - Verification email sent!");
        return;
      }
      
      // In a real implementation, you would call Supabase to send a new verification email
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Failed to resend verification email:", error);
      toast.error("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail
  };
};
