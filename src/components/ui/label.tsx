
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { useDeviceDetection } from "@/hooks/useDeviceDetection"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => {
  const { deviceType, touchCapable } = useDeviceDetection();
  
  const getMobileClasses = () => {
    if (deviceType === 'mobile') {
      return "text-base leading-relaxed"; // Larger text and better line height on mobile
    } else if (deviceType === 'tablet') {
      return "text-sm leading-relaxed";
    }
    return "";
  };

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        labelVariants(), 
        getMobileClasses(),
        touchCapable && "touch-manipulation",
        className
      )}
      {...props}
    />
  )
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
