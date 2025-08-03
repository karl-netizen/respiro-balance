
import * as React from "react"
import { cn } from "@/lib/utils"
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  preventZoom?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, preventZoom = true, ...props }, ref) => {
    const { deviceType, touchCapable } = useDeviceDetection();
    
    // Mobile-optimized textarea styling
    const getMobileClasses = () => {
      let classes = '';
      
      if (deviceType === 'mobile') {
        classes += 'min-h-[100px] text-base '; // Larger minimum height and text for mobile
      } else if (deviceType === 'tablet') {
        classes += 'min-h-[90px] text-base '; // Medium height for tablet
      } else {
        classes += 'min-h-[80px] text-sm '; // Default desktop sizing
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

    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200",
          getMobileClasses(),
          touchCapable && "active:scale-[0.99]", // Subtle touch feedback
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
