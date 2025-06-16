
import React from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import MobileMenu from '@/components/header/MobileMenu';
import DesktopNav from '@/components/header/DesktopNav';
import { TouchFriendlyButton } from './TouchFriendlyButton';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponsiveNavigationProps {
  isMenuOpen?: boolean;
  toggleMenu?: () => void;
  className?: string;
}

export const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  isMenuOpen = false,
  toggleMenu,
  className,
}) => {
  const { deviceType, touchCapable } = useDeviceDetection();

  if (deviceType === 'mobile') {
    return (
      <>
        <TouchFriendlyButton
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          className={cn(
            'lg:hidden relative z-50',
            'brand-button',
            className
          )}
          aria-label="Toggle menu"
          hapticFeedback={true}
        >
          <Menu className="h-5 w-5" />
        </TouchFriendlyButton>
        
        {toggleMenu && (
          <MobileMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        )}
      </>
    );
  }

  if (deviceType === 'tablet') {
    return (
      <div className={cn('flex items-center', className)}>
        <TouchFriendlyButton
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          className="lg:hidden relative z-50 brand-button"
          aria-label="Toggle menu"
          hapticFeedback={true}
        >
          <Menu className="h-5 w-5" />
        </TouchFriendlyButton>
        
        <div className="hidden lg:block">
          <DesktopNav />
        </div>
        
        {toggleMenu && (
          <MobileMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        )}
      </div>
    );
  }

  // Desktop
  return (
    <div className={cn('hidden lg:flex', className)}>
      <DesktopNav />
    </div>
  );
};
