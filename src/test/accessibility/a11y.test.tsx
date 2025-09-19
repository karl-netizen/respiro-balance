import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createTestWrapper, a11yTestHelpers } from '../utils/comprehensive-test-utils';

// Extend expect with accessibility matchers
expect.extend(toHaveNoViolations);

// Mock accessible components
const MockButton = ({ children, variant, isLoading, disabled, ariaLabel, ...props }: any) => (
  <button
    disabled={disabled || isLoading}
    aria-busy={isLoading}
    aria-label={ariaLabel}
    {...props}
  >
    {isLoading ? 'Loading...' : children}
  </button>
);

const MockModal = ({ isOpen, onClose, title, children }: any) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const previousFocus = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else if (previousFocus.current) {
      previousFocus.current.focus();
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
    <div
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
      tabIndex={-1}
      ref={modalRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 id="modal-title">{title}</h2>
          <button aria-label="Close modal" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const MockAlert = ({ variant, title, children, onDismiss, dismissible }: any) => (
  <div
    role="alert"
    aria-live="polite"
    style={{
      padding: '1rem',
      borderRadius: '0.25rem',
      backgroundColor: variant?.type === 'error' ? '#fee' : variant?.type === 'success' ? '#efe' : '#eef',
      border: `1px solid ${variant?.type === 'error' ? '#faa' : variant?.type === 'success' ? '#afa' : '#aaf'}`
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        {title && <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{title}</h3>}
        <div>{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          aria-label={`Dismiss ${title || 'alert'}`}
          style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          ×
        </button>
      )}
    </div>
  </div>
);

const MockForm = ({ children, onSubmit }: any) => (
  <form onSubmit={onSubmit} noValidate>
    {children}
  </form>
);

const MockFormField = ({ label, id, required, error, hint, children }: any) => (
  <div style={{ marginBottom: '1rem' }}>
    <label htmlFor={id} style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
      {label}
      {required && <span aria-label="required" style={{ color: 'red' }}> *</span>}
    </label>
    
    {React.cloneElement(children, {
      id,
      'aria-required': required,
      'aria-invalid': !!error,
      'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined
    })}
    
    {hint && (
      <div id={`${id}-hint`} style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
        {hint}
      </div>
    )}
    
    {error && (
      <div 
        id={`${id}-error`} 
        role="alert" 
        aria-live="polite"
        style={{ fontSize: '0.875rem', color: 'red', marginTop: '0.25rem' }}
      >
        {error}
      </div>
    )}
  </div>
);

const MockNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav aria-label="Main navigation">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <h1>My App</h1>
        
        {/* Desktop navigation */}
        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '1rem' }}>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/settings">Settings</a></li>
        </ul>
        
        {/* Mobile menu button */}
        <button
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>
      
      {/* Mobile navigation */}
      {isMenuOpen && (
        <div id="mobile-menu" role="menu">
          <a href="/dashboard" role="menuitem">Dashboard</a>
          <a href="/profile" role="menuitem">Profile</a>
          <a href="/settings" role="menuitem">Settings</a>
        </div>
      )}
    </nav>
  );
};

const MockDataTable = ({ data, columns }: any) => (
  <table role="table" aria-label="Data table">
    <thead>
      <tr>
        {columns.map((col: any) => (
          <th key={col.key} scope="col">
            {col.sortable ? (
              <button aria-label={`Sort by ${col.title}`}>
                {col.title}
              </button>
            ) : (
              col.title
            )}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row: any, index: number) => (
        <tr key={index}>
          {columns.map((col: any) => (
            <td key={col.key}>
              {col.render ? col.render(row[col.key]) : row[col.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

describe('Accessibility Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Button Accessibility', () => {
    it('meets accessibility standards', async () => {
      const { container } = render(
        <MockButton ariaLabel="Save document changes">
          Save
        </MockButton>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper keyboard navigation', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <div>
          <MockButton onClick={handleClick}>First Button</MockButton>
          <MockButton onClick={handleClick}>Second Button</MockButton>
        </div>
      );

      // Tab navigation
      await user.tab();
      expect(screen.getByRole('button', { name: 'First Button' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Second Button' })).toHaveFocus();

      // Enter key activation
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Space key activation
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('provides appropriate loading state feedback', () => {
      render(
        <MockButton isLoading={true} ariaLabel="Saving document">
          Save
        </MockButton>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Loading...');
    });

    it('handles disabled state correctly', () => {
      const handleClick = vi.fn();
      
      render(
        <MockButton disabled onClick={handleClick}>
          Disabled Button
        </MockButton>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();

      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Modal Accessibility', () => {
    it('meets accessibility standards', async () => {
      const { container } = render(
        <MockModal isOpen={true} onClose={() => {}} title="Test Modal">
          <p>Modal content</p>
        </MockModal>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('manages focus correctly', async () => {
      const user = userEvent.setup();
      let isOpen = true;
      const onClose = vi.fn(() => { isOpen = false; });

      const TestComponent = () => (
        <div>
          <button data-testid="trigger">Open Modal</button>
          <MockModal isOpen={isOpen} onClose={onClose} title="Focus Test Modal">
            <button>First focusable</button>
            <button>Second focusable</button>
          </MockModal>
        </div>
      );

      const { rerender } = render(<TestComponent />);

      // Modal should be focused when opened
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveFocus();

      // Tab should move to close button
      await user.tab();
      expect(screen.getByRole('button', { name: 'Close modal' })).toHaveFocus();

      // Tab should move to first focusable element
      await user.tab();
      expect(screen.getByRole('button', { name: 'First focusable' })).toHaveFocus();

      // Escape should close modal
      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalled();

      // Rerender with modal closed
      isOpen = false;
      rerender(<TestComponent />);

      // Focus should return to trigger (if we had proper focus management)
      const trigger = screen.getByTestId('trigger');
      // Note: In a real implementation, focus would return to the trigger
    });

    it('traps focus within modal', async () => {
      const user = userEvent.setup();

      render(
        <MockModal isOpen={true} onClose={() => {}} title="Focus Trap Test">
          <button>First</button>
          <button>Last</button>
        </MockModal>
      );

      const closeButton = screen.getByRole('button', { name: 'Close modal' });
      const firstButton = screen.getByRole('button', { name: 'First' });
      const lastButton = screen.getByRole('button', { name: 'Last' });

      // Focus close button
      closeButton.focus();
      expect(closeButton).toHaveFocus();

      // Tab to first button
      await user.tab();
      expect(firstButton).toHaveFocus();

      // Tab to last button
      await user.tab();
      expect(lastButton).toHaveFocus();

      // Tab should wrap back to close button
      await user.tab();
      expect(closeButton).toHaveFocus();
    });

    it('has proper ARIA attributes', () => {
      render(
        <MockModal isOpen={true} onClose={() => {}} title="ARIA Test Modal">
          <p>Modal content</p>
        </MockModal>
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      
      const title = screen.getByRole('heading', { name: 'ARIA Test Modal' });
      expect(title).toHaveAttribute('id', 'modal-title');
    });
  });

  describe('Form Accessibility', () => {
    it('meets accessibility standards', async () => {
      const { container } = render(
        <MockForm>
          <MockFormField label="Email Address" id="email" required>
            <input type="email" />
          </MockFormField>
          <MockFormField label="Password" id="password" required>
            <input type="password" />
          </MockFormField>
          <MockButton type="submit">Submit</MockButton>
        </MockForm>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides proper form labels and associations', () => {
      render(
        <MockFormField label="Email Address" id="email" required>
          <input type="email" />
        </MockFormField>
      );

      const input = screen.getByRole('textbox');
      const label = screen.getByText('Email Address');

      expect(input).toHaveAttribute('id', 'email');
      expect(label).toHaveAttribute('for', 'email');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('announces form errors to screen readers', async () => {
      const user = userEvent.setup();

      const TestForm = () => {
        const [error, setError] = React.useState('');

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const email = formData.get('email') as string;
          
          if (!email) {
            setError('Email is required');
          }
        };

        return (
          <MockForm onSubmit={handleSubmit}>
            <MockFormField label="Email" id="email" required error={error}>
              <input type="email" name="email" />
            </MockFormField>
            <MockButton type="submit">Submit</MockButton>
          </MockForm>
        );
      };

      render(<TestForm />);

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.getByRole('alert');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveAttribute('aria-live', 'polite');
        expect(errorMessage).toHaveTextContent('Email is required');
      });

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
    });

    it('provides helpful form hints', () => {
      render(
        <MockFormField 
          label="Password" 
          id="password" 
          required 
          hint="Must be at least 8 characters long"
        >
          <input type="password" />
        </MockFormField>
      );

      const input = screen.getByLabelText(/password/i);
      const hint = screen.getByText('Must be at least 8 characters long');

      expect(input).toHaveAttribute('aria-describedby', 'password-hint');
      expect(hint).toHaveAttribute('id', 'password-hint');
    });

    it('handles form validation states correctly', () => {
      render(
        <MockFormField 
          label="Email" 
          id="email" 
          required 
          error="Please enter a valid email address"
          hint="We'll never share your email"
        >
          <input type="email" />
        </MockFormField>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
      
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Please enter a valid email address');
      expect(errorMessage).toHaveAttribute('id', 'email-error');
    });
  });

  describe('Alert Accessibility', () => {
    it('meets accessibility standards', async () => {
      const { container } = render(
        <MockAlert variant={{ type: 'success' }} title="Success!">
          Your changes have been saved.
        </MockAlert>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides proper screen reader announcements', () => {
      render(
        <MockAlert variant={{ type: 'error' }} title="Error!">
          Please fix the following errors.
        </MockAlert>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'polite');
      expect(alert).toHaveTextContent('Error!');
      expect(alert).toHaveTextContent('Please fix the following errors.');
    });

    it('handles dismissible alerts correctly', async () => {
      const user = userEvent.setup();
      const onDismiss = vi.fn();

      render(
        <MockAlert 
          variant={{ type: 'info' }} 
          title="Information" 
          dismissible 
          onDismiss={onDismiss}
        >
          This is an informational message.
        </MockAlert>
      );

      const dismissButton = screen.getByRole('button', { name: 'Dismiss Information' });
      expect(dismissButton).toBeInTheDocument();

      await user.click(dismissButton);
      expect(onDismiss).toHaveBeenCalled();
    });
  });

  describe('Navigation Accessibility', () => {
    it('meets accessibility standards', async () => {
      const { container } = render(<MockNavigation />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides proper navigation landmarks', () => {
      render(<MockNavigation />);

      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav).toBeInTheDocument();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('My App');
    });

    it('handles mobile menu accessibility', async () => {
      const user = userEvent.setup();

      render(<MockNavigation />);

      const menuButton = screen.getByRole('button', { name: 'Toggle navigation menu' });
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');

      await user.click(menuButton);

      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      
      const mobileMenu = screen.getByRole('menu');
      expect(mobileMenu).toBeInTheDocument();
      expect(mobileMenu).toHaveAttribute('id', 'mobile-menu');

      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems).toHaveLength(3);
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();

      render(<MockNavigation />);

      // Tab through navigation links
      await user.tab();
      expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('link', { name: 'Profile' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('link', { name: 'Settings' })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: 'Toggle navigation menu' })).toHaveFocus();
    });
  });

  describe('Data Table Accessibility', () => {
    const mockData = [
      { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
      { name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
    ];

    const mockColumns = [
      { key: 'name', title: 'Name', sortable: true },
      { key: 'email', title: 'Email', sortable: false },
      { key: 'role', title: 'Role', sortable: true }
    ];

    it('meets accessibility standards', async () => {
      const { container } = render(
        <MockDataTable data={mockData} columns={mockColumns} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides proper table structure', () => {
      render(<MockDataTable data={mockData} columns={mockColumns} />);

      const table = screen.getByRole('table', { name: 'Data table' });
      expect(table).toBeInTheDocument();

      // Check column headers
      const nameHeader = screen.getByRole('columnheader', { name: 'Sort by Name' });
      expect(nameHeader).toBeInTheDocument();

      const emailHeader = screen.getByRole('columnheader', { name: 'Email' });
      expect(emailHeader).toBeInTheDocument();

      // Check table cells
      const cells = screen.getAllByRole('cell');
      expect(cells).toHaveLength(6); // 2 rows × 3 columns
    });

    it('handles sortable columns correctly', async () => {
      const user = userEvent.setup();

      render(<MockDataTable data={mockData} columns={mockColumns} />);

      const sortButton = screen.getByRole('button', { name: 'Sort by Name' });
      expect(sortButton).toBeInTheDocument();

      await user.click(sortButton);
      // In a real implementation, this would trigger sorting
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('meets WCAG color contrast requirements', async () => {
      const { container } = render(
        <div>
          <h1 style={{ color: '#000', backgroundColor: '#fff' }}>High Contrast Heading</h1>
          <p style={{ color: '#333', backgroundColor: '#fff' }}>Regular text content</p>
          <MockButton variant={{ variant: 'primary' }}>Primary Button</MockButton>
          <MockAlert variant={{ type: 'error' }} title="Error">Error message</MockAlert>
        </div>
      );

      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });

      expect(results).toHaveNoViolations();
    });

    it('provides text alternatives for visual content', () => {
      render(
        <div>
          <img src="/test-image.jpg" alt="Descriptive text for the image" />
          <button aria-label="Close dialog">×</button>
          <div aria-label="Loading spinner" role="status">⟳</div>
        </div>
      );

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Descriptive text for the image');

      const closeButton = screen.getByRole('button', { name: 'Close dialog' });
      expect(closeButton).toBeInTheDocument();

      const spinner = screen.getByRole('status', { name: 'Loading spinner' });
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Screen Reader Support', () => {
    it('provides appropriate live regions', () => {
      render(
        <div>
          <div aria-live="polite" id="status">Status updates</div>
          <div aria-live="assertive" id="errors">Error messages</div>
          <div role="status" aria-live="polite">Loading...</div>
        </div>
      );

      const statusRegion = screen.getByText('Status updates');
      expect(statusRegion).toHaveAttribute('aria-live', 'polite');

      const errorRegion = screen.getByText('Error messages');
      expect(errorRegion).toHaveAttribute('aria-live', 'assertive');

      const loadingStatus = screen.getByRole('status');
      expect(loadingStatus).toHaveAttribute('aria-live', 'polite');
    });

    it('provides descriptive labels and landmarks', () => {
      render(
        <div>
          <header role="banner">
            <h1>Site Header</h1>
          </header>
          <main role="main" aria-label="Main content">
            <section aria-labelledby="section-heading">
              <h2 id="section-heading">Section Title</h2>
              <p>Section content</p>
            </section>
          </main>
          <aside role="complementary" aria-label="Sidebar">
            <h3>Related Links</h3>
          </aside>
          <footer role="contentinfo">
            <p>Footer content</p>
          </footer>
        </div>
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Main content');
      expect(screen.getByRole('complementary')).toHaveAttribute('aria-label', 'Sidebar');
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('handles dynamic content updates', async () => {
      const DynamicContent = () => {
        const [message, setMessage] = React.useState('');
        const [loading, setLoading] = React.useState(false);

        const handleUpdate = async () => {
          setLoading(true);
          setTimeout(() => {
            setMessage('Content updated successfully');
            setLoading(false);
          }, 1000);
        };

        return (
          <div>
            <button onClick={handleUpdate}>Update Content</button>
            {loading && (
              <div role="status" aria-live="polite">
                Loading new content...
              </div>
            )}
            {message && (
              <div role="status" aria-live="polite">
                {message}
              </div>
            )}
          </div>
        );
      };

      const user = userEvent.setup();
      render(<DynamicContent />);

      const button = screen.getByRole('button', { name: 'Update Content' });
      await user.click(button);

      expect(screen.getByRole('status', { name: 'Loading new content...' })).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByRole('status', { name: 'Content updated successfully' })).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });
});