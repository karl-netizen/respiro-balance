# Bluetooth Heart Rate Monitor Integration

## New Implementation

I've integrated the improved Bluetooth Heart Rate Monitor code into your React application. Here's what was added:

### 1. HeartRateMonitor Service (`src/services/bluetooth/HeartRateMonitor.ts`)

A TypeScript class that handles:
- **Device scanning and connection** using Web Bluetooth API
- **Real-time heart rate monitoring** with proper BLE characteristic parsing
- **Event-based callbacks** for heart rate updates and disconnections
- **Full Fitbit support** including Inspire 2, Charge 5/6, Versa, Sense, and Ionic
- **Connection status tracking** and device info management

Key features:
```typescript
const monitor = new HeartRateMonitor();

// Connect to device
const result = await monitor.scanAndConnect();

// Set callback for heart rate updates
monitor.setOnHeartRateUpdate((data) => {
  console.log('Heart Rate:', data.heartRate, 'BPM');
});

// Disconnect
await monitor.disconnect();
```

### 2. useHeartRateMonitor Hook (`src/hooks/useHeartRateMonitor.ts`)

A React hook that provides:
- Simple connection management
- Real-time heart rate state
- Device info and connection status
- Support for both Web Bluetooth (desktop) and Capacitor (mobile)
- Automatic cleanup on unmount

Usage in components:
```typescript
const {
  isConnected,
  isConnecting,
  heartRate,
  deviceInfo,
  connect,
  disconnect,
  isSupported
} = useHeartRateMonitor();
```

### 3. HeartRateDisplay Component (`src/components/biofeedback/HeartRateDisplay.tsx`)

A clean, ready-to-use UI component that:
- Shows real-time heart rate in large, easy-to-read format
- Displays connection status with live indicator
- Provides one-click connect/disconnect buttons
- Shows helpful device preparation tips
- Handles unsupported browsers gracefully

Now available at the top of your Biofeedback page!

## Comparison: Old vs New Implementation

### Old Implementation (deviceService.ts)
- Complex device management with simulation fallbacks
- Mock devices mixed with real devices
- Harder to debug connection issues
- More files and state to manage

### New Implementation (HeartRateMonitor.ts)
- ✅ Clean, focused on real devices only
- ✅ Standard BLE Heart Rate Service implementation
- ✅ Event-driven architecture
- ✅ Easy to test and debug
- ✅ Works seamlessly with existing Capacitor mobile setup
- ✅ No demo/test mode confusion

## How to Use

### On Desktop/Web (Chrome, Edge, Opera):
1. Navigate to `/biofeedback`
2. Look for the "Heart Rate Monitor" card at the top
3. Click "Connect Device"
4. Select your Fitbit or heart rate monitor from the browser dialog
5. **For Fitbit devices**: Make sure you've started an Exercise on your Fitbit first

### On Mobile (iOS/Android):
1. Transfer project to GitHub and build native app (see `MOBILE_SETUP.md`)
2. The hook automatically uses Capacitor Bluetooth LE
3. Native permissions are requested automatically
4. Better performance and reliability on mobile

## Supported Devices

Any Bluetooth Low Energy (BLE) device that broadcasts the standard Heart Rate Service (0x180D):

- **Fitbit**: Inspire 2, Charge 5/6, Versa, Sense, Ionic (Exercise mode required)
- **Polar**: H9, H10, Verity Sense
- **Garmin**: HRM-Dual, HRM-Pro
- **Wahoo**: TICKR, TICKR X
- **Suunto**: Smart Sensor
- **CooSpo**: H6, H808S
- Most chest strap and optical heart rate monitors

## Troubleshooting

**"No devices found"**
- Ensure device is powered on and charged
- Put device in pairing mode
- For Fitbit: Start an Exercise (Run, Bike, etc.)
- Check device is within 10 meters

**"Connection failed"**
- Try turning device off and on
- Refresh browser
- Clear browser's Bluetooth cache
- Ensure no other app is connected to the device

**"Bluetooth not supported"**
- Use Chrome, Edge, or Opera (not Firefox or Safari)
- Or install the native mobile app for full support

**Heart rate shows 0 or doesn't update**
- Check device is worn properly
- Ensure Exercise mode is active (Fitbit)
- Try disconnecting and reconnecting
- Check device battery level

## Code Example: Custom Integration

If you want to use the monitor in other parts of your app:

```typescript
import { hrMonitor } from '@/services/bluetooth/HeartRateMonitor';

// Connect
const result = await hrMonitor.scanAndConnect();

if (result.success) {
  // Set up callback for updates
  hrMonitor.setOnHeartRateUpdate((data) => {
    console.log(`${data.heartRate} BPM from ${data.deviceName}`);
    // Process heart rate data
    updateBiofeedbackSystem(data.heartRate);
  });
  
  // Handle disconnection
  hrMonitor.setOnDisconnect(() => {
    console.log('Device disconnected');
    // Handle reconnection logic
  });
}

// Get single reading
const currentHR = await hrMonitor.getCurrentHeartRate();

// Disconnect when done
await hrMonitor.disconnect();
```

## Next Steps

1. The new `HeartRateDisplay` component is now live at the top of your Biofeedback page
2. The existing device management system is still available below it
3. You can transition fully to the new system by removing the old implementation once tested
4. For mobile, follow the setup guide in `MOBILE_SETUP.md`

## Resources

- [Web Bluetooth API Specification](https://webbluetoothcg.github.io/web-bluetooth/)
- [BLE Heart Rate Service](https://www.bluetooth.com/specifications/specs/heart-rate-service-1-0/)
- [Capacitor Bluetooth LE Plugin](https://github.com/capacitor-community/bluetooth-le)
