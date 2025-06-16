
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriptionContext } from "@/hooks/useSubscriptionContext";
import { TouchFriendlyButton } from "@/components/responsive/TouchFriendlyButton";
import { User, Crown, LogOut } from "lucide-react";

interface MobileMenuUserActionsProps {
  toggleMenu: () => void;
}

const MobileMenuUserActions = ({ toggleMenu }: MobileMenuUserActionsProps) => {
  const { user, signOut } = useAuth();
  const { isPremium } = useSubscriptionContext();
  
  if (!user) return null;
  
  const handleSignOut = () => {
    signOut();
    toggleMenu();
  };

  return (
    <div className="py-2 space-y-2">
      <Link
        to="/account"
        className="flex items-center gap-2 text-white hover:text-respiro-light py-2 button-transition"
        onClick={toggleMenu}
      >
        <User className="h-4 w-4" />
        <span>Profile Settings</span>
      </Link>
      
      {isPremium ? (
        <Link
          to="/subscription"
          className="flex items-center gap-2 text-white hover:text-respiro-light py-2 button-transition"
          onClick={toggleMenu}
        >
          <Crown className="h-4 w-4 text-yellow-500" />
          <span>Manage Subscription</span>
        </Link>
      ) : (
        <Link
          to="/subscription"
          className="flex items-center gap-2 text-white hover:text-respiro-light py-2 button-transition"
          onClick={toggleMenu}
        >
          <Crown className="h-4 w-4 text-yellow-500" />
          <span>Upgrade to Premium</span>
        </Link>
      )}
      
      <TouchFriendlyButton
        variant="ghost"
        className="w-full justify-start p-2 text-white hover:bg-red-600/20 hover:text-red-400"
        onClick={handleSignOut}
        hapticFeedback={true}
      >
        <LogOut className="h-4 w-4 mr-2" />
        <span>Log out</span>
      </TouchFriendlyButton>
    </div>
  );
};

export default MobileMenuUserActions;
