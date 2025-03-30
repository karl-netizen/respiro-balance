
import { useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AuthContext } from '@/context/AuthContext';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser, 
  requestPasswordReset, 
  updateUserPassword 
} from '@/lib/authActions';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Auth methods
  const signIn = (email: string, password: string) => {
    return signInWithEmail(email, password, navigate, setLoading);
  };

  const signUp = (email: string, password: string, firstName?: string) => {
    return signUpWithEmail(email, password, firstName, setLoading);
  };

  const signOut = () => {
    return signOutUser(navigate, setLoading);
  };

  const forgotPassword = (email: string) => {
    return requestPasswordReset(email, setLoading);
  };

  const resetPassword = (newPassword: string) => {
    return updateUserPassword(newPassword, navigate, setLoading);
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
