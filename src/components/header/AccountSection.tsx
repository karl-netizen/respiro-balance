
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, Crown } from "lucide-react";
import { useSubscriptionContext } from "@/hooks/useSubscriptionContext";
import SubscriptionBadge from "@/components/subscription/SubscriptionBadge";

const AccountSection = () => {
  const { user, loading, signOut } = useAuth();
  const { isPremium, tierName } = useSubscriptionContext();

  // Show login/signup buttons if not logged in
  if (!user && !loading) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/login">Log in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/signup">Sign up</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
    );
  }

  // Handle user dropdown for logged-in users
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full focus-visible:ring-offset-0 focus-visible:ring-0"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {isPremium && (
            <div className="absolute -bottom-1 -right-1 rounded-full bg-primary w-3 h-3 border border-background flex items-center justify-center">
              <Crown className="h-2 w-2 text-background" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>My Account</span>
          <SubscriptionBadge />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/account" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut?.()} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountSection;
