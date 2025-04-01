
import { supabase, demoAuth, handleSupabaseError } from '@/lib/supabase';
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
    
    // In demo mode, simulate a successful sign-in
    if (demoAuth.isDemo) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      console.log("Demo mode: Sign in successful");
      navigate('/dashboard');
      toast("Demo Mode - Welcome back!", {
        description: "Using demo account (no actual authentication occurred)"
      });
      return;
    }
    
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
    handleSupabaseError(error, "Sign in failed");
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
    
    // In demo mode, simulate a successful sign-up
    if (demoAuth.isDemo) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      console.log("Demo mode: Sign up successful");
      toast("Demo Mode - Account created!", {
        description: "Simulated account creation (no actual registration occurred)"
      });
      return;
    }
    
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
    handleSupabaseError(error, "Sign up failed");
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
    
    // In demo mode, simulate sign out
    if (demoAuth.isDemo) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      navigate('/login');
      toast("Demo Mode - Signed out", {
        description: "Simulated sign out (no actual authentication occurred)"
      });
      return;
    }
    
    await supabase.auth.signOut();
    navigate('/login');
    toast("Signed out", {
      description: "You've been successfully signed out."
    });
  } catch (error: any) {
    console.error("Error signing out:", error);
    handleSupabaseError(error, "Error signing out");
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
    
    // In demo mode, simulate password reset email
    if (demoAuth.isDemo) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      toast("Demo Mode - Reset email sent", {
        description: "In production, a password reset email would be sent."
      });
      return;
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      throw error;
    }
    
    toast("Password reset email sent", {
      description: "Check your email for a password reset link."
    });
  } catch (error: any) {
    console.error("Failed to send reset email:", error);
    handleSupabaseError(error, "Failed to send reset email");
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
    
    // In demo mode, simulate password update
    if (demoAuth.isDemo) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      toast("Demo Mode - Password updated", {
        description: "In production, your password would be updated."
      });
      navigate('/login');
      return;
    }
    
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
    handleSupabaseError(error, "Password reset failed");
    throw error;
  } finally {
    setLoading(false);
  }
};
