
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { TouchFriendlyButton } from "@/components/responsive/TouchFriendlyButton";
import SubscriptionBadge from "@/components/subscription/SubscriptionBadge";
import ProfileAvatarUpload from "@/components/profile/ProfileAvatarUpload";

interface MobileMenuHeaderProps {
  toggleMenu: () => void;
}

const MobileMenuHeader = ({ toggleMenu }: MobileMenuHeaderProps) => {
  const { user, loading } = useAuth();
  
  if (user && !loading) {
    return (
      <div className="py-4">
        <div className="flex items-center gap-3">
          <ProfileAvatarUpload size="md" showUploadButton={false} />
          <div className="flex-1">
            <p className="font-medium text-white">{user?.email}</p>
            <SubscriptionBadge className="mt-1" />
          </div>
        </div>
      </div>
    );
  } 
  
  if (!loading) {
    return (
      <div className="py-4 space-y-3">
        <TouchFriendlyButton asChild variant="default" className="w-full bg-respiro-dark hover:bg-respiro-darker text-white">
          <Link to="/login" onClick={toggleMenu}>
            Log in
          </Link>
        </TouchFriendlyButton>
        <TouchFriendlyButton asChild variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
          <Link to="/register" onClick={toggleMenu}>
            Sign up
          </Link>
        </TouchFriendlyButton>
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
