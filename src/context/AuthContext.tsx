
import { createContext, useContext } from 'react';

interface AuthContextType {
  user: any;
  loading: boolean;
}

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
});

// Export the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
