
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Activity, Heart, LineChart, Smartphone, Watch } from "lucide-react";
import { useUserPreferences } from "@/context/UserPreferencesContext";

const BiofeedbackCard = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [connectionAttempted, setConnectionAttempted] = useState(false);

  const handleConnectDevice = () => {
    setConnectionAttempted(true);
    // In a real app, this would trigger device detection and pairing
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Biofeedback</CardTitle>
          <Watch className="h-5 w-5 text-primary" />
        </div>
        <CardDescription>
          Connect your wearable device to enhance your meditation insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {preferences.hasWearableDevice ? (
            <div>
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
            </div>
          ) : connectionAttempted ? (
            <div className="text-center py-4">
              <div className="text-muted-foreground mb-2">No devices found</div>
              <p className="text-sm">
                Make sure your device is nearby and Bluetooth is enabled.
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
                Connect your smartwatch or fitness tracker to gain deeper insights into your meditation practice.
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="bg-secondary/30 px-2 py-1 rounded text-xs">Apple Watch</div>
                <div className="bg-secondary/30 px-2 py-1 rounded text-xs">Fitbit</div>
                <div className="bg-secondary/30 px-2 py-1 rounded text-xs">Garmin</div>
                <div className="bg-secondary/30 px-2 py-1 rounded text-xs">+More</div>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2 pt-4">
            <Switch
              id="wearable"
              checked={preferences.hasWearableDevice}
              onCheckedChange={(checked) => {
                updatePreferences({ hasWearableDevice: checked });
                if (checked) {
                  setConnectionAttempted(true);
                }
              }}
            />
            <label
              htmlFor="wearable"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {preferences.hasWearableDevice ? "Device connected" : "Enable wearable integration"}
            </label>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant={preferences.hasWearableDevice ? "outline" : "default"}
          className="w-full"
          onClick={handleConnectDevice}
        >
          {preferences.hasWearableDevice ? "Manage Device" : "Connect Device"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BiofeedbackCard;
