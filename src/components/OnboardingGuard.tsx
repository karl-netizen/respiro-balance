import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if onboarding is completed
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    
    // Skip onboarding check for certain routes
    const skipOnboarding = ['/onboarding', '/login', '/signup', '/register'].includes(location.pathname);
    
    // If not completed and not on skip routes, redirect to onboarding
    if (!onboardingCompleted && !skipOnboarding) {
      navigate('/onboarding');
    }
  }, [navigate, location.pathname]);

  return <>{children}</>;
}
