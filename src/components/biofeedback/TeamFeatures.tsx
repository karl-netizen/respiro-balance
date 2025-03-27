
import { Users, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const TeamFeatures = () => {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold mb-2">Team Features</h4>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-secondary/30 rounded">
          <div className="flex items-center">
            <Users className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">Team data sharing</span>
          </div>
          <Switch 
            checked={true} 
            onCheckedChange={() => {}}
          />
        </div>
        
        <div className="flex items-center justify-between p-2 bg-secondary/30 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">Coach access</span>
          </div>
          <Switch 
            checked={true} 
            onCheckedChange={() => {}}
          />
        </div>
        
        <div className="flex items-center justify-between p-2 bg-secondary/30 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">Stress alerts</span>
          </div>
          <Switch 
            checked={false} 
            onCheckedChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamFeatures;
