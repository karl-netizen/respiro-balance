import { vi } from 'vitest';

// Mock screen object for tests
export const mockScreen = {
  getByRole: vi.fn(),
  getByText: vi.fn(),
  getByLabelText: vi.fn(),
  getByTestId: vi.fn(),
  getAllByRole: vi.fn(),
  queryByRole: vi.fn(),
  queryByText: vi.fn(),
  findByText: vi.fn(),
  findByRole: vi.fn(),
};

// Mock render function
export const mockRender = vi.fn().mockReturnValue({
  container: document.createElement('div'),
  ...mockScreen,
});

// Mock fireEvent
export const mockFireEvent = {
  click: vi.fn(),
  change: vi.fn(),
  submit: vi.fn(),
  keyDown: vi.fn(),
  blur: vi.fn(),
};

// Mock waitFor
export const mockWaitFor = vi.fn().mockImplementation((callback) => {
  return Promise.resolve(callback());
});

// Mock axe function
export const mockAxe = vi.fn().mockResolvedValue({ violations: [] });

// Mock toHaveNoViolations matcher
export const mockToHaveNoViolations = vi.fn();

// Global test setup
export const setupTestEnvironment = () => {
  // Mock DOM APIs
  global.IntersectionObserver = vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
  })) as any;

  global.ResizeObserver = vi.fn(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
  })) as any;

  // Mock fetch
  global.fetch = vi.fn();

  return {
    screen: mockScreen,
    render: mockRender,
    fireEvent: mockFireEvent,
    waitFor: mockWaitFor,
    axe: mockAxe,
  };
};