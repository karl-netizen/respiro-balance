
import { useState } from 'react';
import { UserPreferences, BluetoothDevice, DeviceType, BluetoothDeviceInfo } from '../types';
import { connectBluetoothDevice, disconnectDevice, normalizeDeviceId } from '../bluetoothUtils';
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
        // Create a device info object from the device
        const deviceInfo: BluetoothDeviceInfo = {
          id: result.device.id,
          name: result.device.name,
          type: result.device.type,
          connected: result.device.connected
        };
        
        // Add the device to the list of connected devices
        const updatedDevices = [...(preferences.connectedDevices || []), deviceInfo];
        
        const updatedPreferences = {
          hasWearableDevice: true,
          wearableDeviceType: "Respiro HR Monitor",
          wearableDeviceId: result.device.id,
          lastSyncDate: new Date().toISOString(),
          connectedDevices: updatedDevices
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
  
  const handleDisconnectBluetoothDevice = async (deviceId: string): Promise<boolean> => {
    try {
      const updatedDevices = disconnectDevice(deviceId, preferences);
      
      const updatedPreferences = {
        connectedDevices: updatedDevices,
        hasWearableDevice: updatedDevices.length > 0
      };
      
      updatePreferences(updatedPreferences);
      
      // If user is authenticated and Supabase configured, also update device in devices table
      if (isSupabaseConfigured() && userId) {
        try {
          await supabase
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
      
      return true;
    } catch (error) {
      console.error("Error disconnecting device:", error);
      return false;
    }
  };

  return {
    connectBluetoothDevice: handleConnectBluetoothDevice,
    disconnectBluetoothDevice: handleDisconnectBluetoothDevice
  };
};
