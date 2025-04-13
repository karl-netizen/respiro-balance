
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SubscriptionBadge from "@/components/subscription/SubscriptionBadge";

interface MobileMenuHeaderProps {
  toggleMenu: () => void;
}

const MobileMenuHeader = ({ toggleMenu }: MobileMenuHeaderProps) => {
  const { user, loading } = useAuth();
  
  if (user && !loading) {
    return (
      <div className="py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{user?.email}</p>
            <SubscriptionBadge className="mt-1" />
          </div>
        </div>
      </div>
    );
  } 
  
  if (!loading) {
    return (
      <div className="py-4 space-y-3">
        <Button asChild variant="default" className="w-full">
          <Link to="/login" onClick={toggleMenu}>
            Log in
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link to="/signup" onClick={toggleMenu}>
            Sign up
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="py-4">
      <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
    </div>
  );
};

export default MobileMenuHeader;
