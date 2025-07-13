
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { DEMO_SESSION, DEMO_USER } from '@/lib/demoAuth';
import { toast } from 'sonner';

export const useAuthInitialization = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety mechanism to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Auth initialization timeout reached - forcing completion");
        setLoading(false);
        
        // If no user is set by this point and we're in demo mode, use demo user
        if (!user && !isSupabaseConfigured()) {
          console.log("Timeout reached: Using demo user automatically");
          setSession(DEMO_SESSION);
          setUser(DEMO_USER);
        }
      }
    }, 5000);

    // If Supabase is not configured, use demo mode
    if (!isSupabaseConfigured()) {
      console.log("Supabase not configured: Using demo user automatically");
      setSession(DEMO_SESSION);
      setUser(DEMO_USER);
      setLoading(false);
      return () => clearTimeout(timeoutId); // Clean up timeout
    }

    // Get initial session
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          toast.error("Authentication error. Using demo mode instead.");
          
          // Fallback to demo mode on error
          setSession(DEMO_SESSION);
          setUser(DEMO_USER);
        } else if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Also update the user's last login time
          if (currentSession.user) {
            try {
              const { error } = await supabase
                .from('user_profiles')
                .update({ last_login: new Date().toISOString() })
                .eq('id', currentSession.user.id);
                
              if (error) {
                console.error("Error updating last login:", error);
              }
            } catch (profileError) {
              console.error("Error updating profile:", profileError);
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        toast.error("Unable to initialize authentication. Using demo mode instead.");
        
        // Fallback to demo mode on error
        setSession(DEMO_SESSION);
        setUser(DEMO_USER);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Handle specific auth events
        if (event === 'SIGNED_IN' && newSession?.user) {
          // Update last login time
          try {
            supabase
              .from('user_profiles')
              .update({ last_login: new Date().toISOString() })
              .eq('id', newSession.user.id)
              .then(({ error }) => {
                if (error) {
                  console.error("Error updating last login:", error);
                }
              });
          } catch (error) {
            console.error("Error handling sign-in event:", error);
          }
        }
      }
    );

    // Initialize auth
    initializeAuth();

    // Cleanup
    return () => {
      subscription?.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  return { user, session, loading, setLoading };
};
