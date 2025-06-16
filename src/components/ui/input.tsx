
import * as React from "react"
import { cn } from "@/lib/utils"
import { useDeviceDetection } from "@/hooks/useDeviceDetection"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
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
      
      return classes;
    };

    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          getMobileClasses(),
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
