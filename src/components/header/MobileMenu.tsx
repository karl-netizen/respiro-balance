
import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import MobileMenuHeader from "./MobileMenuHeader";
import MobileMenuLinks from "./MobileMenuLinks";
import MobileMenuUserActions from "./MobileMenuUserActions";
import { useAuth } from "@/hooks/useAuth";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenu = ({ isOpen, toggleMenu }: MobileMenuProps) => {
  const { user } = useAuth();
  const { deviceType } = useDeviceDetection();
  
  // Enhanced mobile optimization
  const getSheetWidth = () => {
    switch (deviceType) {
      case 'mobile':
        return 'w-[280px] sm:w-[320px]';
      case 'tablet':
        return 'sm:max-w-sm';
      default:
        return 'sm:max-w-sm';
    }
  };

  const getContentPadding = () => {
    return deviceType === 'mobile' ? 'p-3 sm:p-4' : 'p-4';
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={toggleMenu}>
      <SheetContent 
        side="right" 
        className={`${getSheetWidth()} bg-gray-900 border-gray-800 text-white p-0 z-50`}
      >
        <div className={`h-full flex flex-col ${getContentPadding()}`}>
          <MobileMenuHeader toggleMenu={toggleMenu} />

          <Separator className="bg-gray-700 my-3" />

          <MobileMenuLinks toggleMenu={toggleMenu} />

          {user && (
            <>
              <Separator className="bg-gray-700 my-3" />
              <MobileMenuUserActions toggleMenu={toggleMenu} />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
