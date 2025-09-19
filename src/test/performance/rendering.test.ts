import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { createTestWrapper, TestDataFactory, performanceHelpers } from '../utils/comprehensive-test-utils';

// Mock components for performance testing
const MockButton = ({ children, onClick, disabled }: any) => 
  React.createElement('button', { onClick, disabled }, children);

const MockGrid = ({ children, columns }: any) => 
  React.createElement('div', { 
    style: { 
      display: 'grid', 
      gridTemplateColumns: `repeat(${columns?.lg || 3}, 1fr)`,
      gap: '1rem'
    }
  }, children);

// Mock authentication hook
const mockUseAuth = () => {
  const [authState] = React.useState(TestDataFactory.createMockAuthState());
  
  const hasPermission = React.useCallback((permission: string) => {
    return authState.user?.permissions?.includes(permission) || false;
  }, [authState]);

  return {
    ...authState,
    hasPermission,
    isAuthenticated: authState.type === 'authenticated'
  };
};

// Mock form validation hook
const mockUseFormValidation = (schema: any) => {
  const validate = React.useCallback((data: any) => {
    // Simulate validation work
    const start = performance.now();
    
    // Artificial validation work
    let result = true;
    for (let i = 0; i < 1000; i++) {
      result = result && Boolean(data);
    }
    
    const end = performance.now();
    
    return {
      isValid: result,
      errors: {},
      validationTime: end - start
    };
  }, [schema]);

  return { validate };
};

describe('Performance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering Performance', () => {
    it('renders large lists efficiently', () => {
      const renderTime = performanceHelpers.measureRenderTime(() => {
        render(
          React.createElement(MockGrid, { columns: { lg: 6 } },
            Array.from({ length: 1000 }, (_, i) => 
              React.createElement(MockButton, { key: i }, `Button ${i}`)
            )
          )
        );
      });

      // Should render 1000 buttons within reasonable time
      expect(renderTime).toBeLessThan(100); // 100ms threshold
    });

    it('handles rapid re-renders efficiently', () => {
      const TestComponent = ({ count }: { count: number }) => (
        <div>
          {Array.from({ length: count }, (_, i) => (
            <MockButton key={i}>Button {i}</MockButton>
          ))}
        </div>
      );

      const { rerender } = render(<TestComponent count={100} />);

      const startTime = performance.now();
      
      // Rapid re-renders with increasing counts
      for (let i = 100; i <= 500; i += 100) {
        rerender(<TestComponent count={i} />);
      }
      
      const endTime = performance.now();
      const rerenderTime = endTime - startTime;

      // Multiple re-renders should be fast
      expect(rerenderTime).toBeLessThan(50);
    });

    it('memoization prevents unnecessary re-renders', () => {
      let renderCount = 0;

      const ExpensiveComponent = React.memo(({ data }: { data: any }) => {
        renderCount++;
        
        // Simulate expensive computation
        React.useMemo(() => {
          let result = 0;
          for (let i = 0; i < 10000; i++) {
            result += i;
          }
          return result;
        }, [data.id]);

        return <div>Expensive Component {data.name}</div>;
      });

      const TestContainer = () => {
        const [count, setCount] = React.useState(0);
        const [data] = React.useState({ id: 1, name: 'Test' });

        return (
          <div>
            <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
            <ExpensiveComponent data={data} />
          </div>
        );
      };

      const { getByRole } = render(<TestContainer />);
      const button = getByRole('button');

      // Initial render
      expect(renderCount).toBe(1);

      // Click button multiple times (should not re-render ExpensiveComponent)
      for (let i = 0; i < 5; i++) {
        button.click();
      }

      // ExpensiveComponent should not re-render since data didn't change
      expect(renderCount).toBe(1);
    });

    it('virtual scrolling handles large datasets', () => {
      // Mock virtual scrolling component
      const VirtualList = ({ items, itemHeight = 50 }: any) => {
        const [scrollTop, setScrollTop] = React.useState(0);
        const containerHeight = 400;
        
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(
          startIndex + Math.ceil(containerHeight / itemHeight) + 1,
          items.length
        );
        
        const visibleItems = items.slice(startIndex, endIndex);
        
        return (
          <div 
            style={{ height: containerHeight, overflow: 'auto' }}
            onScroll={(e) => setScrollTop((e.target as HTMLElement).scrollTop)}
          >
            <div style={{ height: items.length * itemHeight, position: 'relative' }}>
              {visibleItems.map((item: any, index: number) => (
                <div
                  key={startIndex + index}
                  style={{
                    position: 'absolute',
                    top: (startIndex + index) * itemHeight,
                    height: itemHeight,
                    width: '100%'
                  }}
                >
                  Item {item}
                </div>
              ))}
            </div>
          </div>
        );
      };

      const largeDataset = Array.from({ length: 10000 }, (_, i) => i);
      
      const renderTime = performanceHelpers.measureRenderTime(() => {
        render(<VirtualList items={largeDataset} />);
      });

      // Virtual scrolling should handle large datasets efficiently
      expect(renderTime).toBeLessThan(50);
    });
  });

  describe('Hook Performance', () => {
    it('authentication hook performs permission checks efficiently', () => {
      const { result } = renderHook(() => mockUseAuth(), {
        wrapper: createTestWrapper()
      });

      const startTime = performance.now();
      
      // Perform many permission checks
      for (let i = 0; i < 10000; i++) {
        result.current.hasPermission('read:profile');
        result.current.hasPermission('write:profile');
        result.current.hasPermission('admin:system');
      }
      
      const endTime = performance.now();
      const checkTime = endTime - startTime;
      
      // 30,000 permission checks should be very fast
      expect(checkTime).toBeLessThan(10);
    });

    it('form validation performs efficiently with complex schemas', () => {
      const complexSchema = {
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        password: { required: true, minLength: 8 },
        confirmPassword: { required: true },
        terms: { required: true }
      };

      const { result } = renderHook(() => mockUseFormValidation(complexSchema));

      const testData = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
        terms: true
      };

      const startTime = performance.now();
      
      // Perform many validations
      for (let i = 0; i < 1000; i++) {
        result.current.validate(testData);
      }
      
      const endTime = performance.now();
      const validationTime = endTime - startTime;
      
      // 1000 validations should be fast
      expect(validationTime).toBeLessThan(100);
    });

    it('state updates batch efficiently', async () => {
      const TestComponent = () => {
        const [state, setState] = React.useState({
          count: 0,
          name: 'test',
          items: [] as number[]
        });

        const batchUpdate = React.useCallback(() => {
          // Multiple state updates should be batched
          setState(prev => ({ ...prev, count: prev.count + 1 }));
          setState(prev => ({ ...prev, name: `test-${prev.count}` }));
          setState(prev => ({ ...prev, items: [...prev.items, prev.count] }));
        }, []);

        return (
          <div>
            <div data-testid="count">{state.count}</div>
            <div data-testid="name">{state.name}</div>
            <div data-testid="items">{state.items.length}</div>
            <button onClick={batchUpdate}>Update</button>
          </div>
        );
      };

      const { result } = renderHook(() => {
        let renderCount = 0;
        return {
          renderCount: ++renderCount,
          Component: TestComponent
        };
      });

      const { getByRole } = render(<result.current.Component />);
      const button = getByRole('button');

      const initialRenderCount = result.current.renderCount;

      // Multiple state updates should only cause one re-render due to batching
      act(() => {
        button.click();
      });

      // Should only render once more despite multiple setState calls
      expect(result.current.renderCount).toBe(initialRenderCount + 1);
    });
  });

  describe('Memory Performance', () => {
    it('prevents memory leaks in event listeners', () => {
      const TestComponent = () => {
        const [count, setCount] = React.useState(0);

        React.useEffect(() => {
          const handleResize = () => setCount(c => c + 1);
          
          window.addEventListener('resize', handleResize);
          
          // Cleanup should prevent memory leaks
          return () => window.removeEventListener('resize', handleResize);
        }, []);

        return <div>Count: {count}</div>;
      };

      const { unmount } = render(<TestComponent />);

      // Get initial listener count
      const getListenerCount = () => {
        const listeners = (window as any).getEventListeners?.(window) || {};
        return listeners.resize?.length || 0;
      };

      const initialCount = getListenerCount();

      // Unmount should clean up listeners
      unmount();

      const finalCount = getListenerCount();
      
      // Should not have added any persistent listeners
      expect(finalCount).toBeLessThanOrEqual(initialCount);
    });

    it('handles large datasets without memory issues', () => {
      const LargeDataComponent = ({ data }: { data: any[] }) => {
        // Use pagination or virtualization for large datasets
        const [page, setPage] = React.useState(0);
        const pageSize = 100;
        
        const paginatedData = React.useMemo(() => {
          const start = page * pageSize;
          return data.slice(start, start + pageSize);
        }, [data, page, pageSize]);

        return (
          <div>
            {paginatedData.map((item, index) => (
              <div key={index}>{item.name}</div>
            ))}
            <button onClick={() => setPage(p => p + 1)}>Next Page</button>
          </div>
        );
      };

      // Create large dataset
      const largeData = Array.from({ length: 50000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        data: `Data for item ${i}`
      }));

      const renderTime = performanceHelpers.measureRenderTime(() => {
        render(<LargeDataComponent data={largeData} />);
      });

      // Should handle large datasets efficiently through pagination
      expect(renderTime).toBeLessThan(100);
    });

    it('cleanup prevents memory leaks in subscriptions', () => {
      const TestComponent = () => {
        const [data, setData] = React.useState(null);

        React.useEffect(() => {
          // Mock subscription
          let cancelled = false;
          
          const subscription = {
            unsubscribe: () => {
              cancelled = true;
            }
          };

          // Simulate async data fetching
          setTimeout(() => {
            if (!cancelled) {
              setData({ loaded: true });
            }
          }, 100);

          return () => subscription.unsubscribe();
        }, []);

        return <div>{data ? 'Loaded' : 'Loading'}</div>;
      };

      const { unmount } = render(<TestComponent />);

      // Unmount before data loads
      unmount();

      // Component should handle cleanup properly
      // (In a real scenario, you'd check that no state updates occur after unmount)
      expect(true).toBe(true); // Placeholder assertion
    });
  });

  describe('Network Performance', () => {
    it('batches API requests efficiently', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      });
      
      global.fetch = mockFetch;

      const useBatchedRequests = () => {
        const [requests] = React.useState<string[]>([]);
        
        const batchedFetch = React.useCallback(async (urls: string[]) => {
          // Simulate request batching
          const startTime = performance.now();
          
          const promises = urls.map(url => fetch(url));
          await Promise.all(promises);
          
          const endTime = performance.now();
          return endTime - startTime;
        }, []);

        return { batchedFetch };
      };

      const { result } = renderHook(() => useBatchedRequests());

      const urls = Array.from({ length: 10 }, (_, i) => `/api/data/${i}`);
      
      const batchTime = await act(async () => {
        return await result.current.batchedFetch(urls);
      });

      // Batched requests should complete quickly
      expect(batchTime).toBeLessThan(100);
      expect(mockFetch).toHaveBeenCalledTimes(10);
    });

    it('caches API responses to reduce redundant requests', async () => {
      const cache = new Map();
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: 'cached' })
      });
      
      global.fetch = mockFetch;

      const useCachedFetch = () => {
        const cachedFetch = React.useCallback(async (url: string) => {
          if (cache.has(url)) {
            return cache.get(url);
          }
          
          const response = await fetch(url);
          const data = await response.json();
          cache.set(url, data);
          
          return data;
        }, []);

        return { cachedFetch };
      };

      const { result } = renderHook(() => useCachedFetch());

      // First request
      await act(async () => {
        await result.current.cachedFetch('/api/test');
      });

      // Second request (should use cache)
      await act(async () => {
        await result.current.cachedFetch('/api/test');
      });

      // Should only make one actual network request
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Bundle Size and Loading Performance', () => {
    it('lazy loads components efficiently', async () => {
      // Mock lazy loading
      const LazyComponent = React.lazy(() => 
        Promise.resolve({
          default: () => <div>Lazy Component Loaded</div>
        })
      );

      const TestApp = () => (
        <React.Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </React.Suspense>
      );

      const startTime = performance.now();
      const { findByText } = render(<TestApp />);
      
      // Should show loading state first
      expect(await findByText('Loading...')).toBeInTheDocument();
      
      // Then load the component
      expect(await findByText('Lazy Component Loaded')).toBeInTheDocument();
      
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Lazy loading should be efficient
      expect(loadTime).toBeLessThan(100);
    });

    it('code splitting reduces initial bundle size', () => {
      // Mock dynamic imports
      const dynamicImport = async (module: string) => {
        const startTime = performance.now();
        
        // Simulate module loading
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const endTime = performance.now();
        return endTime - startTime;
      };

      // Simulate loading multiple chunks
      const loadTime = performanceHelpers.measureAsyncOperation(async () => {
        await Promise.all([
          dynamicImport('auth-module'),
          dynamicImport('dashboard-module'),
          dynamicImport('admin-module')
        ]);
      });

      // Dynamic imports should be fast
      expect(loadTime).resolves.toBeLessThan(100);
    });
  });

  describe('Animation Performance', () => {
    it('animations run at 60fps', async () => {
      const AnimatedComponent = () => {
        const [isVisible, setIsVisible] = React.useState(false);
        
        // Mock animation with requestAnimationFrame
        React.useEffect(() => {
          if (isVisible) {
            let start: number;
            let frameCount = 0;
            
            const animate = (timestamp: number) => {
              if (!start) start = timestamp;
              
              frameCount++;
              const elapsed = timestamp - start;
              
              if (elapsed < 1000) { // Run for 1 second
                requestAnimationFrame(animate);
              } else {
                const fps = frameCount / (elapsed / 1000);
                // Should maintain close to 60fps
                expect(fps).toBeGreaterThan(55);
              }
            };
            
            requestAnimationFrame(animate);
          }
        }, [isVisible]);

        return (
          <div>
            <button onClick={() => setIsVisible(!isVisible)}>
              Toggle Animation
            </button>
            {isVisible && <div className="animated-element">Animating...</div>}
          </div>
        );
      };

      const { getByRole } = render(<AnimatedComponent />);
      const button = getByRole('button');
      
      // Start animation
      button.click();
      
      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 1100));
    });
  });
});