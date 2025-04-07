
import { ReactNode } from 'react';
import { AuthProvider as BaseAuthProvider } from '@/providers/AuthProvider';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // We don't need useNavigate here anymore as we'll pass it from components inside the Router
  return (
    <BaseAuthProvider>
      {children}
    </BaseAuthProvider>
  );
}

export default AuthProvider;
