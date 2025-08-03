
import * as React from "react"
import { cn } from "@/lib/utils"
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

export interface InputProps extends React.ComponentProps<"input"> {
  preventZoom?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, preventZoom = true, ...props }, ref) => {
    const { deviceType, touchCapable } = useDeviceDetection();
    
    // Mobile-optimized input styling
    const getMobileClasses = () => {
      let classes = '';
      
      if (deviceType === 'mobile') {
        classes += 'h-12 text-base '; // Larger height and text for mobile
      } else if (deviceType === 'tablet') {
        classes += 'h-11 text-base '; // Medium height for tablet
      } else {
        classes += 'h-10 md:text-sm '; // Default desktop sizing
      }
      
      // Add touch-friendly styling
      if (touchCapable) {
        classes += 'touch-manipulation ';
      }
      
      // Prevent zoom on iOS
      if (preventZoom && touchCapable && deviceType === 'mobile') {
        classes += 'text-base '; // Force 16px font size to prevent zoom
      }
      
      return classes;
    };

    // Get appropriate input type for mobile keyboards
    const getInputType = () => {
      if (props.inputMode) return type; // Respect explicit inputMode
      
      switch (type) {
        case 'email':
          return 'email';
        case 'tel':
          return 'tel';
        case 'number':
          return 'number';
        case 'url':
          return 'url';
        default:
          return type;
      }
    };

    // Set appropriate inputMode for better mobile keyboards
    const getInputMode = () => {
      if (props.inputMode) return props.inputMode;
      
      switch (type) {
        case 'email':
          return 'email';
        case 'tel':
          return 'tel';
        case 'number':
          return 'numeric';
        case 'url':
          return 'url';
        default:
          return undefined;
      }
    };

    return (
      <input
        type={getInputType()}
        inputMode={getInputMode()}
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          getMobileClasses(),
          touchCapable && "active:scale-[0.98]", // Subtle touch feedback
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
