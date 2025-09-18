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
  InputHTMLAttributes,
  FormHTMLAttributes,
  HTMLAttributes
} from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  ButtonVariant, 
  AlertVariant, 
  FormFieldState,
  getButtonStyles,
  animations,
  colors,
  spacing,
  typography,
  radius,
  shadows,
  focusVisible,
  srOnly,
  KEYBOARD_KEYS,
  AriaLabel,
  FocusableElement
} from './design-system-tokens';

// 1. BUTTON COMPONENT - Fully accessible with all variants
// ===================================================================

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  ariaLabel?: AriaLabel;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = { variant: 'primary', size: 'md' },
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  ariaLabel,
  onClick,
  ...props
}, ref) => {
  const styles = getButtonStyles(variant);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading) return;
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === KEYBOARD_KEYS.SPACE || e.key === KEYBOARD_KEYS.ENTER) {
      e.preventDefault();
      if (!isLoading && !disabled) {
        handleClick(e as any);
      }
    }
  };

  return (
    <motion.button
      ref={ref}
      style={{
        ...styles,
        width: fullWidth ? '100%' : 'auto',
      }}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            marginRight: spacing[2],
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <Spinner size="sm" />
        </motion.div>
      )}
      
      {leftIcon && !isLoading && (
        <span style={{ marginRight: spacing[2], display: 'flex', alignItems: 'center' }}>
          {leftIcon}
        </span>
      )}
      
      <span>
        {isLoading && loadingText ? loadingText : children}
      </span>
      
      {rightIcon && !isLoading && (
        <span style={{ marginLeft: spacing[2], display: 'flex', alignItems: 'center' }}>
          {rightIcon}
        </span>
      )}
      
      {/* Screen reader loading indicator */}
      {isLoading && (
        <span style={srOnly}>
          Loading, please wait
        </span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

// 2. FORM COMPONENTS - Accessible forms with validation states
// ===================================================================

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
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
    <div style={{ marginBottom: spacing[4] }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
          color: colors.neutral[700],
          marginBottom: spacing[2],
        }}
      >
        {label}
        {required && (
          <span
            aria-label="required"
            style={{ 
              color: colors.semantic.error,
              marginLeft: spacing[1] 
            }}
          >
            *
          </span>
        )}
      </label>
      
      {hint && (
        <p
          id={hintId}
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.neutral[500],
            marginBottom: spacing[2],
          }}
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
          <motion.p
            id={errorId}
            role="alert"
            aria-live="polite"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.semantic.error,
              marginTop: spacing[1],
              display: 'flex',
              alignItems: 'center',
              gap: spacing[1],
            }}
          >
            <ErrorIcon size="16" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  state?: FormFieldState;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  state = { state: 'default' },
  fullWidth = false,
  ...props
}, ref) => {
  const getInputStyles = () => {
    const baseStyles = {
      width: fullWidth ? '100%' : 'auto',
      padding: `${spacing[3]} ${spacing[4]}`,
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.normal,
      borderRadius: radius.md,
      border: `1px solid ${colors.neutral[300]}`,
      backgroundColor: colors.neutral[0],
      transition: 'all 150ms ease-in-out',
      
      '&:focus': {
        ...focusVisible,
        borderColor: colors.primary[500],
      },
      
      '&::placeholder': {
        color: colors.neutral[400],
      },
    };

    switch (state.state) {
      case 'valid':
        return {
          ...baseStyles,
          borderColor: colors.semantic.success,
          '&:focus': {
            ...focusVisible,
            borderColor: colors.semantic.success,
          },
        };
        
      case 'invalid':
        return {
          ...baseStyles,
          borderColor: colors.semantic.error,
          '&:focus': {
            ...focusVisible,
            borderColor: colors.semantic.error,
          },
        };
        
      case 'disabled':
        return {
          ...baseStyles,
          backgroundColor: colors.neutral[50],
          color: colors.neutral[400],
          cursor: 'not-allowed',
        };
        
      default:
        return baseStyles;
    }
  };

  return (
    <input
      ref={ref}
      style={getInputStyles()}
      disabled={state.state === 'disabled'}
      {...props}
    />
  );
});

Input.displayName = 'Input';

// 3. ALERT COMPONENT - Accessible notifications
// ===================================================================

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  children,
  onDismiss
}) => {
  const getAlertStyles = () => {
    const baseStyles = {
      padding: spacing[4],
      borderRadius: radius.md,
      border: '1px solid',
      display: 'flex',
      alignItems: 'flex-start',
      gap: spacing[3],
    };

    switch (variant.type) {
      case 'info':
        return {
          ...baseStyles,
          backgroundColor: colors.primary[50],
          borderColor: colors.primary[200],
          color: colors.primary[800],
        };
        
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: '#f0fdf4',
          borderColor: '#bbf7d0',
          color: '#166534',
        };
        
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: '#fffbeb',
          borderColor: '#fed7aa',
          color: '#9a3412',
        };
        
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: '#fef2f2',
          borderColor: '#fecaca',
          color: '#991b1b',
        };
    }
  };

  const getIcon = () => {
    switch (variant.type) {
      case 'info': return <InfoIcon />;
      case 'success': return <CheckIcon />;
      case 'warning': return <WarningIcon />;
      case 'error': return <ErrorIcon />;
    }
  };

  const canDismiss = variant.dismissible !== false;

  return (
    <motion.div
      role="alert"
      aria-live="polite"
      style={getAlertStyles()}
      {...animations.fadeUp}
    >
      <div style={{ flexShrink: 0 }}>
        {getIcon()}
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <h4 style={{
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.semibold,
            marginBottom: spacing[1],
          }}>
            {title}
          </h4>
        )}
        
        <div style={{
          fontSize: typography.fontSize.sm,
          lineHeight: typography.lineHeight.normal,
        }}>
          {children}
        </div>
        
        {(variant.type === 'success' && variant.action) && (
          <div style={{ marginTop: spacing[3] }}>
            <Button
              variant={{ variant: 'ghost', size: 'sm' }}
              onClick={variant.action.onClick}
            >
              {variant.action.label}
            </Button>
          </div>
        )}
        
        {(variant.type === 'error' && variant.retry) && (
          <div style={{ marginTop: spacing[3] }}>
            <Button
              variant={{ variant: 'secondary', size: 'sm' }}
              onClick={variant.retry}
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
      
      {canDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss alert"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: spacing[1],
            borderRadius: radius.sm,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'currentColor',
            opacity: 0.7,
            transition: 'opacity 150ms ease-in-out',
            
            '&:hover': {
              opacity: 1,
            },
            
            '&:focus-visible': focusVisible,
          }}
        >
          <CloseIcon size="16" />
        </button>
      )}
    </motion.div>
  );
};

// 4. MODAL COMPONENT - Fully accessible dialog
// ===================================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
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
      if (e.key === KEYBOARD_KEYS.ESCAPE && closeOnEscape) {
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
    if (e.key === KEYBOARD_KEYS.TAB) {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<FocusableElement>;
      
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

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { maxWidth: '28rem' };
      case 'md': return { maxWidth: '32rem' };
      case 'lg': return { maxWidth: '42rem' };
      case 'xl': return { maxWidth: '56rem' };
    }
  };

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants: Variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing[4],
            zIndex: 1000,
          }}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={closeOnOverlayClick ? onClose : undefined}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
            style={{
              backgroundColor: colors.neutral[0],
              borderRadius: radius.lg,
              boxShadow: shadows.xl,
              width: '100%',
              ...getSizeStyles(),
            }}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div style={{
              padding: `${spacing[6]} ${spacing[6]} ${spacing[4]}`,
              borderBottom: `1px solid ${colors.neutral[200]}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <h2
                id="modal-title"
                style={{
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.neutral[900],
                  margin: 0,
                }}
              >
                {title}
              </h2>
              
              <button
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: spacing[2],
                  borderRadius: radius.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.neutral[400],
                  transition: 'color 150ms ease-in-out',
                  
                  '&:hover': {
                    color: colors.neutral[600],
                  },
                  
                  '&:focus-visible': focusVisible,
                }}
              >
                <CloseIcon size="20" />
              </button>
            </div>
            
            {/* Content */}
            <div style={{ padding: spacing[6] }}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 5. TOAST NOTIFICATION SYSTEM
// ===================================================================

interface Toast {
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

const ToastContext = createContext<{
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
} | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
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
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{
  toasts: Toast[];
  removeToast: (id: string) => void;
}> = ({ toasts, removeToast }) => {
  return (
    <div
      role="region"
      aria-label="Notifications"
      style={{
        position: 'fixed',
        top: spacing[4],
        right: spacing[4],
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[2],
        maxWidth: '24rem',
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{
  toast: Toast;
  onRemove: () => void;
}> = ({ toast, onRemove }) => {
  const getToastStyles = () => {
    const baseStyles = {
      padding: spacing[4],
      borderRadius: radius.md,
      backgroundColor: colors.neutral[0],
      border: '1px solid',
      boxShadow: shadows.lg,
      display: 'flex',
      alignItems: 'flex-start',
      gap: spacing[3],
      minWidth: '20rem',
    };

    switch (toast.type) {
      case 'success':
        return { ...baseStyles, borderColor: '#bbf7d0' };
      case 'error':
        return { ...baseStyles, borderColor: '#fecaca' };
      case 'warning':
        return { ...baseStyles, borderColor: '#fed7aa' };
      case 'info':
        return { ...baseStyles, borderColor: colors.primary[200] };
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckIcon />;
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      case 'info': return <InfoIcon />;
    }
  };

  return (
    <motion.div
      role="alert"
      aria-live="polite"
      style={getToastStyles()}
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 300,
      }}
      whileHover={{ scale: 1.02 }}
    >
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        {getIcon()}
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.semibold,
          color: colors.neutral[900],
          margin: 0,
          marginBottom: toast.message ? spacing[1] : 0,
        }}>
          {toast.title}
        </h4>
        
        {toast.message && (
          <p style={{
            fontSize: typography.fontSize.sm,
            color: colors.neutral[600],
            margin: 0,
            lineHeight: typography.lineHeight.normal,
          }}>
            {toast.message}
          </p>
        )}
        
        {toast.action && (
          <div style={{ marginTop: spacing[3] }}>
            <button
              onClick={toast.action.onClick}
              style={{
                background: 'none',
                border: 'none',
                color: colors.primary[600],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                cursor: 'pointer',
                textDecoration: 'underline',
                
                '&:hover': {
                  color: colors.primary[700],
                },
                
                '&:focus-visible': focusVisible,
              }}
            >
              {toast.action.label}
            </button>
          </div>
        )}
      </div>
      
      <button
        onClick={onRemove}
        aria-label="Dismiss notification"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: spacing[1],
          borderRadius: radius.sm,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.neutral[400],
          transition: 'color 150ms ease-in-out',
          
          '&:hover': {
            color: colors.neutral[600],
          },
          
          '&:focus-visible': focusVisible,
        }}
      >
        <CloseIcon size="14" />
      </button>
    </motion.div>
  );
};

// 6. UTILITY COMPONENTS AND ICONS
// ===================================================================

const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeMap = { sm: '16', md: '20', lg: '24' };
  return (
    <motion.svg
      width={sizeMap[size]}
      height={sizeMap[size]}
      viewBox="0 0 24 24"
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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
    </motion.svg>
  );
};

// Simple icon components (replace with your preferred icon library)
const CheckIcon: React.FC<{ size?: string }> = ({ size = '20' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ErrorIcon: React.FC<{ size?: string }> = ({ size = '20' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const WarningIcon: React.FC<{ size?: string }> = ({ size = '20' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const InfoIcon: React.FC<{ size?: string }> = ({ size = '20' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

const CloseIcon: React.FC<{ size?: string }> = ({ size = '20' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

// 7. HIGHER-ORDER COMPONENTS FOR ACCESSIBILITY
// ===================================================================

// HOC for focus management
export const withFocusManagement = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return forwardRef<any, P>((props, ref) => {
    const internalRef = useRef<HTMLElement>(null);
    const focusRef = ref || internalRef;

    const focusElement = () => {
      if ('current' in focusRef && focusRef.current) {
        focusRef.current.focus();
      }
    };

    return (
      <Component
        {...props}
        ref={focusRef}
        onFocus={focusElement}
      />
    );
  });
};

// HOC for keyboard navigation
export const withKeyboardNavigation = <P extends object>(
  Component: React.ComponentType<P>,
  keyHandlers: Record<string, (e: KeyboardEvent) => void>
) => {
  return (props: P) => {
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const handler = keyHandlers[e.key];
        if (handler) {
          handler(e);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return <Component {...props} />;
  };
};

// Export all components
export {
  Button,
  FormField,
  Input,
  Alert,
  Modal,
  ToastProvider,
  useToast,
  Spinner,
  CheckIcon,
  ErrorIcon,
  WarningIcon,
  InfoIcon,
  CloseIcon,
};