
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Activity, Heart, LineChart, Smartphone, Watch, Users, AlertCircle } from "lucide-react";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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

  const handleDisconnectDevice = (deviceId: string) => {
    disconnectBluetoothDevice(deviceId);
    toast.info("Device disconnected", {
      description: "Your device has been disconnected successfully."
    });
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
              {preferences.connectedDevices.map((device) => (
                <div key={device.id} className="border rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{device.name}</span>
                    {isTeamOrEnterprise && (
                      <Badge className="text-xs">{device.type === "heart_rate" ? "Heart Rate" : "Activity"}</Badge>
                    )}
                  </div>
                  
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
                  
                  {isTeamOrEnterprise && (
                    <div className="mt-3 pt-3 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-destructive"
                        onClick={() => handleDisconnectDevice(device.id)}
                      >
                        Disconnect Device
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              
              {isTeamOrEnterprise && showTeamFeatures && (
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
              )}
            </div>
          ) : isConnecting ? (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
              <p className="text-sm mb-2">Searching for devices...</p>
              <p className="text-xs text-muted-foreground">
                Make sure your device is nearby and Bluetooth is enabled
              </p>
            </div>
          ) : (
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
                  {preferences.subscriptionTier === "Enterprise" 
                    ? "Enterprise tier allows unlimited device connections" 
                    : "Team tier supports up to 10 connected devices"}
                </p>
              )}
            </div>
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
                  preferences.connectedDevices.forEach(device => 
                    disconnectBluetoothDevice(device.id)
                  );
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
