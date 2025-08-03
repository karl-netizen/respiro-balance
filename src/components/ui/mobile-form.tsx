
import * as React from "react"
import { cn } from "@/lib/utils"
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

interface MobileFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  spacing?: 'compact' | 'normal' | 'relaxed';
}

export const MobileForm = React.forwardRef<HTMLFormElement, MobileFormProps>(
  ({ children, className, spacing = 'normal', ...props }, ref) => {
    const { deviceType, touchCapable } = useDeviceDetection();

    const getSpacingClasses = () => {
      const baseSpacing = {
        compact: 'space-y-3',
        normal: 'space-y-4',
        relaxed: 'space-y-6'
      };

      const mobileSpacing = {
        compact: 'space-y-4',
        normal: 'space-y-6', 
        relaxed: 'space-y-8'
      };

      return deviceType === 'mobile' ? mobileSpacing[spacing] : baseSpacing[spacing];
    };

    return (
      <form
        ref={ref}
        className={cn(
          "w-full",
          getSpacingClasses(),
          touchCapable && "touch-manipulation",
          // Add padding on mobile to prevent edge tapping issues
          deviceType === 'mobile' && "px-2",
          className
        )}
        {...props}
      >
        {children}
      </form>
    );
  }
);

MobileForm.displayName = "MobileForm";

interface MobileFormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  label?: string;
  error?: string;
  required?: boolean;
}

export const MobileFormField = React.forwardRef<HTMLDivElement, MobileFormFieldProps>(
  ({ children, className, label, error, required, ...props }, ref) => {
    const { deviceType } = useDeviceDetection();

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          // Ensure adequate spacing between form fields
          deviceType === 'mobile' && "mb-6",
          className
        )}
        {...props}
      >
        {label && (
          <label className={cn(
            "block text-sm font-medium text-gray-700 mb-2",
            deviceType === 'mobile' && "text-base mb-3",
            required && "after:content-['*'] after:text-red-500 after:ml-1"
          )}>
            {label}
          </label>
        )}
        {children}
        {error && (
          <p className={cn(
            "mt-1 text-sm text-red-600",
            deviceType === 'mobile' && "text-base mt-2"
          )}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

MobileFormField.displayName = "MobileFormField";
