
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  useEffect(() => {
    // Get initial session
    const initialize = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          return;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // Debug
        if (data.session?.user) {
          console.log("User is authenticated:", data.session.user.email);
        } else {
          console.log("No authenticated user");
        }
      } catch (err) {
        console.error("Failed to get session:", err);
      } finally {
        setLoading(false);
      }
    };

    initialize();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (_event === 'SIGNED_IN') {
        console.log("User signed in:", session?.user?.email);
      } else if (_event === 'SIGNED_OUT') {
        console.log("User signed out");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
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

  const signUp = async (email: string, password: string, firstName?: string) => {
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

  const signOut = async () => {
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

  const forgotPassword = async (email: string) => {
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

  const resetPassword = async (newPassword: string) => {
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      forgotPassword, 
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
