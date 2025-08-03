import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Palette, Upload, Settings } from 'lucide-react'

export const WhiteLabelSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    companyName: 'Acme Corporation',
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    logo: null,
    customDomain: 'wellness.acme.com',
    hideRespiroBranding: true,
    customWelcomeMessage: 'Welcome to your wellness journey!',
    customEmailFooter: ''
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            White Label Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="customDomain">Custom Domain</Label>
                <Input
                  id="customDomain"
                  value={settings.customDomain}
                  onChange={(e) => setSettings({ ...settings, customDomain: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="hideRespiroBranding"
                  checked={settings.hideRespiroBranding}
                  onCheckedChange={(checked) => setSettings({ ...settings, hideRespiroBranding: checked })}
                />
                <Label htmlFor="hideRespiroBranding">Hide Respiro Branding</Label>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-20"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-20"
                  />
                  <Input
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Company Logo</Label>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="welcomeMessage">Custom Welcome Message</Label>
              <Textarea
                id="welcomeMessage"
                value={settings.customWelcomeMessage}
                onChange={(e) => setSettings({ ...settings, customWelcomeMessage: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="emailFooter">Custom Email Footer</Label>
              <Textarea
                id="emailFooter"
                value={settings.customEmailFooter}
                onChange={(e) => setSettings({ ...settings, customEmailFooter: e.target.value })}
                placeholder="This email was sent by [Company Name]. Unsubscribe | Privacy Policy"
              />
            </div>
          </div>
          <Button className="w-full">
            Save White Label Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}