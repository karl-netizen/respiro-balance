
import { useState, useEffect } from "react";

export type ToastVariant = "default" | "destructive";

export type ToastProps = {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: React.ReactNode;
};

export type Toast = ToastProps & {
  id: string;
};

const DEFAULT_TOAST_DURATION = 5000;

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (props: ToastProps) => {
    const id = props.id || Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...props,
      id,
      variant: props.variant || "default",
      duration: props.duration || DEFAULT_TOAST_DURATION,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Log for debugging in non-production environments
    console.log(`Toast: ${newToast.title} - ${newToast.description} (${newToast.variant})`);
    
    return {
      id,
      dismiss: () => dismissToast(id),
      update: (props: ToastProps) => updateToast(id, props),
    };
  };

  const dismissToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const updateToast = (id: string, props: ToastProps) => {
    setToasts((prevToasts) =>
      prevToasts.map((toast) => (toast.id === id ? { ...toast, ...props } : toast))
    );
  };

  // Auto-dismiss toasts based on their duration
  useEffect(() => {
    const timers = toasts.map((toast) => {
      if (toast.duration !== Infinity) {
        return setTimeout(() => {
          dismissToast(toast.id);
        }, toast.duration);
      }
      return undefined;
    });

    return () => {
      timers.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [toasts]);

  return {
    toast,
    toasts,
    dismissToast,
    updateToast,
  };
};

// For convenience, to avoid repeating useToast().toast everywhere
export const toast = (props: ToastProps) => {
  console.log(`Direct toast called: ${props.title} - ${props.description}`);
  // This is just for logging, actual implementation happens in the useToast hook
};
