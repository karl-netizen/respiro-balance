
import * as React from "react"
import { cn } from "@/lib/utils"
import { useDeviceDetection } from "@/hooks/useDeviceDetection"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
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
      
      return classes;
    };

    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          getMobileClasses(),
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
