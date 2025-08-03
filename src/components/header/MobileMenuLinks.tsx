
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useDeviceDetection } from '@/hooks/core/useDeviceDetection';
import { 
  Home, Gauge, LineChart, Settings, BookOpen, Heart, 
  Clock, Sunrise, Briefcase
} from "lucide-react";
import MobileDropdown from "./MobileDropdown";

interface MobileMenuLinksProps {
  toggleMenu: () => void;
}

const MobileMenuLinks = ({ toggleMenu }: MobileMenuLinksProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const { deviceType } = useDeviceDetection();
  
  const isActive = (path: string) => {
    if (path === '/landing' || path === '/') {
      return location.pathname === '/landing' || location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  // Mobile-optimized link styling
  const getLinkClasses = (isActiveLink: boolean) => {
    const baseClasses = "flex items-center gap-3 text-white hover:text-respiro-light button-transition rounded-md";
    const paddingClasses = deviceType === 'mobile' 
      ? 'py-3 px-3 min-h-[48px]' 
      : 'py-2 px-2 min-h-[44px]';
    const activeClasses = isActiveLink ? 'text-respiro-light font-medium bg-gray-800' : '';
    
    return cn(baseClasses, paddingClasses, activeClasses);
  };

  const getIconSize = () => {
    return deviceType === 'mobile' ? 'h-5 w-5' : 'h-4 w-4';
  };

  const getTextSize = () => {
    return deviceType === 'mobile' ? 'text-base' : 'text-sm';
  };

  const handleLinkClick = (path: string) => {
    toggleMenu();
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="flex-1 overflow-auto py-2 space-y-1 z-50">
      <Link
        to="/landing"
        className={getLinkClasses(isActive('/landing') || isActive('/'))}
        onClick={() => handleLinkClick('/landing')}
      >
        <Home className={getIconSize()} />
        <span className={getTextSize()}>Home</span>
      </Link>
      
      {user && (
        <Link
          to="/dashboard"
          className={getLinkClasses(isActive('/dashboard'))}
          onClick={() => handleLinkClick('/dashboard')}
        >
          <Gauge className={getIconSize()} />
          <span className={getTextSize()}>Dashboard</span>
        </Link>
      )}

      <MobileDropdown
        title="Meditate"
        icon={<BookOpen className={getIconSize()} />}
        items={[
          {
            label: "Guided Meditation",
            href: "/meditation?tab=guided",
          },
          {
            label: "Quick Sessions",
            href: "/meditation?tab=quick",
          },
          {
            label: "Deep Focus",
            href: "/meditation?tab=deep",
          },
          {
            label: "Sleep",
            href: "/meditation?tab=sleep",
          }
        ]}
        toggleMainMenu={toggleMenu}
        className="touch-manipulation"
      />

      <MobileDropdown
        title="Breathe"
        icon={<Heart className={getIconSize()} />}
        items={[
          {
            label: "Breathing Exercises",
            href: "/breathe",
          },
          {
            label: "Breathing Techniques",
            href: "/breathe?tab=techniques",
          },
          {
            label: "Box Breathing",
            href: "/breathe?tab=techniques&technique=box",
          },
          {
            label: "4-7-8 Breathing",
            href: "/breathe?tab=techniques&technique=478",
          },
          {
            label: "Coherent Breathing",
            href: "/breathe?tab=techniques&technique=coherent",
          },
          {
            label: "Alternate Nostril",
            href: "/breathe?tab=techniques&technique=alternate",
          }
        ]}
        toggleMainMenu={toggleMenu}
        className="touch-manipulation"
      />
      
      <MobileDropdown
        title="Work-Life Balance"
        icon={<Briefcase className={getIconSize()} />}
        items={[
          {
            label: "Balance Tools",
            href: "/work-life-balance",
          },
          {
            label: "Break Reminders",
            href: "/work-life-balance#breaks",
          },
          {
            label: "Focus Mode",
            href: "/focus",
          }
        ]}
        toggleMainMenu={toggleMenu}
        className="touch-manipulation"
      />
      
      <Link
        to="/morning-ritual"
        className={getLinkClasses(isActive('/morning-ritual'))}
        onClick={() => handleLinkClick('/morning-ritual')}
      >
        <Sunrise className={getIconSize()} />
        <span className={getTextSize()}>Morning Ritual</span>
      </Link>

      <Link
        to="/progress"
        className={getLinkClasses(isActive('/progress'))}
        onClick={() => handleLinkClick('/progress')}
      >
        <LineChart className={getIconSize()} />
        <span className={getTextSize()}>Progress</span>
      </Link>
      
      <Link
        to="/account"
        className={getLinkClasses(isActive('/account'))}
        onClick={() => handleLinkClick('/account')}
      >
        <Settings className={getIconSize()} />
        <span className={getTextSize()}>Account</span>
      </Link>
      
      <Link
        to="/landing#pricing"
        className={getLinkClasses(location.hash === '#pricing')}
        onClick={() => handleLinkClick('/landing#pricing')}
      >
        <Clock className={getIconSize()} />
        <span className={getTextSize()}>Pricing</span>
      </Link>
    </div>
  );
};

export default MobileMenuLinks;
