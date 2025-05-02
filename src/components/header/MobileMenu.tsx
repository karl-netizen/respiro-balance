
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
      <SheetContent side="right" className="sm:max-w-sm bg-gray-900 border-gray-800 text-white p-0">
        <div className="h-full flex flex-col p-4">
          <MobileMenuHeader toggleMenu={toggleMenu} />

          <Separator className="bg-gray-700 my-2" />

          <MobileMenuLinks toggleMenu={toggleMenu} />

          {user && (
            <>
              <Separator className="bg-gray-700 my-2" />
              <MobileMenuUserActions toggleMenu={toggleMenu} />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
