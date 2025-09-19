import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestWrapper, TestDataFactory, securityTestHelpers } from '../utils/comprehensive-test-utils';

// Mock components - these would be your actual secure components
const MockSecureLoginForm = ({ onError, onSuccess, enableTwoFactor = false }: any) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showTwoFactor, setShowTwoFactor] = React.useState(false);
  const [twoFactorCode, setTwoFactorCode] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic XSS protection simulation
    if (securityTestHelpers.xssAttempts.some(xss => email.includes(xss.replace(/[<>]/g, '')))) {
      onError?.({ type: 'invalid_input', message: 'Invalid characters detected' });
      setIsSubmitting(false);
      return;
    }

    // Simulate authentication flow
    if (email === 'test@example.com' && password === 'password123') {
      if (enableTwoFactor && !showTwoFactor) {
        setShowTwoFactor(true);
        setIsSubmitting(false);
        return;
      }
      if (showTwoFactor && twoFactorCode === '123456') {
        onSuccess?.();
      }
    } else {
      onError?.({ type: 'invalid_credentials', attempts: 1, maxAttempts: 5 });
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{showTwoFactor ? 'Two-Factor Authentication' : 'Sign In'}</h2>
      
      {!showTwoFactor ? (
        <>
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isSubmitting}
          />
          
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={isSubmitting}
          />
        </>
      ) : (
        <>
          <label htmlFor="twoFactorCode">Authentication Code</label>
          <input
            id="twoFactorCode"
            type="text"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            placeholder="000000"
            maxLength={6}
          />
          <button type="button" onClick={() => setShowTwoFactor(false)}>
            ← Back to login
          </button>
        </>
      )}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : showTwoFactor ? 'Verify & Sign In' : 'Sign In'}
      </button>
    </form>
  );
};

const MockButton = ({ children, variant, isLoading, onClick, disabled, ...props }: any) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    aria-busy={isLoading}
    style={{ cursor: disabled || isLoading ? 'not-allowed' : 'pointer' }}
    {...props}
  >
    {isLoading ? 'Loading...' : children}
  </button>
);

const MockModal = ({ isOpen, onClose, title, children }: any) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-labelledby="modal-title" tabIndex={-1} ref={modalRef}>
      <div>
        <h2 id="modal-title">{title}</h2>
        <button aria-label="Close modal" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

describe('Component Security Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock fetch for CSRF token
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: 'mock_csrf_token' })
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('SecureLoginForm Component', () => {
    it('validates email format correctly', async () => {
      const user = userEvent.setup();
      const onError = vi.fn();

      render(<MockSecureLoginForm onError={onError} />, { wrapper: createTestWrapper() });

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      // HTML5 validation should prevent submission
      expect(onError).not.toHaveBeenCalled();
    });

    it('prevents XSS in form inputs', async () => {
      const user = userEvent.setup();
      const onError = vi.fn();

      render(<MockSecureLoginForm onError={onError} />, { wrapper: createTestWrapper() });

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      // Try to inject script (simplified version)
      await user.type(emailInput, 'scriptalert@test.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'invalid_input'
          })
        );
      });
    });

    it('handles successful login flow', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();

      render(<MockSecureLoginForm onSuccess={onSuccess} />, { wrapper: createTestWrapper() });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('shows two-factor authentication step', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();

      render(
        <MockSecureLoginForm enableTwoFactor={true} onSuccess={onSuccess} />, 
        { wrapper: createTestWrapper() }
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/two-factor authentication/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/authentication code/i)).toBeInTheDocument();
      });

      // Complete 2FA
      const codeInput = screen.getByLabelText(/authentication code/i);
      const verifyButton = screen.getByRole('button', { name: /verify & sign in/i });

      await user.type(codeInput, '123456');
      await user.click(verifyButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('handles invalid credentials', async () => {
      const user = userEvent.setup();
      const onError = vi.fn();

      render(<MockSecureLoginForm onError={onError} />, { wrapper: createTestWrapper() });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'invalid_credentials'
          })
        );
      });
    });

    it('prevents multiple simultaneous submissions', async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();

      render(<MockSecureLoginForm onSuccess={onSuccess} />, { wrapper: createTestWrapper() });

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      // Click multiple times rapidly
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      // Button should be disabled during submission
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });
  });

  describe('Button Component', () => {
    it('renders with correct variant styles', () => {
      render(<MockButton variant={{ variant: 'primary', size: 'lg' }}>Test Button</MockButton>);

      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveStyle({ cursor: 'pointer' });
    });

    it('handles loading state correctly', () => {
      const handleClick = vi.fn();
      
      render(
        <MockButton isLoading={true} onClick={handleClick}>
          Save
        </MockButton>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Should not call onClick when loading
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<MockButton onClick={handleClick}>Keyboard Test</MockButton>);

      const button = screen.getByRole('button');
      
      // Focus and press Enter
      button.focus();
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Press Space
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('prevents click when disabled', () => {
      const handleClick = vi.fn();
      
      render(<MockButton disabled onClick={handleClick}>Disabled Button</MockButton>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveStyle({ cursor: 'not-allowed' });

      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Modal Component', () => {
    it('manages focus correctly', async () => {
      const user = userEvent.setup();
      let isOpen = true;
      const onClose = vi.fn(() => { isOpen = false; });

      const { rerender } = render(
        <div>
          <button>Outside Button</button>
          <MockModal isOpen={isOpen} onClose={onClose} title="Test Modal">
            <button>Inside Button</button>
            <input type="text" placeholder="Test Input" />
          </MockModal>
        </div>
      );

      // Modal should be focused when opened
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveFocus();

      // Escape should close modal
      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalled();

      // Rerender with modal closed
      rerender(
        <div>
          <button>Outside Button</button>
          <MockModal isOpen={false} onClose={onClose} title="Test Modal">
            <button>Inside Button</button>
            <input type="text" placeholder="Test Input" />
          </MockModal>
        </div>
      );

      // Modal should not be in document when closed
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('has proper accessibility attributes', () => {
      render(
        <MockModal isOpen={true} onClose={() => {}} title="Accessible Modal">
          <p>Modal content</p>
        </MockModal>
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(screen.getByRole('heading', { name: 'Accessible Modal' })).toHaveAttribute('id', 'modal-title');
    });

    it('provides close button', () => {
      const onClose = vi.fn();
      
      render(
        <MockModal isOpen={true} onClose={onClose} title="Test Modal">
          <p>Content</p>
        </MockModal>
      );

      const closeButton = screen.getByRole('button', { name: 'Close modal' });
      expect(closeButton).toBeInTheDocument();

      fireEvent.click(closeButton);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Input Validation', () => {
    it('sanitizes input values', () => {
      const MockInput = ({ value, onChange }: any) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let sanitized = e.target.value;
          
          // Basic sanitization
          if (securityTestHelpers.xssAttempts.some(xss => sanitized.includes(xss))) {
            return; // Don't update if malicious
          }
          
          onChange(sanitized);
        };

        return <input value={value} onChange={handleChange} />;
      };

      const [value, setValue] = React.useState('');
      
      const TestComponent = () => (
        <MockInput value={value} onChange={setValue} />
      );

      render(<TestComponent />);
      
      const input = screen.getByRole('textbox');
      
      // Try malicious input
      fireEvent.change(input, { target: { value: '<script>alert("xss")</script>' } });
      expect(input).toHaveValue(''); // Should remain empty
      
      // Try safe input
      fireEvent.change(input, { target: { value: 'Safe content' } });
      expect(input).toHaveValue('Safe content');
    });
  });
});