
import { createContext, useContext } from 'react';

// Extend the AuthContextType to include all necessary methods
export interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (password: string) => Promise<any>;
  updateProfile: (data: any) => Promise<void>;
  verifyEmail: (token: string) => Promise<any>;
  resendVerificationEmail: (email: string) => Promise<any>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isLoading: true,
  signUp: async () => null,
  signIn: async () => null,
  signOut: async () => null,
  forgotPassword: async () => null,
  resetPassword: async () => null,
  updateProfile: async () => {},
  verifyEmail: async () => null,
  resendVerificationEmail: async () => null
});

// Export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
