
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // TEMPORARILY DISABLED: Authentication check for testing
  // Always render children regardless of authentication status
  console.log("Auth check bypassed for testing");
  return <>{children}</>;
  
  // Original authentication logic - commented out for testing
  /*
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
  */
};

export default RequireAuth;
