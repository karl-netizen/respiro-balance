// ===================================================================
// ACCESSIBLE UI COMPONENTS - Fixed implementation
// ===================================================================

import React, { forwardRef, useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button as BaseButton } from './button';
import { Input as BaseInput } from './input';
import { Alert as BaseAlert } from './alert';
import { cn } from '@/lib/utils';

// Enhanced Button with accessibility
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  loadingText?: string;
  ariaLabel?: string;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(({
  children,
  variant = 'default',
  size = 'default',
  isLoading = false,
  loadingText,
  ariaLabel,
  className,
  ...props
}, ref) => (
  <BaseButton
    ref={ref}
    variant={variant}
    size={size}
    disabled={isLoading || props.disabled}
    aria-label={ariaLabel}
    aria-busy={isLoading}
    className={cn(
      "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "transition-all duration-200 active:scale-95",
      className
    )}
    {...props}
  >
    {isLoading ? (
      <>
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        {loadingText || children}
      </>
    ) : (
      children
    )}
  </BaseButton>
));

AccessibleButton.displayName = 'AccessibleButton';

// Form Field with proper accessibility
interface AccessibleFormFieldProps {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
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
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      
      {hint && (
        <p id={hintId} className="text-sm text-muted-foreground">
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
            className="text-sm text-destructive flex items-center gap-1"
          >
            ⚠️ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// Toast system
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

const ToastContext = createContext<{
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
} | null>(null);

export const useAccessibleToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useAccessibleToast must be used within AccessibleToastProvider');
  }
  return context;
};

export const AccessibleToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    if (toast.duration !== 0) {
      setTimeout(() => removeToast(id), toast.duration || 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              role="alert"
              aria-live="polite"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={cn(
                "p-4 rounded-lg border shadow-lg bg-background",
                {
                  "border-green-200 bg-green-50": toast.type === 'success',
                  "border-red-200 bg-red-50": toast.type === 'error',
                  "border-yellow-200 bg-yellow-50": toast.type === 'warning',
                  "border-blue-200 bg-blue-50": toast.type === 'info',
                }
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-sm">{toast.title}</h4>
                  {toast.message && (
                    <p className="text-sm text-muted-foreground mt-1">{toast.message}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                  aria-label="Dismiss notification"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export {
  AccessibleButton,
  AccessibleFormField,
  AccessibleToastProvider,
  useAccessibleToast,
};