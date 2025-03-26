
import { useState, useEffect } from 'react';
import DesktopNav from './header/DesktopNav';
import AccountSection from './header/AccountSection';
import MobileMenu from './header/MobileMenu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-10 
      ${isScrolled ? 'glass-morph' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mindflow to-mindflow-dark flex items-center justify-center">
            <span className="text-white font-semibold text-lg">R</span>
          </div>
          <h1 className="ml-3 text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-mindflow-dark to-mindflow">
            Respiro Balance
          </h1>
        </div>

        {/* Desktop Navigation */}
        <DesktopNav />

        {/* Account and Subscription Elements */}
        <AccountSection />

        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={mobileMenuOpen} 
          toggleMenu={toggleMobileMenu} 
        />
      </div>
    </header>
  );
};

export default Header;
