
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useUserPreferences } from "@/context";

const AccountSection = () => {
  const { preferences } = useUserPreferences();
  
  return (
    <div className="hidden md:flex items-center space-x-4">
      <div className="flex items-center">
        <div className="mr-2 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
          {preferences.subscriptionTier || "Free"}
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User size={20} />
        </Button>
      </div>
      <Button className="bg-primary text-white hover:bg-respiro-dark">
        Get Started
      </Button>
    </div>
  );
};

export default AccountSection;
