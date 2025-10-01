import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Info, Chrome, Shield, Bluetooth } from 'lucide-react';

const BluetoothHelp: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Bluetooth Connection Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Requirements */}
        <div>
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            Requirements
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Chrome className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Use Chrome or Edge browser (Firefox has limited support)</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>HTTPS required (localhost is okay for testing)</span>
            </li>
            <li className="flex items-start gap-2">
              <Bluetooth className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Bluetooth enabled on your device and computer</span>
            </li>
          </ul>
        </div>

        {/* Troubleshooting */}
        <div>
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            Troubleshooting
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="font-medium min-w-[120px]">No devices found:</span>
              <span>Ensure device is on, in pairing mode, and within range (10m)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium min-w-[120px]">Connection fails:</span>
              <span>Try turning device off and on, refresh browser, clear paired devices</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium min-w-[120px]">Data not updating:</span>
              <span>Check device battery, reconnect, verify device is properly worn</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium min-w-[120px]">Browser not supported:</span>
              <span>Use demo mode with simulated data for testing features</span>
            </li>
          </ul>
        </div>

        {/* Supported Devices */}
        <div>
          <h4 className="font-medium text-sm mb-2">Supported Devices</h4>
          <div className="text-sm text-muted-foreground">
            Any Bluetooth Low Energy (BLE) heart rate monitor using standard Heart Rate Service (0x180D):
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-2 py-1 bg-secondary rounded-md text-xs">Polar H10/H9</span>
            <span className="px-2 py-1 bg-secondary rounded-md text-xs">Garmin HRM-Dual</span>
            <span className="px-2 py-1 bg-secondary rounded-md text-xs">Wahoo TICKR</span>
            <span className="px-2 py-1 bg-secondary rounded-md text-xs">Suunto</span>
            <span className="px-2 py-1 bg-secondary rounded-md text-xs">CooSpo</span>
            <span className="px-2 py-1 bg-secondary rounded-md text-xs">Most BLE HR monitors</span>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-2 text-xs">
            <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-primary mb-1">Privacy & Security</div>
              <div className="text-muted-foreground">
                All biometric data is processed locally in your browser. Connection to devices requires your explicit permission. 
                Data is only saved to your account when you're connected and authenticated.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BluetoothHelp;
