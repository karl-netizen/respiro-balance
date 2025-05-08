import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useFocus } from '@/context/FocusProvider';

interface FocusSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FocusSettingsDialog: React.FC<FocusSettingsDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { settings, updateSettings } = useFocus();
  
  const handleNumberChange = (key: keyof typeof settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      updateSettings({ [key]: value });
    }
  };
  
  const handleSwitchChange = (key: keyof typeof settings) => (checked: boolean) => {
    updateSettings({ [key]: checked });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Focus Settings</DialogTitle>
          <DialogDescription>
            Customize your focus session parameters
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workDuration">Work duration (min)</Label>
              <Input
                id="workDuration"
                type="number"
                min="1"
                value={settings.workDuration}
                onChange={handleNumberChange('workDuration')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="breakDuration">Break duration (min)</Label>
              <Input
                id="breakDuration"
                type="number"
                min="1"
                value={settings.breakDuration}
                onChange={handleNumberChange('breakDuration')}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="longBreakDuration">Long break (min)</Label>
              <Input
                id="longBreakDuration"
                type="number"
                min="1"
                value={settings.longBreakDuration}
                onChange={handleNumberChange('longBreakDuration')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longBreakAfterIntervals">Intervals before long break</Label>
              <Input
                id="longBreakAfterIntervals"
                type="number"
                min="1"
                value={settings.longBreakAfterIntervals}
                onChange={handleNumberChange('longBreakAfterIntervals')}
              />
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex items-center justify-between">
            <Label htmlFor="autoStartBreaks">Auto-start breaks</Label>
            <Switch
              id="autoStartBreaks"
              checked={settings.autoStartBreaks}
              onCheckedChange={handleSwitchChange('autoStartBreaks')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="autoStartWork">Auto-start work intervals</Label>
            <Switch
              id="autoStartWork"
              checked={settings.autoStartWork}
              onCheckedChange={handleSwitchChange('autoStartWork')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="enableSounds">Enable sounds</Label>
            <Switch
              id="enableSounds"
              checked={settings.enableSounds}
              onCheckedChange={handleSwitchChange('enableSounds')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="enableNotifications">Enable notifications</Label>
            <Switch
              id="enableNotifications"
              checked={settings.enableNotifications}
              onCheckedChange={handleSwitchChange('enableNotifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="blockNotifications">
              Block other notifications during focus
            </Label>
            <Switch
              id="blockNotifications"
              checked={settings.blockNotifications}
              onCheckedChange={handleSwitchChange('blockNotifications')}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
