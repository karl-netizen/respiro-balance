
import React, { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Circle } from "lucide-react"; 
import DesktopNav from "./header/DesktopNav";
import MobileMenu from "./header/MobileMenu";
import AccountSection from "./header/AccountSection";
import BackButton from "./header/BackButton";
import { NotificationBell } from "./notifications";
import { MenuIcon } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/" || location.pathname === "/landing";
  const isTransparent = isHomePage;

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleLogoClick = useCallback(() => {
    console.log("Logo clicked! Current path:", location.pathname);
    
    if (location.pathname === "/landing" || location.pathname === "/") {
      console.log("Already on homepage, scrolling to top");
      window.scrollTo({top: 0, behavior: 'smooth'});
    } else {
      console.log("Navigating to landing page");
      navigate("/");
      
      setTimeout(() => {
        console.log("Scrolling to top after navigation");
        window.scrollTo({top: 0, behavior: 'smooth'});
      }, 300);
    }
  }, [location.pathname, navigate]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        isTransparent
          ? "bg-white/80 backdrop-blur-md border-b border-respiro-default/20"
          : "bg-white border-b border-respiro-default/30 shadow-sm"
      )}
    >
      <div className="container flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {!isHomePage && <BackButton />}
          <button
            className="flex items-center text-xl font-bold tracking-tight hover:text-respiro-dark transition-colors"
            aria-label="Home"
            onClick={handleLogoClick}
          >
            <Circle 
              className="mr-2 text-respiro-dark fill-respiro-default" 
              size={24} 
            />
            <span className="text-respiro-dark">Respiro Balance</span>
          </button>
        </div>

        <DesktopNav />

        <div className="flex items-center space-x-4">
          <NotificationBell />
          <AccountSection />
          
          <button
            className="p-2 rounded-md lg:hidden text-respiro-dark hover:bg-respiro-light/50 transition-colors"
            onClick={toggleMobileMenu}
            aria-controls="mobile-menu"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
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
