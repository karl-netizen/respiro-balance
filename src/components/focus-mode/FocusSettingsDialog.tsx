
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
  
  const handleSwitchChange = (key: keyof typeof settings) => (checked: boolean) => {
    updateSettings({ [key]: checked });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">Focus Settings</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Customize your focus session parameters
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workDuration" className="text-gray-700 dark:text-gray-300">Work duration (min)</Label>
              <Input
                id="workDuration"
                type="number"
                min="1"
                value={Math.floor(settings.workDuration / 60)}
                onChange={(e) => {
                  const minutes = parseInt(e.target.value);
                  if (!isNaN(minutes) && minutes > 0) {
                    updateSettings({ workDuration: minutes * 60 });
                  }
                }}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="breakDuration" className="text-gray-700 dark:text-gray-300">Break duration (min)</Label>
              <Input
                id="breakDuration"
                type="number"
                min="1"
                value={Math.floor(settings.breakDuration / 60)}
                onChange={(e) => {
                  const minutes = parseInt(e.target.value);
                  if (!isNaN(minutes) && minutes > 0) {
                    updateSettings({ breakDuration: minutes * 60 });
                  }
                }}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="longBreakDuration" className="text-gray-700 dark:text-gray-300">Long break (min)</Label>
              <Input
                id="longBreakDuration"
                type="number"
                min="1"
                value={Math.floor(settings.longBreakDuration / 60)}
                onChange={(e) => {
                  const minutes = parseInt(e.target.value);
                  if (!isNaN(minutes) && minutes > 0) {
                    updateSettings({ longBreakDuration: minutes * 60 });
                  }
                }}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longBreakAfterIntervals" className="text-gray-700 dark:text-gray-300">Intervals before long break</Label>
              <Input
                id="longBreakAfterIntervals"
                type="number"
                min="1"
                value={settings.longBreakAfterIntervals}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0) {
                    updateSettings({ longBreakAfterIntervals: value });
                  }
                }}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          
          <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="autoStartBreaks" className="text-gray-700 dark:text-gray-300 font-medium">
                Auto-start breaks
              </Label>
              <Switch
                id="autoStartBreaks"
                checked={settings.autoStartBreaks}
                onCheckedChange={handleSwitchChange('autoStartBreaks')}
                className="data-[state=checked]:bg-orange-500"
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="autoStartWork" className="text-gray-700 dark:text-gray-300 font-medium">
                Auto-start work intervals
              </Label>
              <Switch
                id="autoStartWork"
                checked={settings.autoStartWork || false}
                onCheckedChange={handleSwitchChange('autoStartWork')}
                className="data-[state=checked]:bg-orange-500"
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="enableSounds" className="text-gray-700 dark:text-gray-300 font-medium">
                Enable sounds
              </Label>
              <Switch
                id="enableSounds"
                checked={settings.enableSounds}
                onCheckedChange={handleSwitchChange('enableSounds')}
                className="data-[state=checked]:bg-orange-500"
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="enableNotifications" className="text-gray-700 dark:text-gray-300 font-medium">
                Enable notifications
              </Label>
              <Switch
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={handleSwitchChange('enableNotifications')}
                className="data-[state=checked]:bg-orange-500"
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="blockNotifications" className="text-gray-700 dark:text-gray-300 font-medium">
                Block other notifications during focus
              </Label>
              <Switch
                id="blockNotifications"
                checked={settings.blockNotifications || false}
                onCheckedChange={handleSwitchChange('blockNotifications')}
                className="data-[state=checked]:bg-orange-500"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
