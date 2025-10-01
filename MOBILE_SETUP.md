# Mobile Device Setup Guide

Your app now has **native Bluetooth support** for iOS and Android! No more demo/test mode on mobile devices.

## How to Run on Mobile Device

### Step 1: Export to GitHub
1. Click the "Export to GitHub" button in Lovable
2. Clone your repository locally:
   ```bash
   git clone <your-repo-url>
   cd respiro-balance
   ```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Add Mobile Platforms

**For Android:**
```bash
npx cap add android
npx cap update android
```

**For iOS (requires Mac with Xcode):**
```bash
npx cap add ios
npx cap update ios
```

### Step 4: Build the Project
```bash
npm run build
```

### Step 5: Sync with Native Platform
```bash
npx cap sync
```

### Step 6: Run on Device/Emulator

**For Android:**
```bash
npx cap run android
```
Make sure you have Android Studio installed and either:
- An Android emulator running
- A physical Android device connected via USB with Developer Mode enabled

**For iOS:**
```bash
npx cap run ios
```
Requires:
- Mac with Xcode installed
- iOS Simulator or physical iPhone/iPad connected

## Testing Bluetooth

### On Android:
1. Make sure Bluetooth is enabled on your device
2. Open the app and navigate to the Biofeedback page
3. Tap "Scan for Devices"
4. Your Fitbit Inspire 2 or other BLE heart rate monitor should appear

**Important for Fitbit devices:** Start an Exercise mode (e.g., Run, Bike) on your Fitbit to enable heart rate broadcasting.

### On iOS:
1. Make sure Bluetooth is enabled
2. The app will request Bluetooth permissions on first use
3. Follow the same steps as Android

## Permissions

The app requires Bluetooth permissions:
- **Android:** Automatically requested when scanning
- **iOS:** Declared in Info.plist (automatically added by Capacitor)

## Hot Reload for Development

The app is configured to hot-reload from your Lovable sandbox during development. This means you can make changes in Lovable and see them immediately on your mobile device without rebuilding!

To use hot reload:
1. Make sure your mobile device is on the same network
2. The app will load from: `https://e3f5985a-3921-4571-a083-315354dc8830.lovableproject.com`

To disable hot reload and use the local build:
1. Open `capacitor.config.ts`
2. Remove or comment out the `server` section

## After Making Changes

Whenever you pull new changes from GitHub that modify:
- Native plugins
- Capacitor configuration
- Native platform code

Run:
```bash
npm install
npx cap sync
```

## Troubleshooting

**"No devices found"**
- Make sure Bluetooth is enabled on your phone
- Ensure your heart rate monitor is in pairing mode
- For Fitbit: Start an Exercise on the device first

**"Permission denied"**
- Check app permissions in your phone's settings
- Grant Bluetooth and Location permissions (Android requires Location for BLE scanning)

**Build errors**
- Make sure you have the latest versions of Android Studio or Xcode
- Run `npx cap sync` after any dependency changes

## More Information

For detailed guides on mobile development with Capacitor:
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Lovable Mobile Guide](https://lovable.dev/blogs/TODO)
