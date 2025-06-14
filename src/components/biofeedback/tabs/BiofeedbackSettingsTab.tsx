
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BiofeedbackSettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Device Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Device Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Auto-Connect to Saved Devices</Label>
              <p className="text-sm text-muted-foreground">Automatically connect when devices are in range</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Background Connection</Label>
              <p className="text-sm text-muted-foreground">Maintain connection when app is closed</p>
            </div>
            <Switch />
          </div>
          
          <div className="space-y-2">
            <Label>Sampling Rate</Label>
            <Select defaultValue="1hz">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1hz">1 Hz (Battery Optimized)</SelectItem>
                <SelectItem value="5hz">5 Hz (Balanced)</SelectItem>
                <SelectItem value="realtime">Real-time (High Accuracy)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Store Data Locally Only</Label>
              <p className="text-sm text-muted-foreground">Keep data on device instead of cloud sync</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Research Participation</Label>
              <p className="text-sm text-muted-foreground">Help improve algorithms (no personal data shared)</p>
            </div>
            <Switch />
          </div>
          
          <div className="space-y-2">
            <Label>Data Retention Period</Label>
            <Select defaultValue="1year">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="forever">Forever</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              Export All Biometric Data
            </Button>
            <Button variant="destructive" className="w-full">
              Delete All Stored Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alert & Notification System */}
      <Card>
        <CardHeader>
          <CardTitle>Alerts & Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Heart Rate Alert Threshold</Label>
              <div className="flex items-center space-x-2">
                <Input type="number" defaultValue="120" className="w-20" />
                <span className="text-sm text-muted-foreground">BPM</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>HRV Warning Threshold</Label>
              <div className="flex items-center space-x-2">
                <Input type="number" defaultValue="30" className="w-20" />
                <span className="text-sm text-muted-foreground">ms</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Achievement Celebrations</Label>
              <p className="text-sm text-muted-foreground">Notify on personal bests and milestones</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Weekly Progress Summaries</Label>
              <p className="text-sm text-muted-foreground">Comprehensive weekly biometric reports</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Platform Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Apple Health Integration</Label>
              <p className="text-sm text-muted-foreground">Sync with iOS Health app</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Google Fit Integration</Label>
              <p className="text-sm text-muted-foreground">Share data with Google Fit</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Healthcare Provider Sharing</Label>
              <p className="text-sm text-muted-foreground">Export for medical consultations</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiofeedbackSettingsTab;
