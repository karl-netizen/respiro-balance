
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider as BaseAuthProvider } from '@/providers/AuthProvider';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  
  return (
    <BaseAuthProvider navigate={navigate}>
      {children}
    </BaseAuthProvider>
  );
}

export default AuthProvider;
