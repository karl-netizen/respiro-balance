# Bluetooth Biofeedback Integration

## Overview
This feature allows users to connect Bluetooth Low Energy (BLE) heart rate monitors to receive real-time biometric feedback during meditation sessions.

## Features

### ✅ Implemented
- **Real Web Bluetooth API Integration**: Connects to actual BLE heart rate monitors
- **Live Heart Rate Monitoring**: Reads real-time heart rate data using standard Heart Rate Service (0x180D)
- **Battery Level Display**: Shows device battery percentage when available
- **Automatic Notifications**: Subscribes to heart rate notifications for real-time updates
- **Data Persistence**: Saves biometric data to Supabase every 30 seconds
- **Simulation Fallback**: Demo mode for browsers without Bluetooth support
- **User Feedback**: Toast notifications for connection status and errors
- **Device Management**: Scan, connect, and disconnect devices
- **Help Documentation**: Built-in troubleshooting guide

### Device Support
Compatible with any BLE heart rate monitor using standard Heart Rate Service (UUID: 0x180D):
- Polar H10, H9, OH1
- Garmin HRM-Dual, HRM-Pro
- Wahoo TICKR, TICKR X
- Suunto Smart Sensor
- CooSpo H6, H7
- Most Bluetooth chest straps and armbands

## Technical Requirements

### Browser Support
- **Chrome/Edge**: Full support ✅
- **Firefox**: Limited support ⚠️
- **Safari**: Not supported ❌

### Security Requirements
- **HTTPS**: Required for production
- **localhost**: Works for development
- **User Gesture**: Connection must be initiated by user action (button click)

## Architecture

### Core Files
```
src/hooks/biofeedback/
├── deviceService.ts          # Bluetooth device communication
├── useBiofeedback.ts         # Main hook for biofeedback features
├── useBiometricData.ts       # Data reading and processing
├── useSimulation.ts          # Simulation mode fallback
└── types.ts                  # TypeScript interfaces

src/components/biofeedback/
├── layout/BiofeedbackLayout.tsx    # Main layout
├── ConnectedDevicesList.tsx        # Device list UI
├── NoDevicesView.tsx               # Empty state
├── DeviceSearching.tsx             # Scanning state
└── BluetoothHelp.tsx               # Help documentation
```

### Data Flow
1. **Scanning**: User clicks "Scan" → Browser shows device picker → Devices added to state
2. **Connecting**: User selects device → GATT connection established → Services/characteristics discovered
3. **Reading Data**: Heart rate characteristic notifications → Parse BLE data → Update UI
4. **Persistence**: Every 30s → Save to Supabase `biometric_data` table
5. **Disconnecting**: User disconnects → Stop notifications → Close GATT connection

## Web Bluetooth API Usage

### Service UUIDs
```typescript
const HEART_RATE_SERVICE = 0x180D;        // Standard HR service
const BATTERY_SERVICE = 0x180F;            // Battery level
const HEART_RATE_MEASUREMENT = 0x2A37;     // HR characteristic
const BATTERY_LEVEL = 0x2A19;              // Battery characteristic
```

### Connection Flow
```typescript
// 1. Request device
const device = await navigator.bluetooth.requestDevice({
  filters: [{ services: [HEART_RATE_SERVICE] }],
  optionalServices: [BATTERY_SERVICE]
});

// 2. Connect to GATT server
const server = await device.gatt?.connect();

// 3. Get service and characteristic
const hrService = await server.getPrimaryService(HEART_RATE_SERVICE);
const hrCharacteristic = await hrService.getCharacteristic(HEART_RATE_MEASUREMENT);

// 4. Start notifications
await hrCharacteristic.startNotifications();
hrCharacteristic.addEventListener('characteristicvaluechanged', handleData);
```

### Data Parsing
Heart rate data format (per Bluetooth spec):
```
Byte 0: Flags
  - Bit 0: HR format (0 = uint8, 1 = uint16)
  - Bits 1-7: Additional flags
Byte 1-2: Heart rate value (8 or 16 bits)
Bytes 3+: Optional data (energy, RR intervals, etc.)
```

## Database Schema

### biometric_data Table
```sql
CREATE TABLE biometric_data (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_id UUID REFERENCES meditation_sessions,
  heart_rate INT,
  stress_level INT,
  hrv FLOAT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  device_source TEXT
);
```

## Usage Example

```typescript
import { useBiofeedback } from '@/hooks/biofeedback';

function MyComponent() {
  const {
    devices,
    isScanning,
    heartRate,
    stress,
    scanForDevices,
    connectDevice,
    disconnectDevice
  } = useBiofeedback();

  return (
    <div>
      <button onClick={scanForDevices}>
        Scan for Devices
      </button>
      
      {devices.map(device => (
        <div key={device.id}>
          {device.name}
          <button onClick={() => connectDevice(device.id)}>
            Connect
          </button>
        </div>
      ))}
      
      <div>Heart Rate: {heartRate} BPM</div>
    </div>
  );
}
```

## Troubleshooting

### Common Issues

**"Bluetooth not available"**
- Ensure using Chrome or Edge browser
- Check that site is served over HTTPS (or localhost)
- Verify Bluetooth is enabled on computer

**"No devices found"**
- Make sure device is turned on and in pairing mode
- Device must be within ~10m range
- Some devices need to be unpaired from other apps first

**"Connection failed"**
- Try turning device off and back on
- Refresh browser page
- Clear browser's paired Bluetooth devices (chrome://bluetooth-internals)

**"Data not updating"**
- Check device battery level
- Ensure device is properly worn/positioned
- Verify device supports standard HR service (0x180D)

### Demo Mode
If Bluetooth is unavailable, the system automatically falls back to simulation mode with realistic demo data. This is useful for:
- Testing UI without hardware
- Development on unsupported browsers
- Demonstrating features to users

## Future Enhancements

### Planned Features
- [ ] HRV (Heart Rate Variability) calculation
- [ ] Multi-device support (connect multiple sensors)
- [ ] Historical data visualization
- [ ] Breathing rate from RR intervals
- [ ] ANT+ device support
- [ ] Apple Watch integration
- [ ] Export data to health apps

### Advanced Features
- [ ] Real-time stress detection algorithms
- [ ] Coherence score calculation
- [ ] Guided breathing based on HR
- [ ] Adaptive meditation suggestions
- [ ] Team/coach data sharing

## Security & Privacy

### Data Protection
- All device communication happens in the browser
- No data sent to external servers without user consent
- Biometric data encrypted in transit and at rest
- User must explicitly grant Bluetooth permission
- Connection requires user gesture (can't auto-connect)

### Best Practices
- Always validate user has authenticated before saving data
- Implement proper RLS policies on biometric_data table
- Never expose raw biometric data in public APIs
- Provide clear privacy policy for health data collection

## Testing

### Manual Testing Checklist
- [ ] Scan finds real devices
- [ ] Connection establishes successfully
- [ ] Heart rate updates in real-time
- [ ] Battery level displays correctly
- [ ] Disconnection works properly
- [ ] Reconnection after disconnect
- [ ] Multiple scan attempts
- [ ] Error messages display correctly
- [ ] Demo mode works without Bluetooth
- [ ] Data persists to database

### Test Devices
Recommended for testing:
- **Budget**: CooSpo H6 (~$30)
- **Mid-range**: Wahoo TICKR (~$50)
- **Premium**: Polar H10 (~$90)

## Resources

### Documentation
- [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [Bluetooth Heart Rate Service Spec](https://www.bluetooth.com/specifications/specs/heart-rate-service-1-0/)
- [Chrome Bluetooth Implementation](https://developer.chrome.com/docs/capabilities/bluetooth)

### Tools
- [Chrome Bluetooth Internals](chrome://bluetooth-internals)
- [Web Bluetooth Terminal](https://googlechrome.github.io/samples/web-bluetooth/)
- [BLE Scanner Apps](https://www.nordicsemi.com/Products/Development-tools/nrf-connect-for-mobile)

## Support

For issues or questions:
1. Check the in-app Bluetooth Help guide
2. Review browser console for detailed errors
3. Test with demo mode first
4. Verify device compatibility
5. Check HTTPS requirement is met
