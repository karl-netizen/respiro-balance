
import { createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';

// Define comprehensive auth context type with all required methods and properties
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean; // Added to fix errors
  signIn?: (email: string, password: string) => Promise<any>;
  signUp?: (email: string, password: string, firstName: string) => Promise<any>;
  signOut?: () => Promise<void>;
  forgotPassword?: (email: string) => Promise<void>;
  resetPassword?: (password: string) => Promise<void>;
  updateProfile?: (data: any) => Promise<void>;
  verifyEmail?: (token: string) => Promise<void>;
  resendVerificationEmail?: (email: string) => Promise<void>;
}

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isLoading: true
});

// Export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
