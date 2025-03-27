
import { Smartphone } from "lucide-react";

interface NoDevicesViewProps {
  isTeamOrEnterprise: boolean;
}

const NoDevicesView = ({ isTeamOrEnterprise }: NoDevicesViewProps) => {
  return (
    <div className="text-center py-4">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-secondary/50 p-4">
          <Smartphone className="h-8 w-8 text-primary" />
        </div>
      </div>
      <p className="text-sm mb-4">
        {isTeamOrEnterprise 
          ? "Connect multiple devices for your team and share insights with coaches" 
          : "Connect your smartwatch or fitness tracker to gain deeper insights into your meditation practice."}
      </p>
      <div className="flex items-center justify-center space-x-2">
        <div className="bg-secondary/30 px-2 py-1 rounded text-xs">Apple Watch</div>
        <div className="bg-secondary/30 px-2 py-1 rounded text-xs">Fitbit</div>
        <div className="bg-secondary/30 px-2 py-1 rounded text-xs">Garmin</div>
        <div className="bg-secondary/30 px-2 py-1 rounded text-xs">+More</div>
      </div>
      
      {isTeamOrEnterprise && (
        <p className="text-xs mt-3 text-foreground/70">
          {isTeamOrEnterprise && "Team" === "Enterprise" 
            ? "Enterprise tier allows unlimited device connections" 
            : "Team tier supports up to 10 connected devices"}
        </p>
      )}
    </div>
  );
};

export default NoDevicesView;
