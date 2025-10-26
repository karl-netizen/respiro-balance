
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NavigateFunction } from 'react-router-dom';

// Define demoAuth locally instead of importing it
export const demoAuth = {
  isDemo: true
};

export const signInWithEmail = async (
  email: string, 
  password: string,
  navigate: NavigateFunction,
  _setLoading: (loading: boolean) => void
) => {
  try {
    console.log("Signing in with:", email);
    
    // In demo mode, simulate a successful sign-in
    if (demoAuth.isDemo) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      console.log("Demo mode: Sign in successful");
      
      toast.success("Demo Mode - Welcome back!", {
        description: "Using demo account (no actual authentication occurred)"
      });
      
      navigate('/dashboard');
      return;
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      throw error;
    }
    
    console.log("Sign in successful:", data.user?.email);
    
    toast.success("Welcome back!", {
      description: "You've been successfully signed in."
    });
    
    navigate('/dashboard');
  } catch (error: any) {
    console.error("Sign in error:", error);
    const errorInfo = handleSupabaseError(error);
    toast.error("Sign in failed", {
      description: errorInfo.message
    });
    throw error;
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
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        });

      if (profileError) {
        console.error("Error creating user profile:", profileError);
        // We don't throw here to not block signup, but log the error
      } else {
        console.log("User profile created successfully");
      }
      
      // Create initial user preferences
      const { error: preferencesError } = await supabase
        .from('user_preferences')
        .insert({
          user_id: data.user.id,
          preferences_data: {
            userRole: "client",
            workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
            workStartTime: "09:00",
            workEndTime: "17:00",
            workEnvironment: "office",
            stressLevel: "moderate",
            focusChallenges: [],
            energyPattern: "morning",
            lunchBreak: true,
            lunchTime: "12:00",
            morningExercise: false,
            exerciseTime: "",
            bedTime: "22:00",
            meditationExperience: "beginner",
            meditationGoals: [],
            preferredSessionDuration: 10,
            metricsOfInterest: [],
            subscriptionTier: "free",
          }
        });
        
      if (preferencesError) {
        console.error("Error creating initial user preferences:", preferencesError);
      } else {
        console.log("Initial user preferences created successfully");
      }
    }
    
    toast("Account created!", {
      description: "Please check your email for the confirmation link."
    });
  } catch (error: any) {
    console.error("Sign up error:", error);
    const errorInfo = handleSupabaseError(error);
    toast.error("Sign up failed", {
      description: errorInfo.message
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
    const errorInfo = handleSupabaseError(error);
    toast.error("Error signing out", {
      description: errorInfo.message
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
    
    // In demo mode, simulate password reset email
    if (demoAuth.isDemo) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      toast("Demo Mode - Reset email sent", {
        description: "In production, a password reset email would be sent."
      });
      return;
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password?type=recovery`
    });
    
    if (error) {
      throw error;
    }
    
    toast("Password reset email sent", {
      description: "Check your email for a password reset link."
    });
  } catch (error: any) {
    console.error("Failed to send reset email:", error);
    const errorInfo = handleSupabaseError(error);
    toast.error("Failed to send reset email", {
      description: errorInfo.message
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
    const errorInfo = handleSupabaseError(error);
    toast.error("Password reset failed", {
      description: errorInfo.message
    });
    throw error;
  } finally {
    setLoading(false);
  }
};

// New function to get current user profile
export const fetchUserProfile = async (userId: string) => {
  if (!userId) return null;
  
  if (demoAuth.isDemo) {
    return {
      id: 'demo-user-id',
      email: 'demo@example.com',
      first_name: 'Demo',
      last_name: 'User',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString()
    };
  }
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  
  return data;
};
