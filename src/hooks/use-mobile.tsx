
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      const checkIfMobile = () => {
        // Check screen width
        const isMobileWidth = window.innerWidth < MOBILE_BREAKPOINT;
        
        // Check for mobile user agent as a fallback
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
        
        return isMobileWidth || isMobileDevice;
      };
      
      const handleResize = () => {
        setIsMobile(checkIfMobile());
      };
      
      // Add event listener
      window.addEventListener('resize', handleResize);
      
      // Check on mount
      handleResize();
      
      // Also listen for custom viewport change events
      const handleViewportChange = (e: Event) => {
        const customEvent = e as CustomEvent;
        setIsMobile(customEvent.detail.isMobile);
      };
      window.addEventListener('viewport-change', handleViewportChange);
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('viewport-change', handleViewportChange);
      };
    }
  }, []);

  return isMobile;
}
