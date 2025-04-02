
import { useState } from 'react';
import { UserPreferences, BluetoothDevice } from '../types';
import { connectBluetoothDevice, disconnectDevice } from '../bluetoothUtils';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { toast } from 'sonner';

export const useDeviceConnections = (
  preferences: UserPreferences,
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void,
  userId?: string
) => {
  const handleConnectBluetoothDevice = async (): Promise<boolean> => {
    try {
      const result = await connectBluetoothDevice();
      
      if (result.success && result.device) {
        // Add the device to the list of connected devices
        const updatedPreferences = {
          hasWearableDevice: true,
          wearableDeviceType: "Respiro HR Monitor",
          wearableDeviceId: result.device.id,
          lastSyncDate: new Date().toISOString(),
          connectedDevices: [...preferences.connectedDevices, result.device]
        };
        
        updatePreferences(updatedPreferences);
        
        // If user is authenticated and Supabase configured, also store device in devices table
        if (isSupabaseConfigured() && userId) {
          try {
            const { error } = await supabase
              .from('user_devices')
              .insert({
                user_id: userId,
                device_id: result.device.id,
                device_name: result.device.name,
                device_type: result.device.type,
                connected_at: new Date().toISOString()
              });
              
            if (error) {
              console.error("Error storing connected device:", error);
            }
          } catch (deviceError) {
            console.error("Failed to store device info:", deviceError);
          }
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Failed to connect Bluetooth device:", error);
      return false;
    }
  };
  
  const handleDisconnectBluetoothDevice = (deviceId: string) => {
    const updatedDevices = disconnectDevice(deviceId, preferences);
    
    const updatedPreferences = {
      connectedDevices: updatedDevices,
      hasWearableDevice: updatedDevices.length > 0
    };
    
    updatePreferences(updatedPreferences);
    
    // If user is authenticated and Supabase configured, also update device in devices table
    if (isSupabaseConfigured() && userId) {
      try {
        supabase
          .from('user_devices')
          .update({
            connected: false,
            disconnected_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('device_id', deviceId);
      } catch (deviceError) {
        console.error("Failed to update device connection status:", deviceError);
      }
    }
  };

  return {
    connectBluetoothDevice: handleConnectBluetoothDevice,
    disconnectBluetoothDevice: handleDisconnectBluetoothDevice
  };
};
