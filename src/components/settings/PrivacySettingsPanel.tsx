/**
 * Privacy Settings Panel
 * Allows users to control visibility of their profile, activity, and stats
 * Security Issue #3 - User Activity Privacy Controls
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, EyeOff, Users, BarChart, Trophy, Info } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PrivacySettings {
  profile_visibility: 'public' | 'friends' | 'private';
  activity_visibility: 'public' | 'friends' | 'private';
  stats_visibility: 'public' | 'friends' | 'private';
  leaderboard_participation: boolean;
}

const VISIBILITY_OPTIONS = [
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone can see',
    icon: <Eye className="h-4 w-4" />,
  },
  {
    value: 'friends',
    label: 'Friends Only',
    description: 'Only your friends can see',
    icon: <Users className="h-4 w-4" />,
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can see',
    icon: <EyeOff className="h-4 w-4" />,
  },
];

export const PrivacySettingsPanel: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<PrivacySettings>({
    profile_visibility: 'friends',
    activity_visibility: 'friends',
    stats_visibility: 'private',
    leaderboard_participation: true,
  });

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_social_profiles')
        .select('privacy_settings')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data?.privacy_settings) {
        setSettings(data.privacy_settings as PrivacySettings);
      }
    } catch (error) {
      console.error('Failed to load privacy settings:', error);
      toast.error('Failed to load privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_social_profiles')
        .update({ privacy_settings: settings })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Privacy settings updated', {
        description: 'Your privacy preferences have been saved.',
      });
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
      toast.error('Failed to save settings', {
        description: 'Please try again later.',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof PrivacySettings>(
    key: K,
    value: PrivacySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>Loading your privacy preferences...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy Settings
        </CardTitle>
        <CardDescription>
          Control who can see your profile, activity, and meditation stats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Visibility */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                Profile Visibility
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Controls who can view your basic profile information like display name and avatar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <p className="text-sm text-muted-foreground">
                Who can see your profile information
              </p>
            </div>
          </div>
          <Select
            value={settings.profile_visibility}
            onValueChange={(value) =>
              updateSetting('profile_visibility', value as PrivacySettings['profile_visibility'])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Activity Visibility */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                Activity Visibility
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Controls who can see your meditation sessions, challenge participation, and social posts</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <p className="text-sm text-muted-foreground">
                Who can see your meditation sessions and challenges
              </p>
            </div>
          </div>
          <Select
            value={settings.activity_visibility}
            onValueChange={(value) =>
              updateSetting('activity_visibility', value as PrivacySettings['activity_visibility'])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Stats Visibility */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Stats Visibility
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Controls who can see your detailed meditation statistics like total minutes, streaks, and session count</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <p className="text-sm text-muted-foreground">
                Who can see your meditation statistics and streaks
              </p>
            </div>
          </div>
          <Select
            value={settings.stats_visibility}
            onValueChange={(value) =>
              updateSetting('stats_visibility', value as PrivacySettings['stats_visibility'])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Leaderboard Participation */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard Participation
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>When enabled, your progress will appear on public leaderboards for challenges you join</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <p className="text-sm text-muted-foreground">
              Show my progress on public leaderboards
            </p>
          </div>
          <Switch
            checked={settings.leaderboard_participation}
            onCheckedChange={(checked) =>
              updateSetting('leaderboard_participation', checked)
            }
          />
        </div>

        <Separator />

        {/* Privacy Summary */}
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy Summary
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Profile: <span className="font-medium">{settings.profile_visibility}</span></p>
            <p>• Activity: <span className="font-medium">{settings.activity_visibility}</span></p>
            <p>• Stats: <span className="font-medium">{settings.stats_visibility}</span></p>
            <p>• Leaderboards: <span className="font-medium">{settings.leaderboard_participation ? 'Enabled' : 'Disabled'}</span></p>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={savePrivacySettings}
          disabled={saving}
          className="w-full"
        >
          {saving ? 'Saving...' : 'Save Privacy Settings'}
        </Button>

        {/* Information */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• These settings only affect what others can see</p>
          <p>• You can always view all your own data</p>
          <p>• Changes apply immediately after saving</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettingsPanel;
