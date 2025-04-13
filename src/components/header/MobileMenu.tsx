
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LogOut, Settings, User, Crown, Home, Gauge, LineChart, Clock, BookOpen, Heart } from "lucide-react";
import MobileDropdown from "./MobileDropdown";
import { useSubscriptionContext } from "@/context/SubscriptionProvider";
import SubscriptionBadge from "@/components/subscription/SubscriptionBadge";

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenu = ({ isOpen, toggleMenu }: MobileMenuProps) => {
  const { user, loading, signOut } = useAuth();
  const { isPremium } = useSubscriptionContext();

  const handleSignOut = () => {
    signOut();
    toggleMenu();
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleMenu}>
      <SheetContent side="right" className="sm:max-w-sm">
        <div className="h-full flex flex-col">
          {user && !loading ? (
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
          ) : !loading ? (
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
          ) : (
            <div className="py-4">
              <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
            </div>
          )}

          <Separator />

          <div className="flex-1 overflow-auto py-4 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-2 text-foreground/80 hover:text-primary py-2 button-transition"
              onClick={toggleMenu}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            {user && (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-foreground/80 hover:text-primary py-2 button-transition"
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
              ]}
              toggleMainMenu={toggleMenu}
            />

            <Link
              to="/progress"
              className="flex items-center gap-2 text-foreground/80 hover:text-primary py-2 button-transition"
              onClick={toggleMenu}
            >
              <LineChart className="h-4 w-4" />
              <span>Progress</span>
            </Link>

            <Link
              to="/#pricing"
              className="flex items-center gap-2 text-foreground/80 hover:text-primary py-2 button-transition"
              onClick={toggleMenu}
            >
              <Clock className="h-4 w-4" />
              <span>Pricing</span>
            </Link>
          </div>

          {user && (
            <>
              <Separator />
              <div className="py-4 space-y-2">
                <Link
                  to="/account"
                  className="flex items-center gap-2 text-foreground/80 hover:text-primary py-2 button-transition"
                  onClick={toggleMenu}
                >
                  <Settings className="h-4 w-4" />
                  <span>Account Settings</span>
                </Link>
                
                {isPremium && (
                  <Link
                    to="/subscription"
                    className="flex items-center gap-2 text-foreground/80 hover:text-primary py-2 button-transition"
                    onClick={toggleMenu}
                  >
                    <Crown className="h-4 w-4" />
                    <span>Subscription</span>
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
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
