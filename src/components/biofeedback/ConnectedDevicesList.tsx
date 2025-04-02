
import { Activity, Heart, LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BluetoothDevice } from "@/types/supabase"; // Import from shared type

interface ConnectedDevicesListProps {
  devices: BluetoothDevice[];
  isTeamOrEnterprise: boolean;
  onDisconnect: (deviceId: string) => void;
}

const ConnectedDevicesList = ({ 
  devices, 
  isTeamOrEnterprise, 
  onDisconnect 
}: ConnectedDevicesListProps) => {
  if (!Array.isArray(devices) || devices.length === 0) {
    return null;
  }

  return (
    <>
      {devices.map((device) => (
        <div key={device.id} className="border rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{device.name}</span>
            {isTeamOrEnterprise && (
              <Badge className="text-xs">{device.type === "heart_rate" ? "Heart Rate" : "Activity"}</Badge>
            )}
          </div>
          
          <DeviceMetrics />
          
          {isTeamOrEnterprise && (
            <div className="mt-3 pt-3 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-destructive"
                onClick={() => onDisconnect(device.id)}
              >
                Disconnect Device
              </Button>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

// Extracted device metrics into a separate component
const DeviceMetrics = () => {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium flex items-center">
          <Heart className="h-4 w-4 text-rose-500 mr-2" />
          Heart Rate
        </span>
        <span className="text-sm text-muted-foreground">Connected</span>
      </div>
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium flex items-center">
          <Activity className="h-4 w-4 text-emerald-500 mr-2" />
          Stress Level
        </span>
        <span className="text-sm text-muted-foreground">Connected</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-medium flex items-center">
          <LineChart className="h-4 w-4 text-blue-500 mr-2" />
          Focus Metrics
        </span>
        <span className="text-sm text-muted-foreground">Connected</span>
      </div>
    </>
  );
};

export default ConnectedDevicesList;
