
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { NavigateFunction } from 'react-router-dom';

export const signInWithEmail = async (
  email: string, 
  password: string,
  navigate: NavigateFunction,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    console.log("Signing in with:", email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      throw error;
    }
    
    console.log("Sign in successful:", data.user?.email);
    navigate('/dashboard');
    toast("Welcome back!", {
      description: "You've been successfully signed in."
    });
  } catch (error: any) {
    console.error("Sign in error:", error);
    toast("Sign in failed", {
      description: error.message || "There was a problem signing you in."
    });
    throw error;
  } finally {
    setLoading(false);
  }
};

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  firstName: string = '',
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    console.log("Signing up with:", email);
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          first_name: firstName || '',
        },
      }
    });
    
    if (error) {
      throw error;
    }

    console.log("Sign up response:", data);

    if (data.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          email: email,
          first_name: firstName || '',
          created_at: new Date().toISOString()
        });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
        // We don't throw here to not block signup, but log the error
      } else {
        console.log("User profile created successfully");
      }
    }
    
    toast("Account created!", {
      description: "Please check your email for the confirmation link."
    });
  } catch (error: any) {
    console.error("Sign up error:", error);
    toast("Sign up failed", {
      description: error.message || "There was a problem creating your account."
    });
    throw error;
  } finally {
    setLoading(false);
  }
};

export const signOutUser = async (
  navigate: NavigateFunction,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    await supabase.auth.signOut();
    navigate('/login');
    toast("Signed out", {
      description: "You've been successfully signed out."
    });
  } catch (error: any) {
    console.error("Error signing out:", error);
    toast("Error signing out", {
      description: error.message || "There was a problem signing you out."
    });
  } finally {
    setLoading(false);
  }
};

export const requestPasswordReset = async (
  email: string,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    console.log("Sending password reset for:", email);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      throw error;
    }
    
    toast("Password reset email sent", {
      description: "Check your email for a password reset link."
    });
  } catch (error: any) {
    console.error("Failed to send reset email:", error);
    toast("Failed to send reset email", {
      description: error.message || "There was a problem sending the reset email."
    });
    throw error;
  } finally {
    setLoading(false);
  }
};

export const updateUserPassword = async (
  newPassword: string,
  navigate: NavigateFunction,
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
    console.log("Resetting password");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      throw error;
    }
    
    toast("Password updated", {
      description: "Your password has been successfully reset."
    });
    navigate('/login');
  } catch (error: any) {
    console.error("Password reset failed:", error);
    toast("Password reset failed", {
      description: error.message || "There was a problem resetting your password."
    });
    throw error;
  } finally {
    setLoading(false);
  }
};
