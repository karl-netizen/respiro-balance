
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Upload, Eye, Save, Smartphone, Monitor } from 'lucide-react';
import { FeatureGate } from '@/features/subscription';
import { toast } from 'sonner';

const WhiteLabelCustomization: React.FC = () => {
  const [customizations, setCustomizations] = useState({
    appName: 'Respiro Balance',
    appDescription: 'Your personal meditation companion',
    primaryColor: '#14B8A6',
    secondaryColor: '#0F766E',
    accentColor: '#06B6D4',
    logoUrl: '',
    welcomeMessage: 'Welcome to your meditation journey',
    customDomain: '',
    hideRespiroBranding: false,
    customLoadingScreen: false,
    customOnboarding: false
  });

  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [activeTab, setActiveTab] = useState('branding');

  const handleInputChange = (field: string, value: string | boolean) => {
    setCustomizations(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would upload to storage
      const mockUrl = URL.createObjectURL(file);
      handleInputChange('logoUrl', mockUrl);
      toast.success('Logo uploaded successfully');
    }
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    toast.success('Customizations saved successfully!');
  };

  const handlePreview = () => {
    toast.info('Preview mode activated', {
      description: 'This is how your customized app would look'
    });
  };

  const ColorPicker: React.FC<{ 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
  }> = ({ label, value, onChange }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    </div>
  );

  return (
    <FeatureGate
      requiredTier="premium"
      featureName="White-label Customization"
      featureDescription="Fully customize the app's branding and appearance"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">White-label Customization</h2>
            <p className="text-muted-foreground">
              Customize the app's branding, colors, and content to match your organization
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Customization Controls */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="branding">Branding</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="branding" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>App Branding</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>App Name</Label>
                      <Input
                        value={customizations.appName}
                        onChange={(e) => handleInputChange('appName', e.target.value)}
                        placeholder="Your App Name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>App Description</Label>
                      <Textarea
                        value={customizations.appDescription}
                        onChange={(e) => handleInputChange('appDescription', e.target.value)}
                        placeholder="Describe your app's purpose"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Logo Upload</Label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logo
                        </Button>
                        {customizations.logoUrl && (
                          <img 
                            src={customizations.logoUrl} 
                            alt="Logo preview"
                            className="w-12 h-12 object-contain rounded border"
                          />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recommended: 512x512px, PNG or SVG format
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="colors" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="w-5 h-5" />
                      <span>Color Scheme</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ColorPicker
                      label="Primary Color"
                      value={customizations.primaryColor}
                      onChange={(value) => handleInputChange('primaryColor', value)}
                    />
                    
                    <ColorPicker
                      label="Secondary Color"
                      value={customizations.secondaryColor}
                      onChange={(value) => handleInputChange('secondaryColor', value)}
                    />
                    
                    <ColorPicker
                      label="Accent Color"
                      value={customizations.accentColor}
                      onChange={(value) => handleInputChange('accentColor', value)}
                    />
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Color Preview</h4>
                      <div className="flex space-x-2">
                        <div 
                          className="w-16 h-16 rounded-lg border"
                          style={{ backgroundColor: customizations.primaryColor }}
                        />
                        <div 
                          className="w-16 h-16 rounded-lg border"
                          style={{ backgroundColor: customizations.secondaryColor }}
                        />
                        <div 
                          className="w-16 h-16 rounded-lg border"
                          style={{ backgroundColor: customizations.accentColor }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Welcome Message</Label>
                      <Textarea
                        value={customizations.welcomeMessage}
                        onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                        placeholder="Customize the welcome message for your users"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Custom Domain (Optional)</Label>
                      <Input
                        value={customizations.customDomain}
                        onChange={(e) => handleInputChange('customDomain', e.target.value)}
                        placeholder="your-domain.com"
                      />
                      <p className="text-xs text-muted-foreground">
                        Configure a custom domain for your white-labeled app
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Hide Respiro Branding</Label>
                        <p className="text-sm text-muted-foreground">
                          Remove all Respiro Balance branding from the app
                        </p>
                      </div>
                      <Switch
                        checked={customizations.hideRespiroBranding}
                        onCheckedChange={(checked) => handleInputChange('hideRespiroBranding', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Custom Loading Screen</Label>
                        <p className="text-sm text-muted-foreground">
                          Use your own loading screen design
                        </p>
                      </div>
                      <Switch
                        checked={customizations.customLoadingScreen}
                        onCheckedChange={(checked) => handleInputChange('customLoadingScreen', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Custom Onboarding</Label>
                        <p className="text-sm text-muted-foreground">
                          Create a personalized onboarding experience
                        </p>
                      </div>
                      <Switch
                        checked={customizations.customOnboarding}
                        onCheckedChange={(checked) => handleInputChange('customOnboarding', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Live Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Live Preview</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={previewMode === 'mobile' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={previewMode === 'desktop' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`mx-auto border rounded-lg overflow-hidden ${
                  previewMode === 'mobile' ? 'max-w-sm' : 'w-full'
                }`}>
                  <div 
                    className="p-4 text-white"
                    style={{ backgroundColor: customizations.primaryColor }}
                  >
                    <div className="flex items-center space-x-3">
                      {customizations.logoUrl && (
                        <img 
                          src={customizations.logoUrl} 
                          alt="Logo"
                          className="w-8 h-8 object-contain"
                        />
                      )}
                      <h3 className="font-bold">{customizations.appName}</h3>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white">
                    <p className="text-sm text-gray-600 mb-4">
                      {customizations.welcomeMessage}
                    </p>
                    
                    <div className="space-y-2">
                      <button 
                        className="w-full p-2 rounded text-white text-sm"
                        style={{ backgroundColor: customizations.primaryColor }}
                      >
                        Start Meditation
                      </button>
                      
                      <button 
                        className="w-full p-2 rounded border text-sm"
                        style={{ 
                          borderColor: customizations.secondaryColor,
                          color: customizations.secondaryColor
                        }}
                      >
                        Browse Sessions
                      </button>
                    </div>
                    
                    <div className="mt-4 p-3 rounded" style={{ backgroundColor: customizations.accentColor + '20' }}>
                      <p className="text-xs" style={{ color: customizations.accentColor }}>
                        {customizations.appDescription}
                      </p>
                    </div>
                  </div>
                  
                  {!customizations.hideRespiroBranding && (
                    <div className="p-2 bg-gray-50 text-center">
                      <p className="text-xs text-gray-400">Powered by Respiro Balance</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  Export Theme Config
                </Button>
                <Button variant="outline" className="w-full">
                  Generate Style Guide
                </Button>
                <Button variant="outline" className="w-full">
                  Download Assets
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </FeatureGate>
  );
};

export default WhiteLabelCustomization;
