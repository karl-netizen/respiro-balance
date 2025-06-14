
import { BluetoothDeviceInfo, DeviceType } from './types';

export const scanForBluetoothDevices = async (): Promise<BluetoothDeviceInfo[]> => {
  try {
    if (!navigator.bluetooth) {
      throw new Error('Bluetooth not supported');
    }

    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: ['heart_rate'] },
        { services: ['0000180d-0000-1000-8000-00805f9b34fb'] }
      ],
      optionalServices: ['battery_service']
    });

    return [{
      id: device.id,
      name: device.name || 'Unknown Device',
      type: 'heart_rate' as DeviceType,
      services: ['heart_rate']
    }];
  } catch (error) {
    console.error('Bluetooth scanning failed:', error);
    return [];
  }
};
