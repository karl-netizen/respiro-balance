
import { createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoading?: boolean; // Alias for compatibility
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  updateProfile?: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
