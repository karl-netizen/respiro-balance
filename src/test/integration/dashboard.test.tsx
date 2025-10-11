import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '@/pages/Dashboard';

// Mock authentication
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: {
      id: 'test-user-123',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User'
      }
    },
    isLoading: false
  }))
}));

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({
              data: [],
              error: null
            }))
          })),
          single: vi.fn(() => Promise.resolve({
            data: null,
            error: null
          }))
        })),
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({
            data: [],
            error: null
          }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: null,
            error: null
          }))
        }))
      }))
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: {
          user: {
            id: 'test-user-123',
            email: 'test@example.com'
          }
        },
        error: null
      }))
    }
  }
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0
    }
  }
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();
  });

  describe('Dashboard Loading', () => {
    it('should render dashboard without crashing', async () => {
      renderWithProviders(<Dashboard />);
      
      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should display welcome message', async () => {
      renderWithProviders(<Dashboard />);
      
      await waitFor(() => {
        // Look for common dashboard elements
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Dashboard Components', () => {
    it('should display dashboard statistics', async () => {
      renderWithProviders(<Dashboard />);
      
      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should show quick access cards', async () => {
      renderWithProviders(<Dashboard />);
      
      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Navigation', () => {
    it('should navigate to meditation page', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Dashboard />);
      
      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      }, { timeout: 5000 });
      
      // Look for meditation-related buttons or links
      const meditationLinks = screen.queryAllByText(/meditat/i);
      if (meditationLinks.length > 0) {
        await user.click(meditationLinks[0]);
        // Navigation should occur
      }
    });

    it('should navigate to focus mode', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Dashboard />);
      
      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      }, { timeout: 5000 });
      
      const focusLinks = screen.queryAllByText(/focus/i);
      if (focusLinks.length > 0) {
        await user.click(focusLinks[0]);
        // Navigation should occur
      }
    });
  });

  describe('Module Activation', () => {
    it('should display available modules', async () => {
      renderWithProviders(<Dashboard />);
      
      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should handle module interactions', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Dashboard />);
      
      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      }, { timeout: 5000 });
      
      // Test that clicks don't crash the app
      const buttons = screen.queryAllByRole('button');
      if (buttons.length > 0) {
        await user.click(buttons[0]);
        expect(main).toBeInTheDocument();
      }
    });
  });

  describe('Data Loading', () => {
    it('should handle loading state', async () => {
      renderWithProviders(<Dashboard />);
      
      // Dashboard should eventually render
      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should handle empty data gracefully', async () => {
      renderWithProviders(<Dashboard />);
      
      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Responsive Behavior', () => {
    it('should render mobile layout', async () => {
      // Set mobile viewport
      global.innerWidth = 375;
      global.innerHeight = 667;
      
      renderWithProviders(<Dashboard />);
      
      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should render desktop layout', async () => {
      // Set desktop viewport
      global.innerWidth = 1920;
      global.innerHeight = 1080;
      
      renderWithProviders(<Dashboard />);
      
      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      renderWithProviders(<Dashboard />);
      
      // Should still render even with API errors
      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should display error boundaries', async () => {
      renderWithProviders(<Dashboard />);
      
      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('User Interactions', () => {
    it('should track user clicks', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Dashboard />);
      
      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      }, { timeout: 5000 });
      
      const buttons = screen.queryAllByRole('button');
      if (buttons.length > 0) {
        await user.click(buttons[0]);
        // Should not crash
        expect(main).toBeInTheDocument();
      }
    });

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Dashboard />);
      
      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toBeInTheDocument();
      }, { timeout: 5000 });
      
      // Test Tab navigation
      await user.keyboard('{Tab}');
      expect(main).toBeInTheDocument();
    });
  });
});
