import React, { memo, useMemo, useCallback, lazy, Suspense, CSSProperties } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FixedSizeList as List } from 'react-window';

// ===================================================================
// COMPONENT-LEVEL OPTIMIZATIONS
// ===================================================================

// Memoize expensive components
export const ExpensiveComponent = memo<{
  data: any[];
  onAction: (id: string) => void;
}>(({ data, onAction }) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: expensiveCalculation(item)
    }));
  }, [data]);

  // Memoize callback functions
  const handleClick = useCallback((id: string) => {
    onAction(id);
  }, [onAction]);

  return (
    <div className="space-y-4">
      {processedData.map(item => (
        <ItemComponent 
          key={item.id}
          item={item}
          onClick={handleClick}
        />
      ))}
    </div>
  );
});

ExpensiveComponent.displayName = 'ExpensiveComponent';

// Performance-optimized item component
const ItemComponent = memo<{
  item: any;
  onClick: (id: string) => void;
}>(({ item, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(item.id);
  }, [onClick, item.id]);

  return (
    <div 
      className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={handleClick}
    >
      <h3 className="font-semibold">{item.title}</h3>
      <p className="text-muted-foreground">{item.computed}</p>
    </div>
  );
});

ItemComponent.displayName = 'ItemComponent';

// Expensive calculation function (example)
function expensiveCalculation(item: any): string {
  // Simulate expensive computation
  let result = '';
  for (let i = 0; i < 1000; i++) {
    result += item.id;
  }
  return result.slice(0, 20) + '...';
}

// ===================================================================
// LAZY LOADING COMPONENTS
// ===================================================================

// Route-level lazy loading
export const LazyDashboard = lazy(() => import('@/pages/Dashboard'));
export const LazyUserProfile = lazy(() => import('@/pages/ProfilePage'));
export const LazyAdminPanel = lazy(() => import('@/pages/SystemDashboardPage'));

// Heavy component lazy loading
export const LazyChart = lazy(() => import('@/components/charts/HeavyChart'));
export const LazyAnalytics = lazy(() => import('@/components/analytics/Analytics'));

// Performance-aware loading component
export const PerformanceAwareLoader: React.FC<{ variant?: string }> = ({ variant = 'default' }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="space-y-4 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="text-sm text-muted-foreground">
          {variant === 'heavy' ? 'Loading advanced features...' : 'Loading...'}
        </p>
      </div>
    </div>
  );
};

// Enhanced dashboard with lazy loading
export const OptimizedDashboard = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div className="container mx-auto p-6 space-y-6">
        <Suspense fallback={<PerformanceAwareLoader />}>
          <LazyChart />
        </Suspense>
        
        <Suspense fallback={<PerformanceAwareLoader variant="heavy" />}>
          <LazyAnalytics />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

// ===================================================================
// VIRTUALIZED LIST COMPONENTS
// ===================================================================

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const VirtualizedUserList: React.FC<{ 
  users: User[];
  onUserSelect?: (user: User) => void;
}> = ({ users, onUserSelect }) => {
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    const user = users[index];
    
    const handleClick = useCallback(() => {
      onUserSelect?.(user);
    }, [user]);

    return (
      <div style={style} className="p-2">
        <div 
          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={handleClick}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{user.name}</h4>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="border rounded-lg">
      <List
        height={600}
        itemCount={users.length}
        itemSize={80}
        overscanCount={5} // Render 5 extra items for smooth scrolling
      >
        {Row}
      </List>
    </div>
  );
};

// ===================================================================
// ERROR BOUNDARIES
// ===================================================================

const ErrorFallback: React.FC<{ error?: Error }> = ({ error }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
    <div className="text-destructive">
      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 13.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <div>
      <h3 className="text-lg font-semibold">Something went wrong</h3>
      <p className="text-muted-foreground mt-1">
        {error?.message || 'An unexpected error occurred'}
      </p>
    </div>
    <button 
      onClick={() => window.location.reload()} 
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      Reload page
    </button>
  </div>
);

// ===================================================================
// PERFORMANCE HOOKS
// ===================================================================

// Hook for memoizing expensive calculations
export const useExpensiveCalculation = <T,>(
  calculation: () => T,
  dependencies: React.DependencyList
): T => {
  return useMemo(calculation, dependencies);
};

// Hook for stable callbacks
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T => {
  return useCallback(callback, dependencies);
};

// Hook for intersection observer (lazy loading)
export const useIntersectionObserver = (options?: IntersectionObserverInit) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting] as const;
};

export default {
  ExpensiveComponent,
  OptimizedDashboard,
  VirtualizedUserList,
  LazyChart,
  LazyAnalytics,
  useExpensiveCalculation,
  useStableCallback,
  useIntersectionObserver
};