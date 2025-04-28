
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriptionContext } from "@/hooks/useSubscriptionContext";
import { Button } from "@/components/ui/button";
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
    <div className="py-4 space-y-2">
      <Link
        to="/account"
        className="flex items-center gap-2 text-foreground/80 hover:text-primary py-2 button-transition"
        onClick={toggleMenu}
      >
        <User className="h-4 w-4" />
        <span>Profile Settings</span>
      </Link>
      
      {isPremium ? (
        <Link
          to="/subscription"
          className="flex items-center gap-2 text-foreground/80 hover:text-primary py-2 button-transition"
          onClick={toggleMenu}
        >
          <Crown className="h-4 w-4" />
          <span>Manage Subscription</span>
        </Link>
      ) : (
        <Link
          to="/subscription"
          className="flex items-center gap-2 text-foreground/80 hover:text-primary py-2 button-transition"
          onClick={toggleMenu}
        >
          <Crown className="h-4 w-4" />
          <span>Upgrade to Premium</span>
        </Link>
      )}
      
      <Button
        variant="ghost"
        className="w-full justify-start p-2 hover:bg-destructive/10 hover:text-destructive"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4 mr-2" />
        <span>Log out</span>
      </Button>
    </div>
  );
};

export default MobileMenuUserActions;
