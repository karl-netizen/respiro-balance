
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Watch } from "lucide-react";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { toast } from "sonner";

import ConnectedDevicesList from "./ConnectedDevicesList";
import DeviceSearching from "./DeviceSearching";
import NoDevicesView from "./NoDevicesView";
import TeamFeatures from "./TeamFeatures";

const BiofeedbackCard = () => {
  const { preferences, updatePreferences, connectBluetoothDevice, disconnectBluetoothDevice } = useUserPreferences();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showTeamFeatures, setShowTeamFeatures] = useState(false);

  const isTeamOrEnterprise = preferences.subscriptionTier === "Team" || preferences.subscriptionTier === "Enterprise";

  const handleConnectDevice = async () => {
    if (preferences.hasWearableDevice) {
      // Show device management options
      setShowTeamFeatures(!showTeamFeatures);
      return;
    }
    
    setIsConnecting(true);
    
    try {
      const success = await connectBluetoothDevice();
      
      if (success) {
        toast.success("Device connected successfully", {
          description: "Your wearable device is now connected to Respiro Balance."
        });
      } else {
        toast.error("Connection failed", {
          description: "Unable to connect to your device. Please try again."
        });
      }
    } catch (error) {
      toast.error("Connection error", {
        description: "An error occurred while connecting to your device."
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Biofeedback</CardTitle>
          <Watch className="h-5 w-5 text-primary" />
        </div>
        <CardDescription>
          {isTeamOrEnterprise 
            ? "Connect multiple wearable devices and share insights with your team" 
            : "Connect your wearable device to enhance your meditation insights"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {preferences.hasWearableDevice ? (
            <div>
              <ConnectedDevicesList 
                devices={preferences.connectedDevices} 
                isTeamOrEnterprise={isTeamOrEnterprise}
                onDisconnect={disconnectBluetoothDevice}
              />
              
              {isTeamOrEnterprise && showTeamFeatures && (
                <TeamFeatures />
              )}
            </div>
          ) : isConnecting ? (
            <DeviceSearching />
          ) : (
            <NoDevicesView isTeamOrEnterprise={isTeamOrEnterprise} />
          )}
          
          <div className="flex items-center space-x-2 pt-4">
            <Switch
              id="wearable"
              checked={preferences.hasWearableDevice}
              onCheckedChange={(checked) => {
                updatePreferences({ hasWearableDevice: checked });
                if (checked) {
                  connectBluetoothDevice();
                } else {
                  if (Array.isArray(preferences.connectedDevices)) {
                    preferences.connectedDevices.forEach(device => 
                      disconnectBluetoothDevice(device.id)
                    );
                  }
                }
              }}
            />
            <label
              htmlFor="wearable"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {preferences.hasWearableDevice 
                ? isTeamOrEnterprise 
                  ? "Devices connected" 
                  : "Device connected" 
                : "Enable wearable integration"}
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant={preferences.hasWearableDevice ? "outline" : "default"}
          className="w-full"
          onClick={handleConnectDevice}
          disabled={isConnecting}
        >
          {isConnecting 
            ? "Connecting..." 
            : preferences.hasWearableDevice 
              ? isTeamOrEnterprise 
                ? showTeamFeatures ? "Hide Team Settings" : "Team Device Settings" 
                : "Manage Device"
              : isTeamOrEnterprise 
                ? "Connect Team Devices" 
                : "Connect Device"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BiofeedbackCard;
