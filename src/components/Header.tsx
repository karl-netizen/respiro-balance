
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Circle } from "lucide-react"; // Changed from CircleDot to Circle
import DesktopNav from "./header/DesktopNav";
import MobileMenu from "./header/MobileMenu";
import AccountSection from "./header/AccountSection";
import { NotificationBell } from "./notifications";
import { MenuIcon } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isTransparent = isHomePage;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        isTransparent
          ? "bg-transparent"
          : "bg-background border-b shadow-sm"
      )}
    >
      <div className="container flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center text-xl font-bold tracking-tight hover:text-primary transition-colors"
          >
            <Circle 
              className="mr-2 text-respiro-dark fill-respiro-dark" 
              size={24} 
            />
            <span className="text-respiro-dark">Respiro Balance</span>
          </Link>
        </div>

        <DesktopNav />

        <div className="flex items-center space-x-4">
          <NotificationBell />
          <AccountSection />
          
          <button
            className="p-2 rounded-md lg:hidden"
            onClick={toggleMobileMenu}
            aria-controls="mobile-menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <MobileMenu isOpen={mobileMenuOpen} toggleMenu={toggleMobileMenu} />
    </header>
  );
};

export default Header;
