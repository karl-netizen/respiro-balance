
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { 
  Home, Gauge, LineChart, Settings, BookOpen, Heart, 
  Clock, Sunrise
} from "lucide-react";
import MobileDropdown from "./MobileDropdown";

interface MobileMenuLinksProps {
  toggleMenu: () => void;
}

const MobileMenuLinks = ({ toggleMenu }: MobileMenuLinksProps) => {
  const { user } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  }

  return (
    <div className="flex-1 overflow-auto py-2 space-y-2">
      <Link
        to="/"
        className={cn("flex items-center gap-2 text-white hover:text-respiro-light py-2 button-transition", isActive('/') && "text-respiro-light font-medium")}
        onClick={toggleMenu}
      >
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>
      
      {user && (
        <Link
          to="/dashboard"
          className={cn("flex items-center gap-2 text-white hover:text-respiro-light py-2 button-transition", isActive('/dashboard') && "text-respiro-light font-medium")}
          onClick={toggleMenu}
        >
          <Gauge className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
      )}

      <MobileDropdown
        title="Meditate"
        icon={<BookOpen className="h-4 w-4" />}
        items={[
          {
            label: "All Sessions",
            href: "/meditate",
          },
          {
            label: "Guided Meditation",
            href: "/meditate?tab=guided",
          },
          {
            label: "Quick Sessions",
            href: "/meditate?tab=quick",
          },
          {
            label: "Deep Focus",
            href: "/meditate?tab=deep",
          },
          {
            label: "Sleep",
            href: "/meditate?tab=sleep",
          }
        ]}
        toggleMainMenu={toggleMenu}
      />

      <MobileDropdown
        title="Breathe"
        icon={<Heart className="h-4 w-4" />}
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
          }
        ]}
        toggleMainMenu={toggleMenu}
      />
      
      <Link
        to="/morning-ritual"
        className={cn("flex items-center gap-2 text-white hover:text-respiro-light py-2 button-transition", isActive('/morning-ritual') && "text-respiro-light font-medium")}
        onClick={toggleMenu}
      >
        <Sunrise className="h-4 w-4" />
        <span>Morning Ritual</span>
      </Link>

      <Link
        to="/progress"
        className={cn("flex items-center gap-2 text-white hover:text-respiro-light py-2 button-transition", isActive('/progress') && "text-respiro-light font-medium")}
        onClick={toggleMenu}
      >
        <LineChart className="h-4 w-4" />
        <span>Progress</span>
      </Link>
      
      <Link
        to="/account"
        className={cn("flex items-center gap-2 text-white hover:text-respiro-light py-2 button-transition", isActive('/account') && "text-respiro-light font-medium")}
        onClick={toggleMenu}
      >
        <Settings className="h-4 w-4" />
        <span>Account</span>
      </Link>
      
      <Link
        to="/#pricing"
        className={cn("flex items-center gap-2 text-white hover:text-respiro-light py-2 button-transition", location.hash === '#pricing' && "text-respiro-light font-medium")}
        onClick={toggleMenu}
      >
        <Clock className="h-4 w-4" />
        <span>Pricing</span>
      </Link>
    </div>
  );
};

export default MobileMenuLinks;
