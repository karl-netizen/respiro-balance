import { Suspense, ReactNode } from 'react';
import { DashboardSkeleton } from '@/components/ui/skeleton-variants';

interface SuspenseRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wrapper component for lazy-loaded routes with consistent loading state
 */
export function SuspenseRoute({ children, fallback }: SuspenseRouteProps) {
  return (
    <Suspense fallback={fallback || <DashboardSkeleton />}>
      {children}
    </Suspense>
  );
}
