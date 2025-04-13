
import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import MobileMenuHeader from "./MobileMenuHeader";
import MobileMenuLinks from "./MobileMenuLinks";
import MobileMenuUserActions from "./MobileMenuUserActions";
import { useAuth } from "@/hooks/useAuth";

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenu = ({ isOpen, toggleMenu }: MobileMenuProps) => {
  const { user } = useAuth();
  
  return (
    <Sheet open={isOpen} onOpenChange={toggleMenu}>
      <SheetContent side="right" className="sm:max-w-sm">
        <div className="h-full flex flex-col">
          <MobileMenuHeader toggleMenu={toggleMenu} />

          <Separator />

          <MobileMenuLinks toggleMenu={toggleMenu} />

          {user && (
            <>
              <Separator />
              <MobileMenuUserActions toggleMenu={toggleMenu} />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
