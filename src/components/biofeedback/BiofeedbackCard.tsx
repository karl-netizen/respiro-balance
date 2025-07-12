import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TouchFriendlyButton } from "@/components/responsive/TouchFriendlyButton";
import { Switch } from "@/components/ui/switch";
import { Monitor } from "lucide-react";
import { useUserPreferences } from "@/context";
import { toast } from "sonner";
import { BluetoothDevice, BluetoothDeviceInfo } from "@/types/bluetooth";

import ConnectedDevicesList from "./ConnectedDevicesList";
import DeviceSearching from "./DeviceSearching";
import NoDevicesView from "./NoDevicesView";
import TeamFeatures from "./TeamFeatures";

const BiofeedbackCard = () => {
  const { preferences, updatePreferences, connectBluetoothDevice, disconnectBluetoothDevice } = useUserPreferences();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showTeamFeatures, setShowTeamFeatures] = useState(false);

  const isTeamOrEnterprise = ["team", "enterprise", "premium"].includes(preferences.subscriptionTier || 'free');
  
  const handleConnectDevice = async () => {
    if (preferences.hasWearableDevice) {
      setShowTeamFeatures(!showTeamFeatures);
      return;
    }
    
    setIsConnecting(true);
    
    try {
      // Mock device for connection
      const mockDevice: BluetoothDeviceInfo = {
        id: 'mock-device-001',
        name: 'Respiro HR Monitor',
        type: 'heart_rate_monitor',
        connected: true,
        rssi: -45,
        services: ['heart_rate']
      };
      
      if (connectBluetoothDevice) {
        await connectBluetoothDevice(mockDevice);
      }
      
      if (connectBluetoothDevice) {
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

  const handleScanForDevices = async (deviceType?: string, options?: any): Promise<void> => {
    setIsConnecting(true);
    try {
      // Mock scanning process
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectDeviceById = async (deviceId: string, callback?: () => void): Promise<void> => {
    try {
      const mockDevice: BluetoothDeviceInfo = {
        id: deviceId,
        name: 'Mock Device',
        type: 'heart_rate_monitor',
        connected: true,
        rssi: -45,
        services: ['heart_rate']
      };
      
      await connectBluetoothDevice(mockDevice);
      if (callback) callback();
    } catch (error) {
      console.error("Failed to connect device:", error);
      throw error;
    }
  };

  const handleDisconnectDeviceById = async (deviceId: string, callback?: () => void): Promise<void> => {
    try {
      await disconnectBluetoothDevice(deviceId);
      if (callback) callback();
    } catch (error) {
      console.error("Failed to disconnect device:", error);
      throw error;
    }
  };

  // Create mock devices for display
  const mockDevices: BluetoothDevice[] = preferences.hasWearableDevice ? [
    {
      id: 'mock-device-001',
      name: 'Respiro HR Monitor',
      type: 'heart_rate_monitor',
      connected: true
    }
  ] : [];

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl">Biofeedback</CardTitle>
          <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <CardDescription className="text-sm">
          {isTeamOrEnterprise 
            ? "Connect multiple wearable devices and share insights with your team" 
            : "Connect your wearable device to enhance your meditation insights"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-3 sm:space-y-4">
          {preferences.hasWearableDevice ? (
            <div className="space-y-3 sm:space-y-4">
              <ConnectedDevicesList 
                devices={mockDevices} 
                onScanForDevices={handleScanForDevices}
                onConnectDevice={handleConnectDeviceById}
                onDisconnectDevice={handleDisconnectDeviceById}
                disabled={isConnecting}
              />
              
              {isTeamOrEnterprise && showTeamFeatures && (
                <TeamFeatures />
              )}
            </div>
          ) : isConnecting ? (
            <DeviceSearching onStopScan={() => {
              setIsConnecting(false);
              return Promise.resolve();
            }} />
          ) : (
            <NoDevicesView 
              onScanForDevices={handleScanForDevices}
              disabled={isConnecting}
            />
          )}
          
          <div className="flex items-center space-x-2 pt-2 sm:pt-4">
            <Switch
              id="wearable"
              checked={preferences.hasWearableDevice}
              onCheckedChange={(checked) => {
                updatePreferences({ hasWearableDevice: checked });
                if (checked) {
                  const mockDevice: BluetoothDeviceInfo = {
                    id: 'mock-device-001',
                    name: 'Respiro HR Monitor',
                    type: 'heart_rate_monitor',
                    connected: true,
                    rssi: -45,
                    services: ['heart_rate']
                  };
                  connectBluetoothDevice(mockDevice);
                } else {
                  if (mockDevices.length > 0) {
                    mockDevices.forEach(device => 
                      disconnectBluetoothDevice(device.id)
                    );
                  }
                }
              }}
            />
            <label
              htmlFor="wearable"
              className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
      <CardFooter className="p-4 sm:p-6 pt-0">
        <TouchFriendlyButton
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
        </TouchFriendlyButton>
      </CardFooter>
    </Card>
  );
};

export default BiofeedbackCard;
