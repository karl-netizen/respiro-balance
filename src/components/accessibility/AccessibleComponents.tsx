// ===================================================================
// ACCESSIBLE REACT COMPONENTS WITH DESIGN SYSTEM INTEGRATION
// ===================================================================

import React, { 
  forwardRef, 
  useState, 
  useEffect, 
  useRef, 
  createContext, 
  useContext,
  ReactNode,
  ButtonHTMLAttributes,
  InputHTMLAttributes
} from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// 1. ENHANCED ACCESSIBLE BUTTON
// ===================================================================

interface A11yButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  ariaLabel?: string;
}

export const A11yButton = forwardRef<HTMLButtonElement, A11yButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  ariaLabel,
  className,
  onClick,
  ...props
}, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading || disabled) return;
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && !disabled) {
        handleClick(e as any);
      }
    }
  };

  const baseClasses = cn(
    // Core styling
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-95 hover:scale-[1.02]",
    
    // Size variants
    {
      "h-8 px-3 text-xs": size === 'sm',
      "h-10 px-4 text-sm": size === 'md',
      "h-12 px-8 text-base": size === 'lg',
      "h-10 w-10 p-0": size === 'icon',
    },
    
    // Color variants using design system tokens
    {
      "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80": variant === 'primary',
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70": variant === 'secondary',
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80": variant === 'destructive',
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80": variant === 'outline',
      "hover:bg-accent hover:text-accent-foreground active:bg-accent/80": variant === 'ghost',
      "text-primary underline-offset-4 hover:underline active:text-primary/80": variant === 'link',
    },
    
    // Full width
    fullWidth && "w-full",
    
    className
  );

  return (
    <button
      ref={ref}
      className={baseClasses}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {isLoading && (
        <div className="mr-2 flex items-center animate-in fade-in-0 zoom-in-95">
          <A11ySpinner size="sm" />
        </div>
      )}
      
      {leftIcon && !isLoading && (
        <span className="mr-2 flex items-center">
          {leftIcon}
        </span>
      )}
      
      <span>
        {isLoading && loadingText ? loadingText : children}
      </span>
      
      {rightIcon && !isLoading && (
        <span className="ml-2 flex items-center">
          {rightIcon}
        </span>
      )}
      
      {/* Screen reader loading indicator */}
      {isLoading && (
        <span className="sr-only">
          Loading, please wait
        </span>
      )}
    </button>
  );
});

A11yButton.displayName = 'A11yButton';

// 2. ACCESSIBLE FORM FIELD
// ===================================================================

interface A11yFormFieldProps {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export const A11yFormField: React.FC<A11yFormFieldProps> = ({
  label,
  id,
  error,
  hint,
  required,
  children
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span
            aria-label="required"
            className="ml-1 text-destructive"
          >
            *
          </span>
        )}
      </label>
      
      {hint && (
        <p
          id={hintId}
          className="text-sm text-muted-foreground"
        >
          {hint}
        </p>
      )}
      
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-describedby': [hintId, errorId].filter(Boolean).join(' '),
        'aria-invalid': !!error,
        'aria-required': required,
      })}
      
      <AnimatePresence>
        {error && (
          <div
            id={errorId}
            role="alert"
            aria-live="polite"
            className="flex items-center gap-1 text-sm text-destructive animate-in fade-in-0 slide-in-from-top-2"
          >
            <A11yErrorIcon size="16" />
            {error}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 3. ACCESSIBLE INPUT
// ===================================================================

interface A11yInputProps extends InputHTMLAttributes<HTMLInputElement> {
  state?: 'default' | 'valid' | 'invalid' | 'disabled';
  fullWidth?: boolean;
}

export const A11yInput = forwardRef<HTMLInputElement, A11yInputProps>(({
  state = 'default',
  fullWidth = false,
  className,
  ...props
}, ref) => {
  const inputClasses = cn(
    // Base styles
    "flex h-10 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "transition-all duration-200",
    
    // State-specific styles
    {
      "border-input": state === 'default',
      "border-green-500 focus-visible:ring-green-500": state === 'valid',
      "border-destructive focus-visible:ring-destructive": state === 'invalid',
      "bg-muted cursor-not-allowed": state === 'disabled',
    },
    
    // Width
    fullWidth ? "w-full" : "w-auto",
    
    className
  );

  return (
    <input
      ref={ref}
      className={inputClasses}
      disabled={state === 'disabled'}
      {...props}
    />
  );
});

A11yInput.displayName = 'A11yInput';

// 4. ACCESSIBLE ALERT
// ===================================================================

interface A11yAlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const A11yAlert: React.FC<A11yAlertProps> = ({
  type,
  title,
  children,
  dismissible = true,
  onDismiss,
  action
}) => {
  const getIcon = () => {
    switch (type) {
      case 'info': return <A11yInfoIcon />;
      case 'success': return <A11yCheckIcon />;
      case 'warning': return <A11yWarningIcon />;
      case 'error': return <A11yErrorIcon />;
    }
  };

  const alertClasses = cn(
    "relative flex gap-3 rounded-lg border p-4",
    {
      "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200": type === 'info',
      "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200": type === 'success',
      "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200": type === 'warning',
      "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200": type === 'error',
    }
  );

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(alertClasses, "animate-in fade-in-0 slide-in-from-bottom-4")}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="mb-1 text-sm font-semibold">
            {title}
          </h4>
        )}
        
        <div className="text-sm">
          {children}
        </div>
        
        {action && (
          <div className="mt-3">
            <A11yButton
              variant="ghost"
              size="sm"
              onClick={action.onClick}
              className="text-current hover:bg-current/10"
            >
              {action.label}
            </A11yButton>
          </div>
        )}
      </div>
      
      {dismissible && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="flex-shrink-0 rounded-sm p-1 hover:bg-current/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 transition-colors"
        >
          <A11yCloseIcon size="16" />
        </button>
      )}
    </div>
  );
};

// 5. ACCESSIBLE MODAL
// ===================================================================

interface A11yModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const A11yModal: React.FC<A11yModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Escape key handling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape, onClose]);

  // Focus trap
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in-0"
          onClick={closeOnOverlayClick ? onClose : undefined}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
            className={cn(
              "w-full bg-background rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95",
              sizeClasses[size]
            )}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2
                id="modal-title"
                className="text-xl font-semibold text-foreground"
              >
                {title}
              </h2>
              
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
              >
                <A11yCloseIcon size="20" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

// 6. TOAST NOTIFICATION SYSTEM
// ===================================================================

interface A11yToast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const A11yToastContext = createContext<{
  addToast: (toast: Omit<A11yToast, 'id'>) => void;
  removeToast: (id: string) => void;
} | null>(null);

export const useA11yToast = () => {
  const context = useContext(A11yToastContext);
  if (!context) {
    throw new Error('useA11yToast must be used within A11yToastProvider');
  }
  return context;
};

export const A11yToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<A11yToast[]>([]);

  const addToast = (toast: Omit<A11yToast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <A11yToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <A11yToastContainer toasts={toasts} removeToast={removeToast} />
    </A11yToastContext.Provider>
  );
};

const A11yToastContainer: React.FC<{
  toasts: A11yToast[];
  removeToast: (id: string) => void;
}> = ({ toasts, removeToast }) => {
  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <A11yToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const A11yToastItem: React.FC<{
  toast: A11yToast;
  onRemove: () => void;
}> = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <A11yCheckIcon />;
      case 'error': return <A11yErrorIcon />;
      case 'warning': return <A11yWarningIcon />;
      case 'info': return <A11yInfoIcon />;
    }
  };

  const toastClasses = cn(
    "flex gap-3 rounded-lg border bg-background p-4 shadow-lg min-w-80",
    {
      "border-green-200": toast.type === 'success',
      "border-red-200": toast.type === 'error',
      "border-yellow-200": toast.type === 'warning',
      "border-blue-200": toast.type === 'info',
    }
  );

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(toastClasses, "animate-in slide-in-from-right-full")}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground">
          {toast.title}
        </h4>
        
        {toast.message && (
          <p className="mt-1 text-sm text-muted-foreground">
            {toast.message}
          </p>
        )}
        
        {toast.action && (
          <div className="mt-3">
            <button
              onClick={toast.action.onClick}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {toast.action.label}
            </button>
          </div>
        )}
      </div>
      
      <button
        onClick={onRemove}
        aria-label="Dismiss notification"
        className="flex-shrink-0 p-1 rounded-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
      >
        <A11yCloseIcon size="14" />
      </button>
    </div>
  );
};

// 7. UTILITY COMPONENTS AND ICONS
// ===================================================================

const A11ySpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <svg
      className={cn('animate-spin', sizeClasses[size])}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="32"
        opacity="0.3"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="24"
      />
    </svg>
  );
};

// Icon components using proper SVG structure
const A11yCheckIcon: React.FC<{ size?: string }> = ({ size = '20' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const A11yErrorIcon: React.FC<{ size?: string }> = ({ size = '20' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const A11yWarningIcon: React.FC<{ size?: string }> = ({ size = '20' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const A11yInfoIcon: React.FC<{ size?: string }> = ({ size = '20' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

const A11yCloseIcon: React.FC<{ size?: string }> = ({ size = '20' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

// Components are exported inline above